<script module lang="ts">
    import type { WithChildren, WithElementRef } from 'bits-ui';
    import { badge, type BadgeVariantProps } from '../styles';
    import type { HTMLAttributes } from 'svelte/elements';
    import type { Snippet } from 'svelte';

    export type BadgeProps = BadgeVariantProps &
        WithElementRef<
            WithChildren<Omit<HTMLAttributes<HTMLDivElement>, 'class'>>,
            HTMLDivElement
        > & {
            badgeRef?: HTMLElement | null;
            as?: keyof HTMLElementTagNameMap;
            badge?: Snippet;
            badgeProps?: HTMLAttributes<HTMLElement>;

            class?: SlotsToClasses<['badge']>;
        };
</script>

<script lang="ts">
    import { parseClasses, type SlotsToClasses } from '@utils/common';

    let {
        class: className,
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
            variant
        })
    );

    const classes = $derived(parseClasses(className));
</script>

<div
    bind:this={ref}
    class={styles.base({
        className: classes.root
    })}
    {...restProps}
>
    {@render children?.()}
    <svelte:element
        this={as}
        class={styles.badge({
            className: classes.badge
        })}
        bind:this={badgeRef}
        data-invisible={isInvisible}
        {...badgeProps}
    >
        {@render badgeSlot?.()}
    </svelte:element>
</div>
