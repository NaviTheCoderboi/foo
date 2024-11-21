<script module lang="ts">
    import type { WithChildren, WithElementRef } from 'bits-ui';
    import type { HTMLAttributes } from 'svelte/elements';
    import type {
        CheckboxGroupVariantProps,
        CheckboxVariantProps
    } from '../styles';

    export type CheckboxGroupProps = WithChildren<
        WithElementRef<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
    > & {
        // TODO
    } & CheckboxGroupVariantProps &
        CheckboxVariantProps;
</script>
