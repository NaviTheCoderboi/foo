import type { MaybeBoxOrGetter } from 'svelte-toolbelt';

type AnyFn = (...args: any[]) => any;

export const clamp = (value: number, min: number, max: number) => {
    return Math.min(Math.max(value, min), max);
};

/**
 * Chain multiple functions together
 * @param cbs - Functions to chain
 * @returns A function that calls each function in the order they were passed
 */
export const chain = <T extends AnyFn>(...cbs: T[]) => {
    return ((...args: Parameters<T>) => {
        for (const callback of cbs) {
            if (typeof callback === 'function') {
                callback(...args);
            }
        }
    }) as T;
};

export type ReadableProp<T> = MaybeBoxOrGetter<T>;

export type SlotsToClasses<T extends string[]> =
    | string
    | undefined
    | ({
          root?: string;
      } & {
          [key in T[number]]?: string;
      });

export const parseClasses = <T extends string[]>(slots: SlotsToClasses<T>) => {
    if (typeof slots === 'string' || !slots) {
        return { root: slots } as {
            root: string;
        } & {
            [key in T[number]]?: string;
        };
    }

    return slots;
};

export const formatStyles = (styles: Record<string, string | number>) => {
    return Object.entries(styles)
        .map(([key, value]) => `${key}: ${value};`)
        .join('');
};
