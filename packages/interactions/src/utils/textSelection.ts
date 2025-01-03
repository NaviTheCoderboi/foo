import { getOwnerDocument } from './domHelpers';
import { isIOS } from './platform';
import { runAfterTransition } from './runAfterTransition';

type State = 'default' | 'disabled' | 'restoring';

let state: State = 'default';
let savedUserSelect = '';
const modifiedElementMap = new WeakMap<Element, string>();

export const disableTextSelection = (target?: Element) => {
    if (isIOS()) {
        if (state === 'default') {
            const documentObject = getOwnerDocument(target);
            savedUserSelect =
                documentObject.documentElement.style.webkitUserSelect;
            documentObject.documentElement.style.webkitUserSelect = 'none';
        }

        state = 'disabled';
    } else if (target instanceof HTMLElement || target instanceof SVGElement) {
        modifiedElementMap.set(target, target.style.userSelect);
        target.style.userSelect = 'none';
    }
};

export const restoreTextSelection = (target?: Element) => {
    if (isIOS()) {
        if (state !== 'disabled') {
            return;
        }

        state = 'restoring';

        setTimeout(() => {
            runAfterTransition(() => {
                if (state === 'restoring') {
                    const documentObject = getOwnerDocument(target);
                    if (
                        documentObject.documentElement.style
                            .webkitUserSelect === 'none'
                    ) {
                        documentObject.documentElement.style.webkitUserSelect =
                            savedUserSelect || '';
                    }

                    savedUserSelect = '';
                    state = 'default';
                }
            });
        }, 300);
    } else if (target instanceof HTMLElement || target instanceof SVGElement) {
        if (modifiedElementMap.has(target)) {
            const targetOldUserSelect = modifiedElementMap.get(
                target
            ) as string;

            if (target.style.userSelect === 'none') {
                target.style.userSelect = targetOldUserSelect;
            }

            if (target.getAttribute('style') === '') {
                target.removeAttribute('style');
            }
            modifiedElementMap.delete(target);
        }
    }
};
