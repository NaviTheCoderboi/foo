<script module lang="ts">
    import type { WithChildren, WithElementRef } from 'bits-ui';
    import type { HTMLAttributes } from 'svelte/elements';
    import {
        checkboxGroup,
        type CheckboxGroupVariantProps,
        type CheckboxVariantProps
    } from '../styles';
    import { checkboxGroupCtx, stylesCtx } from '../ctx';
    import { CheckboxGroupState } from '../group.svelte';
    import { box } from 'svelte-toolbelt';
    import type { Snippet } from 'svelte';

    export type CheckboxGroupProps = WithChildren<
        WithElementRef<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
    > & {
        /** The default checked items */
        defaultChecked?: string[];
        /** The checked items */
        checked?: Set<string>;
        /** Called when checked items change */
        onCheckedChange?: (checked: Set<string>) => void;
        /** Whether the checked is controlled or uncontrolled */
        isControlled?: boolean;
        /** The orientation of the checkbox group */
        orientation?: 'horizontal' | 'vertical';
        // slots
        labelSlot?: Snippet<[string]>;
        errorMessageSlot?: Snippet<[string]>;
        descriptionSlot?: Snippet<[string]>;
    } & CheckboxGroupVariantProps &
        CheckboxVariantProps;
</script>

<script lang="ts">
    let {
        class: className,
        ref = $bindable(null),
        children,
        checked = $bindable(new Set<string>()),
        defaultChecked,
        onCheckedChange,
        isControlled,
        // slots
        labelSlot,
        errorMessageSlot,
        descriptionSlot,
        // variants
        color,
        size,
        disabled,
        lineThrough,
        radius,
        isInvalid,
        disableAnimation,
        required,
        orientation,
        ...restProps
    }: CheckboxGroupProps = $props();

    const item = $derived({
        color,
        size,
        disabled,
        lineThrough,
        radius,
        isInvalid,
        disableAnimation,
        required
    });

    stylesCtx.set(() => item);

    const checkboxGroupState = new CheckboxGroupState({
        isDisabled: box.with(() => disabled ?? false),
        checked: box.with(
            () => checked,
            (v) => {
                if (isControlled) {
                    onCheckedChange?.(v);
                } else {
                    checked = v;
                    onCheckedChange?.(v);
                }
            }
        ),
        defaultChecked: box.with(() => defaultChecked ?? [])
    });

    checkboxGroupCtx.set(checkboxGroupState);

    const styles = $derived(
        checkboxGroup({
            disableAnimation,
            isInvalid,
            required,
            className
        })
    );
</script>

<div
    role="group"
    aria-disabled={disabled}
    class={styles.base({
        className
    })}
    {...restProps}
>
    {@render labelSlot?.(styles.label())}
    <div class={styles.wrapper()} data-orientation={orientation}>
        {@render children?.()}
    </div>
    {#if isInvalid && errorMessageSlot}
        {@render errorMessageSlot?.(styles.errorMessage())}
    {:else if descriptionSlot}
        {@render descriptionSlot?.(styles.description())}
    {/if}
</div>
