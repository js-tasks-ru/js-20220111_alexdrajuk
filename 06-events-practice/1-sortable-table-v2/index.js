export default class SortableTable {
    constructor(headerConfig, { data = [], sorted = {} } = {}) {
        this.headerConfig = headerConfig;
        this.isSortLocally = true;
        this.data = Array.isArray(data) ? data : data.data;
        this.templates = {
            default: data => `<div class="sortable-table__cell">${data}</div>`
        };
        this.activeCols = [];
        this.defaultSorting = sorted;
        this.subElements = {};
        this.render();
        if (this.defaultSorting.id) {
            this.defaultSort();
        }
        this.initEventListeners();
    }

    getCellTemplate(id) {
        return this.templates[id] ? this.templates[id] : this.templates.default;
    }

    initEventListeners() {
        if (!this.subElements.header) {
            return;
        }
        this.subElements.header.addEventListener('pointerdown', this.onHeaderClick);
    }

    getTableHeader() {
        return this.headerConfig.map(({ id, title, sortable = false, template }) => {
            this.activeCols.push(id);
            if (template) { this.templates[id] = template; }
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

    getTableRows() {
        return this.data.map((rowData = {}) => {
            return `
                <a href="/products/${rowData.id || '#'}" class="sortable-table__row">
                    ${this.activeCols.map((col) => this.getCellTemplate(col)(rowData[col])).join('')}
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
        `.trim();
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

    sort(field, order = 'desc') {
        if (this.isSortLocally) {
            this.sortTableData(field, order);
        }
        this.updateHeaderCells(field, order);
        this.subElements.body.innerHTML = this.getTableRows();
    }

    onHeaderClick = (e) => {
        const col = e.target.closest('[data-sortable=true]');
        if (!col) {
            return;
        }
        const revertedOrder = {
            'asc': 'desc',
            'desc': 'asc'
        };
        console.log(e.target);
        this.sort(col.dataset.id, revertedOrder[col.dataset.order]);
    }

    sortTableData(field, order = 'desc') {
        const column = this.headerConfig.find(column => column.id === field);
        if (!column.sortable) {
            return;
        }
        const directions = {
            asc: 1,
            desc: -1
        };
        const direction = directions[order];
        this.data.sort((a, b) => {
            if (column.sortType === 'string') {
                return direction * a[field].localeCompare(b[field], ['ru', 'en']);
            } else if (column.sortType === 'number') {
                return direction * (a[field] - b[field]);
            } else {
                return direction * (a[field] - b[field]);
            }
        });
    }
    
    defaultSort() {
        if (this.defaultSorting.id) {
            this.sortTableData(this.defaultSorting.id, this.defaultSorting.order);
            this.updateHeaderCells(this.defaultSorting.id, this.defaultSorting.order);
            this.subElements.body.innerHTML = this.getTableRows();
        }
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
        this.activeCols = null;
        this.templates = null;
        this.defaultSorting = null;
    }

    render() {
        const element = document.createElement('div');
        element.innerHTML = this.getTable();
        this.element = element.firstChild;
        this.subElements = this.getSubElements();
    }
}

