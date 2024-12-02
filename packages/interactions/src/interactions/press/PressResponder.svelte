<script lang="ts" generics="T extends FocusableElement">
    import { onMount, type Snippet } from 'svelte';
    import { PressResponderContext } from './ctx';
    import type { PressProps } from './press.svelte';
    import type { FocusableElement } from '../../types/dom';
    import { mergeProps } from '../../utils/mergeProps';

    let {
        children,
        ...props
    }: PressProps<T> & {
        children: Snippet;
    } = $props();

    let isRegistered = $state(false);
    const prevContext = PressResponderContext.get();

    const context = $derived.by(() =>
        mergeProps(prevContext ?? {}, {
            ...props,
            register: () => {
                isRegistered = true;
                if (prevContext) {
                    prevContext.register();
                }
            }
        })
    );

    onMount(() => {
        if (!isRegistered) {
            console.warn(
                'A PressResponder was rendered without a pressable child. ' +
                    'Use the Press utility'
            );
            isRegistered = true;
        }
    });

    $effect(() => {
        PressResponderContext.set(context);
    });
</script>

{@render children()}
