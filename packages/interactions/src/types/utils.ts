import type { MaybeBoxOrGetter } from 'svelte-toolbelt';

export type ReadableProp<T> = MaybeBoxOrGetter<T>;
export type WritableProp<T> = MaybeBoxOrGetter<T>;
