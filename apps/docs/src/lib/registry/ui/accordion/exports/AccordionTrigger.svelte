<script module lang="ts">
    import type { AccordionTriggerProps as _AccordionTriggerProps } from 'bits-ui';
    import type { AccordionItemVariantProps } from '../styles';

    export type AccordionTriggerProps = _AccordionTriggerProps &
        AccordionItemVariantProps & {
            startContent?: Snippet<[string | undefined]>;
            // title_ causes a conflict with the title prop
            title_?: Snippet<[string | undefined]>;
            subtitle?: Snippet<[string | undefined]>;
            titleWrapper?: Snippet<
                [string | undefined, string | undefined, string | undefined]
            >;
            indicator?: Snippet<[string | undefined]>;
        };
</script>

<script lang="ts">
    import { Accordion as AccordionPrimitive } from 'bits-ui';
    import { stylesCtx } from '../ctx';
    import Carret from 'lucide-svelte/icons/chevron-left';
    import type { Snippet } from 'svelte';

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
        // slots
        startContent,
        title_,
        subtitle,
        titleWrapper,
        indicator,
        ...restProps
    }: AccordionTriggerProps = $props();

    const styles = $derived.by(stylesCtx.get());
</script>

<AccordionPrimitive.Trigger
    {disabled}
    bind:ref
    class={styles?.trigger({
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
    {#if startContent}
        {@render startContent(
            styles?.startContent({
                disabled,
                hideIndicator,
                disableIndicatorAnimation,
                variant,
                isCompact,
                disableAnimation
            })
        )}
    {/if}
    {#if (title_ || subtitle) && !titleWrapper}
        <div
            class={styles?.titleWrapper({
                disabled,
                hideIndicator,
                disableIndicatorAnimation,
                variant,
                isCompact,
                disableAnimation
            })}
        >
            {#if title_}
                {@render title_(
                    styles?.title({
                        disabled,
                        hideIndicator,
                        disableIndicatorAnimation,
                        variant,
                        isCompact,
                        disableAnimation
                    })
                )}
            {/if}
            {#if subtitle}
                {@render subtitle(
                    styles?.subtitle({
                        disabled,
                        hideIndicator,
                        disableIndicatorAnimation,
                        variant,
                        isCompact,
                        disableAnimation
                    })
                )}
            {/if}
        </div>
    {:else if titleWrapper}
        {@render titleWrapper(
            styles?.titleWrapper({
                disabled,
                hideIndicator,
                disableIndicatorAnimation,
                variant,
                isCompact,
                disableAnimation
            }),
            styles?.title({
                disabled,
                hideIndicator,
                disableIndicatorAnimation,
                variant,
                isCompact,
                disableAnimation
            }),
            styles?.subtitle({
                disabled,
                hideIndicator,
                disableIndicatorAnimation,
                variant,
                isCompact,
                disableAnimation
            })
        )}
    {/if}
    {@render children?.()}

    {#if indicator}
        {@render indicator(
            styles?.indicator({
                disabled,
                hideIndicator,
                disableIndicatorAnimation,
                variant,
                isCompact,
                disableAnimation
            })
        )}
    {:else}
        <span
            class={styles?.indicator({
                disabled,
                hideIndicator,
                disableIndicatorAnimation,
                variant,
                isCompact,
                disableAnimation
            })}
        >
            <Carret />
        </span>
    {/if}
</AccordionPrimitive.Trigger>
