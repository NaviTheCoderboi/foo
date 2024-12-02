import { box, type AnyFn, type ReadableBox } from 'svelte-toolbelt';
import type { FocusableDOMProps, FocusableElement } from '../types/dom';
import type { FocusableProps } from '../types/events';
import type { ReadableProp } from '../types/utils';
import { Focus, Keyboard } from '../interactions';
import { getOwnerDocument } from '../utils/domHelpers';
import { getInteractionModality } from '../interactions/focusVisible/focusVisible.svelte';
import { runAfterTransition } from '../utils/runAfterTransition';
import { focusWithoutScrolling } from '../utils/focusWithoutScrolling';
import { chain } from '../utils/common';

export interface FocusableOptions<T extends FocusableElement = FocusableElement>
    extends FocusableProps<T>,
        FocusableDOMProps {
    /** Whether focus should be disabled. */
    isDisabled?: ReadableProp<boolean>;
}

/**
 * Used to make an element focusable and capable of auto focus.
 */
export class Focusable<T extends FocusableElement = FocusableElement> {
    #isDisabled: ReadableBox<boolean>;
    #autoFocus: ReadableBox<boolean>;
    #excludeFromTabOrder: ReadableBox<boolean>;
    #id: ReadableBox<string | undefined>;
    #onBlur: FocusableProps<T>['onBlur'];
    #onFocus: FocusableProps<T>['onFocus'];
    #onFocusChange: FocusableProps<T>['onFocusChange'];
    #onKeyDown: FocusableProps<T>['onKeyDown'];
    #onKeyUp: FocusableProps<T>['onKeyUp'];

    constructor(props: FocusableOptions<T> = {}) {
        const {
            isDisabled = false,
            autoFocus = false,
            excludeFromTabOrder = false,
            id,
            onBlur,
            onFocus,
            onFocusChange,
            onKeyDown,
            onKeyUp
        } = props;

        this.#isDisabled = box.from(isDisabled);
        this.#autoFocus = box.from(autoFocus);
        this.#excludeFromTabOrder = box.from(excludeFromTabOrder);
        this.#id = box.from(id);
        this.#onBlur = onBlur;
        this.#onFocus = onFocus;
        this.#onFocusChange = onFocusChange;
        this.#onKeyDown = onKeyDown;
        this.#onKeyUp = onKeyUp;
    }

    get isDisabled() {
        return this.#isDisabled.current;
    }

    get autoFocus() {
        return this.#autoFocus.current;
    }

    get excludeFromTabOrder() {
        return this.#excludeFromTabOrder.current;
    }

    get id() {
        return this.#id.current;
    }

    action(node: T) {
        const _focus = new Focus({
            isDisabled: () => this.isDisabled,
            onBlur: this.#onBlur,
            onFocus: this.#onFocus,
            onFocusChange: this.#onFocusChange
        });

        const _keyboard = new Keyboard({
            isDisabled: () => this.isDisabled,
            onKeyDown: this.#onKeyDown,
            onKeyUp: this.#onKeyUp
        });

        let autoFocusRef = this.#autoFocus.current;

        $effect(() => {
            if (autoFocusRef) {
                Focusable.focusSafely(node);
            }

            autoFocusRef = false;
        });

        $effect(() => {
            this.id;
            this.isDisabled;
            this.excludeFromTabOrder;

            if (this.id) {
                node.id = this.id;
            }

            if (this.excludeFromTabOrder && !this.isDisabled) {
                node.tabIndex = -1;
            } else {
                node.tabIndex = undefined as unknown as number;
            }
        });

        const destroy: AnyFn[] = [];
        const update: AnyFn[] = [];

        const _focusAction = _focus.action(node);
        const _keyboardAction = _keyboard.action(node);

        // @ts-ignore
        destroy.push(_focusAction.destroy);
        // @ts-ignore
        destroy.push(_keyboardAction.destroy);
        // @ts-ignore
        update.push(_focusAction.update);
        // @ts-ignore
        update.push(_keyboardAction.update);

        return {
            destroy: () => {
                chain(...destroy)();
            },
            update: () => {
                chain(...update)();
            }
        };
    }

    /**
     * A utility function that focuses an element while avoiding undesired side effects such
     * as page scrolling and screen reader issues with CSS transitions.
     */
    static focusSafely(element: FocusableElement) {
        const ownerDocument = getOwnerDocument(element);

        if (getInteractionModality() === 'virtual') {
            const lastFocusedElement = ownerDocument.activeElement;

            runAfterTransition(() => {
                if (
                    ownerDocument.activeElement === lastFocusedElement &&
                    element.isConnected
                ) {
                    focusWithoutScrolling(element);
                }
            });
        } else {
            focusWithoutScrolling(element);
        }
    }
}
