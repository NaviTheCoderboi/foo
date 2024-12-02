import type { ReadableBox, WritableBox } from 'svelte-toolbelt';

interface CheckboxGroupStateProps {
    /** Whether the group is disabled */
    isDisabled: ReadableBox<boolean>;
    /** The default checked items */
    defaultChecked: ReadableBox<string[]>;
    /** The checked items */
    checked: WritableBox<Set<string>>;
}

export class CheckboxGroupState {
    #defaultChecked: ReadableBox<string[]>;
    #checked: WritableBox<Set<string>>;
    #isDisabled: ReadableBox<boolean>;

    constructor(props: CheckboxGroupStateProps) {
        const { checked, defaultChecked, isDisabled } = props;

        this.#checked = checked;
        this.#defaultChecked = defaultChecked;
        this.#isDisabled = isDisabled;

        this.#checked.current = new Set([
            ...this.#checked.current,
            ...this.#defaultChecked.current
        ]);
    }

    update(item: string, checked: boolean) {
        if (this.#isDisabled.current) {
            return;
        }

        if (checked === true) {
            this.#checked.current = new Set(this.#checked.current.add(item));
        } else {
            this.#checked.current = new Set(
                [...this.#checked.current].filter((i) => i !== item)
            );
        }
    }

    isChecked(item?: string) {
        if (item === undefined) return false;

        return this.#checked.current.has(item);
    }

    toggle(item: string) {
        if (this.#isDisabled.current) {
            return;
        }

        this.update(item, !this.isChecked(item));
    }

    get disabled() {
        return this.#isDisabled.current;
    }

    get checked() {
        return this.#checked.current;
    }
}
