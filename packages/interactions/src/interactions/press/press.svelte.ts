import { box, type ReadableBox, type WritableBox } from 'svelte-toolbelt';
import type { FocusableElement } from '../../types/dom';
import type {
    PointerType,
    PressEvents,
    PressEvent as IPressEvent,
    TypedEvent
} from '../../types/events';
import type { ReadableProp } from '../../types/utils';
import type { HTMLAttributes } from 'svelte/elements';
import { PressResponderContext } from './ctx';
import { GlobalListeners } from '../../utils/globalListeners';
import {
    disableTextSelection,
    restoreTextSelection
} from '../../utils/textSelection';
import { getOwnerDocument, getOwnerWindow } from '../../utils/domHelpers';
import { chain } from '../../utils/common';
import { isMac } from '../../utils/platform';
import { openLink } from '../../utils/openLink';
import {
    isVirtualClick,
    isVirtualPointerEvent
} from '../../utils/virtualClick';
import { focusWithoutScrolling } from '../../utils/focusWithoutScrolling';
import type { Action } from 'svelte/action';
import { createAction } from '../../utils/action';
import { mergeProps } from '../../utils/mergeProps';

export interface PressProps<T extends FocusableElement = FocusableElement>
    extends PressEvents<T> {
    /** Whether the press events should be disabled. */
    isDisabled?: ReadableProp<boolean>;
    /** Whether the target should not receive focus on press. */
    preventFocusOnPress?: ReadableProp<boolean>;
    /**
     * Whether press events should be canceled when the pointer leaves the target while pressed.
     * By default, this is `false`, which means if the pointer returns back over the target while
     * still pressed, onPressStart will be fired again. If set to `true`, the press is canceled
     * when the pointer leaves the target and onPressStart will not be fired if the pointer returns.
     */
    shouldCancelOnPointerExit?: ReadableProp<boolean>;
    /** Whether text selection should be enabled on the pressable element. */
    allowTextSelectionOnPress?: ReadableProp<boolean>;
}

interface PressState<T extends FocusableElement = FocusableElement> {
    isPressed: boolean;
    ignoreEmulatedMouseEvents: boolean;
    ignoreClickAfterPress: boolean;
    didFirePressStart: boolean;
    isTriggeringEvent: boolean;
    activePointerId: any;
    target: T | null;
    isOverTarget: boolean;
    pointerType: PointerType | null;
    userSelect?: string;
    metaKeyEvents?: Map<string, KeyboardEvent>;
}

interface EventBase<T extends FocusableElement = FocusableElement> {
    currentTarget: (T & EventTarget) | null;
    shiftKey: boolean;
    ctrlKey: boolean;
    metaKey: boolean;
    altKey: boolean;
    clientX?: number;
    clientY?: number;
    targetTouches?: Array<{ clientX?: number; clientY?: number }>;
}

class PressEvent<T extends FocusableElement = FocusableElement>
    implements IPressEvent<T>
{
    type: IPressEvent['type'];
    pointerType: PointerType;
    target: EventTarget & T;
    shiftKey: boolean;
    ctrlKey: boolean;
    metaKey: boolean;
    altKey: boolean;
    x: number;
    y: number;
    #shouldStopPropagation = true;

    constructor(
        type: IPressEvent['type'],
        pointerType: PointerType,
        originalEvent: EventBase<T>,
        state?: PressState
    ) {
        const currentTarget = state?.target ?? originalEvent.currentTarget;
        const rect: DOMRect | undefined =
            currentTarget?.getBoundingClientRect();
        let x = 0;
        let y = 0;
        let clientX: number | null = null;
        let clientY: number | null = null;
        if (originalEvent.clientX != null && originalEvent.clientY != null) {
            clientX = originalEvent.clientX;
            clientY = originalEvent.clientY;
        }
        if (rect) {
            if (clientX != null && clientY != null) {
                x = clientX - rect.left;
                y = clientY - rect.top;
            } else {
                x = rect.width / 2;
                y = rect.height / 2;
            }
        }
        this.type = type;
        this.pointerType = pointerType;
        this.target = originalEvent.currentTarget as EventTarget & T;
        this.shiftKey = originalEvent.shiftKey;
        this.metaKey = originalEvent.metaKey;
        this.ctrlKey = originalEvent.ctrlKey;
        this.altKey = originalEvent.altKey;
        this.x = x;
        this.y = y;
    }

    continuePropagation() {
        this.#shouldStopPropagation = false;
    }

    get shouldStopPropagation() {
        return this.#shouldStopPropagation;
    }
}

const LINK_CLICKED = Symbol('linkClicked');

/**
 * Handles press interactions across mouse, touch, keyboard, and screen readers.
 * It normalizes behavior across browsers and platforms, and handles many nuances
 * of dealing with pointer and keyboard events.
 */
export class Press<T extends FocusableElement = FocusableElement> {
    #onPress: PressEvents<T>['onPress'];
    #onPressChange: PressEvents<T>['onPressChange'];
    #onPressStart: PressEvents<T>['onPressStart'];
    #onPressEnd: PressEvents<T>['onPressEnd'];
    #onPressUp: PressEvents<T>['onPressUp'];
    #isDisabled: ReadableBox<boolean>;
    #preventFocusOnPress: ReadableBox<boolean>;
    #shouldCancelOnPointerExit: ReadableBox<boolean>;
    #allowTextSelectionOnPress: ReadableBox<boolean>;
    #domProps: HTMLAttributes<T> = $state({});
    #isPressed: WritableBox<boolean>;
    action: Action<T>;

    private pressResponderCtx(props: PressProps<T>) {
        const ctx = PressResponderContext.get();
        if (ctx) {
            const { register, ...other } = ctx;

            const newProps = $derived.by(
                () => mergeProps(other, props) as PressProps<T>
            );

            register();

            return () => newProps;
        }

        return () => props;
    }

    constructor(props: PressProps<T> = {}) {
        const {
            onPress,
            onPressChange,
            onPressStart,
            onPressEnd,
            onPressUp,
            isDisabled = false,
            preventFocusOnPress = false,
            shouldCancelOnPointerExit = false,
            allowTextSelectionOnPress = false,
            ...domProps
        } = $derived.by(this.pressResponderCtx(props));

        this.#onPress = onPress;
        this.#onPressChange = onPressChange;
        this.#onPressStart = onPressStart;
        this.#onPressEnd = onPressEnd;
        this.#onPressUp = onPressUp;
        this.#isDisabled = box.from(isDisabled);
        this.#isPressed = box(false);
        this.#preventFocusOnPress = box.from(preventFocusOnPress);
        this.#shouldCancelOnPointerExit = box.from(shouldCancelOnPointerExit);
        this.#allowTextSelectionOnPress = box.from(allowTextSelectionOnPress);
        this.#domProps = domProps;

        this.action = createAction(this.handlers(), {
            onCall: (node) => {
                for (const [key, value] of Object.entries(this.domProps)) {
                    node.setAttribute(key, value);
                }
            }
        });
    }

    get isDisabled() {
        return this.#isDisabled.current;
    }

    get isPressed() {
        return this.#isPressed.current;
    }

    get preventFocusOnPress() {
        return this.#preventFocusOnPress.current;
    }

    get shouldCancelOnPointerExit() {
        return this.#shouldCancelOnPointerExit.current;
    }

    get allowTextSelectionOnPress() {
        return this.#allowTextSelectionOnPress.current;
    }

    get domProps() {
        return this.#domProps;
    }

    handlers() {
        const ref: PressState<T> = {
            isPressed: false,
            ignoreEmulatedMouseEvents: false,
            ignoreClickAfterPress: false,
            didFirePressStart: false,
            isTriggeringEvent: false,
            activePointerId: null,
            target: null,
            isOverTarget: false,
            pointerType: null
        };

        const globalListeners = new GlobalListeners();

        const triggerPressStart = (
            originalEvent: EventBase,
            pointerType: PointerType
        ) => {
            if (this.isDisabled || ref.didFirePressStart) {
                return false;
            }

            let shouldStopPropagation = true;
            ref.isTriggeringEvent = true;
            if (this.#onPressStart) {
                const event = new PressEvent(
                    'pressstart',
                    pointerType,
                    originalEvent
                );
                this.#onPressStart(event as unknown as IPressEvent<T>);
                shouldStopPropagation = event.shouldStopPropagation;
            }

            if (this.#onPressChange) {
                this.#onPressChange(true);
            }

            ref.isTriggeringEvent = false;
            ref.didFirePressStart = true;
            this.#isPressed.current = true;
            return shouldStopPropagation;
        };

        const triggerPressEnd = (
            originalEvent: EventBase,
            pointerType: PointerType,
            wasPressed = true
        ) => {
            if (!ref.didFirePressStart) {
                return false;
            }

            ref.ignoreClickAfterPress = true;
            ref.didFirePressStart = false;
            ref.isTriggeringEvent = true;

            let shouldStopPropagation = true;
            if (this.#onPressEnd) {
                const event = new PressEvent(
                    'pressend',
                    pointerType,
                    originalEvent
                );
                this.#onPressEnd(event as unknown as IPressEvent<T>);
                shouldStopPropagation = event.shouldStopPropagation;
            }

            if (this.#onPressChange) {
                this.#onPressChange(false);
            }

            this.#isPressed.current = false;

            if (this.#onPress && wasPressed && !this.isDisabled) {
                const event = new PressEvent(
                    'press',
                    pointerType,
                    originalEvent
                );
                this.#onPress(event as unknown as IPressEvent<T>);
                shouldStopPropagation &&= event.shouldStopPropagation;
            }

            ref.isTriggeringEvent = false;
            return shouldStopPropagation;
        };

        const triggerPressUp = (
            originalEvent: EventBase,
            pointerType: PointerType
        ) => {
            if (this.isDisabled) {
                return false;
            }

            if (this.#onPressUp) {
                ref.isTriggeringEvent = true;
                const event = new PressEvent(
                    'pressup',
                    pointerType,
                    originalEvent
                );
                this.#onPressUp(event as unknown as IPressEvent<T>);
                ref.isTriggeringEvent = false;
                return event.shouldStopPropagation;
            }

            return true;
        };

        const cancel = (e: EventBase) => {
            if (ref.isPressed && ref.target) {
                if (ref.isOverTarget && ref.pointerType != null) {
                    triggerPressEnd(
                        createEvent(ref.target, e),
                        ref.pointerType,
                        false
                    );
                }
                ref.isPressed = false;
                ref.isOverTarget = false;
                ref.activePointerId = null;
                ref.pointerType = null;
                globalListeners.removeAllGlobalListeners();
                if (!this.allowTextSelectionOnPress) {
                    restoreTextSelection(ref.target);
                }
            }
        };

        const cancelOnPointerExit = (e: EventBase) => {
            if (this.shouldCancelOnPointerExit) {
                cancel(e);
            }
        };

        const pressProps: {
            click?: (e: TypedEvent<MouseEvent, T>) => void;
            keydown?: (e: TypedEvent<KeyboardEvent, T>) => void;
            pointerdown?: (e: TypedEvent<PointerEvent, T>) => void;
            pointerup?: (e: TypedEvent<PointerEvent, T>) => void;
            mousedown?: (e: TypedEvent<MouseEvent, T>) => void;
            mouseenter?: (e: TypedEvent<MouseEvent, T>) => void;
            mouseleave?: (e: TypedEvent<MouseEvent, T>) => void;
            mouseup?: (e: TypedEvent<MouseEvent, T>) => void;
            touchstart?: (e: TypedEvent<TouchEvent, T>) => void;
            touchmove?: (e: TypedEvent<TouchEvent, T>) => void;
            touchend?: (e: TypedEvent<TouchEvent, T>) => void;
            touchcancel?: (e: TypedEvent<TouchEvent, T>) => void;
            dragstart?: (e: TypedEvent<DragEvent, T>) => void;
        } = {
            keydown: (e) => {
                if (
                    isValidKeyboardEvent(e, e.currentTarget) &&
                    e.currentTarget.contains(e.target as Element)
                ) {
                    if (
                        shouldPreventDefaultKeyboard(e.target as Element, e.key)
                    ) {
                        e.preventDefault();
                    }

                    let shouldStopPropagation = true;
                    if (!ref.isPressed && !e.repeat) {
                        ref.target = e.currentTarget as T;
                        ref.isPressed = true;
                        shouldStopPropagation = triggerPressStart(
                            e,
                            'keyboard'
                        );

                        const originalTarget = e.currentTarget;
                        const pressUp = (e: KeyboardEvent) => {
                            if (
                                isValidKeyboardEvent(e, originalTarget) &&
                                !e.repeat &&
                                originalTarget.contains(e.target as Element) &&
                                ref.target
                            ) {
                                triggerPressUp(
                                    createEvent(ref.target, e as EventBase<T>),
                                    'keyboard'
                                );
                            }
                        };

                        globalListeners.addGlobalListener(
                            getOwnerDocument(e.currentTarget),
                            'keyup',
                            chain(pressUp, onKeyUp),
                            true
                        );
                    }

                    if (shouldStopPropagation) {
                        e.stopPropagation();
                    }

                    if (e.metaKey && isMac()) {
                        ref.metaKeyEvents?.set(e.key, e);
                    }
                } else if (e.key === 'Meta') {
                    ref.metaKeyEvents = new Map();
                }
            },
            click: (e) => {
                if (e && !e.currentTarget.contains(e.target as Element)) {
                    return;
                }

                if (
                    e &&
                    e.button === 0 &&
                    !ref.isTriggeringEvent &&
                    !(openLink as any).isOpening
                ) {
                    let shouldStopPropagation = true;
                    if (this.isDisabled) {
                        e.preventDefault();
                    }

                    if (
                        !ref.ignoreClickAfterPress &&
                        !ref.ignoreEmulatedMouseEvents &&
                        !ref.isPressed &&
                        (ref.pointerType === 'virtual' || isVirtualClick(e))
                    ) {
                        if (!this.isDisabled && !this.preventFocusOnPress) {
                            focusWithoutScrolling(e.currentTarget);
                        }

                        const stopPressStart = triggerPressStart(e, 'virtual');
                        const stopPressUp = triggerPressUp(e, 'virtual');
                        const stopPressEnd = triggerPressEnd(e, 'virtual');
                        shouldStopPropagation =
                            stopPressStart && stopPressUp && stopPressEnd;
                    }

                    ref.ignoreEmulatedMouseEvents = false;
                    ref.ignoreClickAfterPress = false;
                    if (shouldStopPropagation) {
                        e.stopPropagation();
                    }
                }
            }
        };

        const onKeyUp = (e: KeyboardEvent) => {
            if (
                ref.isPressed &&
                ref.target &&
                isValidKeyboardEvent(e, ref.target)
            ) {
                if (shouldPreventDefaultKeyboard(e.target as Element, e.key)) {
                    e.preventDefault();
                }

                const target = e.target as Element;
                triggerPressEnd(
                    createEvent(ref.target, e as EventBase<T>),
                    'keyboard',
                    ref.target.contains(target)
                );
                globalListeners.removeAllGlobalListeners();

                if (
                    e.key !== 'Enter' &&
                    isHTMLAnchorLink(ref.target) &&
                    ref.target.contains(target) &&
                    // @ts-ignore
                    !e[LINK_CLICKED]
                ) {
                    // @ts-ignore
                    e[LINK_CLICKED] = true;
                    openLink(ref.target, e, false);
                }

                ref.isPressed = false;
                ref.metaKeyEvents?.delete(e.key);
            } else if (e.key === 'Meta' && ref.metaKeyEvents?.size) {
                const events = ref.metaKeyEvents;
                ref.metaKeyEvents = undefined;
                for (const event of events.values()) {
                    ref.target?.dispatchEvent(
                        new KeyboardEvent('keyup', event)
                    );
                }
            }
        };

        if (typeof PointerEvent !== 'undefined') {
            pressProps.pointerdown = (e) => {
                if (
                    e.button !== 0 ||
                    !e.currentTarget.contains(e.target as Element)
                ) {
                    return;
                }

                if (isVirtualPointerEvent(e)) {
                    ref.pointerType = 'virtual';
                    return;
                }

                if (shouldPreventDefault(e.currentTarget as Element)) {
                    e.preventDefault();
                }

                ref.pointerType = e.pointerType as PointerType;

                let shouldStopPropagation = true;
                if (!ref.isPressed) {
                    ref.isPressed = true;
                    ref.isOverTarget = true;
                    ref.activePointerId = e.pointerId;
                    ref.target = e.currentTarget as T;

                    if (!this.isDisabled && !this.preventFocusOnPress) {
                        focusWithoutScrolling(e.currentTarget);
                    }

                    if (!this.allowTextSelectionOnPress) {
                        disableTextSelection(ref.target);
                    }

                    shouldStopPropagation = triggerPressStart(
                        e,
                        ref.pointerType
                    );

                    globalListeners.addGlobalListener(
                        getOwnerDocument(e.currentTarget),
                        'pointermove',
                        onPointerMove,
                        false
                    );
                    globalListeners.addGlobalListener(
                        getOwnerDocument(e.currentTarget),
                        'pointerup',
                        onPointerUp,
                        false
                    );
                    globalListeners.addGlobalListener(
                        getOwnerDocument(e.currentTarget),
                        'pointercancel',
                        onPointerCancel,
                        false
                    );
                }

                if (shouldStopPropagation) {
                    e.stopPropagation();
                }
            };

            pressProps.mousedown = (e) => {
                if (!e.currentTarget.contains(e.target as Element)) {
                    return;
                }

                if (e.button === 0) {
                    if (shouldPreventDefault(e.currentTarget as Element)) {
                        e.preventDefault();
                    }

                    e.stopPropagation();
                }
            };

            pressProps.pointerup = (e) => {
                if (
                    !e.currentTarget.contains(e.target as Element) ||
                    ref.pointerType === 'virtual'
                ) {
                    return;
                }

                if (e.button === 0 && isOverTarget(e, e.currentTarget)) {
                    triggerPressUp(
                        e,
                        ref.pointerType || (e.pointerType as PointerType)
                    );
                }
            };

            const onPointerMove = (e: PointerEvent) => {
                if (e.pointerId !== ref.activePointerId) {
                    return;
                }

                if (ref.target && isOverTarget(e, ref.target)) {
                    if (!ref.isOverTarget && ref.pointerType != null) {
                        ref.isOverTarget = true;
                        triggerPressStart(
                            createEvent(ref.target, e as EventBase<T>),
                            ref.pointerType
                        );
                    }
                } else if (
                    ref.target &&
                    ref.isOverTarget &&
                    ref.pointerType != null
                ) {
                    ref.isOverTarget = false;
                    triggerPressEnd(
                        createEvent(ref.target, e as EventBase<T>),
                        ref.pointerType,
                        false
                    );
                    cancelOnPointerExit(e as EventBase<T>);
                }
            };

            const onPointerUp = (e: PointerEvent) => {
                if (
                    e.pointerId === ref.activePointerId &&
                    ref.isPressed &&
                    e.button === 0 &&
                    ref.target
                ) {
                    if (
                        isOverTarget(e, ref.target) &&
                        ref.pointerType != null
                    ) {
                        triggerPressEnd(
                            createEvent(ref.target, e as EventBase<T>),
                            ref.pointerType
                        );
                    } else if (ref.isOverTarget && ref.pointerType != null) {
                        triggerPressEnd(
                            createEvent(ref.target, e as EventBase<T>),
                            ref.pointerType,
                            false
                        );
                    }

                    ref.isPressed = false;
                    ref.isOverTarget = false;
                    ref.activePointerId = null;
                    ref.pointerType = null;
                    globalListeners.removeAllGlobalListeners();
                    if (!this.allowTextSelectionOnPress) {
                        restoreTextSelection(ref.target);
                    }
                }
            };

            const onPointerCancel = (e: PointerEvent) => {
                cancel(e as EventBase<T>);
            };

            pressProps.dragstart = (e) => {
                if (!e.currentTarget.contains(e.target as Element)) {
                    return;
                }
                cancel(e);
            };
        } else {
            pressProps.mousedown = (e) => {
                if (
                    e.button !== 0 ||
                    !e.currentTarget.contains(e.target as Element)
                ) {
                    return;
                }

                if (shouldPreventDefault(e.currentTarget)) {
                    e.preventDefault();
                }

                if (ref.ignoreEmulatedMouseEvents) {
                    e.stopPropagation();
                    return;
                }

                ref.isPressed = true;
                ref.isOverTarget = true;
                ref.target = e.currentTarget as T;
                ref.pointerType = isVirtualClick(e) ? 'virtual' : 'mouse';

                if (!this.isDisabled && !this.preventFocusOnPress) {
                    focusWithoutScrolling(e.currentTarget);
                }

                const shouldStopPropagation = triggerPressStart(
                    e,
                    ref.pointerType
                );
                if (shouldStopPropagation) {
                    e.stopPropagation();
                }

                globalListeners.addGlobalListener(
                    getOwnerDocument(e.currentTarget),
                    'mouseup',
                    onMouseUp,
                    false
                );
            };

            pressProps.mouseenter = (e) => {
                if (!e.currentTarget.contains(e.target as Element)) {
                    return;
                }

                let shouldStopPropagation = true;
                if (
                    ref.isPressed &&
                    !ref.ignoreEmulatedMouseEvents &&
                    ref.pointerType != null
                ) {
                    ref.isOverTarget = true;
                    shouldStopPropagation = triggerPressStart(
                        e,
                        ref.pointerType
                    );
                }

                if (shouldStopPropagation) {
                    e.stopPropagation();
                }
            };

            pressProps.mouseleave = (e) => {
                if (!e.currentTarget.contains(e.target as Element)) {
                    return;
                }

                let shouldStopPropagation = true;
                if (
                    ref.isPressed &&
                    !ref.ignoreEmulatedMouseEvents &&
                    ref.pointerType != null
                ) {
                    ref.isOverTarget = false;
                    shouldStopPropagation = triggerPressEnd(
                        e,
                        ref.pointerType,
                        false
                    );
                    cancelOnPointerExit(e);
                }

                if (shouldStopPropagation) {
                    e.stopPropagation();
                }
            };

            pressProps.mouseup = (e) => {
                if (!e.currentTarget.contains(e.target as Element)) {
                    return;
                }

                if (!ref.ignoreEmulatedMouseEvents && e.button === 0) {
                    triggerPressUp(e, ref.pointerType || 'mouse');
                }
            };

            const onMouseUp = (e: MouseEvent) => {
                if (e.button !== 0) {
                    return;
                }

                ref.isPressed = false;
                globalListeners.removeAllGlobalListeners();

                if (ref.ignoreEmulatedMouseEvents) {
                    ref.ignoreEmulatedMouseEvents = false;
                    return;
                }

                if (
                    ref.target &&
                    isOverTarget(e, ref.target) &&
                    ref.pointerType != null
                ) {
                    triggerPressEnd(
                        createEvent(ref.target, e as EventBase<T>),
                        ref.pointerType
                    );
                } else if (
                    ref.target &&
                    ref.isOverTarget &&
                    ref.pointerType != null
                ) {
                    triggerPressEnd(
                        createEvent(ref.target, e as EventBase<T>),
                        ref.pointerType,
                        false
                    );
                }

                ref.isOverTarget = false;
            };

            pressProps.touchstart = (e) => {
                if (!e.currentTarget.contains(e.target as Element)) {
                    return;
                }

                const touch = getTouchFromEvent(e);
                if (!touch) {
                    return;
                }
                ref.activePointerId = touch.identifier;
                ref.ignoreEmulatedMouseEvents = true;
                ref.isOverTarget = true;
                ref.isPressed = true;
                ref.target = e.currentTarget as T;
                ref.pointerType = 'touch';

                if (!this.isDisabled && !this.preventFocusOnPress) {
                    focusWithoutScrolling(e.currentTarget);
                }

                if (!this.allowTextSelectionOnPress) {
                    disableTextSelection(ref.target!);
                }

                const shouldStopPropagation = triggerPressStart(
                    createTouchEvent(ref.target!, e),
                    ref.pointerType
                );
                if (shouldStopPropagation) {
                    e.stopPropagation();
                }

                globalListeners.addGlobalListener(
                    getOwnerWindow(e.currentTarget),
                    'scroll',
                    onScroll,
                    true
                );
            };

            pressProps.touchmove = (e) => {
                if (!e.currentTarget.contains(e.target as Element)) {
                    return;
                }

                if (!ref.isPressed) {
                    e.stopPropagation();
                    return;
                }

                const touch = getTouchById(e, ref.activePointerId);
                let shouldStopPropagation = true;
                if (touch && isOverTarget(touch, e.currentTarget)) {
                    if (!ref.isOverTarget && ref.pointerType != null) {
                        ref.isOverTarget = true;
                        shouldStopPropagation = triggerPressStart(
                            createTouchEvent(ref.target!, e),
                            ref.pointerType
                        );
                    }
                } else if (ref.isOverTarget && ref.pointerType != null) {
                    ref.isOverTarget = false;
                    shouldStopPropagation = triggerPressEnd(
                        createTouchEvent(ref.target!, e),
                        ref.pointerType,
                        false
                    );
                    cancelOnPointerExit(createTouchEvent(ref.target!, e));
                }

                if (shouldStopPropagation) {
                    e.stopPropagation();
                }
            };

            pressProps.touchend = (e) => {
                if (!e.currentTarget.contains(e.target as Element)) {
                    return;
                }

                if (!ref.isPressed) {
                    e.stopPropagation();
                    return;
                }

                const touch = getTouchById(e, ref.activePointerId);
                let shouldStopPropagation = true;
                if (
                    touch &&
                    isOverTarget(touch, e.currentTarget) &&
                    ref.pointerType != null
                ) {
                    triggerPressUp(
                        createTouchEvent(ref.target!, e),
                        ref.pointerType
                    );
                    shouldStopPropagation = triggerPressEnd(
                        createTouchEvent(ref.target!, e),
                        ref.pointerType
                    );
                } else if (ref.isOverTarget && ref.pointerType != null) {
                    shouldStopPropagation = triggerPressEnd(
                        createTouchEvent(ref.target!, e),
                        ref.pointerType,
                        false
                    );
                }

                if (shouldStopPropagation) {
                    e.stopPropagation();
                }

                ref.isPressed = false;
                ref.activePointerId = null;
                ref.isOverTarget = false;
                ref.ignoreEmulatedMouseEvents = true;
                if (ref.target && !this.allowTextSelectionOnPress) {
                    restoreTextSelection(ref.target);
                }
                globalListeners.removeAllGlobalListeners();
            };

            pressProps.touchcancel = (e) => {
                if (!e.currentTarget.contains(e.target as Element)) {
                    return;
                }

                e.stopPropagation();
                if (ref.isPressed) {
                    cancel(createTouchEvent(ref.target!, e));
                }
            };

            const onScroll = (e: Event) => {
                if (
                    ref.isPressed &&
                    (e.target as Element).contains(ref.target)
                ) {
                    cancel({
                        currentTarget: ref.target,
                        shiftKey: false,
                        ctrlKey: false,
                        metaKey: false,
                        altKey: false
                    });
                }
            };

            pressProps.dragstart = (e) => {
                if (!e.currentTarget.contains(e.target as Element)) {
                    return;
                }

                cancel(e);
            };
        }

        $effect(() => {
            return () => {
                if (!this.allowTextSelectionOnPress) {
                    restoreTextSelection(ref.target ?? undefined);
                }
            };
        });

        return pressProps;
    }
}

const isHTMLAnchorLink = (target: Element): target is HTMLAnchorElement => {
    return target.tagName === 'A' && target.hasAttribute('href');
};

const isValidKeyboardEvent = (
    event: KeyboardEvent,
    currentTarget: Element
): boolean => {
    const { key, code } = event;
    const element = currentTarget as HTMLElement;
    const role = element.getAttribute('role');
    return (
        (key === 'Enter' ||
            key === ' ' ||
            key === 'Spacebar' ||
            code === 'Space') &&
        !(
            (element instanceof getOwnerWindow(element).HTMLInputElement &&
                !isValidInputKey(element, key)) ||
            element instanceof getOwnerWindow(element).HTMLTextAreaElement ||
            element.isContentEditable
        ) &&
        !(
            (role === 'link' || (!role && isHTMLAnchorLink(element))) &&
            key !== 'Enter'
        )
    );
};

const getTouchFromEvent = (event: TouchEvent): Touch | null => {
    const { targetTouches } = event;
    if (targetTouches.length > 0) {
        return targetTouches[0];
    }
    return null;
};

const getTouchById = (
    event: TouchEvent,
    pointerId: null | number
): null | Touch => {
    const changedTouches = event.changedTouches;
    for (const touch of changedTouches) {
        if (touch.identifier === pointerId) {
            return touch;
        }
    }
    return null;
};

const createTouchEvent = (
    target: FocusableElement,
    e: TouchEvent
): EventBase => {
    let clientX = 0;
    let clientY = 0;
    if (e.targetTouches && e.targetTouches.length === 1) {
        clientX = e.targetTouches[0].clientX;
        clientY = e.targetTouches[0].clientY;
    }
    return {
        currentTarget: target,
        shiftKey: e.shiftKey,
        ctrlKey: e.ctrlKey,
        metaKey: e.metaKey,
        altKey: e.altKey,
        clientX,
        clientY
    };
};

const createEvent = (target: FocusableElement, e: EventBase): EventBase => {
    const clientX = e.clientX;
    const clientY = e.clientY;
    return {
        currentTarget: target,
        shiftKey: e.shiftKey,
        ctrlKey: e.ctrlKey,
        metaKey: e.metaKey,
        altKey: e.altKey,
        clientX,
        clientY
    };
};

interface Rect {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

interface EventPoint {
    clientX: number;
    clientY: number;
    width?: number;
    height?: number;
    radiusX?: number;
    radiusY?: number;
}

const getPointClientRect = (point: EventPoint): Rect => {
    let offsetX = 0;
    let offsetY = 0;
    if (point.width !== undefined) {
        offsetX = point.width / 2;
    } else if (point.radiusX !== undefined) {
        offsetX = point.radiusX;
    }
    if (point.height !== undefined) {
        offsetY = point.height / 2;
    } else if (point.radiusY !== undefined) {
        offsetY = point.radiusY;
    }

    return {
        top: point.clientY - offsetY,
        right: point.clientX + offsetX,
        bottom: point.clientY + offsetY,
        left: point.clientX - offsetX
    };
};

const areRectanglesOverlapping = (a: Rect, b: Rect) => {
    if (a.left > b.right || b.left > a.right) {
        return false;
    }
    if (a.top > b.bottom || b.top > a.bottom) {
        return false;
    }
    return true;
};

const isOverTarget = (point: EventPoint, target: Element) => {
    const rect = target.getBoundingClientRect();
    const pointRect = getPointClientRect(point);
    return areRectanglesOverlapping(rect, pointRect);
};

const shouldPreventDefault = (target: Element) => {
    return (
        !(target instanceof HTMLElement) || !target.hasAttribute('draggable')
    );
};

const shouldPreventDefaultKeyboard = (target: Element, key: string) => {
    if (target instanceof HTMLInputElement) {
        return !isValidInputKey(target, key);
    }

    if (target instanceof HTMLButtonElement) {
        return target.type !== 'submit' && target.type !== 'reset';
    }

    if (isHTMLAnchorLink(target)) {
        return false;
    }

    return true;
};

const nonTextInputTypes = new Set([
    'checkbox',
    'radio',
    'range',
    'color',
    'file',
    'image',
    'button',
    'submit',
    'reset'
]);

const isValidInputKey = (target: HTMLInputElement, key: string) => {
    return target.type === 'checkbox' || target.type === 'radio'
        ? key === ' '
        : nonTextInputTypes.has(target.type);
};
