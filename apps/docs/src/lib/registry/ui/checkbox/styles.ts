import { focusVisibleClasses } from '@utils/classes/utils';
import { tv } from '@utils/cn';
import type { VariantProps } from 'tailwind-variants';

export const checkbox = tv({
    slots: {
        base: 'group relative max-w-fit inline-flex items-center justify-start cursor-pointer tap-highlight-transparent p-2 -m-2 select-none',
        wrapper: [
            'relative',
            'inline-flex',
            'items-center',
            'justify-center',
            'flex-shrink-0',
            'overflow-hidden',
            'cursor-pointer',
            // before
            "before:content-['']",
            'before:absolute',
            'before:inset-0',
            'before:border-solid',
            'before:border-2',
            'before:box-border',
            'before:border-default',
            // after
            "after:content-['']",
            'after:absolute',
            'after:inset-0',
            'after:scale-40',
            'after:opacity-0',
            'after:origin-center',
            'group-data-[selected=true]:after:scale-100',
            'group-data-[selected=true]:after:opacity-100',
            // hover
            'group-hover:before:bg-default-100',
            // focus ring
            ...focusVisibleClasses
        ],
        icon: 'z-10 w-4 h-3 opacity-0 group-data-[selected=true]:opacity-100',
        label: 'relative text-foreground select-none'
    },
    variants: {
        color: {
            default: {
                wrapper:
                    'after:bg-default after:text-default-foreground text-default-foreground'
            },
            primary: {
                wrapper:
                    'after:bg-primary after:text-primary-foreground text-primary-foreground'
            },
            secondary: {
                wrapper:
                    'after:bg-secondary after:text-secondary-foreground text-secondary-foreground'
            },
            success: {
                wrapper:
                    'after:bg-success after:text-success-foreground text-success-foreground'
            },
            warning: {
                wrapper:
                    'after:bg-warning after:text-warning-foreground text-warning-foreground'
            },
            danger: {
                wrapper:
                    'after:bg-danger after:text-danger-foreground text-danger-foreground'
            }
        },
        size: {
            sm: {
                wrapper: [
                    'w-4 h-4 mr-2 rtl:ml-2 rtl:mr-[unset]',
                    'rounded-[calc(theme(borderRadius.lg)*0.5)]',
                    'before:rounded-[calc(theme(borderRadius.lg)*0.5)]',
                    'after:rounded-[calc(theme(borderRadius.lg)*0.5)]'
                ],
                label: 'text-base',
                icon: 'w-3 h-2'
            },
            md: {
                wrapper: [
                    'w-5 h-5 mr-2 rtl:ml-2 rtl:mr-[unset]',
                    'rounded-[calc(theme(borderRadius.lg)*0.6)]',
                    'before:rounded-[calc(theme(borderRadius.lg)*0.6)]',
                    'after:rounded-[calc(theme(borderRadius.lg)*0.6)]'
                ],
                label: 'text-lg',
                icon: 'w-4 h-3'
            },
            lg: {
                wrapper: [
                    'w-6 h-6 mr-2 rtl:ml-2 rtl:mr-[unset]',
                    'rounded-[calc(theme(borderRadius.lg)*0.7)]',
                    'before:rounded-[calc(theme(borderRadius.lg)*0.7)]',
                    'after:rounded-[calc(theme(borderRadius.lg)*0.7)]'
                ],
                label: 'text-xl',
                icon: 'w-5 h-4'
            }
        },
        radius: {
            none: {
                wrapper: 'rounded-none before:rounded-none after:rounded-none'
            },
            sm: {
                wrapper: [
                    'rounded-[calc(theme(borderRadius.medium)*0.5)]',
                    'before:rounded-[calc(theme(borderRadius.medium)*0.5)]',
                    'after:rounded-[calc(theme(borderRadius.medium)*0.5)]'
                ]
            },
            md: {
                wrapper: [
                    'rounded-[calc(theme(borderRadius.lg)*0.6)]',
                    'before:rounded-[calc(theme(borderRadius.lg)*0.6)]',
                    'after:rounded-[calc(theme(borderRadius.lg)*0.6)]'
                ]
            },
            lg: {
                wrapper: [
                    'rounded-[calc(theme(borderRadius.lg)*0.7)]',
                    'before:rounded-[calc(theme(borderRadius.lg)*0.7)]',
                    'after:rounded-[calc(theme(borderRadius.lg)*0.7)]'
                ]
            },
            full: {
                wrapper: 'rounded-full before:rounded-full after:rounded-full'
            }
        },
        lineThrough: {
            true: {
                label: [
                    'inline-flex',
                    'items-center',
                    'justify-center',
                    "before:content-['']",
                    'before:absolute',
                    'before:bg-foreground',
                    'before:w-0',
                    'before:h-0.5',
                    'group-data-[selected=true]:opacity-60',
                    'group-data-[selected=true]:before:w-full'
                ]
            }
        },
        disabled: {
            true: {
                base: 'opacity-disabled pointer-events-none'
            }
        },
        isInvalid: {
            true: {
                wrapper: 'before:border-danger',
                label: 'text-danger'
            }
        },
        disableAnimation: {
            true: {
                wrapper: 'transition-none',
                icon: 'transition-none',
                label: 'transition-none'
            },
            false: {
                wrapper: [
                    'before:transition-colors',
                    'active:scale-95',
                    'transition-transform',
                    'after:transition-transform-opacity',
                    'after:!ease-linear',
                    'after:!duration-200',
                    'motion-reduce:transition-none'
                ],
                icon: 'transition-opacity motion-reduce:transition-none',
                label: 'transition-colors-opacity before:transition-width motion-reduce:transition-none'
            }
        }
    },
    defaultVariants: {
        color: 'primary',
        size: 'md',
        disabled: false,
        lineThrough: false,
        disableAnimation: false
    }
});

export const checkboxGroup = tv({
    slots: {
        base: 'relative flex flex-col gap-2',
        label: 'relative text-lg text-foreground-500',
        wrapper:
            'flex flex-col flex-wrap gap-2 data-[orientation=horizontal]:flex-row',
        description: 'text-base text-foreground-400',
        errorMessage: 'text-base text-danger'
    },
    variants: {
        required: {
            true: {
                label: "after:content-['*'] after:text-danger after:ml-0.5"
            }
        },
        isInvalid: {
            true: {
                description: 'text-danger'
            }
        },
        disableAnimation: {
            true: {},
            false: {
                description:
                    'transition-colors !duration-150 motion-reduce:transition-none'
            }
        }
    },
    defaultVariants: {
        isInvalid: false,
        required: false
    }
});

export type CheckboxVariantProps = VariantProps<typeof checkbox>;
export type CheckboxGroupVariantProps = VariantProps<typeof checkboxGroup>;