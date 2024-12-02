import type { AnyFn } from 'svelte-toolbelt';
import type { FocusableElement } from '../types/dom';
import { chain } from './common';

interface Events<T> {
    onCall?: (node: T) => void;
    onUpdate?: (node: T) => void;
    onDestroy?: (node: T) => void;
}

const useEventHandler = (node: Element, e: string, handler: AnyFn) => {
    try {
        node.addEventListener(e, handler);
    } catch {
        console.warn(`Failed to add event listener for "${e}" on ${node}`);
    }

    return () => {
        try {
            node.removeEventListener(e, handler);
        } catch {
            console.warn(
                `Failed to remove event listener for "${e}" on ${node}`
            );
        }
    };
};

export const createAction = <T extends FocusableElement>(
    handlers: Record<string, AnyFn>,
    events: Events<T> = {}
) => {
    const action = (node: T) => {
        events.onCall?.(node);

        const unsubscribers = [] as AnyFn[];

        for (const [e, handler] of Object.entries(handlers)) {
            unsubscribers.push(useEventHandler(node, e, handler));
        }

        return {
            update: () => {
                events.onUpdate?.(node);
            },
            destroy: () => {
                chain(...unsubscribers)();
                events.onDestroy?.(node);
            }
        };
    };

    return action;
};
