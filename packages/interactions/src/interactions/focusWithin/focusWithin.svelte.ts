import { box, type ReadableBox, type WritableBox } from 'svelte-toolbelt';
import type { FocusableElement } from '../../types/dom';
import type { TypedEvent } from '../../types/events';
import type { ReadableProp } from '../../types/utils';
import { BlurEvent } from '../focus/blurEvent.svelte';
import { withDisabledCheck } from '../../utils/common';
import type { Action } from 'svelte/action';
import { createAction } from '../../utils/action';

export interface FocusWithinProps<
    T extends FocusableElement = FocusableElement
> {
    /** Whether the focus within events should be disabled. */
    isDisabled?: ReadableProp<boolean>;
    /** Handler that is called when the target element or a descendant receives focus. */
    onFocusWithin?: (e: TypedEvent<FocusEvent, T>) => void;
    /** Handler that is called when the target element and all descendants lose focus. */
    onBlurWithin?: (e: TypedEvent<FocusEvent, T>) => void;
    /** Handler that is called when the the focus within state changes. */
    onFocusWithinChange?: (isFocusWithin: boolean) => void;
}

/**
 * Handles focus events for the target and its descendants.
 */
export class FocusWithin<T extends FocusableElement = FocusableElement> {
    #isDisabled: ReadableBox<boolean>;
    #onBlurWithin: FocusWithinProps<T>['onBlurWithin'];
    #onFocusWithin: FocusWithinProps<T>['onFocusWithin'];
    #onFocusWithinChange: FocusWithinProps<T>['onFocusWithinChange'];
    #isFocusWithin: WritableBox<boolean>;
    action: Action<T>;

    constructor(props: FocusWithinProps<T>) {
        const {
            isDisabled = false,
            onBlurWithin,
            onFocusWithin,
            onFocusWithinChange
        } = props;

        this.#isDisabled = box.from(isDisabled);
        this.#onBlurWithin = onBlurWithin;
        this.#onFocusWithin = onFocusWithin;
        this.#onFocusWithinChange = onFocusWithinChange;
        this.#isFocusWithin = box(false);

        this.action = createAction(this.handlers());
    }

    get isDisabled() {
        return this.#isDisabled.current;
    }

    get isFocusWithin() {
        return this.#isFocusWithin.current;
    }

    handlers() {
        const onBlur = (e: FocusEvent) => {
            if (
                this.#isFocusWithin.current &&
                !(e.currentTarget as Element).contains(
                    e.relatedTarget as Element
                )
            ) {
                this.#isFocusWithin.current = false;

                if (this.#onBlurWithin) {
                    this.#onBlurWithin(e as TypedEvent<FocusEvent, T>);
                }

                if (this.#onFocusWithinChange) {
                    this.#onFocusWithinChange(false);
                }
            }
        };

        const onSFocus = new BlurEvent(onBlur);

        const onFocus = (e: FocusEvent) => {
            if (
                !this.#isFocusWithin.current &&
                document.activeElement === e.target
            ) {
                if (this.#onFocusWithin) {
                    this.#onFocusWithin(e as TypedEvent<FocusEvent, T>);
                }

                if (this.#onFocusWithinChange) {
                    this.#onFocusWithinChange(true);
                }

                this.#isFocusWithin.current = true;
                onSFocus.handler(e);
            }
        };

        return {
            focusin: withDisabledCheck(onFocus, this.#isDisabled),
            focusout: withDisabledCheck(onBlur, this.#isDisabled)
        };
    }
}
