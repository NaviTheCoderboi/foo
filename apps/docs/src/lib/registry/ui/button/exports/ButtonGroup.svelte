<script module lang="ts">
    export type ButtonGroupProps = WithElementRef<
        HTMLAttributes<HTMLDivElement>
    > & {
        groupFullWidth?: boolean;
    } & ButtonVariantProps;
</script>

<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';
    import type { WithElementRef } from 'bits-ui';
    import { buttonGroup, type ButtonVariantProps } from '../styles';
    import { groupCtx } from '../ctx';

    let {
        class: className,
        ref = $bindable(null),
        children,
        // variants
        groupFullWidth,
        // button children variants
        color,
        disableAnimation,
        fullWidth,
        disabled,
        isIconOnly,
        isInGroup,
        radius,
        size,
        variant,
        ...restProps
    }: ButtonGroupProps = $props();

    const item = $derived({
        color,
        disableAnimation,
        fullWidth,
        disabled,
        isIconOnly,
        isInGroup: true,
        radius,
        size,
        variant
    });

    groupCtx.set(() => item);
</script>

<div
    role="group"
    class={buttonGroup({
        fullWidth: groupFullWidth,
        className
    })}
    aria-disabled={disabled}
    {...restProps}
>
    {@render children?.()}
</div>
