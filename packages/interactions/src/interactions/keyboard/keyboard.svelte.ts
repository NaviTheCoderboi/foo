import { box, type ReadableBox } from 'svelte-toolbelt';
import type { FocusableElement } from '../../types/dom';
import type { KeyboardEvents } from '../../types/events';
import type { ReadableProp } from '../../types/utils';
import { withDisabledCheck } from '../../utils/common';
import { createEventHandler } from '../../utils/createEventHandler';
import type { Action } from 'svelte/action';
import { createAction } from '../../utils/action';

export interface KeyboardProps<T extends FocusableElement = FocusableElement>
    extends KeyboardEvents<T> {
    /** Whether the keyboard events should be disabled. */
    isDisabled?: ReadableProp<boolean>;
}

/**
 * Handles keyboard interactions for a focusable element.
 */
export class Keyboard<T extends FocusableElement = FocusableElement> {
    #onKeyUp: KeyboardEvents<T>['onKeyUp'];
    #onKeyDown: KeyboardEvents<T>['onKeyDown'];
    #isDisabled: ReadableBox<boolean>;
    action: Action<T>;

    constructor(props: KeyboardProps<T> = {}) {
        const { onKeyUp, onKeyDown, isDisabled = false } = props;

        this.#onKeyUp = onKeyUp;
        this.#onKeyDown = onKeyDown;
        this.#isDisabled = box.from(isDisabled);

        this.action = createAction(this.handlers());
    }

    get isDisabled() {
        return this.#isDisabled.current;
    }

    handlers() {
        const keydown = withDisabledCheck(
            createEventHandler<KeyboardEvent, T>(this.#onKeyDown),
            this.#isDisabled
        );

        const keyup = withDisabledCheck(
            createEventHandler<KeyboardEvent, T>(this.#onKeyUp),
            this.#isDisabled
        );

        return { keydown, keyup };
    }
}
