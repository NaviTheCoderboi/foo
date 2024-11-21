import { onMount } from 'svelte';

export class BlurEvent {
    #onBlur: (e: FocusEvent) => void;
    #stateRef = $state<{
        isFocused: boolean;
        observer: MutationObserver | null;
    }>({
        isFocused: false,
        observer: null
    });

    constructor(onBlur: (e: FocusEvent) => void) {
        this.#onBlur = onBlur;

        onMount(() => {
            return () => this.cleanup();
        });
    }

    private cleanup() {
        if (this.#stateRef.observer) {
            this.#stateRef.observer.disconnect();
            this.#stateRef.observer = null;
        }
    }

    private dispatchBlur(e: FocusEvent) {
        this.#onBlur?.(e);
    }

    get focusState() {
        return this.#stateRef as { isFocused: boolean };
    }

    handler(e: FocusEvent) {
        if (
            e.target instanceof HTMLButtonElement ||
            e.target instanceof HTMLInputElement ||
            e.target instanceof HTMLTextAreaElement ||
            e.target instanceof HTMLSelectElement
        ) {
            this.#stateRef.isFocused = true;
            const target = e.target;
            const onBlurHandler: EventListenerOrEventListenerObject | null = (
                e
            ) => {
                this.#stateRef.isFocused = false;

                if (target.disabled) {
                    this.dispatchBlur(new FocusEvent('blur', e as FocusEvent));
                }

                if (this.#stateRef.observer) {
                    this.#stateRef.observer.disconnect();
                    this.#stateRef.observer = null;
                }
            };

            target.addEventListener('focusout', onBlurHandler, {
                once: true
            });

            this.#stateRef.observer = new MutationObserver(() => {
                if (this.#stateRef.isFocused && target.disabled) {
                    this.#stateRef.observer?.disconnect();
                    const relatedTargetEl =
                        target === document.activeElement
                            ? null
                            : document.activeElement;
                    target.dispatchEvent(
                        new FocusEvent('blur', {
                            relatedTarget: relatedTargetEl
                        })
                    );
                    target.dispatchEvent(
                        new FocusEvent('focusout', {
                            bubbles: true,
                            relatedTarget: relatedTargetEl
                        })
                    );
                }
            });

            this.#stateRef.observer.observe(target, {
                attributes: true,
                attributeFilter: ['disabled']
            });
        }
    }
}
