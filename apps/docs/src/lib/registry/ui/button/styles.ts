import type { VariantProps } from 'tailwind-variants';
import {
    collapseAdjacentVariantBorders,
    focusVisibleClasses
} from '../../utils/classes/utils';
import { colorVariants } from '../../utils/classes/variants';
import { tv } from '../../utils/cn';

const button = tv({
    base: [
        'z-0',
        'group',
        'relative',
        'inline-flex',
        'items-center',
        'justify-center',
        'box-border',
        'appearance-none',
        'select-none',
        'whitespace-nowrap',
        'min-w-max',
        'font-normal',
        'subpixel-antialiased',
        'overflow-hidden',
        'tap-highlight-transparent',
        'active:scale-[0.97]',
        // focus ring
        ...focusVisibleClasses
    ],
    variants: {
        variant: {
            solid: '',
            bordered: 'border-2 bg-transparent',
            light: 'bg-transparent',
            flat: '',
            faded: 'border-2',
            shadow: '',
            ghost: 'border-2 bg-transparent'
        },
        size: {
            sm: 'px-3 min-w-16 h-8 text-xs gap-2 rounded-md',
            md: 'px-4 min-w-20 h-10 text-base gap-2 rounded-lg',
            lg: 'px-6 min-w-24 h-12 text-lg gap-3 rounded-xl'
        },
        color: {
            default: '',
            primary: '',
            secondary: '',
            success: '',
            warning: '',
            danger: ''
        },
        radius: {
            none: 'rounded-none',
            sm: 'rounded-md',
            md: 'rounded-lg',
            lg: 'rounded-xl',
            full: 'rounded-full'
        },
        fullWidth: {
            true: 'w-full'
        },
        disabled: {
            true: 'opacity-disabled pointer-events-none'
        },
        isInGroup: {
            true: '[&:not(:first-child):not(:last-child)]:rounded-none'
        },
        isIconOnly: {
            true: 'px-0 !gap-0',
            false: '[&>svg]:max-w-[theme(spacing.8)]'
        },
        disableAnimation: {
            true: '!transition-none active:scale-100',
            false: 'transition-transform-colors-opacity duration-200 motion-reduce:transition-none'
        }
    },
    defaultVariants: {
        size: 'md',
        variant: 'solid',
        color: 'default',
        fullWidth: false,
        disabled: false,
        isInGroup: false
    },
    compoundVariants: [
        // solid / color
        {
            variant: 'solid',
            color: 'default',
            class: colorVariants.solid.default
        },
        {
            variant: 'solid',
            color: 'primary',
            class: colorVariants.solid.primary
        },
        {
            variant: 'solid',
            color: 'secondary',
            class: colorVariants.solid.secondary
        },
        {
            variant: 'solid',
            color: 'success',
            class: colorVariants.solid.success
        },
        {
            variant: 'solid',
            color: 'warning',
            class: colorVariants.solid.warning
        },
        {
            variant: 'solid',
            color: 'danger',
            class: colorVariants.solid.danger
        },
        // shadow / color
        {
            variant: 'shadow',
            color: 'default',
            class: colorVariants.shadow.default
        },
        {
            variant: 'shadow',
            color: 'primary',
            class: colorVariants.shadow.primary
        },
        {
            variant: 'shadow',
            color: 'secondary',
            class: colorVariants.shadow.secondary
        },
        {
            variant: 'shadow',
            color: 'success',
            class: colorVariants.shadow.success
        },
        {
            variant: 'shadow',
            color: 'warning',
            class: colorVariants.shadow.warning
        },
        {
            variant: 'shadow',
            color: 'danger',
            class: colorVariants.shadow.danger
        },
        // bordered / color
        {
            variant: 'bordered',
            color: 'default',
            class: colorVariants.bordered.default
        },
        {
            variant: 'bordered',
            color: 'primary',
            class: colorVariants.bordered.primary
        },
        {
            variant: 'bordered',
            color: 'secondary',
            class: colorVariants.bordered.secondary
        },
        {
            variant: 'bordered',
            color: 'success',
            class: colorVariants.bordered.success
        },
        {
            variant: 'bordered',
            color: 'warning',
            class: colorVariants.bordered.warning
        },
        {
            variant: 'bordered',
            color: 'danger',
            class: colorVariants.bordered.danger
        },
        // flat / color
        {
            variant: 'flat',
            color: 'default',
            class: colorVariants.flat.default
        },
        {
            variant: 'flat',
            color: 'primary',
            class: colorVariants.flat.primary
        },
        {
            variant: 'flat',
            color: 'secondary',
            class: colorVariants.flat.secondary
        },
        {
            variant: 'flat',
            color: 'success',
            class: colorVariants.flat.success
        },
        {
            variant: 'flat',
            color: 'warning',
            class: colorVariants.flat.warning
        },
        {
            variant: 'flat',
            color: 'danger',
            class: colorVariants.flat.danger
        },
        // faded / color
        {
            variant: 'faded',
            color: 'default',
            class: colorVariants.faded.default
        },
        {
            variant: 'faded',
            color: 'primary',
            class: colorVariants.faded.primary
        },
        {
            variant: 'faded',
            color: 'secondary',
            class: colorVariants.faded.secondary
        },
        {
            variant: 'faded',
            color: 'success',
            class: colorVariants.faded.success
        },
        {
            variant: 'faded',
            color: 'warning',
            class: colorVariants.faded.warning
        },
        {
            variant: 'faded',
            color: 'danger',
            class: colorVariants.faded.danger
        },
        // light / color
        {
            variant: 'light',
            color: 'default',
            class: [colorVariants.light.default, 'hover:bg-default/40']
        },
        {
            variant: 'light',
            color: 'primary',
            class: [colorVariants.light.primary, 'hover:bg-primary/20']
        },
        {
            variant: 'light',
            color: 'secondary',
            class: [colorVariants.light.secondary, 'hover:bg-secondary/20']
        },
        {
            variant: 'light',
            color: 'success',
            class: [colorVariants.light.success, 'hover:bg-success/20']
        },
        {
            variant: 'light',
            color: 'warning',
            class: [colorVariants.light.warning, 'hover:bg-warning/20']
        },
        {
            variant: 'light',
            color: 'danger',
            class: [colorVariants.light.danger, 'hover:bg-danger/20']
        },
        // ghost / color
        {
            variant: 'ghost',
            color: 'default',
            class: [colorVariants.ghost.default, 'hover:!bg-default']
        },
        {
            variant: 'ghost',
            color: 'primary',
            class: [
                colorVariants.ghost.primary,
                'hover:!bg-primary hover:!text-primary-foreground'
            ]
        },
        {
            variant: 'ghost',
            color: 'secondary',
            class: [
                colorVariants.ghost.secondary,
                'hover:!bg-secondary hover:!text-secondary-foreground'
            ]
        },
        {
            variant: 'ghost',
            color: 'success',
            class: [
                colorVariants.ghost.success,
                'hover:!bg-success hover:!text-success-foreground'
            ]
        },
        {
            variant: 'ghost',
            color: 'warning',
            class: [
                colorVariants.ghost.warning,
                'hover:!bg-warning hover:!text-warning-foreground'
            ]
        },
        {
            variant: 'ghost',
            color: 'danger',
            class: [
                colorVariants.ghost.danger,
                'hover:!bg-danger hover:!text-danger-foreground'
            ]
        },
        // isInGroup / radius / size <-- radius not provided
        {
            isInGroup: true,
            class: 'rounded-none first:rounded-s-lg last:rounded-e-lg'
        },
        {
            isInGroup: true,
            size: 'sm',
            class: 'rounded-none first:rounded-s-md last:rounded-e-md'
        },
        {
            isInGroup: true,
            size: 'md',
            class: 'rounded-none first:rounded-s-lg last:rounded-e-lg'
        },
        {
            isInGroup: true,
            size: 'lg',
            class: 'rounded-none first:rounded-s-xl last:rounded-e-xl'
        },
        {
            isInGroup: true,
            isRounded: true,
            class: 'rounded-none first:rounded-s-full last:rounded-e-full'
        },
        // isInGroup / radius <-- radius provided
        {
            isInGroup: true,
            radius: 'none',
            class: 'rounded-none first:rounded-s-none last:rounded-e-none'
        },
        {
            isInGroup: true,
            radius: 'sm',
            class: 'rounded-none first:rounded-s-md last:rounded-e-md'
        },
        {
            isInGroup: true,
            radius: 'md',
            class: 'rounded-none first:rounded-s-lg last:rounded-e-lg'
        },
        {
            isInGroup: true,
            radius: 'lg',
            class: 'rounded-none first:rounded-s-xl last:rounded-e-xl'
        },
        {
            isInGroup: true,
            radius: 'full',
            class: 'rounded-none first:rounded-s-full last:rounded-e-full'
        },
        // isInGroup / bordered / ghost
        {
            isInGroup: true,
            variant: ['ghost', 'bordered'],
            color: 'default',
            className: collapseAdjacentVariantBorders.default
        },
        {
            isInGroup: true,
            variant: ['ghost', 'bordered'],
            color: 'primary',
            className: collapseAdjacentVariantBorders.primary
        },
        {
            isInGroup: true,
            variant: ['ghost', 'bordered'],
            color: 'secondary',
            className: collapseAdjacentVariantBorders.secondary
        },
        {
            isInGroup: true,
            variant: ['ghost', 'bordered'],
            color: 'success',
            className: collapseAdjacentVariantBorders.success
        },
        {
            isInGroup: true,
            variant: ['ghost', 'bordered'],
            color: 'warning',
            className: collapseAdjacentVariantBorders.warning
        },
        {
            isInGroup: true,
            variant: ['ghost', 'bordered'],
            color: 'danger',
            className: collapseAdjacentVariantBorders.danger
        },
        {
            isIconOnly: true,
            size: 'sm',
            class: 'min-w-8 w-8 h-8'
        },
        {
            isIconOnly: true,
            size: 'md',
            class: 'min-w-10 w-10 h-10'
        },
        {
            isIconOnly: true,
            size: 'lg',
            class: 'min-w-12 w-12 h-12'
        },
        // variant / hover
        {
            variant: ['solid', 'faded', 'flat', 'bordered', 'shadow'],
            class: 'hover:opacity-hover'
        }
    ]
});

/**
 * ButtonGroup wrapper **Tailwind Variants** component
 *
 */
const buttonGroup = tv({
    base: 'inline-flex items-center justify-center h-auto',
    variants: {
        fullWidth: {
            true: 'w-full'
        }
    },
    defaultVariants: {
        fullWidth: false
    }
});

export type ButtonGroupVariantProps = VariantProps<typeof buttonGroup>;
export type ButtonVariantProps = VariantProps<typeof button>;

export { button, buttonGroup };
