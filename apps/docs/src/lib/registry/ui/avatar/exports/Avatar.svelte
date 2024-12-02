<script module lang="ts">
    import type { AvatarRootProps, AvatarFallbackProps } from 'bits-ui';
    import { avatar, type AvatarVariantProps } from '../styles';

    export type AvatarProps = Omit<AvatarRootProps, 'class'> &
        AvatarVariantProps & {
            imageRef?: HTMLImageElement | null;
            fallbackRef?: HTMLElement | null;
            fallbackProps?: Omit<AvatarFallbackProps, 'class'>;
            src?: string;
            alt?: string;
            // slots
            fallback?: Snippet;
            name?: string;
            icon?: Snippet;

            class?: SlotsToClasses<['image', 'fallback']>;
        };
</script>

<script lang="ts">
    import { Avatar as AvatarPrimitive } from 'bits-ui';
    import type { Snippet } from 'svelte';
    import { avatarGroupCtx } from '../ctx';
    import { parseClasses, type SlotsToClasses } from '@utils/common';

    let {
        class: className,
        ref = $bindable(null),
        imageRef = $bindable(null),
        fallbackRef = $bindable(null),
        fallbackProps,
        children,
        src,
        alt,
        // variants
        color,
        disableAnimation,
        isBordered,
        disabled,
        isInGridGroup,
        isInGroup,
        radius,
        size,
        // slots
        fallback: fallbackSlot,
        icon: iconSlot,
        name: _name,
        ...restProps
    }: AvatarProps = $props();

    const ctx = $derived.by(avatarGroupCtx.get());

    const styles = $derived(
        avatar({
            color: color ?? ctx?.color,
            disableAnimation: disableAnimation ?? ctx?.disableAnimation,
            isBordered: isBordered ?? ctx?.isBordered,
            disabled: disabled ?? ctx?.disabled,
            isInGridGroup: isInGridGroup ?? ctx?.isInGridGroup,
            isInGroup: isInGroup ?? ctx?.isInGroup,
            radius: radius ?? ctx?.radius,
            size: size ?? ctx?.size
        })
    );

    const getInitials = (name: string) => {
        const [firstName, lastName] = name.split(' ');

        if (!lastName) {
            return firstName.charAt(0);
        }

        return firstName.charAt(0) + (lastName ? lastName.charAt(0) : '');
    };

    // @ts-ignore
    fallbackProps && delete fallbackProps.class;

    const classes = $derived(parseClasses(className));
</script>

<AvatarPrimitive.Root
    class={styles.base({
        className: classes.root
    })}
    bind:ref
    {...restProps}
>
    <AvatarPrimitive.Image
        {src}
        {alt}
        bind:ref={imageRef}
        class={styles.img({
            className: classes.image
        })}
    />
    <AvatarPrimitive.Fallback
        class={fallbackSlot
            ? styles.fallback({
                  className: classes.fallback
              })
            : _name
              ? styles.name({
                    className: classes.fallback
                })
              : styles.icon({
                    className: classes.fallback
                })}
        bind:ref={fallbackRef}
        {...fallbackProps}
    >
        {#if fallbackSlot}
            {@render fallbackSlot()}
        {:else if _name}
            {getInitials(_name)}
        {:else if iconSlot}
            {@render iconSlot()}
        {/if}
    </AvatarPrimitive.Fallback>
</AvatarPrimitive.Root>
