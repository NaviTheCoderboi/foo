<script module lang="ts">
    import type { AccordionHeaderProps as _AccordionHeaderProps } from 'bits-ui';

    export type AccordionHeaderProps = _AccordionHeaderProps &
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
    }: AccordionHeaderProps = $props();

    const styles = stylesCtx.get()();
</script>

<AccordionPrimitive.Header
    bind:ref
    class={styles?.heading({
        disabled,
        hideIndicator,
        disableIndicatorAnimation,
        variant,
        isCompact,
        disableAnimation
    })}
    {...restProps}
>
    {@render children?.()}
</AccordionPrimitive.Header>
