import { tv } from '@utils/cn';
import type { VariantProps } from 'tailwind-variants';
export const user = tv({
    slots: {
        base: ['inline-flex items-center justify-center gap-2 rounded-small'],
        wrapper: 'inline-flex flex-col items-start',
        name: 'text-small text-inherit',
        description: 'text-tiny text-foreground-400'
    }
});

export type UserVariantProps = VariantProps<typeof user>;
