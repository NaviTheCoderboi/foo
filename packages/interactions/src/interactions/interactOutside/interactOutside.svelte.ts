import { box, type ReadableBox } from 'svelte-toolbelt';
import type { ReadableProp } from '../../types/utils';
import { getOwnerDocument } from '../../utils/domHelpers';

export interface InteractOutsideProps<T extends Element = Element> {
    ref: ReadableProp<T>;
    onInteractOutside?: (e: PointerEvent) => void;
    onInteractOutsideStart?: (e: PointerEvent) => void;
    /** Whether the interact outside events should be disabled. */
    isDisabled?: ReadableProp<boolean>;
}

/**
 * Used in components like Dialogs and Popovers so they can close
 * when a user clicks outside them.
 */
export class InteractOutside<T extends Element = Element> {
    #ref: ReadableBox<T>;
    #isDisabled: ReadableBox<boolean>;
    #onInteractOutside: InteractOutsideProps<T>['onInteractOutside'];
    #onInteractOutsideStart: InteractOutsideProps<T>['onInteractOutsideStart'];

    constructor(props: InteractOutsideProps<T>) {
        const {
            ref,
            onInteractOutside,
            onInteractOutsideStart,
            isDisabled = false
        } = props;

        this.#ref = box.from(ref);
        this.#isDisabled = box.from(isDisabled);
        this.#onInteractOutside = onInteractOutside;
        this.#onInteractOutsideStart = onInteractOutsideStart;
    }

    get ref() {
        return this.#ref.current;
    }

    get isDisabled() {
        return this.#isDisabled.current;
    }

    static isValidEvent(
        event: PointerEvent | MouseEvent | TouchEvent,
        ref: Element | null
    ) {
        const target = event.target as HTMLElement | null;

        // @ts-ignore
        if (event.button > 0) {
            return false;
        }

        if (target) {
            const ownerDocument = target.ownerDocument;
            if (
                !ownerDocument ||
                !ownerDocument.documentElement.contains(target)
            ) {
                return false;
            }
        }

        return ref && !ref.contains(target);
    }

    initialize() {
        const stateRef = {
            isPointerDown: false,
            ignoreEmulatedMouseEvents: false
        };

        const onPointerDown = (e: PointerEvent) => {
            if (
                this.#onInteractOutside &&
                InteractOutside.isValidEvent(e, this.#ref.current)
            ) {
                if (this.#onInteractOutsideStart) {
                    this.#onInteractOutsideStart(e);
                }
                stateRef.isPointerDown = true;
            }
        };

        const triggerInteractOutside = (e: PointerEvent) => {
            if (this.#onInteractOutside) {
                this.#onInteractOutside(e);
            }
        };

        $effect(() => {
            if (this.isDisabled) {
                return;
            }

            const documentObject = getOwnerDocument(this.#ref.current);

            if (typeof PointerEvent !== 'undefined') {
                const onPointerUp = (e: PointerEvent) => {
                    if (
                        stateRef.isPointerDown &&
                        InteractOutside.isValidEvent(e, this.#ref.current)
                    ) {
                        triggerInteractOutside(e);
                    }
                    stateRef.isPointerDown = false;
                };

                documentObject.addEventListener(
                    'pointerdown',
                    onPointerDown,
                    true
                );
                documentObject.addEventListener('pointerup', onPointerUp, true);

                return () => {
                    documentObject.removeEventListener(
                        'pointerdown',
                        onPointerDown,
                        true
                    );
                    documentObject.removeEventListener(
                        'pointerup',
                        onPointerUp,
                        true
                    );
                };
            }

            const onMouseUp = (e: MouseEvent) => {
                if (stateRef.ignoreEmulatedMouseEvents) {
                    stateRef.ignoreEmulatedMouseEvents = false;
                } else if (
                    stateRef.isPointerDown &&
                    InteractOutside.isValidEvent(e, this.#ref.current)
                ) {
                    // @ts-ignore
                    triggerInteractOutside(e);
                }
                stateRef.isPointerDown = false;
            };

            const onTouchEnd = (e: TouchEvent) => {
                stateRef.ignoreEmulatedMouseEvents = true;
                if (
                    stateRef.isPointerDown &&
                    InteractOutside.isValidEvent(e, this.#ref.current)
                ) {
                    // @ts-ignore
                    triggerInteractOutside(e);
                }
                stateRef.isPointerDown = false;
            };

            // @ts-ignore
            documentObject.addEventListener('mousedown', onPointerDown, true);
            documentObject.addEventListener('mouseup', onMouseUp, true);
            // @ts-ignore
            documentObject.addEventListener('touchstart', onPointerDown, true);
            documentObject.addEventListener('touchend', onTouchEnd, true);

            return () => {
                documentObject.removeEventListener(
                    'mousedown',
                    // @ts-ignore
                    onPointerDown,
                    true
                );
                documentObject.removeEventListener('mouseup', onMouseUp, true);
                documentObject.removeEventListener(
                    'touchstart',
                    // @ts-ignore
                    onPointerDown,
                    true
                );
                documentObject.removeEventListener(
                    'touchend',
                    onTouchEnd,
                    true
                );
            };
        });
    }

    static action(
        node: Element,
        props: Omit<InteractOutsideProps, 'ref'> = {}
    ) {
        const interactOutside = new InteractOutside({
            ref: node,
            ...props
        });

        interactOutside.initialize();
    }
}
