import type { ReadableBox, WritableBox } from 'svelte-toolbelt';

interface CheckboxGroupStateProps {
    /** Whether the group is disabled */
    isDisabled: ReadableBox<boolean>;
    /** Whether the group is read-only */
    isReadOnly: ReadableBox<boolean>;
    /** The default checked items */
    defaultChecked: ReadableBox<string[]>;
    /** The checked items */
    checked: WritableBox<string[]>;
}

export class CheckboxGroupState {
    #defaultChecked: ReadableBox<string[]>;
    #checked: WritableBox<string[]>;
    #isDisabled: ReadableBox<boolean>;
    #isReadOnly: ReadableBox<boolean>;

    constructor(props: CheckboxGroupStateProps) {
        const { checked, defaultChecked, isDisabled, isReadOnly } = props;

        this.#checked = checked;
        this.#defaultChecked = defaultChecked;
        this.#isDisabled = isDisabled;
        this.#isReadOnly = isReadOnly;

        this.#checked.current = this.#checked.current.concat(
            this.#defaultChecked.current
        );
    }

    update(item: string, checked: boolean) {
        if (this.#isReadOnly.current || this.#isDisabled.current) {
            return;
        }

        if (checked === true) {
            this.#checked.current = this.#checked.current.concat(item);
        } else {
            this.#checked.current = this.#checked.current.filter(
                (i) => i !== item
            );
        }
    }

    isChecked(item: string) {
        return this.#checked.current.includes(item);
    }

    toggle(item: string) {
        if (this.#isReadOnly.current || this.#isDisabled.current) {
            return;
        }

        this.update(item, !this.isChecked(item));
    }
}
