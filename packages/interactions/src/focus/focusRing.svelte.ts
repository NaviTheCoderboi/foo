import { box, type ReadableBox } from 'svelte-toolbelt';
import type { ReadableProp } from '../types/utils';
import {
    FocusVisible,
    isFocusVisible
} from '../interactions/focusVisible/focusVisible.svelte';
import { Focus, FocusWithin } from '../interactions';
import type { Action } from 'svelte/action';
import type { FocusableElement } from '../types/dom';
import { createAction } from '../utils/action';

export interface FocusRingProps {
    /**
     * Whether to show the focus ring when something
     * inside the container element has focus (true), or
     * only if the container itself has focus (false).
     * @default 'false'
     */
    within?: ReadableProp<boolean>;

    /** Whether the element is a text input. */
    isTextInput?: ReadableProp<boolean>;

    /** Whether the element will be auto focused. */
    autoFocus?: ReadableProp<boolean>;
}

/**
 * A utility component that applies a CSS class when an element has keyboard focus.
 * Focus rings are visible only when the user is interacting with a keyboard,
 * not with a mouse, touch, or other input methods.
 */
export class FocusRing {
    #autoFocus: ReadableBox<boolean>;
    #isTextInput: ReadableBox<boolean>;
    #within: ReadableBox<boolean>;
    #isFocusVisible = box(false);
    action: Action<FocusableElement>;

    constructor(props: FocusRingProps = {}) {
        const {
            autoFocus = false,
            isTextInput = false,
            within = false
        } = props;

        this.#autoFocus = box.from(autoFocus);
        this.#isTextInput = box.from(isTextInput);
        this.#within = box.from(within);

        this.action = createAction(this.handlers());
    }

    get autoFocus() {
        return this.#autoFocus.current;
    }

    get isTextInput() {
        return this.#isTextInput.current;
    }

    get within() {
        return this.#within.current;
    }

    get isFocusVisible() {
        return this.#isFocusVisible.current;
    }

    handlers() {
        const state = {
            isFocusVisible: this.autoFocus ?? isFocusVisible()
        };

        const onFocusChange = (isFocused: boolean) => {
            this.#isFocusVisible.current = isFocused && state.isFocusVisible;
        };

        const _focus = new Focus({
            isDisabled: () => this.within ?? false,
            onFocusChange
        });

        FocusVisible.focusVisibleListener((isFocusVisible) => {
            state.isFocusVisible = isFocusVisible;
            this.#isFocusVisible.current =
                isFocusVisible && _focus.focusState.isFocused;
        }, this.#isTextInput);

        const _focusWithin = new FocusWithin({
            isDisabled: () => !this.within,
            onFocusWithinChange: onFocusChange
        });

        return this.within ? _focusWithin.handlers() : _focus.handlers();
    }
}
