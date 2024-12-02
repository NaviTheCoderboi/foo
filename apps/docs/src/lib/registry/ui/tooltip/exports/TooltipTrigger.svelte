<script module lang="ts">
    import { stylesCtx } from '../ctx';
    import type { PopoverVariantProps as TooltipVariantProps } from '../styles';

    export type TooltipTriggerProps = TooltipPrimitive.TriggerProps &
        TooltipVariantProps & {
            class?: string;
        };
</script>

<script lang="ts">
    import { Tooltip as TooltipPrimitive } from 'bits-ui';

    let {
        class: className,
        backdrop,
        color,
        disableAnimation,
        isTriggerDisabled,
        radius,
        shadow,
        size,
        triggerScaleOnOpen,
        ...restProps
    }: TooltipTriggerProps = $props();

    const styles = $derived.by(stylesCtx.get());
</script>

<TooltipPrimitive.Trigger
    class={styles?.trigger({
        backdrop,
        color,
        disableAnimation,
        isTriggerDisabled,
        radius,
        shadow,
        size,
        triggerScaleOnOpen,
        className
    })}
    {...restProps}
/>
