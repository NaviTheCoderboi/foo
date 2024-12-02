<script module lang="ts">
    import type { WithChildren, WithElementRef } from 'bits-ui';
    import type { HTMLAnchorAttributes } from 'svelte/elements';
    import { link, linkAnchorClasses, type LinkVariantProps } from '../styles';
    import type { Snippet } from 'svelte';

    export type LinkProps = WithChildren<
        WithElementRef<Omit<HTMLAnchorAttributes, 'class'>, HTMLAnchorElement>
    > &
        LinkVariantProps & {
            isExternal?: boolean;
            showAnchorIcon?: boolean;
            // slots
            anchorIconSlot?: Snippet<[string]>;

            class?: SlotsToClasses<['anchorIcon']>;
        };
</script>

<script lang="ts">
    import LinkIcon from 'lucide-svelte/icons/square-arrow-out-up-right';
    import { cn } from '@utils/cn';
    import { parseClasses, type SlotsToClasses } from '@utils/common';

    let {
        class: className,
        ref = $bindable(null),
        children,
        rel,
        target,
        onclick,
        // slots
        anchorIconSlot,
        // variants
        underline,
        isBlock,
        disableAnimation,
        color,
        size,
        disabled,
        isExternal,
        showAnchorIcon,
        ...restProps
    }: LinkProps = $props();

    if (isExternal) {
        rel = rel ?? 'noopener noreferrer';
        target = target ?? '_blank';
    }

    const classes = $derived(parseClasses(className));

    const styles = $derived(
        link({
            underline,
            isBlock,
            disableAnimation,
            color,
            size,
            disabled,
            className: classes.root
        })
    );
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<a
    bind:this={ref}
    class={styles}
    {rel}
    {target}
    aria-disabled={disabled}
    onclick={disabled ? (e) => e.preventDefault() : onclick}
    tabindex={disabled ? -1 : undefined}
    {...restProps}
>
    {@render children?.()}
    {#if showAnchorIcon}
        {#if anchorIconSlot}
            {@render anchorIconSlot(cn(linkAnchorClasses, classes.anchorIcon))}
        {:else}
            <LinkIcon class={cn(linkAnchorClasses, classes.anchorIcon)} />
        {/if}
    {/if}
</a>
