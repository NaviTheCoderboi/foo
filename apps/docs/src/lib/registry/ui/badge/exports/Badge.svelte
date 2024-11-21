<script module lang="ts">
    import type { WithChildren, WithElementRef } from 'bits-ui';
    import { badge, type BadgeVariantProps } from '../styles';
    import type { HTMLAttributes } from 'svelte/elements';
    import type { Snippet } from 'svelte';

    export type BadgeProps = BadgeVariantProps &
        WithElementRef<
            WithChildren<HTMLAttributes<HTMLDivElement>>,
            HTMLDivElement
        > & {
            badgeRef?: HTMLElement | null;
            as?: keyof HTMLElementTagNameMap;
            badgeClass?: string;
            badge?: Snippet;
            badgeProps?: HTMLAttributes<HTMLElement>;
        };
</script>

<script lang="ts">
    let {
        class: className,
        badgeClass,
        ref = $bindable(null),
        badgeRef = $bindable(null),
        children,
        as = 'span',
        badgeProps,
        // variants
        color,
        disableAnimation,
        isDot,
        isInvisible,
        isOneChar,
        placement,
        shape,
        showOutline,
        size,
        variant,
        // slots
        badge: badgeSlot,
        ...restProps
    }: BadgeProps = $props();

    const styles = $derived(
        badge({
            color,
            disableAnimation,
            isDot,
            isInvisible,
            isOneChar,
            placement,
            shape,
            showOutline,
            size,
            variant,
            className
        })
    );
</script>

<div
    bind:this={ref}
    class={styles.base({
        className
    })}
    {...restProps}
>
    {@render children?.()}
    <svelte:element
        this={as}
        class={styles.badge({
            className: badgeClass
        })}
        bind:this={badgeRef}
        data-invisible={isInvisible}
        {...badgeProps}
    >
        {@render badgeSlot?.()}
    </svelte:element>
</div>
