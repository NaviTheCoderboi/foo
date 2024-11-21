import type { ReadableProp } from './utils';

/** Any focusable element, including both HTML and SVG elements. */
export interface FocusableElement extends Element, HTMLOrSVGElement {}

export interface DOMProps {
    /**
     * The element's unique identifier. See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id).
     */
    id?: ReadableProp<string | undefined>;
}

export interface FocusableDOMProps extends DOMProps {
    /**
     * Whether to exclude the element from the sequential tab order. If true,
     * the element will not be focusable via the keyboard by tabbing. This should
     * be avoided except in rare scenarios where an alternative means of accessing
     * the element or its functionality via the keyboard is available.
     */
    excludeFromTabOrder?: ReadableProp<boolean>;
}
