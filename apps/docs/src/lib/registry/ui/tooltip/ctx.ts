import { createContext } from 'svelte-contextify';
import type { popover } from './styles';

export const stylesCtx = createContext<
    () =>
        | (ReturnType<typeof popover> & {
              showArrow: boolean;
          })
        | undefined
>({
    defaultValue: () => undefined
});
