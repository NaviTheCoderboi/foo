<script module lang="ts">
    import type { HTMLAttributes, MouseEventHandler } from 'svelte/elements';
    import { card, type CardVariantProps } from '../styles';
    import type { WithChildren, WithElementRef } from 'bits-ui';

    export type CardProps<T extends boolean | undefined> = CardVariantProps &
        WithChildren<
            WithElementRef<
                T extends true
                    ? HTMLAttributes<HTMLButtonElement>
                    : HTMLAttributes<HTMLDivElement>,
                T extends true ? HTMLButtonElement : HTMLDivElement
            >
        > & {
            disableRipple?: boolean;
            isPressable?: T;
        };
</script>

<script lang="ts" generics="T extends boolean | undefined = false">
    import { stylesCtx } from '../ctx';
    import { Ripple, RippleState } from '@components/ui/ripple';
    import { chain } from '@utils/common';

    let {
        class: className,
        ref = $bindable(null),
        children,
        onclick,
        // variants
        isPressable,
        radius,
        shadow,
        fullWidth,
        isHoverable,
        disabled,
        isFooterBlurred,
        isBlurred,
        disableAnimation,
        disableRipple,
        ...restProps
    }: CardProps<T> = $props();

    const styles = $derived(
        card({
            isPressable,
            radius,
            shadow,
            fullWidth,
            isHoverable,
            disabled,
            isFooterBlurred,
            isBlurred,
            disableAnimation
        })
    );

    stylesCtx.set(() => ({
        header: styles.header,
        body: styles.body,
        footer: styles.footer
    }));

    let rippleState = $state<RippleState | undefined>(undefined);

    if (isPressable && !disableAnimation && !disableRipple) {
        rippleState = new RippleState();
        onclick = chain(
            (e: PointerEvent | MouseEvent | TouchEvent) => {
                rippleState?.createRipple(e);
            },
            onclick ?? (() => {})
        );
    }

    const _restProps = restProps as HTMLAttributes<HTMLElement>;
</script>

{#if isPressable}
    <button
        bind:this={ref as any}
        class={styles.base({
            className
        })}
        onclick={onclick as MouseEventHandler<HTMLButtonElement>}
        {disabled}
        {..._restProps}
    >
        {@render children?.()}
        {#if rippleState !== undefined}
            <Ripple
                bind:ripples={rippleState.ripples}
                removeRipple={rippleState.removeRipple}
            />
        {/if}
    </button>
{:else}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        bind:this={ref as any}
        class={styles.base({
            className
        })}
        onclick={onclick as MouseEventHandler<HTMLDivElement>}
        {..._restProps}
        aria-disabled={disabled}
    >
        {@render children?.()}
    </div>
{/if}
