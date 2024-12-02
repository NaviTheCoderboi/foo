<script module lang="ts">
    import { stylesCtx } from '../ctx';
    import type { HTMLAttributes } from 'svelte/elements';
    import type { PopoverVariantProps as TooltipVariantProps } from '../styles';

    export type TooltipContentProps = Omit<
        TooltipPrimitive.ContentProps,
        'class'
    > &
        TooltipVariantProps & {
            portalProps?: TooltipPrimitive.PortalProps;
            wrapperProps?: HTMLAttributes<HTMLDivElement>;

            customWrapper?: Snippet<
                [string | undefined, HTMLAttributes<HTMLDivElement>]
            >;

            class?: SlotsToClasses<['wrapper']>;
        };
</script>

<script lang="ts">
    import { Tooltip as TooltipPrimitive } from 'bits-ui';
    import { parseClasses, type SlotsToClasses } from '@utils/common';
    import type { Snippet } from 'svelte';
    import { scale } from 'svelte/transition';

    let {
        class: className,
        children,
        ref = $bindable(null),
        backdrop,
        color,
        disableAnimation,
        isTriggerDisabled,
        radius,
        shadow,
        size,
        triggerScaleOnOpen,
        // props
        portalProps = {},
        wrapperProps = {},
        customWrapper,
        ...restProps
    }: TooltipContentProps = $props();

    const styles = $derived.by(stylesCtx.get());
    const classes = $derived(parseClasses(className));
</script>

<TooltipPrimitive.Portal {...portalProps}>
    <TooltipPrimitive.Content
        class={styles?.base({
            backdrop,
            color,
            disableAnimation,
            isTriggerDisabled,
            radius,
            shadow,
            size,
            triggerScaleOnOpen,
            className: classes.root
        })}
        {...restProps}
    >
        {#if !customWrapper}
            <div
                class={styles?.content({
                    backdrop,
                    color,
                    disableAnimation,
                    isTriggerDisabled,
                    radius,
                    shadow,
                    size,
                    triggerScaleOnOpen
                })}
                in:scale|global={{
                    duration: 200,
                    start: 0.5
                }}
                out:scale|global={{
                    duration: 200,
                    start: 0.6
                }}
            >
                {#if styles?.showArrow}
                    <TooltipPrimitive.Arrow
                        class={styles.arrow({
                            backdrop,
                            color,
                            disableAnimation,
                            isTriggerDisabled,
                            radius,
                            shadow,
                            size,
                            triggerScaleOnOpen
                        })}
                    />
                {/if}
                {@render children?.()}
            </div>
        {:else}
            {@render customWrapper?.(
                styles?.content({
                    backdrop,
                    color,
                    disableAnimation,
                    isTriggerDisabled,
                    radius,
                    shadow,
                    size,
                    triggerScaleOnOpen
                }),
                wrapperProps
            )}
        {/if}
    </TooltipPrimitive.Content>
</TooltipPrimitive.Portal>
