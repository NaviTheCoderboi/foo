import type { AnyFn, ReadableBox } from 'svelte-toolbelt';

export const withDisabledCheck = <T extends AnyFn>(
    handler?: T,
    isDisabled?: ReadableBox<boolean>
): T => {
    if (!handler) {
        return (() => {}) as T;
    }

    return ((...args) => {
        if (isDisabled?.current === true) return;

        handler(...args);
    }) as T;
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

export const isSSR = () => {
    return typeof window === 'undefined' && typeof document === 'undefined';
};

/**
 * Map over an object
 * @param obj - Object to map over
 * @param fn - Function to call for each key-value pair
 */
export const mapObject = <T extends Record<string, any>>(
    obj: T,
    fn: <K extends keyof T>(value: T[K], key: K) => T[K]
): { [K in keyof T]: T[K] } => {
    return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => [
            key,
            fn(value as T[keyof T], key as keyof T)
        ])
    ) as { [K in keyof T]: T[K] };
};
