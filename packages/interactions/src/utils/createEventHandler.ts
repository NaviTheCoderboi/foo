import type { FocusableElement } from '../types/dom';
import type { BaseEvent } from '../types/events';

const copyEvent = (e: Event, extraProps: Record<string, any> = {}) => {
    const clone: Record<string, any> = {};

    for (const prop in e) {
        const d = Object.getOwnPropertyDescriptor(e, prop);
        if (d && (d.get || d.set)) {
            Object.defineProperty(clone, prop, d);
        } else {
            clone[prop] = e[prop as keyof typeof e];
        }
    }

    for (const prop in extraProps) {
        const d = Object.getOwnPropertyDescriptor(extraProps, prop);
        if (d && (d.get || d.set)) {
            Object.defineProperty(clone, prop, d);
        } else {
            clone[prop] = extraProps[prop];
        }
    }

    Object.setPrototypeOf(clone, e);

    return clone;
};

/**
 * This function wraps a event handler to make stopPropagation the default, and support continuePropagation instead.
 */
export const createEventHandler = <
    E extends Event,
    T extends FocusableElement = FocusableElement
>(
    handler?: (e: BaseEvent<E, T>) => void
): ((e: E) => void) | undefined => {
    if (!handler) {
        return undefined;
    }

    let shouldStopPropagation = true;

    return (e: E) => {
        const event = copyEvent(e, {
            preventDefault() {
                e.preventDefault();
            },
            isDefaultPrevented() {
                return e.defaultPrevented;
            },
            stopPropagation() {
                console.error(
                    'stopPropagation is now the default behavior for events in headlessui-svelte. You can use continuePropagation() to revert this behavior.'
                );
            },
            continuePropagation() {
                shouldStopPropagation = false;
            }
        }) as BaseEvent<E, T>;

        handler(event);

        if (shouldStopPropagation) {
            e.stopPropagation();
        }
    };
};
