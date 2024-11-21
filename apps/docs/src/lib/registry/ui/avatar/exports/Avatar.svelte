<script module lang="ts">
    import type { AvatarRootProps, AvatarFallbackProps } from 'bits-ui';
    import { avatar, type AvatarVariantProps } from '../styles';

    export type AvatarProps = AvatarRootProps &
        AvatarVariantProps & {
            imageClass?: string;
            imageRef?: HTMLImageElement | null;
            fallbackRef?: HTMLElement | null;
            fallbackClass?: string;
            fallbackProps?: Omit<AvatarFallbackProps, 'class'>;
            src?: string;
            alt?: string;
            // slots
            fallback?: Snippet;
            name?: string;
            icon?: Snippet;
        };
</script>

<script lang="ts">
    import { Avatar as AvatarPrimitive } from 'bits-ui';
    import type { Snippet } from 'svelte';
    import { avatarGroupCtx } from '../ctx';

    let {
        class: className,
        imageClass,
        fallbackClass,
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
        return firstName.charAt(0) + (lastName ? lastName.charAt(0) : '');
    };

    // @ts-ignore
    fallbackProps && delete fallbackProps.class;
</script>

<AvatarPrimitive.Root
    class={styles.base({
        className
    })}
    bind:ref
    {...restProps}
>
    <AvatarPrimitive.Image
        {src}
        {alt}
        bind:ref={imageRef}
        class={styles.img({
            className: imageClass
        })}
    />
    <AvatarPrimitive.Fallback
        class={fallbackSlot
            ? styles.fallback({
                  className: fallbackClass
              })
            : _name
              ? styles.name({
                    className: fallbackClass
                })
              : styles.icon({
                    className: fallbackClass
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
