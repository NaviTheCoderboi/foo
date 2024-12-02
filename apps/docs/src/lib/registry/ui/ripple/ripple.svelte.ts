export interface RippleType {
    id: number;
    x: number;
    y: number;
    size: number;
}

export class RippleState {
    ripples = $state<RippleType[]>([]);

    addRipple(x: number, y: number, size: number) {
        const id = Date.now();
        this.ripples.push({ id, x, y, size });
    }

    removeRipple(id: number) {
        this.ripples = this.ripples.filter((ripple) => ripple.id !== id);
    }

    createRipple(event: PointerEvent | MouseEvent | TouchEvent) {
        const trigger = event.currentTarget as HTMLElement;
        const size = Math.max(trigger.clientWidth, trigger.clientHeight);
        const rect = trigger.getBoundingClientRect();

        let x = 0;
        let y = 0;

        if (event instanceof PointerEvent || event instanceof MouseEvent) {
            x = event.clientX;
            y = event.clientY;
        } else if (event instanceof TouchEvent) {
            x = event.touches[0].clientX;
            y = event.touches[0].clientY;
        }

        this.addRipple(x - rect.left - size / 2, y - rect.top - size / 2, size);
    }
}
