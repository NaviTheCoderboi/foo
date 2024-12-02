import type { FocusableElement } from './dom';
import type { ReadableProp } from './utils';

/**
 * Provides a more consise way to type events
 */
export type TypedEvent<E extends Event, T extends FocusableElement> = E & {
    currentTarget: EventTarget & T;
};

export type PointerType = 'mouse' | 'pen' | 'touch' | 'keyboard' | 'virtual';

export type BaseEvent<
    E extends Event,
    T extends FocusableElement = FocusableElement
> = TypedEvent<E, T> & {
    /**
     * Use continuePropagation.
     * @deprecated */
    stopPropagation(): void;
    continuePropagation(): void;
};

// --- focus ---
export interface FocusEvents<
    Target extends FocusableElement = FocusableElement
> {
    /** Handler that is called when the element receives focus. */
    onFocus?: (e: TypedEvent<FocusEvent, Target>) => void;
    /** Handler that is called when the element loses focus. */
    onBlur?: (e: TypedEvent<FocusEvent, Target>) => void;
    /** Handler that is called when the element's focus status changes. */
    onFocusChange?: (isFocused: boolean) => void;
}

export interface FocusableProps<T extends FocusableElement = FocusableElement>
    extends FocusEvents<T>,
        KeyboardEvents {
    /** Whether the element should receive focus on render. */
    autoFocus?: ReadableProp<boolean>;
}

// --- hover ---
export interface HoverEvent<T extends FocusableElement = FocusableElement> {
    /** The type of hover event being fired. */
    type: 'hoverstart' | 'hoverend';
    /** The pointer type that triggered the hover event. */
    pointerType: 'mouse' | 'pen';
    /** The target element of the hover event. */
    target: T;
}

export interface HoverEvents<T extends FocusableElement = FocusableElement> {
    /** Handler that is called when a hover interaction starts. */
    onHoverStart?: (e: HoverEvent<T>) => void;
    /** Handler that is called when a hover interaction ends. */
    onHoverEnd?: (e: HoverEvent<T>) => void;
    /** Handler that is called when the hover state changes. */
    onHoverChange?: (isHovering: boolean) => void;
}

// keyboard

type SKeyboardEvent<T extends FocusableElement = FocusableElement> = BaseEvent<
    KeyboardEvent,
    T
>;

export interface KeyboardEvents<T extends FocusableElement = FocusableElement> {
    /** Handler that is called when a key is pressed. */
    onKeyDown?: (e: SKeyboardEvent<T>) => void;
    /** Handler that is called when a key is released. */
    onKeyUp?: (e: SKeyboardEvent<T>) => void;
}

// --- move ---
interface BaseMoveEvent {
    /** The pointer type that triggered the move event. */
    pointerType: PointerType;
    /** Whether the shift keyboard modifier was held during the move event. */
    shiftKey: boolean;
    /** Whether the ctrl keyboard modifier was held during the move event. */
    ctrlKey: boolean;
    /** Whether the meta keyboard modifier was held during the move event. */
    metaKey: boolean;
    /** Whether the alt keyboard modifier was held during the move event. */
    altKey: boolean;
}

export interface MoveStartEvent extends BaseMoveEvent {
    /** The type of move event being fired. */
    type: 'movestart';
}

export interface MoveMoveEvent extends BaseMoveEvent {
    /** The type of move event being fired. */
    type: 'move';
    /** The amount moved in the X direction since the last event. */
    deltaX: number;
    /** The amount moved in the Y direction since the last event. */
    deltaY: number;
}

export interface MoveEndEvent extends BaseMoveEvent {
    /** The type of move event being fired. */
    type: 'moveend';
}

export interface MoveEvents {
    /** Handler that is called when a move interaction starts. */
    onMoveStart?: (e: MoveStartEvent) => void;
    /** Handler that is called when the element is moved. */
    onMove?: (e: MoveMoveEvent) => void;
    /** Handler that is called when a move interaction ends. */
    onMoveEnd?: (e: MoveEndEvent) => void;
}

// --- press ---

export interface PressEvent<T extends FocusableElement = FocusableElement> {
    /** The type of press event being fired. */
    type: 'pressstart' | 'pressend' | 'pressup' | 'press';
    /** The pointer type that triggered the press event. */
    pointerType: PointerType;
    /** The target element of the press event. */
    target: EventTarget & T;
    /** Whether the shift keyboard modifier was held during the press event. */
    shiftKey: boolean;
    /** Whether the ctrl keyboard modifier was held during the press event. */
    ctrlKey: boolean;
    /** Whether the meta keyboard modifier was held during the press event. */
    metaKey: boolean;
    /** Whether the alt keyboard modifier was held during the press event. */
    altKey: boolean;
    /** X position relative to the target. */
    x: number;
    /** Y position relative to the target. */
    y: number;
    /**
     * By default, press events stop propagation to parent elements.
     * In cases where a handler decides not to handle a specific event,
     * it can call `continuePropagation()` to allow a parent to handle it.
     */
    continuePropagation(): void;
}

export interface PressEvents<T extends FocusableElement = FocusableElement> {
    /** Handler that is called when the press is released over the target. */
    onPress?: (e: PressEvent<T>) => void;
    /** Handler that is called when a press interaction starts. */
    onPressStart?: (e: PressEvent<T>) => void;
    /**
     * Handler that is called when a press interaction ends, either
     * over the target or when the pointer leaves the target.
     */
    onPressEnd?: (e: PressEvent<T>) => void;
    /** Handler that is called when the press state changes. */
    onPressChange?: (isPressed: boolean) => void;
    /**
     * Handler that is called when a press is released over the target, regardless of
     * whether it started on the target or not.
     */
    onPressUp?: (e: PressEvent<T>) => void;
}

// --- longpress ---

export interface LongPressEvent<T extends FocusableElement = FocusableElement>
    extends Omit<PressEvent<T>, 'type' | 'continuePropagation'> {
    /** The type of long press event being fired. */
    type: 'longpressstart' | 'longpressend' | 'longpress';
}
