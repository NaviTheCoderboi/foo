<script module lang="ts">
    import type { SeparatorRootProps } from 'bits-ui';
    import { divider, type DividerVariantProps } from '../styles';

    export type DividerProps = SeparatorRootProps & DividerVariantProps;
</script>

<script lang="ts">
    import { Separator } from 'bits-ui';

    let {
        class: className,
        ref = $bindable(null),
        // variants
        orientation,
        ...restProps
    }: DividerProps = $props();
</script>

<Separator.Root
    bind:ref
    class={divider({
        orientation,
        className
    })}
    {...restProps}
/>
