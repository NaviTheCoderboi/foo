<script module lang="ts">
    import type { WithChildren, WithElementRef } from 'bits-ui';
    import type { HTMLAttributes, MouseEventHandler } from 'svelte/elements';
    import { chip, type ChipVariantProps } from '../styles';
    import { parseClasses, type SlotsToClasses } from '@r/utils/common';
    import type { Snippet } from 'svelte';

    export type ChipProps = Omit<
        WithChildren<
            WithElementRef<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
        >,
        'class'
    > &
        ChipVariantProps & {
            // slots
            startContentSlot?: Snippet;
            endContentSlot?: Snippet<
                [MouseEventHandler<HTMLButtonElement> | undefined]
            >;
            avatarSlot?: Snippet<[string]>;

            class?: SlotsToClasses<['dot', 'closeButton', 'content']>;

            onClose?: MouseEventHandler<HTMLButtonElement>;
            closeButtonProps?: HTMLAttributes<HTMLButtonElement>;
        };
</script>

<script lang="ts">
    let {
        class: className,
        ref = $bindable(null),
        children,
        // slots
        startContentSlot,
        endContentSlot,
        avatarSlot,
        onClose,
        closeButtonProps,
        // variants
        color,
        disabled,
        hasEndContent,
        hasStartContent,
        isCloseable,
        isOneChar,
        radius,
        size,
        variant,
        ...restProps
    }: ChipProps = $props();

    const styles = $derived(
        chip({
            color,
            disabled,
            hasEndContent,
            hasStartContent,
            isCloseable,
            isOneChar,
            radius,
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
    aria-disabled={disabled}
    {...restProps}
>
    {#if startContentSlot}
        {@render startContentSlot()}
    {:else if avatarSlot}
        {@render avatarSlot(styles.avatar())}
    {:else if variant === 'dot'}
        <span
            class={styles.dot({
                className: classes.dot
            })}
        ></span>
    {/if}

    <span
        class={styles.content({
            className: classes.content
        })}
    >
        {@render children?.()}
    </span>

    {#if endContentSlot}
        {@render endContentSlot(onClose)}
    {:else if onClose}
        <button
            {disabled}
            tabindex="0"
            aria-label="close chip"
            onclick={onClose}
            class={styles.closeButton({
                className: classes.closeButton
            })}
            {...closeButtonProps}
        >
            <!-- from next-ui  -->
            <svg
                aria-hidden="true"
                focusable="false"
                role="presentation"
                viewBox="0 0 24 24"
                ><path
                    d="M12 2a10 10 0 1010 10A10.016 10.016 0 0012 2zm3.36 12.3a.754.754 0 010 1.06.748.748 0 01-1.06 0l-2.3-2.3-2.3 2.3a.748.748 0 01-1.06 0 .754.754 0 010-1.06l2.3-2.3-2.3-2.3A.75.75 0 019.7 8.64l2.3 2.3 2.3-2.3a.75.75 0 011.06 1.06l-2.3 2.3z"
                    fill="currentColor"
                ></path></svg
            >
        </button>
    {/if}
</div>
