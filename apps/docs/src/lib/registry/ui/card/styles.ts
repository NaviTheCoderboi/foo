import { focusVisibleClasses } from '@utils/classes/utils';
import { tv } from '@utils/cn';
import type { VariantProps } from 'tailwind-variants';

export const card = tv({
    slots: {
        base: [
            'flex',
            'flex-col',
            'relative',
            'overflow-hidden',
            'h-auto',
            'outline-none',
            'text-foreground',
            'box-border',
            'bg-content1',
            // focus ring
            ...focusVisibleClasses
        ],
        header: [
            'flex',
            'p-3',
            'z-10',
            'w-full',
            'justify-start',
            'items-center',
            'shrink-0',
            'text-inherit',
            'bg-inherit',
            'subpixel-antialiased'
        ],
        body: [
            'relative',
            'flex',
            'flex-1',
            'w-full',
            'p-3',
            'flex-auto',
            'flex-col',
            'place-content-inherit',
            'align-items-inherit',
            'h-fit',
            'break-words',
            'text-left',
            'overflow-y-auto',
            'subpixel-antialiased'
        ],
        footer: [
            'p-3',
            'h-auto',
            'flex',
            'w-full',
            'items-center',
            'overflow-hidden',
            'text-inherit',
            'bg-inherit',
            'subpixel-antialiased'
        ]
    },
    variants: {
        shadow: {
            none: {
                base: 'shadow-none'
            },
            sm: {
                base: 'shadow-md'
            },
            md: {
                base: 'shadow-lg'
            },
            lg: {
                base: 'shadow-xl'
            }
        },
        radius: {
            none: {
                base: 'rounded-none',
                header: 'rounded-none',
                footer: 'rounded-none'
            },
            sm: {
                base: 'rounded-md',
                header: 'rounded-t-md',
                footer: 'rounded-b-md'
            },
            md: {
                base: 'rounded-lg',
                header: 'rounded-t-lg',
                footer: 'rounded-b-lg'
            },
            lg: {
                base: 'rounded-xl',
                header: 'rounded-t-xl',
                footer: 'rounded-b-xl'
            }
        },
        fullWidth: {
            true: {
                base: 'w-full'
            }
        },
        isHoverable: {
            true: {
                base: 'hover:bg-content2'
            }
        },
        isPressable: {
            true: { base: 'cursor-pointer' }
        },
        isBlurred: {
            true: {
                base: [
                    'bg-background/20',
                    'backdrop-blur-md',
                    'backdrop-saturate-150'
                ]
            }
        },
        isFooterBlurred: {
            true: {
                footer: [
                    'bg-background/10',
                    'backdrop-blur',
                    'backdrop-saturate-150'
                ]
            }
        },
        disabled: {
            true: {
                base: 'opacity-disabled cursor-not-allowed'
            }
        },
        disableAnimation: {
            true: '',
            false: {
                base: 'transition-transform-background motion-reduce:transition-none'
            }
        }
    },
    compoundVariants: [
        {
            isPressable: true,
            class: 'active:scale-[0.97] tap-highlight-transparent'
        }
    ],
    defaultVariants: {
        radius: 'lg',
        shadow: 'md',
        fullWidth: false,
        isHoverable: false,
        isPressable: false,
        disabled: false,
        isFooterBlurred: false
    }
});

export type CardVariantProps = VariantProps<typeof card>;
