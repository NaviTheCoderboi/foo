<script module lang="ts">
    import type { WithChildren, WithElementRef } from 'bits-ui';
    import { avatarGroupCtx } from '../ctx';
    import {
        avatarGroup,
        type AvatarGroupVariantProps,
        type AvatarVariantProps
    } from '../styles';
    import type { HTMLAttributes } from 'svelte/elements';

    export type AvatarGroupProps = AvatarGroupVariantProps &
        AvatarVariantProps &
        WithElementRef<
            WithChildren<HTMLAttributes<HTMLDivElement>>,
            HTMLDivElement
        >;
</script>

<script lang="ts">
    let {
        class: className,
        ref = $bindable(null),
        children,
        // variants
        isGrid,
        color,
        disableAnimation,
        isBordered,
        disabled,
        isInGridGroup,
        isInGroup,
        radius,
        size,
        ...restProps
    }: AvatarGroupProps = $props();

    const item = $derived({
        color,
        disableAnimation,
        isBordered,
        disabled,
        isInGridGroup: isGrid,
        isInGroup: true,
        radius,
        size
    });

    avatarGroupCtx.set(() => item);
</script>

<div
    bind:this={ref}
    role="group"
    class={avatarGroup({
        isGrid,
        className
    })}
    {...restProps}
>
    {@render children?.()}
</div>
