class Tooltip {
    static instance;
    constructor({ shift = 10 } = {}) {
        this.shift = shift;
        if (Tooltip.instance) {
            return Tooltip.instance;
        }
        Tooltip.instance = this;
    }
    initialize () {
        document.addEventListener('pointerover', this.onPointerOver);
        document.addEventListener('pointerout', this.onPointerOut);
    }

    getTooltip(data) {
        return `<div class="tooltip">${data}</div>`;
    }

    onPointerOver = e => {
        const element = e.target.closest('[data-tooltip]');
        if (element) {
            this.render(element.dataset.tooltip);
            document.addEventListener('pointermove', this.onPointerMove);
        }
    }

    onPointerOut = e => {
        if (this.element) {
            this.element.remove();
        }
        document.removeEventListener('pointermove', this.onPointerMove);
    }

    onPointerMove = e => {
        this.moveTooltip(e);
    }

    moveTooltip(e) {
        const top = e.pageY + this.shift;
        const left = e.pageX + this.shift;
        const tooltip = this.element;
        const clientRect = tooltip.getBoundingClientRect();
        tooltip.style.left = (clientRect.right > window.innerWidth) ? `${left - clientRect.width - this.shift}px` : `${left}px`;
        tooltip.style.top = (clientRect.bottom > window.innerHeight) ? `${top - clientRect.height - this.shift}px` : `${top}px`;
        tooltip.innerHTML = e.target.closest('[data-tooltip]').dataset.tooltip;
    }

    destroy() {
        this.element.remove();
        Tooltip.instance = null;
        document.removeEventListener('pointerover', this.onPointerOver);
        document.removeEventListener('pointerout', this.onPointerOut);
    }

    remove() {
        if (this.element) {
            this.element.remove();
        }
    }

    render(data) {
        const element = document.createElement('div');
        element.innerHTML = this.getTooltip(data);
        this.element = element.firstElementChild;
        document.body.append(this.element);
    }
}

export default Tooltip;
