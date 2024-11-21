<script module lang="ts">
    import type { AccordionContentProps as _AccordionContentProps } from 'bits-ui';

    export type AccordionContentProps = _AccordionContentProps &
        AccordionItemVariantProps;
</script>

<script lang="ts">
    import { Accordion as AccordionPrimitive } from 'bits-ui';
    import { stylesCtx } from '../ctx';
    import type { AccordionItemVariantProps } from '../styles';

    let {
        class: className,
        ref = $bindable(null),
        children,
        // variants
        disabled,
        hideIndicator,
        disableIndicatorAnimation,
        variant,
        isCompact,
        disableAnimation,
        ...restProps
    }: AccordionContentProps = $props();

    const styles = $derived.by(stylesCtx.get());
</script>

<AccordionPrimitive.Content
    bind:ref
    class={styles?.content({
        disabled,
        hideIndicator,
        disableIndicatorAnimation,
        variant,
        isCompact,
        disableAnimation,
        className
    })}
    {...restProps}
>
    {@render children?.()}
</AccordionPrimitive.Content>
