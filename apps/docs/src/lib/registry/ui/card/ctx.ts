import { createContext } from 'svelte-contextify';
import type { card } from './styles';

export const stylesCtx = createContext<
    () => Omit<ReturnType<typeof card>, 'base'> | undefined
>({
    defaultValue: () => undefined
});
