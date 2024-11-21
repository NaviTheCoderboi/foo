import { box, type ReadableBox } from 'svelte-toolbelt';
import type { FocusableElement } from '../../types/dom';
import type { LongPressEvent } from '../../types/events';
import type { ReadableProp } from '../../types/utils';
import type { HTMLAttributes } from 'svelte/elements';
import { GlobalListeners } from '../../utils/globalListeners';
import { Press } from '../press';
import { watch } from '../../utils/watch.svelte';
import type { Action } from 'svelte/action';
import { createAction } from '../../utils/action';

export interface LongPressProps<T extends FocusableElement = FocusableElement> {
    /** Whether long press events should be disabled. */
    isDisabled?: ReadableProp<boolean>;
    /** Handler that is called when a long press interaction starts. */
    onLongPressStart?: (e: LongPressEvent<T>) => void;
    /**
     * Handler that is called when a long press interaction ends, either
     * over the target or when the pointer leaves the target.
     */
    onLongPressEnd?: (e: LongPressEvent<T>) => void;
    /**
     * Handler that is called when the threshold time is met while
     * the press is over the target.
     */
    onLongPress?: (e: LongPressEvent<T>) => void;
    /**
     * The amount of time in milliseconds to wait before triggering a long press.
     * @default 500ms
     */
    threshold?: ReadableProp<number>;
    /**
     * A description for assistive techology users indicating that a long press
     * action is available, e.g. "Long press to open menu".
     */
    accessibilityDescription?: ReadableProp<string>;
}

const DEFAULT_THRESHOLD = 500;

/**
 * Handles long press interactions across mouse and touch devices. Supports a customizable time threshold,
 * accessibility description, and normalizes behavior across browsers and devices.
 */
export class LongPress<T extends FocusableElement = FocusableElement> {
    #onLongPress: LongPressProps<T>['onLongPress'];
    #onLongPressEnd: LongPressProps<T>['onLongPressEnd'];
    #onLongPressStart: LongPressProps<T>['onLongPressStart'];
    #accessibilityDescription: ReadableBox<string | undefined>;
    #isDisabled: ReadableBox<boolean>;
    #threshold: ReadableBox<number>;
    #domProps: HTMLAttributes<T> & {
        'aria-description'?: string;
    } = $state({});
    action: Action<T>;

    constructor(props: LongPressProps<T> = {}) {
        const {
            onLongPress,
            onLongPressEnd,
            onLongPressStart,
            accessibilityDescription,
            isDisabled = false,
            threshold = DEFAULT_THRESHOLD
        } = props;

        this.#onLongPress = onLongPress;
        this.#onLongPressEnd = onLongPressEnd;
        this.#onLongPressStart = onLongPressStart;
        this.#accessibilityDescription = box.from(accessibilityDescription);
        this.#isDisabled = box.from(isDisabled);
        this.#threshold = box.from(threshold);

        watch(this.#accessibilityDescription, (curr) => {
            if (!curr) return;
            if (this.isDisabled) return;

            this.#domProps['aria-description'] = curr;
        });

        this.action = createAction(this.handlers());
    }

    get isDisabled() {
        return this.#isDisabled.current;
    }

    get threshold() {
        return this.#threshold.current;
    }

    get domProps() {
        return this.#domProps;
    }

    handlers() {
        const longPress = this;

        let timeRef: ReturnType<typeof setTimeout> | undefined = undefined;
        const globalListeners = new GlobalListeners();

        const _press = new Press({
            isDisabled: () => this.isDisabled,
            onPressStart(e) {
                e.continuePropagation();
                if (e.pointerType === 'mouse' || e.pointerType === 'touch') {
                    if (longPress.#onLongPressStart) {
                        longPress.#onLongPressStart({
                            ...e,
                            type: 'longpressstart'
                        } as unknown as LongPressEvent<T>);
                    }

                    timeRef = setTimeout(() => {
                        e.target.dispatchEvent(
                            new PointerEvent('pointercancel', {
                                bubbles: true
                            })
                        );
                        if (longPress.#onLongPress) {
                            longPress.#onLongPress({
                                ...e,
                                type: 'longpress'
                            } as unknown as LongPressEvent<T>);
                        }
                        timeRef = undefined;
                    }, longPress.threshold);

                    if (e.pointerType === 'touch') {
                        const onContextMenu = (e: MouseEvent) => {
                            e.preventDefault();
                        };

                        globalListeners.addGlobalListener(
                            e.target,
                            'contextmenu',
                            onContextMenu,
                            {
                                once: true
                            }
                        );
                        globalListeners.addGlobalListener(
                            window,
                            'pointerup',
                            () => {
                                setTimeout(() => {
                                    globalListeners.removeGlobalListener(
                                        e.target,
                                        'contextmenu',
                                        onContextMenu
                                    );
                                }, 30);
                            },
                            { once: true }
                        );
                    }
                }
            },
            onPressEnd(e) {
                if (timeRef) {
                    clearTimeout(timeRef);
                }

                if (
                    longPress.#onLongPressEnd &&
                    (e.pointerType === 'mouse' || e.pointerType === 'touch')
                ) {
                    longPress.#onLongPressEnd({
                        ...e,
                        type: 'longpressend'
                    } as unknown as LongPressEvent<T>);
                }
            }
        });

        this.#domProps = _press.domProps;

        return _press.handlers();
    }
}
