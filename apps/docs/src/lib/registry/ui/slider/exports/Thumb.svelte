<script lang="ts">
    import { Slider as SliderPrimitive } from 'bits-ui';
    import * as Tooltip from '@components/ui/tooltip';
    import type { slider } from '../styles';
    import { onMount } from 'svelte';

    let {
        showTooltip,
        tooltipProps,
        color,
        thumb,
        value,
        index
    }: {
        showTooltip?: boolean;
        tooltipProps?: Tooltip.TooltipRootProps;
        color?:
            | 'foreground'
            | 'primary'
            | 'secondary'
            | 'success'
            | 'warning'
            | 'danger';
        thumb: ReturnType<typeof slider>['thumb'];
        value?: number[];
        index: number;
    } = $props();

    let isDown = $state(false);
    let isHovered = $state(false);

    const getThumbEvents = () => {
        let thumbEvents = {};

        if (typeof PointerEvent !== 'undefined') {
            thumbEvents = {
                onpointerdown: () => {
                    isDown = true;
                },
                onpointerenter: () => {
                    isHovered = true;
                },
                onpointerleave: () => {
                    isHovered = false;
                }
            };
        } else {
            thumbEvents = {
                onmousedown: () => {
                    isDown = true;
                },
                ontouchstart: () => {
                    isDown = true;
                    isHovered = true;
                },
                onmouseenter: () => {
                    isHovered = true;
                },
                onmouseleave: () => {
                    isHovered = false;
                },
                ontouchend: () => {
                    isDown = false;
                }
            };
        }

        return thumbEvents;
    };

    onMount(() => {
        document.addEventListener('pointerup', () => {
            isDown = false;
        });

        document.addEventListener('mouseup', () => {
            isDown = false;
        });

        document.addEventListener('touchend', () => {
            isDown = false;
        });
    });

    let show = $derived(isDown || isHovered);
</script>

{#if showTooltip}
    <Tooltip.Provider>
        <Tooltip.Root
            open={show}
            {color}
            delayDuration={100}
            showArrow
            controlledOpen
            {...tooltipProps}
        >
            <Tooltip.Trigger>
                {#snippet child({ props })}
                    <SliderPrimitive.Thumb
                        {...props}
                        class={thumb({
                            className: (props.class as string) ?? ''
                        })}
                        {index}
                        {...getThumbEvents()}
                    />
                {/snippet}
            </Tooltip.Trigger>
            <Tooltip.Content>
                {value?.[index]}
            </Tooltip.Content>
        </Tooltip.Root>
    </Tooltip.Provider>
{:else}
    <SliderPrimitive.Thumb {index} class={thumb()} role="div" />
{/if}
