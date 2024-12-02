<script lang="ts">
    import { onMount } from 'svelte';
    import Slider from '@r/ui/slider/exports/Slider.svelte';

    onMount(() => {
        document.documentElement.dataset.theme = 'dark';
    });
</script>

<div
    class="h-screen flex flex-col justify-center items-center bg-background text-foreground gap-5"
>
    <Slider
        label="Temperature"
        class={{
            root: 'max-w-xs'
        }}
        color="foreground"
        size="lg"
        max={40}
        min={-40}
        step={8}
        value={[20]}
    >
        {#snippet output(cls, v)}
            {@const fmt = new Intl.NumberFormat('en-US', {
                style: 'unit',
                minimumFractionDigits: 1,
                unit: 'celsius'
            })}
            <output class={cls}>
                {fmt.format(v?.[0] ?? 0)}
            </output>
        {/snippet}
    </Slider>
</div>
