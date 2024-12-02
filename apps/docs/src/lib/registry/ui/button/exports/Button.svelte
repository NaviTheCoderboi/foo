<script module lang="ts">
    export type ButtonProps = WithElementRef<HTMLButtonAttributes> &
        WithElementRef<HTMLAnchorAttributes> &
        ButtonVariantProps & {
            ripple?: boolean;
        };
</script>

<script lang="ts">
    import type {
        HTMLButtonAttributes,
        HTMLAnchorAttributes,
        MouseEventHandler
    } from 'svelte/elements';
    import type { WithElementRef } from 'bits-ui';
    import { button, type ButtonVariantProps } from '../styles';
    import { groupCtx } from '../ctx';
    import { Ripple, RippleState } from '../../ripple';
    import { chain } from '../../../utils/common';

    let {
        class: className,
        href = undefined,
        type = 'button',
        ref = $bindable(null),
        children,
        ripple = true,
        onclick,
        // variants
        color,
        disableAnimation,
        fullWidth,
        disabled,
        isIconOnly,
        isInGroup,
        radius,
        size,
        variant,
        ...restProps
    }: ButtonProps = $props();

    let rippleState = $state<RippleState | undefined>(undefined);

    if (ripple) {
        rippleState = new RippleState();

        onclick = chain(
            (e: PointerEvent | MouseEvent | TouchEvent) => {
                rippleState?.createRipple(e);
            },
            onclick ?? (() => {})
        ) as MouseEventHandler<HTMLButtonElement> &
            MouseEventHandler<HTMLAnchorElement>;
    }

    const ctx = $derived.by(groupCtx.get());
</script>

{#if href}
    <a
        bind:this={ref}
        {href}
        class={button({
            color: color ?? ctx?.color,
            disableAnimation: disableAnimation ?? ctx?.disableAnimation,
            fullWidth: fullWidth ?? ctx?.fullWidth,
            disabled: disabled ?? ctx?.disabled,
            isIconOnly: isIconOnly ?? ctx?.isIconOnly,
            isInGroup: isInGroup ?? ctx?.isInGroup,
            radius: radius ?? ctx?.radius,
            size: size ?? ctx?.size,
            variant: variant ?? ctx?.variant,
            className
        })}
        {onclick}
        {...restProps}
        aria-disabled={disabled}
    >
        {#if ripple && rippleState !== undefined}
            <Ripple
                bind:ripples={rippleState.ripples}
                removeRipple={rippleState.removeRipple}
            />
        {/if}
        {@render children?.()}
    </a>
{:else}
    <button
        bind:this={ref}
        {type}
        class={button({
            color: color ?? ctx?.color,
            disableAnimation: disableAnimation ?? ctx?.disableAnimation,
            fullWidth: fullWidth ?? ctx?.fullWidth,
            disabled: disabled ?? ctx?.disabled,
            isIconOnly: isIconOnly ?? ctx?.isIconOnly,
            isInGroup: isInGroup ?? ctx?.isInGroup,
            radius: radius ?? ctx?.radius,
            size: size ?? ctx?.size,
            variant: variant ?? ctx?.variant,
            className
        })}
        {onclick}
        {...restProps}
        {disabled}
    >
        {#if ripple && rippleState !== undefined}
            <Ripple
                bind:ripples={rippleState.ripples}
                removeRipple={rippleState.removeRipple}
            />
        {/if}
        {@render children?.()}
    </button>
{/if}
