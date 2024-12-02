<script lang="ts">
    import { Slider as SliderPrimitive } from 'bits-ui';
    import type { slider } from '../styles';

    let {
        index,
        styles,
        min = 0,
        max = 100,
        step = 1,
        value,
        startOffset,
        endOffset
    }: {
        index: number;
        styles: string;
        min?: number;
        max?: number;
        step?: number;
        value?: number[];
        startOffset: number;
        endOffset: number;
    } = $props();

    const _value = index * step + min;
    const valuePercent = (_value - min) / (max - min);

    const isInRange = $derived(
        valuePercent <= endOffset && valuePercent >= startOffset
    );
</script>

<SliderPrimitive.Tick
    data-in-range={isInRange}
    {index}
    class={styles}
    data-is-first={index === 0}
    data-is-last={index === 100}
/>
