import { colorVariants } from '@utils/classes/variants';
import {
    focusVisibleClasses,
    translateCenterClasses
} from '@utils/classes/utils';
import { tv } from '@utils/cn';
import type { VariantProps } from 'tailwind-variants';

export const avatar = tv({
    slots: {
        base: [
            'flex',
            'relative',
            'justify-center',
            'items-center',
            'box-border',
            'overflow-hidden',
            'align-middle',
            'text-white',
            'z-0',
            // focus ring
            ...focusVisibleClasses
        ],
        img: [
            'flex',
            'object-cover',
            'w-full',
            'h-full',
            'transition-opacity',
            '!duration-500',
            'opacity-0',
            'data-[status=loaded]:opacity-100'
        ],
        fallback: [
            ...translateCenterClasses,
            'flex',
            'items-center',
            'justify-center'
        ],
        name: [
            ...translateCenterClasses,
            'font-normal',
            'text-center',
            'text-inherit'
        ],
        icon: [
            ...translateCenterClasses,
            'flex',
            'items-center',
            'justify-center',
            'text-inherit',
            'w-full',
            'h-full'
        ]
    },
    variants: {
        size: {
            sm: {
                base: 'w-8 h-8 text-sm'
            },
            md: {
                base: 'w-10 h-10 text-base'
            },
            lg: {
                base: 'w-14 h-14 text-lg'
            }
        },
        color: {
            default: {
                base: colorVariants.solid.default
            },
            primary: {
                base: colorVariants.solid.primary
            },
            secondary: {
                base: colorVariants.solid.secondary
            },
            success: {
                base: colorVariants.solid.success
            },
            warning: {
                base: colorVariants.solid.warning
            },
            danger: {
                base: colorVariants.solid.danger
            }
        },
        radius: {
            none: {
                base: 'rounded-none'
            },
            sm: {
                base: 'rounded-md'
            },
            md: {
                base: 'rounded-lg'
            },
            lg: {
                base: 'rounded-xl'
            },
            full: {
                base: 'rounded-full'
            }
        },
        isBordered: {
            true: {
                base: 'ring-2 ring-offset-2 ring-offset-background'
            }
        },
        disabled: {
            true: {
                base: 'opacity-disabled'
            }
        },
        isInGroup: {
            true: {
                base: [
                    '-ms-2 hover:-translate-x-3 rtl:hover:translate-x-3 transition-transform',
                    'focus-visible:-translate-x-3 rtl:focus-visible:translate-x-3'
                ]
            }
        },
        isInGridGroup: {
            true: {
                base: 'm-0 hover:translate-x-0'
            }
        },
        disableAnimation: {
            true: {
                base: 'transition-none',
                img: 'transition-none'
            },
            false: {}
        }
    },
    defaultVariants: {
        size: 'md',
        color: 'default',
        radius: 'full'
    },
    compoundVariants: [
        {
            color: 'default',
            isBordered: true,
            class: {
                base: 'ring-default'
            }
        },
        {
            color: 'primary',
            isBordered: true,
            class: {
                base: 'ring-primary'
            }
        },
        {
            color: 'secondary',
            isBordered: true,
            class: {
                base: 'ring-secondary'
            }
        },
        {
            color: 'success',
            isBordered: true,
            class: {
                base: 'ring-success'
            }
        },
        {
            color: 'warning',
            isBordered: true,
            class: {
                base: 'ring-warning'
            }
        },
        {
            color: 'danger',
            isBordered: true,
            class: {
                base: 'ring-danger'
            }
        }
    ]
});

export const avatarGroup = tv({
    // slots: {
    base: 'flex items-center justify-center h-auto w-max',
    // count: 'hover:-translate-x-0'
    // },
    variants: {
        isGrid: {
            true: 'inline-grid grid-cols-4 gap-3'
        }
    }
});

export type AvatarVariantProps = VariantProps<typeof avatar>;
export type AvatarGroupVariantProps = VariantProps<typeof avatarGroup>;
