<!-- <script lang="ts">
    import { onMount } from 'svelte';
    import Checkbox from '@r/ui/checkbox/exports/Checkbox.svelte';
    import { CheckboxGroupState } from '@r/ui/checkbox/group.svelte';
    import { box } from 'svelte-toolbelt';

    onMount(() => {
        document.documentElement.dataset.theme = 'dark';
    });

    const items = ['pig', 'cow', 'chicken', 'dog', 'cat', 'horse'];

    let checked = $state<string[]>([]);

    const groupState = new CheckboxGroupState({
        isDisabled: box.from(false),
        isReadOnly: box.from(false),
        defaultChecked: box.from(['dog', 'cat']),
        checked: box.with(
            () => checked,
            (v) => {
                checked = v;
            }
        )
    });
</script>

<div
    class="h-screen flex flex-col justify-center items-center bg-background text-foreground"
>
    <div role="group" class="flex flex-col gap-3">
        {#each items as item (item)}
            <Checkbox
                color="primary"
                size="lg"
                lineThrough
                onCheckedChange={() => groupState.toggle(item)}
                checked={groupState.isChecked(item)}
                isInvalid={checked.length < 1}
            >
                {item}
            </Checkbox>
        {/each}
    </div>
    {JSON.stringify(checked, null, 4)}
</div> -->

<script lang="ts">
    import { onMount } from 'svelte';
    import Checkbox from '@r/ui/checkbox/exports/Checkbox.svelte';

    onMount(() => {
        document.documentElement.dataset.theme = 'dark';
    });

    let color = $state('danger');
    let disabled = $state(false);
</script>

<div
    class="h-screen flex flex-col gap-5 justify-center items-center bg-background text-foreground"
>
    <Checkbox color={color as any} {disabled} size="lg">
        {color}
    </Checkbox>

    <button onclick={() => (disabled = !disabled)}>enable/disable</button>
    <input type="text" bind:value={color} />
</div>
