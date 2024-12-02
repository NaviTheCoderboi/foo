import { box, type ReadableBox } from 'svelte-toolbelt';
import type { FocusableElement } from '../../types/dom';
import type { FocusEvents, TypedEvent } from '../../types/events';
import type { ReadableProp } from '../../types/utils';
import { BlurEvent } from './blurEvent.svelte';
import { withDisabledCheck } from '../../utils/common';
import { getOwnerDocument } from '../../utils/domHelpers';
import { createAction } from '../../utils/action';
import type { Action } from 'svelte/action';

export interface FocusProps<T extends FocusableElement = FocusableElement>
    extends FocusEvents<T> {
    /** Whether the focus events should be disabled. */
    isDisabled?: ReadableProp<boolean>;
}

/**
 * Handles focus events for the immediate target.
 * Focus events on child elements will be ignored.
 */
export class Focus<T extends FocusableElement = FocusableElement> {
    #isDisabled: ReadableBox<boolean>;
    #onFocus: FocusProps<T>['onFocus'];
    #onBlur: FocusProps<T>['onBlur'];
    #onFocusChange: FocusProps<T>['onFocusChange'];
    #focusState = $state() as { isFocused: boolean };
    action: Action<T>;

    constructor(props: FocusProps<T> = {}) {
        const { isDisabled = false, onFocus, onBlur, onFocusChange } = props;

        this.#isDisabled = box.from(isDisabled);
        this.#onFocus = onFocus;
        this.#onBlur = onBlur;
        this.#onFocusChange = onFocusChange;
        this.#focusState = {
            isFocused: false
        };

        this.action = createAction(this.handlers());
    }

    get isDisabled() {
        return this.#isDisabled.current;
    }

    get focusState() {
        if (typeof this.#focusState === 'undefined') {
            throw Error(
                'Use the handlers method before accessing the focus state.'
            );
        }

        return this.#focusState;
    }

    handlers() {
        const onBlur = (e: FocusEvent) => {
            if (e.target === e.currentTarget) {
                if (this.#onBlur) {
                    this.#onBlur(e as TypedEvent<FocusEvent, T>);
                }

                if (this.#onFocusChange) {
                    this.#onFocusChange(false);
                }

                return true;
            }
        };

        const onSFocus = new BlurEvent(onBlur);

        this.#focusState = onSFocus.focusState;

        const onFocus = (e: FocusEvent) => {
            const ownerDocument = getOwnerDocument(e.target as Element);

            if (
                e.target === e.currentTarget &&
                ownerDocument.activeElement === e.target
            ) {
                if (this.#onFocus) {
                    this.#onFocus(e as TypedEvent<FocusEvent, T>);
                }

                if (this.#onFocusChange) {
                    this.#onFocusChange(true);
                }

                onSFocus.handler(e);
            }
        };

        return {
            focus: withDisabledCheck(onFocus, this.#isDisabled),
            blur: withDisabledCheck(onBlur, this.#isDisabled)
        };
    }
}
