import { colorVariants } from '@utils/classes/variants';
import { focusVisibleClasses } from '@utils/classes/utils';
import { tv } from '@utils/cn';
import type { VariantProps } from 'tailwind-variants';

export const popover = tv({
    slots: {
        base: [
            'z-0',
            'relative',
            'bg-transparent',
            // focus ring
            ...focusVisibleClasses
        ],
        content: [
            'z-10',
            'px-2.5',
            'py-1',
            'w-full',
            'inline-flex',
            'flex-col',
            'items-center',
            'justify-center',
            'box-border',
            'subpixel-antialiased',
            'outline-none',
            'box-border'
        ],
        trigger: ['z-10'],
        backdrop: ['hidden'],
        arrow: ['[&>svg]:z-[-1]', '[&>svg]:w-2.5', '[&>svg]:h-2.5']
    },
    variants: {
        size: {
            sm: { content: 'text-sm' },
            md: { content: 'text-base' },
            lg: { content: 'text-lg' }
        },
        color: {
            default: {
                content: 'bg-content1',
                arrow: 'text-content1 [&>svg]:shadow-md'
            },
            foreground: {
                content: colorVariants.solid.foreground,
                arrow: 'text-foreground'
            },
            primary: {
                content: colorVariants.solid.primary,
                arrow: 'text-primary'
            },
            secondary: {
                content: colorVariants.solid.secondary,
                arrow: 'text-secondary'
            },
            success: {
                content: colorVariants.solid.success,
                arrow: 'text-success'
            },
            warning: {
                content: colorVariants.solid.warning,
                arrow: 'text-warning'
            },
            danger: {
                content: colorVariants.solid.danger,
                arrow: 'text-danger'
            }
        },
        radius: {
            none: { content: 'rounded-none' },
            sm: { content: 'rounded-md' },
            md: { content: 'rounded-lg' },
            lg: { content: 'rounded-xl' },
            full: { content: 'rounded-full' }
        },
        shadow: {
            sm: {
                content: 'shadow-md'
            },
            md: {
                content: 'shadow-lg'
            },
            lg: {
                content: 'shadow-xl'
            }
        },
        backdrop: {
            transparent: {},
            opaque: {
                backdrop: 'bg-overlay/50 backdrop-opacity-disabled'
            },
            blur: {
                backdrop: 'backdrop-blur-sm backdrop-saturate-150 bg-overlay/30'
            }
        },
        triggerScaleOnOpen: {
            true: {
                trigger: [
                    'aria-expanded:scale-[0.97]',
                    'aria-expanded:opacity-70',
                    'subpixel-antialiased'
                ]
            },
            false: {}
        },
        disableAnimation: {
            true: {
                base: 'animate-none'
            }
        },
        isTriggerDisabled: {
            true: {
                trigger: 'opacity-disabled pointer-events-none'
            },
            false: {}
        }
    },
    defaultVariants: {
        color: 'default',
        radius: 'lg',
        size: 'md',
        shadow: 'md',
        backdrop: 'transparent',
        triggerScaleOnOpen: true
    },
    compoundVariants: [
        // backdrop (opaque/blur)
        {
            backdrop: ['opaque', 'blur'],
            class: {
                backdrop: 'block w-full h-full fixed inset-0 -z-30'
            }
        }
    ]
});

export type PopoverVariantProps = VariantProps<typeof popover>;
