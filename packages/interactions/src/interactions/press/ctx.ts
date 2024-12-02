import { createContext } from 'svelte-contextify';
import type { PressProps } from './press.svelte';

interface IPressResponderContext extends PressProps {
    register(): void;
}

export const PressResponderContext = createContext<IPressResponderContext>({
    defaultValue: {
        register: () => {}
    }
});
