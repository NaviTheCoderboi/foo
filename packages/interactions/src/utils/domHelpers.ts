/**
 * Get the owner document of a given element
 * @param {Element | null | undefined} el
 * @returns {Document}
 */
export const getOwnerDocument = (el: Element | null | undefined): Document => {
    return el?.ownerDocument ?? document;
};

/**
 * Get the owner window of a given element
 * @param {Window & typeof global | Element | null | undefined} el
 * @returns {Window & typeof global}
 */
export const getOwnerWindow = (
    el: (Window & typeof global) | Element | null | undefined
): Window & typeof global => {
    if (el && 'window' in el && el.window === el) {
        return el;
    }

    const doc = getOwnerDocument(el as Element | null | undefined);
    return doc.defaultView || window;
};
