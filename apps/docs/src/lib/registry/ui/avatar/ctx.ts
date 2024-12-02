import { createContext } from 'svelte-contextify';
import type { AvatarVariantProps } from './styles';

export const avatarGroupCtx = createContext<
    () => AvatarVariantProps | undefined
>({
    defaultValue: () => undefined
});
