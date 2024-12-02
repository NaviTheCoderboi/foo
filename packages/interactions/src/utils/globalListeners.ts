import { onMount } from 'svelte';

interface IGlobalListeners {
    addGlobalListener<K extends keyof DocumentEventMap>(
        el: EventTarget,
        type: K,
        listener: (this: Document, ev: DocumentEventMap[K]) => any,
        options?: boolean | AddEventListenerOptions
    ): void;
    addGlobalListener(
        el: EventTarget,
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | AddEventListenerOptions
    ): void;
    removeGlobalListener<K extends keyof DocumentEventMap>(
        el: EventTarget,
        type: K,
        listener: (this: Document, ev: DocumentEventMap[K]) => any,
        options?: boolean | EventListenerOptions
    ): void;
    removeGlobalListener(
        el: EventTarget,
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | EventListenerOptions
    ): void;
    removeAllGlobalListeners(): void;
}

export class GlobalListeners implements IGlobalListeners {
    #globalListeners = new Map<
        EventListenerOrEventListenerObject,
        {
            type: string;
            eventTarget: EventTarget;
            fn: EventListenerOrEventListenerObject;
            options?: boolean | AddEventListenerOptions;
        }
    >();

    constructor() {
        onMount(() => {
            return this.removeAllGlobalListeners.bind(this);
        });
    }

    addGlobalListener<K extends keyof DocumentEventMap>(
        el: EventTarget,
        type: K,
        listener: (this: Document, ev: DocumentEventMap[K]) => any,
        options?: boolean | AddEventListenerOptions
    ): void;
    addGlobalListener(
        el: EventTarget,
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | AddEventListenerOptions
    ): void;
    addGlobalListener(
        el: EventTarget,
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | AddEventListenerOptions
    ): void {
        const fn = (typeof options === 'boolean' ? {} : options)?.once
            ? (...args: any[]) => {
                  this.#globalListeners.delete(listener);
                  // @ts-ignore
                  listener(...args);
              }
            : listener;

        this.#globalListeners.set(listener, {
            type,
            eventTarget: el,
            fn,
            options
        });
        el.addEventListener(type, listener, options);
    }

    removeGlobalListener<K extends keyof DocumentEventMap>(
        el: EventTarget,
        type: K,
        listener: (this: Document, ev: DocumentEventMap[K]) => any,
        options?: boolean | EventListenerOptions
    ): void;
    removeGlobalListener(
        el: EventTarget,
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | EventListenerOptions
    ): void;
    removeGlobalListener(
        el: EventTarget,
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | EventListenerOptions
    ): void {
        const fn = this.#globalListeners.get(listener)?.fn || listener;
        el.removeEventListener(type, fn, options);
        this.#globalListeners.delete(listener);
    }

    removeAllGlobalListeners() {
        for (const [key, value] of this.#globalListeners ?? new Map()) {
            this.removeGlobalListener(
                value.eventTarget,
                value.type,
                key,
                value.options
            );
        }
    }
}
