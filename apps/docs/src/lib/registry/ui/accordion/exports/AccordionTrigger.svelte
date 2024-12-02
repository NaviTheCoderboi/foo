<script module lang="ts">
    import type { AccordionTriggerProps as _AccordionTriggerProps } from 'bits-ui';
    import type { AccordionItemVariantProps } from '../styles';

    export type AccordionTriggerProps = Omit<_AccordionTriggerProps, 'class'> &
        AccordionItemVariantProps & {
            startContent?: Snippet<[string | undefined]>;
            // title_ causes a conflict with the title prop
            title_?: string | Snippet<[string | undefined]>;
            subtitle?: string | Snippet<[string | undefined]>;
            indicator?: Snippet<[string | undefined]>;

            class?: SlotsToClasses<
                ['indicator', 'title', 'subtitle', 'titleWrapper']
            >;
        };
</script>

<script lang="ts">
    import { Accordion as AccordionPrimitive } from 'bits-ui';
    import { stylesCtx } from '../ctx';
    import Carret from 'lucide-svelte/icons/chevron-left';
    import type { Snippet } from 'svelte';
    import { parseClasses, type SlotsToClasses } from '@utils/common';

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
        indicator,
        ...restProps
    }: AccordionTriggerProps = $props();

    const styles = $derived.by(stylesCtx.get());

    const classes = $derived(parseClasses(className));
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
        className: classes.root
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
    {#if title_ || subtitle}
        <div
            class={styles?.titleWrapper({
                disabled,
                hideIndicator,
                disableIndicatorAnimation,
                variant,
                isCompact,
                disableAnimation,
                className: classes.titleWrapper
            })}
        >
            {#if title_}
                {#if typeof title_ === 'string'}
                    <h3
                        class={styles?.title({
                            disabled,
                            hideIndicator,
                            disableIndicatorAnimation,
                            variant,
                            isCompact,
                            disableAnimation,
                            className: classes.title
                        })}
                    >
                        {title_}
                    </h3>
                {:else}
                    {@render title_(
                        styles?.title({
                            disabled,
                            hideIndicator,
                            disableIndicatorAnimation,
                            variant,
                            isCompact,
                            disableAnimation,
                            className: classes.title
                        })
                    )}
                {/if}
            {/if}
            {#if subtitle}
                {#if typeof subtitle === 'string'}
                    <span
                        class={styles?.subtitle({
                            disabled,
                            hideIndicator,
                            disableIndicatorAnimation,
                            variant,
                            isCompact,
                            disableAnimation,
                            className: classes.subtitle
                        })}
                    >
                        {subtitle}
                    </span>
                {:else}
                    {@render subtitle(
                        styles?.subtitle({
                            disabled,
                            hideIndicator,
                            disableIndicatorAnimation,
                            variant,
                            isCompact,
                            disableAnimation,
                            className: classes.subtitle
                        })
                    )}
                {/if}
            {/if}
        </div>
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
                disableAnimation,
                className: classes.indicator
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
                disableAnimation,
                className: classes.indicator
            })}
        >
            <Carret />
        </span>
    {/if}
</AccordionPrimitive.Trigger>
