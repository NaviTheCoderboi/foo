import { isAndroid } from './platform';

export const isVirtualClick = (event: MouseEvent | PointerEvent): boolean => {
    if ((event as any).mozInputSource === 0 && event.isTrusted) {
        return true;
    }

    if (isAndroid() && (event as PointerEvent).pointerType) {
        return event.type === 'click' && event.buttons === 1;
    }

    return event.detail === 0 && !(event as PointerEvent).pointerType;
};

export const isVirtualPointerEvent = (event: PointerEvent) => {
    return (
        (!isAndroid() && event.width === 0 && event.height === 0) ||
        (event.width === 1 &&
            event.height === 1 &&
            event.pressure === 0 &&
            event.detail === 0 &&
            event.pointerType === 'mouse')
    );
};
