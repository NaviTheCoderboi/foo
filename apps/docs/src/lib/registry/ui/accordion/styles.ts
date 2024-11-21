import type { VariantProps } from 'tailwind-variants';
import { tv } from '../../utils/cn';
import { focusVisibleClasses } from '../../utils/classes/utils';

export const accordion = tv({
    base: 'px-2',
    variants: {
        variant: {
            light: '',
            shadow: 'px-4 shadow-lg rounded-lg bg-content1',
            bordered: 'px-4 border-2 border-divider rounded-lg',
            splitted: 'flex flex-col gap-2'
        },
        fullWidth: {
            true: 'w-full'
        }
    },
    defaultVariants: {
        variant: 'light',
        fullWidth: true
    }
});

export const accordionItem = tv({
    slots: {
        base: '',
        heading: '',
        trigger: [
            'flex py-4 w-full h-full gap-3 items-center tap-highlight-transparent',
            // focus ring
            ...focusVisibleClasses
        ],
        startContent: 'shrink-0',
        indicator: 'text-default-400 [&>svg]:size-5!',
        titleWrapper: 'flex-1 flex flex-col text-start',
        title: 'text-foregrounsd text-lg',
        subtitle: 'text-sm text-foreground-500 font-normal',
        // content: 'py-2 overflow-hidden'
        content: 'overflow-hidden'
    },
    variants: {
        variant: {
            splitted: {
                base: 'px-4 bg-content1 shadow-lg rounded-lg'
            }
        },
        isCompact: {
            true: {
                trigger: 'py-2',
                title: 'text-lg',
                subtitle: 'text-sm',
                indicator: '[&>svg]:size-4!'
                // content: 'py-1'
            }
        },
        disabled: {
            true: {
                base: 'opacity-disabled pointer-events-none'
            }
        },
        hideIndicator: {
            true: {
                indicator: 'hidden'
            }
        },
        disableAnimation: {
            true: {
                content: 'hidden data-[state=open]:block'
            },
            false: {
                indicator: 'transition-transform duration-300',
                trigger: 'transition-opacity',
                content:
                    'data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down'
            }
        },
        disableIndicatorAnimation: {
            true: {
                indicator: 'transition-none'
            },
            false: {
                indicator: 'rtl:-rotate-180',
                trigger:
                    '[&[data-state=open]>span]:-rotate-90 rtl:[&[data-state=open]>span]:-rotate-90'
            }
        }
    },
    defaultVariants: {
        size: 'md',
        radius: 'lg',
        disabled: false,
        hideIndicator: false,
        disableIndicatorAnimation: false
    }
});

export type AccordionItemVariantProps = VariantProps<typeof accordionItem>;
export type AccordionVariantProps = VariantProps<typeof accordion>;
