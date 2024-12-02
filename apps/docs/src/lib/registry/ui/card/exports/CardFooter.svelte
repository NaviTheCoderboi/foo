<script module lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';
    import type { WithChildren, WithElementRef } from 'bits-ui';
    import type { CardVariantProps } from '../styles';
    import { stylesCtx } from '../ctx';

    export type CardFooterProps = CardVariantProps &
        WithChildren<
            WithElementRef<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
        >;
</script>

<script lang="ts">
    let {
        class: className,
        ref = $bindable(null),
        children,
        // variants
        isPressable,
        radius,
        shadow,
        fullWidth,
        isHoverable,
        disabled,
        isFooterBlurred,
        isBlurred,
        disableAnimation,
        ...restProps
    }: CardFooterProps = $props();

    const styles = $derived.by(stylesCtx.get());
</script>

<div
    bind:this={ref}
    class={styles?.body({
        isPressable,
        radius,
        shadow,
        fullWidth,
        isHoverable,
        disabled,
        isFooterBlurred,
        isBlurred,
        disableAnimation,
        className
    })}
    {...restProps}
>
    {@render children?.()}
</div>
