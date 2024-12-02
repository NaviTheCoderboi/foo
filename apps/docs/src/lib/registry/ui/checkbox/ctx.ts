import { createContext } from 'svelte-contextify';
import type { CheckboxVariantProps } from './styles';
import type { CheckboxGroupState } from './group.svelte';

export const stylesCtx = createContext<
    () => CheckboxVariantProps & {
        required?: boolean;
    }
>({
    defaultValue: () => ({})
});

export const checkboxGroupCtx = createContext<CheckboxGroupState | undefined>({
    defaultValue: undefined
});
