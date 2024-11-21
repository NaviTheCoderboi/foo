import { box, type ReadableBox, type WritableBox } from 'svelte-toolbelt';
import type { FocusableElement } from '../../types/dom';
import type { HoverEvents, PointerType, TypedEvent } from '../../types/events';
import type { ReadableProp } from '../../types/utils';
import { mapObject, withDisabledCheck } from '../../utils/common';
import type { Action } from 'svelte/action';
import { createAction } from '../../utils/action';

export interface HoverProps<T extends FocusableElement = FocusableElement>
    extends HoverEvents<T> {
    /** Whether the hover events should be disabled. */
    isDisabled?: ReadableProp<boolean>;
}

let globalIgnoreEmulatedMouseEvents = false;
let hoverCount = 0;

const setGlobalIgnoreEmulatedMouseEvents = () => {
    globalIgnoreEmulatedMouseEvents = true;
    setTimeout(() => {
        globalIgnoreEmulatedMouseEvents = false;
    }, 50);
};

const handleGlobalPointerEvent = (e: PointerEvent) => {
    if (e.pointerType === 'touch') {
        setGlobalIgnoreEmulatedMouseEvents();
    }
};

const setupGlobalTouchEvents = () => {
    if (typeof document === 'undefined') {
        return;
    }

    if (typeof PointerEvent !== 'undefined') {
        document.addEventListener('pointerup', handleGlobalPointerEvent);
    } else {
        document.addEventListener(
            'touchend',
            setGlobalIgnoreEmulatedMouseEvents
        );
    }

    hoverCount++;
    return () => {
        hoverCount--;
        if (hoverCount > 0) {
            return;
        }

        if (typeof PointerEvent !== 'undefined') {
            document.removeEventListener('pointerup', handleGlobalPointerEvent);
        } else {
            document.removeEventListener(
                'touchend',
                setGlobalIgnoreEmulatedMouseEvents
            );
        }
    };
};

/**
 * Handles pointer hover interactions for an element. Normalizes behavior
 * across browsers and platforms, and ignores emulated mouse events on touch devices.
 */
export class Hover<T extends FocusableElement = FocusableElement> {
    #isDisabled: ReadableBox<boolean>;
    #onHoverStart: HoverEvents<T>['onHoverStart'];
    #onHoverChange: HoverEvents<T>['onHoverChange'];
    #onHoverEnd: HoverEvents<T>['onHoverEnd'];
    #isHovered: WritableBox<boolean>;
    action: Action<T>;

    constructor(props: HoverProps<T> = {}) {
        const {
            onHoverStart,
            onHoverChange,
            onHoverEnd,
            isDisabled = false
        } = props;

        this.#isDisabled = box.from(isDisabled);
        this.#onHoverStart = onHoverStart;
        this.#onHoverChange = onHoverChange;
        this.#onHoverEnd = onHoverEnd;
        this.#isHovered = box(false);

        this.action = createAction(this.handlers());
    }

    get isDisabled() {
        return this.#isDisabled.current;
    }

    get isHovered() {
        return this.#isHovered.current;
    }

    handlers() {
        const state: {
            isHovered: boolean;
            ignoreEmulatedMouseEvents: boolean;
            pointerType: PointerType;
            target: (EventTarget & T) | null;
        } = {
            isHovered: false,
            ignoreEmulatedMouseEvents: false,
            pointerType: '' as PointerType,
            target: null
        };

        $effect(setupGlobalTouchEvents);

        const hoverProps: {
            pointerenter?: (e: PointerEvent) => void;
            pointerleave?: (e: PointerEvent) => void;
            touchstart?: () => void;
            mouseenter?: (e: MouseEvent) => void;
            mouseleave?: (e: MouseEvent) => void;
        } = {};

        const triggerHoverStart = (
            event: TypedEvent<MouseEvent, T>,
            pointerType: PointerType
        ) => {
            state.pointerType = pointerType;
            if (
                this.isDisabled ||
                pointerType === 'touch' ||
                state.isHovered ||
                !event.currentTarget.contains(event.target as Node)
            ) {
                return;
            }

            state.isHovered = true;
            const target = event.currentTarget;
            state.target = target;

            if (this.#onHoverStart) {
                this.#onHoverStart({
                    type: 'hoverstart',
                    target,
                    pointerType: pointerType as 'mouse' | 'pen'
                });
            }

            if (this.#onHoverChange) {
                this.#onHoverChange(true);
            }

            this.#isHovered.current = true;
        };

        const triggerHoverEnd = (
            event: TypedEvent<MouseEvent, T>,
            pointerType: PointerType
        ) => {
            state.pointerType = '' as PointerType;
            state.target = null;

            if (pointerType === 'touch' || !state.isHovered) {
                return;
            }

            state.isHovered = false;
            const target = event.currentTarget;
            if (this.#onHoverEnd) {
                this.#onHoverEnd({
                    type: 'hoverend',
                    target,
                    pointerType: pointerType as 'mouse' | 'pen'
                });
            }

            if (this.#onHoverChange) {
                this.#onHoverChange(false);
            }

            this.#isHovered.current = false;
        };

        if (typeof PointerEvent !== 'undefined') {
            hoverProps.pointerenter = (e) => {
                if (
                    globalIgnoreEmulatedMouseEvents &&
                    e.pointerType === 'mouse'
                ) {
                    return;
                }

                triggerHoverStart(
                    e as unknown as TypedEvent<MouseEvent, T>,
                    e.pointerType as PointerType
                );
            };

            hoverProps.pointerleave = (e) => {
                if (
                    !this.isDisabled &&
                    (e.currentTarget as FocusableElement).contains(
                        e.target as Element
                    )
                ) {
                    triggerHoverEnd(
                        e as unknown as TypedEvent<MouseEvent, T>,
                        e.pointerType as PointerType
                    );
                }
            };
        } else {
            hoverProps.touchstart = () => {
                state.ignoreEmulatedMouseEvents = true;
            };

            hoverProps.mouseenter = (e) => {
                if (
                    !state.ignoreEmulatedMouseEvents &&
                    !globalIgnoreEmulatedMouseEvents
                ) {
                    triggerHoverStart(
                        e as unknown as TypedEvent<MouseEvent, T>,
                        'mouse'
                    );
                }

                state.ignoreEmulatedMouseEvents = false;
            };

            hoverProps.mouseleave = (e) => {
                if (
                    !this.isDisabled &&
                    (e.currentTarget as FocusableElement).contains(
                        e.target as Element
                    )
                ) {
                    triggerHoverEnd(
                        e as unknown as TypedEvent<MouseEvent, T>,
                        'mouse'
                    );
                }
            };
        }

        $effect(() => {
            if (this.isDisabled) {
                triggerHoverEnd(
                    // @ts-ignore
                    { currentTarget: state.target },
                    state.pointerType
                );
            }
        });

        return {
            ...mapObject(hoverProps, (handler) => {
                if (!handler) return;

                return withDisabledCheck(handler, this.#isDisabled);
            })
        };
    }
}
