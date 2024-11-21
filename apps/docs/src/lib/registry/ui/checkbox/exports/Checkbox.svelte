<script module lang="ts">
    import type { CheckboxRootProps, WithoutChildren } from 'bits-ui';
    import { checkbox, type CheckboxVariantProps } from '../styles';
    import type { HTMLAttributes } from 'svelte/elements';

    export type CheckboxProps = WithoutChildren<CheckboxRootProps> &
        CheckboxVariantProps & {
            wrapperClass?: string;
            labelClass?: string;
            labelProps?: HTMLAttributes<HTMLSpanElement>;
            // slots
            checkedIcon?: Snippet<[string]>;
            indeterminateIcon?: Snippet<[string]>;
            children?: Snippet;
            // refs
            rootRef?: HTMLLabelElement | null;
            rootProps?: HTMLAttributes<HTMLLabelElement>;
        };
</script>

<script lang="ts">
    import { Checkbox as CheckboxPrimitive } from 'bits-ui';
    import type { Snippet } from 'svelte';
    import { draw } from 'svelte/transition';
    import { linear } from 'svelte/easing';

    let {
        class: className,
        wrapperClass,
        labelClass,
        ref = $bindable(null),
        rootRef = $bindable(null),
        children: childrenSlot,
        checkedIcon: checkedIconSlot,
        indeterminateIcon: indeterminateIconSlot,
        checked = $bindable(false),
        indeterminate = $bindable(false),
        labelProps,
        rootProps,
        // variants
        color,
        size,
        disabled,
        lineThrough,
        radius,
        isInvalid,
        disableAnimation,
        ...restProps
    }: CheckboxProps = $props();

    let _isInvalid = $derived(
        (restProps.required && !checked && !indeterminate) || isInvalid
    );

    const styles = $derived(
        checkbox({
            color,
            size,
            disabled,
            lineThrough,
            radius,
            isInvalid,
            disableAnimation
        })
    );
</script>

<!-- svelte-ignore a11y_label_has_associated_control -->
<label
    bind:this={rootRef}
    class={styles.base({
        className,
        isInvalid: _isInvalid
    })}
    data-selected={checked || indeterminate}
    aria-disabled={disabled}
    {...rootProps}
>
    <CheckboxPrimitive.Root
        bind:ref
        bind:checked
        bind:indeterminate
        class={styles.wrapper({
            className: wrapperClass,
            isInvalid: _isInvalid
        })}
        {disabled}
        {...restProps}
    >
        {#snippet children(_props)}
            {#if _props.indeterminate}
                {#if indeterminateIconSlot}
                    {@render indeterminateIconSlot(
                        styles.icon({
                            isInvalid: _isInvalid
                        })
                    )}
                {:else}
                    <svg
                        stroke="currentColor"
                        stroke-width={3}
                        viewBox="0 0 24 24"
                        class={styles.icon({
                            isInvalid: _isInvalid
                        })}
                    >
                        <line x1="21" x2="3" y1="12" y2="12" />
                    </svg>
                {/if}
            {:else if checked}
                {#if checkedIconSlot}
                    {@render checkedIconSlot(
                        styles.icon({
                            isInvalid: _isInvalid
                        })
                    )}
                {:else}
                    <svg
                        aria-hidden="true"
                        role="presentation"
                        viewBox="0 0 17 18"
                        class={styles.icon({
                            isInvalid: _isInvalid
                        })}
                    >
                        <polyline
                            fill="none"
                            points="1 9 7 14 15 4"
                            stroke="currentColor"
                            stroke-dasharray={22}
                            stroke-dashoffset={44}
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width={2}
                            in:draw={{
                                duration: 300,
                                delay: 200,
                                easing: linear
                            }}
                        />
                    </svg>
                {/if}
            {/if}
        {/snippet}
    </CheckboxPrimitive.Root>
    <span
        class={styles.label({
            className: labelClass,
            isInvalid: _isInvalid
        })}
        {...labelProps}
    >
        {@render childrenSlot?.()}
    </span>
</label>
