/**
 * focus classNames when the element is focused by keyboard.
 */
export const focusVisibleClasses = [
    'outline-focus',
    'focus-visible:z-10',
    'focus-visible:outline-2',
    'focus-visible:outline-offset-2'
];

export const groupFocusVisibleClasses = [
    'ring-focus',
    'group-focus-visible:z-10',
    'group-focus-visible:ring-2',
    'group-focus-visible:ring-offset-2',
    'group-focus-visible:ring-offset-background'
];

export const ringClasses = [
    'outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-focus',
    'focus-visible:ring-offset-2',
    'focus-visible:ring-offset-background'
];

/**
 * This classes centers the element by using absolute positioning.
 */
export const translateCenterClasses = [
    'absolute',
    'top-1/2',
    'left-1/2',
    '-translate-x-1/2',
    '-translate-y-1/2'
];

export const absoluteFullClasses = ['absolute', 'inset-0'];

/**
 * This object defines CSS classes for collapsing adjacent variant borders.
 * It includes classes for different variants like default, primary, secondary, etc.
 */
export const collapseAdjacentVariantBorders = {
    default: [
        '[&+.border-2.border-default]:ms-[calc(theme(borderWidth.2)*-1)]'
    ],
    primary: [
        '[&+.border-2.border-primary]:ms-[calc(theme(borderWidth.2)*-1)]'
    ],
    secondary: [
        '[&+.border-2.border-secondary]:ms-[calc(theme(borderWidth.2)*-1)]'
    ],
    success: [
        '[&+.border-2.border-success]:ms-[calc(theme(borderWidth.2)*-1)]'
    ],
    warning: [
        '[&+.border-2.border-warning]:ms-[calc(theme(borderWidth.2)*-1)]'
    ],
    danger: ['[&+.border-2.border-danger]:ms-[calc(theme(borderWidth.2)*-1)]']
};
