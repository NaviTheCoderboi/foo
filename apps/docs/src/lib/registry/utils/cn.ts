import clsx, { type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { tv as tvBase, type TV } from 'tailwind-variants';

export const tv: TV = (options, config) =>
    tvBase(options, {
        ...config,
        twMerge: config?.twMerge ?? true
    });

export const cn = (...classes: ClassValue[]) => twMerge(clsx(...classes));
