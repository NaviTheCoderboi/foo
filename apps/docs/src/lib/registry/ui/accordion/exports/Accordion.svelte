<script module lang="ts">
    import type { AccordionRootProps } from 'bits-ui';
    import {
        accordion,
        accordionItem,
        type AccordionItemVariantProps,
        type AccordionVariantProps
    } from '../styles';

    export type AccordionProps = AccordionRootProps &
        AccordionVariantProps &
        AccordionItemVariantProps;
</script>

<script lang="ts">
    import { Accordion as AccordionPrimitive } from 'bits-ui';
    import { stylesCtx } from '../ctx';

    let {
        class: className,
        ref = $bindable(null),
        children,
        // variants
        variant,
        fullWidth,
        // item variants
        disabled,
        hideIndicator,
        disableIndicatorAnimation,
        isCompact,
        disableAnimation,
        ...restProps
    }: AccordionProps = $props();

    const item = $derived(
        accordionItem({
            disabled,
            hideIndicator,
            disableIndicatorAnimation,
            variant,
            isCompact,
            disableAnimation
        })
    );

    stylesCtx.set(() => item);
</script>

<AccordionPrimitive.Root
    bind:ref
    class={accordion({
        variant,
        fullWidth,
        className
    })}
    role="group"
    {disabled}
    {...restProps}
>
    {@render children?.()}
</AccordionPrimitive.Root>
