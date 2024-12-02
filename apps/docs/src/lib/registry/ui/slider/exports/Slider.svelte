<script module lang="ts">
    export type SliderProps = Omit<
        WithoutChildren<SliderPrimitive.RootProps>,
        'class'
    > &
        Omit<SliderVariantProps, 'hasSingleThumb' | 'isVertical'> & {
            label?: string | Snippet<[string]>;
            output?: Snippet<[string, number[] | undefined]>;
            startContent?: Snippet<[string]>;
            endContent?: Snippet<[string]>;
            showTooltip?: boolean;
            tooltipProps?: Tooltip.TooltipRootProps;
            fillOffset?: number;

            class?: SlotsToClasses<
                ['labelWrapper', 'label', 'output', 'trackWrapper']
            >;
        };
</script>

<script lang="ts">
    import { Slider as SliderPrimitive, type WithoutChildren } from 'bits-ui';
    import { slider, type SliderVariantProps } from '../styles';
    import {
        formatStyles,
        parseClasses,
        type SlotsToClasses
    } from '@utils/common';
    import * as Tooltip from '@components/ui/tooltip';
    import type { Snippet } from 'svelte';
    import Thumb from './Thumb.svelte';
    import Step from './Step.svelte';

    let {
        class: className,
        value = $bindable(),
        ref = $bindable(null),
        label,
        tooltipProps,
        showTooltip,
        output,
        startContent,
        endContent,
        // variants
        color,
        disableAnimation,
        disableThumbScale,
        hasMarks,
        hideThumb,
        hideValue,
        disabled,
        radius,
        showOutline,
        size,
        orientation,
        fillOffset,
        ...restProps
    }: SliderProps = $props();

    const styles = $derived(
        slider({
            color,
            disableAnimation,
            disableThumbScale,
            hasMarks,
            hasSingleThumb:
                fillOffset === undefined ? value?.length === 1 : false,
            hideThumb,
            hideValue,
            disabled,
            isVertical: orientation === 'vertical',
            radius,
            showOutline,
            size
        })
    );
    const classes = $derived(parseClasses(className));

    const valuePercent = (value: number, min: number, max: number) =>
        (value - min) / (max - min);

    const getOffsets = () => {
        let min = restProps.min ?? 0;
        let max = restProps.max ?? 100;

        return [
            // @ts-ignore
            value?.length > 1
                ? // @ts-ignore
                  valuePercent(value[0], min, max)
                : fillOffset !== undefined
                  ? valuePercent(fillOffset, min, max)
                  : 0,
            // @ts-ignore
            valuePercent(value[value?.length - 1], min, max)
        ].sort() as [number, number];
    };

    const [startOffset, endOffset] = $derived.by(getOffsets);
</script>

<div
    bind:this={ref}
    class={styles.base({
        className: classes.root
    })}
    role="group"
    aria-disabled={disabled}
>
    <div
        class={styles.labelWrapper({
            className: classes.labelWrapper
        })}
    >
        {#if typeof label === 'string'}
            <span
                class={styles.label({
                    className: classes.label
                })}
            >
                {label}
            </span>
        {:else}
            {@render label?.(
                styles.label({
                    className: classes.label
                })
            )}
        {/if}
        {#if output}
            {@render output?.(
                styles.value({
                    className: classes.output
                }),
                value
            )}
        {:else}
            <output
                class={styles.value({
                    className: classes.output
                })}
                aria-live="off"
            >
                {value}
            </output>
        {/if}
    </div>
    <SliderPrimitive.Root
        bind:value
        class={styles.trackWrapper({
            className: classes.trackWrapper
        })}
        {...restProps}
        {disabled}
        {orientation}
    >
        {#snippet children({ thumbs, ticks })}
            {@render startContent?.(styles.startContent())}
            <div class={styles.track()}>
                <!-- +++ -->

                <SliderPrimitive.Range>
                    {#snippet child({ props })}
                        {@const { style, ...rest } = props}
                        <span
                            class={styles.filler()}
                            {...rest}
                            style={formatStyles({
                                [orientation === 'vertical'
                                    ? 'bottom'
                                    : 'left']: startOffset * 100 + '%',
                                ...(orientation === 'vertical'
                                    ? {
                                          height: `${(endOffset - startOffset) * 100}%`
                                      }
                                    : {
                                          width: `${(endOffset - startOffset) * 100}%`
                                      })
                            })}
                        ></span>
                    {/snippet}
                </SliderPrimitive.Range>

                <!-- +++ -->
                {#each thumbs as index}
                    <Thumb
                        {color}
                        {index}
                        {showTooltip}
                        {tooltipProps}
                        thumb={styles.thumb}
                        {value}
                    />
                {/each}
                {#each ticks as index}
                    <Step
                        {value}
                        min={restProps.min}
                        max={restProps.max}
                        step={restProps.step}
                        {index}
                        styles={styles.step()}
                        {startOffset}
                        {endOffset}
                    />
                {/each}
            </div>
            {@render endContent?.(styles.endContent())}
        {/snippet}
    </SliderPrimitive.Root>
</div>
