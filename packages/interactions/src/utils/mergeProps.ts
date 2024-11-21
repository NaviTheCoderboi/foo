import clsx from 'clsx';
import { mergeIds } from './ids';
import { chain } from './common';
import { twMerge } from 'tailwind-merge';

interface Props {
    [key: string]: any;
}

type PropsArg = Props | null | undefined;

type TupleTypes<T> = { [P in keyof T]: T[P] } extends { [key: number]: infer V }
    ? NullToObject<V>
    : never;
type NullToObject<T> = T extends null | undefined ? object : T;

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
    k: infer I
) => void
    ? I
    : never;

/**
 * Merges multiple props objects together. Event handlers are chained,
 * class are combined, and ids are deduplicated - different ids
 * For all other props, the last prop object overrides all previous ones.
 * @param args - Multiple sets of props to merge together.
 */
export const mergeProps = <T extends PropsArg[]>(
    ...args: T
): UnionToIntersection<TupleTypes<T>> => {
    const result: Props = { ...args[0] };

    for (let i = 1; i < args.length; i++) {
        const props = args[i];
        for (const key in props) {
            const a = result[key];
            const b = props[key];

            if (
                typeof a === 'function' &&
                typeof b === 'function' &&
                key[0] === 'o' &&
                key[1] === 'n'
            ) {
                Object.defineProperty(result, key, {
                    value: chain(a, b),
                    writable: true,
                    enumerable: true,
                    configurable: true
                });
            } else if (
                key === 'class' &&
                typeof a === 'string' &&
                typeof b === 'string'
            ) {
                Object.defineProperty(result, key, {
                    value: clsx(twMerge(a, b)),
                    writable: true,
                    enumerable: true,
                    configurable: true
                });
            } else if (key === 'id' && a && b) {
                Object.defineProperty(result, key, {
                    value: mergeIds(a as string, b as string),
                    writable: true,
                    enumerable: true,
                    configurable: true
                });
            } else {
                Object.defineProperty(result, key, {
                    value: b !== undefined ? b : a,
                    writable: true,
                    enumerable: true,
                    configurable: true
                });
            }
        }
    }

    return result as UnionToIntersection<TupleTypes<T>>;
};
