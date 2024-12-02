<script lang="ts">
    import { clamp } from '../../../utils/common';
    import type { RippleState, RippleType } from '../ripple.svelte';

    const {
        ripples = $bindable(),
        removeRipple
    }: {
        ripples: RippleType[];
        removeRipple: RippleState['removeRipple'];
    } = $props();
</script>

{#each ripples as ripple (ripple.id)}
    {@const duration = clamp(
        0.01 * ripple.size,
        0.2,
        ripple.size > 100 ? 0.75 : 0.5
    )}
    <span
        class="absolute bg-current rounded-full pointer-events-none origin-center z-0 inset-0"
        style="top: {ripple.y}px; left: {ripple.x}px; width: {ripple.size}px; height: {ripple.size}px; animation: ripple {duration}s linear;"
        onanimationend={() => {
            removeRipple(ripple.id);
        }}
    >
    </span>
{/each}

<style>
    @keyframes ripple {
        0% {
            transform: scale(0);
            opacity: 0.35;
        }
        100% {
            transform: scale(2);
            opacity: 0;
        }
    }
</style>
