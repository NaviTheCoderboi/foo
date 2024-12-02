<script module lang="ts">
    import type { WithElementRef } from 'bits-ui';
    import type { HTMLAttributes } from 'svelte/elements';
    import { user, type UserVariantProps } from '../styles';
    import type { Snippet } from 'svelte';

    export type UserProps = WithElementRef<
        Omit<HTMLAttributes<HTMLDivElement>, 'class'>,
        HTMLDivElement
    > &
        UserVariantProps & {
            name: string | Snippet<[string]>;
            description?: string | Snippet<[string]>;
            isFocusable?: boolean;
            // for avatar
            src?: string;
            alt?: string;
            avatarFallback?: Snippet;
            // slots
            avatarSlot?: Snippet;

            class?: SlotsToClasses<
                ['avatar', 'wrapper', 'name', 'description']
            >;
        };
</script>

<script lang="ts">
    import * as Avatar from '@components/ui/avatar';
    import { parseClasses, type SlotsToClasses } from '@utils/common';
    import { cn } from '@utils/cn';
    import { focusVisibleClasses } from '@utils/classes/utils';

    let {
        class: className,
        ref = $bindable(null),
        // avatar
        name,
        description,
        src,
        alt,
        avatarFallback,
        isFocusable = false,
        // slots
        avatarSlot,
        // variants
        // ... (none yet)
        ...restProps
    }: UserProps = $props();

    const styles = $derived(user());

    const classes = $derived(parseClasses(className));
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
    class={styles.base({
        className: cn(classes.root, isFocusable && focusVisibleClasses)
    })}
    tabindex={isFocusable ? 0 : undefined}
    {...restProps}
>
    {#if avatarSlot}
        {@render avatarSlot()}
    {:else}
        <Avatar.Root
            {src}
            {alt}
            name={typeof name === 'string' ? name : undefined}
            fallback={avatarFallback}
            class={classes.avatar}
        />
    {/if}
    <div
        class={styles.wrapper({
            className: classes.wrapper
        })}
    >
        {#if name}
            {#if typeof name === 'string'}
                <span
                    class={styles.name({
                        className: classes.name
                    })}
                >
                    {name}
                </span>
            {:else}
                {@render name(
                    styles.name({
                        className: classes.name
                    })
                )}
            {/if}
        {/if}
        {#if description}
            {#if typeof description === 'string'}
                <span
                    class={styles.description({
                        className: classes.description
                    })}
                >
                    {description}
                </span>
            {:else}
                {@render description(
                    styles.description({
                        className: classes.description
                    })
                )}
            {/if}
        {/if}
    </div>
</div>
