export default class SortableTable {
    constructor(headerConfig = [], data = []) {
        this.headerConfig = headerConfig;
        this.data = Array.isArray(data) ? data : data.data;
        this.cols = [];
        this.templates = {
            default: data => `<div class="sortable-table__cell">${data}</div>`
        };
        this.sortTypes = {};
        this.render();
    }

    getTableHeader() {
        return this.headerConfig.map(({ id, title, sortable = false, sortType = '', ...props }) => {
            this.cols.push(id);
            if (sortable) {
                this.sortTypes[id] = sortType;
            }
            if (props.template) {
                this.templates[id] = props.template;
            }
            return `
                <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}">
                    <span>${title}</span>
                    <span data-element="arrow" class="sortable-table__sort-arrow">
                        <span class="sort-arrow"></span>
                    </span>
                </div>
            `;
        }).join('');
    }

    buildRow(rowData) {
        return this.cols.map(id => {
            return this.templates[id] ? this.templates[id](rowData[id]) : this.templates.default(rowData[id]);
        }).join('');
    }

    getTableRows() {
        return this.data.map((rowData = {}) => {
            return `
                <a href="/products/${rowData.id || '#'}" class="sortable-table__row">
                    ${this.buildRow(rowData)}
                </a>
            `;
        }).join('');
    }

    getTable() {
        return `
            <div data-element="productsContainer" class="products-list__container">
                <div class="sortable-table">
                    <div data-element="header" class="sortable-table__header sortable-table__row">
                        ${this.getTableHeader()}
                    </div>
                    <div data-element="body" class="sortable-table__body">
                        ${this.getTableRows()}
                    </div>
                    <div data-element="loading" class="loading-line sortable-table__loading-line"></div>

                    <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
                        <div>
                            <p>No products satisfies your filter criteria</p>
                            <button type="button" class="button-primary-outline">Reset all filters</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getSubElements() {
        const result = {};
        const elements = this.element.querySelectorAll('[data-element]');

        for (const subElement of elements) {
            result[subElement.dataset.element] = subElement;
        }
        return result;
    }

    updateHeaderCells(colId, order) {
        this.subElements.header.querySelectorAll('.sortable-table__cell[data-sortable]').forEach((headerCell) => {
            headerCell.dataset.order = (headerCell.dataset.id === colId) ? order : '';
        });
    }

    sort(field, order) {
        if (!this.sortTypes[field]) {
            return;
        }
        const directions = {
            asc: 1,
            desc: -1
        };
        const direction = directions[order];
        const sortType = this.sortTypes[field];
        this.data.sort((a, b) => {
            if (sortType === 'string') {
                return direction * a[field].localeCompare(b[field], ['ru', 'en']);
            } else if (sortType === 'number') {
                return direction * (a[field] - b[field]);
            } else {
                return direction * (a[field] - b[field]);
            }
        });
        this.updateHeaderCells(field, order);
        this.subElements.body.innerHTML = this.getTableRows();
    }

    remove() {
        if (this.element) {
            this.element.remove();
        }
    }

    destroy() {
        this.remove();
        this.element = null;
        this.subElements = {};
    }

    render() {
        const element = document.createElement('div');
        element.innerHTML = this.getTable().trim();
        this.element = element.firstChild;
        this.subElements = this.getSubElements();
    }
}

