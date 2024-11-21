import { createContext } from 'svelte-contextify';
import type { ButtonVariantProps } from './styles';

export const groupCtx = createContext<() => ButtonVariantProps | undefined>({
    defaultValue: () => undefined
});
