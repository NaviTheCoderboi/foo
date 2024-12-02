<script module lang="ts">
    import type { CheckboxRootProps, WithoutChildren } from 'bits-ui';
    import { checkbox, type CheckboxVariantProps } from '../styles';
    import type { HTMLAttributes } from 'svelte/elements';

    export type CheckboxProps = Omit<
        WithoutChildren<CheckboxRootProps>,
        'class'
    > &
        CheckboxVariantProps & {
            labelProps?: HTMLAttributes<HTMLSpanElement>;
            // slots
            checkedIcon?: Snippet<[string]>;
            indeterminateIcon?: Snippet<[string]>;
            children?: Snippet;
            // refs
            rootRef?: HTMLLabelElement | null;
            rootProps?: HTMLAttributes<HTMLLabelElement>;

            class?: SlotsToClasses<
                ['wrapper', 'label', 'checkedIcon', 'indeterminateIcon']
            >;
        };
</script>

<script lang="ts">
    import { Checkbox as CheckboxPrimitive } from 'bits-ui';
    import type { Snippet } from 'svelte';
    import { draw } from 'svelte/transition';
    import { linear } from 'svelte/easing';
    import { checkboxGroupCtx, stylesCtx } from '../ctx';
    import { chain, parseClasses, type SlotsToClasses } from '@utils/common';

    const groupState = checkboxGroupCtx.get();

    let {
        class: className,
        ref = $bindable(null),
        rootRef = $bindable(null),
        children: childrenSlot,
        checkedIcon: checkedIconSlot,
        indeterminateIcon: indeterminateIconSlot,
        value,
        checked = $bindable(groupState?.isChecked(value) ?? false),
        indeterminate = $bindable(false),
        labelProps,
        rootProps,
        onCheckedChange,
        // variants
        color,
        size,
        disabled,
        lineThrough,
        radius,
        isInvalid,
        disableAnimation,
        required,
        ...restProps
    }: CheckboxProps = $props();

    let _isInvalid = $derived(
        (required && !checked && !indeterminate) || isInvalid
    );

    let _disabled = $derived(
        disabled ?? (groupState && groupState.disabled) ?? false
    );

    const ctx = $derived.by(stylesCtx.get());

    const styles = $derived(
        checkbox({
            color: color ?? ctx?.color,
            size: size ?? ctx?.size,
            disabled: disabled ?? ctx?.disabled,
            lineThrough: lineThrough ?? ctx?.lineThrough,
            radius: radius ?? ctx?.radius,
            isInvalid: ctx.isInvalid ?? _isInvalid,
            disableAnimation: disableAnimation ?? ctx?.disableAnimation
        })
    );

    const classes = $derived(parseClasses(className));
</script>

<!-- svelte-ignore a11y_label_has_associated_control -->
<label
    bind:this={rootRef}
    class={styles.base({
        className: classes.root,
        isInvalid: _isInvalid
    })}
    data-selected={checked || indeterminate}
    aria-disabled={_disabled}
    {...rootProps}
>
    <CheckboxPrimitive.Root
        bind:ref
        bind:checked
        bind:indeterminate
        class={styles.wrapper({
            className: classes.wrapper,
            isInvalid: _isInvalid
        })}
        disabled={_disabled}
        required={required ?? ctx.required}
        {...restProps}
        onCheckedChange={chain(onCheckedChange ?? (() => {}), (v) => {
            if (groupState && value) {
                groupState.update(value, v);
            }
        })}
    >
        {#snippet children(_props)}
            {#if _props.indeterminate}
                {#if indeterminateIconSlot}
                    {@render indeterminateIconSlot(
                        styles.icon({
                            isInvalid: _isInvalid,
                            className: classes.indeterminateIcon
                        })
                    )}
                {:else}
                    <svg
                        stroke="currentColor"
                        stroke-width={3}
                        viewBox="0 0 24 24"
                        class={styles.icon({
                            isInvalid: _isInvalid,
                            className: classes.indeterminateIcon
                        })}
                    >
                        <line x1="21" x2="3" y1="12" y2="12" />
                    </svg>
                {/if}
            {:else if checked}
                {#if checkedIconSlot}
                    {@render checkedIconSlot(
                        styles.icon({
                            isInvalid: _isInvalid,
                            className: classes.checkedIcon
                        })
                    )}
                {:else}
                    <svg
                        aria-hidden="true"
                        role="presentation"
                        viewBox="0 0 17 18"
                        class={styles.icon({
                            isInvalid: _isInvalid,
                            className: classes.checkedIcon
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
                            in:draw|global={{
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
            className: classes.label,
            isInvalid: _isInvalid
        })}
        {...labelProps}
    >
        {@render childrenSlot?.()}
    </span>
</label>
