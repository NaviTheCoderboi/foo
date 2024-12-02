import type { Action } from 'svelte/action';
import type { MoveEvents, PointerType } from '../../types/events';
import { GlobalListeners } from '../../utils/globalListeners';
import {
    disableTextSelection,
    restoreTextSelection
} from '../../utils/textSelection';
import { createAction } from '../../utils/action';

interface EventBase {
    shiftKey: boolean;
    ctrlKey: boolean;
    metaKey: boolean;
    altKey: boolean;
}

/**
 * Handles move interactions across mouse, touch, and keyboard, including dragging with
 * the mouse or touch, and using the arrow keys. Normalizes behavior across browsers and
 * platforms, and ignores emulated mouse events on touch devices.
 */
export class Move {
    #onMoveStart: MoveEvents['onMoveStart'];
    #onMove: MoveEvents['onMove'];
    #onMoveEnd: MoveEvents['onMoveEnd'];
    #moveState = $state<{
        didMove: boolean;
        lastPosition: { pageX: number; pageY: number } | null;
        id: number | null;
    }>({ didMove: false, lastPosition: null, id: null });
    action: Action<Element>;

    constructor(props: MoveEvents = {}) {
        const { onMoveStart, onMove, onMoveEnd } = props;

        this.#onMoveStart = onMoveStart;
        this.#onMove = onMove;
        this.#onMoveEnd = onMoveEnd;

        this.action = createAction(this.handlers());
    }

    get moveState() {
        return this.#moveState;
    }

    handlers() {
        const globalListeners = new GlobalListeners();

        const move = (
            originalEvent: EventBase,
            pointerType: PointerType,
            deltaX: number,
            deltaY: number
        ) => {
            if (deltaX === 0 && deltaY === 0) {
                return;
            }

            if (!this.#moveState.didMove) {
                this.#moveState.didMove = true;
                this.#onMoveStart?.({
                    type: 'movestart',
                    pointerType,
                    shiftKey: originalEvent.shiftKey,
                    metaKey: originalEvent.metaKey,
                    ctrlKey: originalEvent.ctrlKey,
                    altKey: originalEvent.altKey
                });
            }
            this.#onMove?.({
                type: 'move',
                pointerType,
                deltaX: deltaX,
                deltaY: deltaY,
                shiftKey: originalEvent.shiftKey,
                metaKey: originalEvent.metaKey,
                ctrlKey: originalEvent.ctrlKey,
                altKey: originalEvent.altKey
            });
        };

        const end = (originalEvent: EventBase, pointerType: PointerType) => {
            restoreTextSelection();
            if (this.#moveState.didMove) {
                this.#onMoveEnd?.({
                    type: 'moveend',
                    pointerType,
                    shiftKey: originalEvent.shiftKey,
                    metaKey: originalEvent.metaKey,
                    ctrlKey: originalEvent.ctrlKey,
                    altKey: originalEvent.altKey
                });
            }
        };

        const moveProps: {
            mousedown?: (e: MouseEvent) => void;
            touchstart?: (e: TouchEvent) => void;
            pointerdown?: (e: PointerEvent) => void;
            keydown?: (e: KeyboardEvent) => void;
        } = {};

        const start = () => {
            disableTextSelection();
            this.#moveState.didMove = false;
        };

        if (typeof PointerEvent === 'undefined') {
            const onMouseMove = (e: MouseEvent) => {
                if (e.button === 0) {
                    move(
                        e,
                        'mouse',
                        e.pageX - (this.#moveState.lastPosition?.pageX ?? 0),
                        e.pageY - (this.#moveState.lastPosition?.pageY ?? 0)
                    );
                    this.#moveState.lastPosition = {
                        pageX: e.pageX,
                        pageY: e.pageY
                    };
                }
            };
            const onMouseUp = (e: MouseEvent) => {
                if (e.button === 0) {
                    end(e, 'mouse');
                    globalListeners.removeGlobalListener(
                        window,
                        'mousemove',
                        onMouseMove,
                        false
                    );
                    globalListeners.removeGlobalListener(
                        window,
                        'mouseup',
                        onMouseUp,
                        false
                    );
                }
            };
            moveProps.mousedown = (e) => {
                if (e.button === 0) {
                    start();
                    e.stopPropagation();
                    e.preventDefault();
                    this.#moveState.lastPosition = {
                        pageX: e.pageX,
                        pageY: e.pageY
                    };
                    globalListeners.addGlobalListener(
                        window,
                        'mousemove',
                        onMouseMove,
                        false
                    );
                    globalListeners.addGlobalListener(
                        window,
                        'mouseup',
                        onMouseUp,
                        false
                    );
                }
            };
            const onTouchMove = (e: TouchEvent) => {
                const touch = [...e.changedTouches].findIndex(
                    ({ identifier }) => identifier === this.#moveState.id
                );
                if (touch >= 0) {
                    const { pageX, pageY } = e.changedTouches[touch];
                    move(
                        e,
                        'touch',
                        pageX - (this.#moveState.lastPosition?.pageX ?? 0),
                        pageY - (this.#moveState.lastPosition?.pageY ?? 0)
                    );
                    this.#moveState.lastPosition = { pageX, pageY };
                }
            };
            const onTouchEnd = (e: TouchEvent) => {
                const touch = [...e.changedTouches].findIndex(
                    ({ identifier }) => identifier === this.#moveState.id
                );
                if (touch >= 0) {
                    end(e, 'touch');
                    this.#moveState.id = null;
                    globalListeners.removeGlobalListener(
                        window,
                        'touchmove',
                        onTouchMove
                    );
                    globalListeners.removeGlobalListener(
                        window,
                        'touchend',
                        onTouchEnd
                    );
                    globalListeners.removeGlobalListener(
                        window,
                        'touchcancel',
                        onTouchEnd
                    );
                }
            };
            moveProps.touchstart = (e) => {
                if (
                    e.changedTouches.length === 0 ||
                    this.#moveState.id != null
                ) {
                    return;
                }

                const { pageX, pageY, identifier } = e.changedTouches[0];
                start();
                e.stopPropagation();
                e.preventDefault();
                this.#moveState.lastPosition = { pageX, pageY };
                this.#moveState.id = identifier;
                globalListeners.addGlobalListener(
                    window,
                    'touchmove',
                    onTouchMove,
                    false
                );
                globalListeners.addGlobalListener(
                    window,
                    'touchend',
                    onTouchEnd,
                    false
                );
                globalListeners.addGlobalListener(
                    window,
                    'touchcancel',
                    onTouchEnd,
                    false
                );
            };
        } else {
            const onPointerMove = (e: PointerEvent) => {
                if (e.pointerId === this.#moveState.id) {
                    const pointerType = (e.pointerType ||
                        'mouse') as PointerType;

                    move(
                        e,
                        pointerType,
                        e.pageX - (this.#moveState.lastPosition?.pageX ?? 0),
                        e.pageY - (this.#moveState.lastPosition?.pageY ?? 0)
                    );
                    this.#moveState.lastPosition = {
                        pageX: e.pageX,
                        pageY: e.pageY
                    };
                }
            };

            const onPointerUp = (e: PointerEvent) => {
                if (e.pointerId === this.#moveState.id) {
                    const pointerType = (e.pointerType ||
                        'mouse') as PointerType;
                    end(e, pointerType);
                    this.#moveState.id = null;
                    globalListeners.removeGlobalListener(
                        window,
                        'pointermove',
                        onPointerMove,
                        false
                    );
                    globalListeners.removeGlobalListener(
                        window,
                        'pointerup',
                        onPointerUp,
                        false
                    );
                    globalListeners.removeGlobalListener(
                        window,
                        'pointercancel',
                        onPointerUp,
                        false
                    );
                }
            };
            moveProps.pointerdown = (e) => {
                if (e.button === 0 && this.#moveState.id == null) {
                    start();
                    e.stopPropagation();
                    e.preventDefault();
                    this.#moveState.lastPosition = {
                        pageX: e.pageX,
                        pageY: e.pageY
                    };
                    this.#moveState.id = e.pointerId;
                    globalListeners.addGlobalListener(
                        window,
                        'pointermove',
                        onPointerMove,
                        false
                    );
                    globalListeners.addGlobalListener(
                        window,
                        'pointerup',
                        onPointerUp,
                        false
                    );
                    globalListeners.addGlobalListener(
                        window,
                        'pointercancel',
                        onPointerUp,
                        false
                    );
                }
            };
        }

        const triggerKeyboardMove = (
            e: EventBase,
            deltaX: number,
            deltaY: number
        ) => {
            start();
            move(e, 'keyboard', deltaX, deltaY);
            end(e, 'keyboard');
        };

        moveProps.keydown = (e) => {
            switch (e.key) {
                case 'Left':
                case 'ArrowLeft':
                    e.preventDefault();
                    e.stopPropagation();
                    triggerKeyboardMove(e, -1, 0);
                    break;
                case 'Right':
                case 'ArrowRight':
                    e.preventDefault();
                    e.stopPropagation();
                    triggerKeyboardMove(e, 1, 0);
                    break;
                case 'Up':
                case 'ArrowUp':
                    e.preventDefault();
                    e.stopPropagation();
                    triggerKeyboardMove(e, 0, -1);
                    break;
                case 'Down':
                case 'ArrowDown':
                    e.preventDefault();
                    e.stopPropagation();
                    triggerKeyboardMove(e, 0, 1);
                    break;
            }
        };

        return moveProps;
    }
}
