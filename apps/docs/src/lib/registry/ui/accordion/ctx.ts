import { createContext } from 'svelte-contextify';
import type { accordionItem } from './styles';

export const stylesCtx = createContext<
    () => ReturnType<typeof accordionItem> | undefined
>({
    defaultValue: () => undefined
});
