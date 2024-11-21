import type { VariantProps } from 'tailwind-variants';
import { tv } from '../../utils/cn';

export const divider = tv({
    base: 'shrink-0 bg-divider border-none',
    variants: {
        orientation: {
            horizontal: 'w-full h-[1px]',
            vertical: 'h-full w-[1px]'
        }
    },
    defaultVariants: {
        orientation: 'horizontal'
    }
});

export type DividerVariantProps = VariantProps<typeof divider>;
