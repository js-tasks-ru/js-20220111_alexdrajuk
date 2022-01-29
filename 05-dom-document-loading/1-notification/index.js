export default class NotificationMessage {
    static notification;
    constructor(message = '', { duration = 2000, type = 'success' } = {}) {
        this.message = message;
        this.duration = duration;
        this.type = type;
        this.show();
    }

    getTemplate() {
        return `
            <div class="notification ${this.type}" style="--value:${Math.round(this.duration / 1000)}s">
                <div class="timer"></div>
                <div class="inner-wrapper">
                    <div class="notification-header">${this.type}</div>
                    <div class="notification-body">
                        ${this.message}
                    </div>
                </div>
            </div>
        `;
    }

    show(parent = document.body) {
        if (NotificationMessage.notification) {
            NotificationMessage.notification.remove();
        }
        const element = document.createElement('div');
        element.innerHTML = this.getTemplate();
        this.element = element.firstElementChild;
        parent.append(this.element);
        NotificationMessage.notification = this.element;
        
        setTimeout(() => {
            this.remove();
        }, this.duration);
    }

    remove() {
        if (this.element) {
            this.element.remove();
        }
    }

    destroy() {
        this.remove();
        this.element = null;
        NotificationMessage.notification = null;
    }
}
