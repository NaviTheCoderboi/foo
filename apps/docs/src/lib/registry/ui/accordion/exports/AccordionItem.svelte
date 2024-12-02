<script module lang="ts">
    import type { AccordionItemProps as _AccordionItemProps } from 'bits-ui';
    import type { AccordionItemVariantProps } from '../styles';

    export type AccordionItemProps = _AccordionItemProps &
        AccordionItemVariantProps;
</script>

<script lang="ts">
    import { Accordion as AccordionPrimitive } from 'bits-ui';
    import { stylesCtx } from '../ctx';

    let {
        class: className,
        ref = $bindable(null),
        // variants
        disabled,
        hideIndicator,
        disableIndicatorAnimation,
        variant,
        isCompact,
        disableAnimation,
        ...restProps
    }: AccordionItemProps = $props();

    const ctx = $derived.by(stylesCtx.get());
</script>

<AccordionPrimitive.Item
    bind:ref
    {disabled}
    class={ctx?.base({
        variant,
        isCompact,
        disabled,
        hideIndicator,
        disableIndicatorAnimation,
        disableAnimation,
        className
    })}
    {...restProps}
/>
