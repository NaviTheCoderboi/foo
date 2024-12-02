<script module lang="ts">
    import { stylesCtx } from '../ctx';
    import {
        popover as tooltip,
        type PopoverVariantProps as TooltipVariantProps
    } from '../styles';

    export type TooltipRootProps = TooltipPrimitive.RootProps &
        TooltipVariantProps & {
            showArrow?: boolean;
        };
</script>

<script lang="ts">
    import { Tooltip as TooltipPrimitive } from 'bits-ui';

    let {
        open = $bindable(false),
        children,
        // variants
        backdrop,
        color,
        disableAnimation,
        isTriggerDisabled,
        radius,
        shadow,
        size,
        triggerScaleOnOpen,
        showArrow,
        ...restProps
    }: TooltipRootProps = $props();

    let styles = $derived(
        tooltip({
            backdrop,
            color,
            disableAnimation,
            isTriggerDisabled,
            radius,
            shadow,
            size,
            triggerScaleOnOpen
        })
    );

    stylesCtx.set(() => ({
        showArrow: showArrow ?? false,
        ...styles
    }));
</script>

<TooltipPrimitive.Root bind:open {...restProps}>
    {@render children?.()}
</TooltipPrimitive.Root>
