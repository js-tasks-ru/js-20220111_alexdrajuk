export default class ColumnChart {
    chartHeight = 50;
    constructor(chartData = {}) {
        this.chartData = chartData;
        this.render();
    }

    getTemplate() {
        return `
            <div class="column-chart column-chart_loading" style="--chart-height: ${this.chartHeight}">
                <div class="column-chart__title">
                    ${this.getChartLabel()}
                    ${this.getViewAllLink()}
                </div>
                <div class="column-chart__container">
                    <div data-element="header" class="column-chart__header">
                        ${this.getChartHeader()}
                    </div>
                    <div data-element="body" class="column-chart__chart">
                        ${this.getChartBars()}
                    </div>
                </div>
            </div>
        `;
    }

    getViewAllLink() {
        return this.chartData.link ? `<a href="${this.chartData.link}" class="column-chart__link">View all</a>` : '';
    }

    getChartLabel() {
        return this.chartData.label ? `Total ${this.chartData.label}` : '';
    }

    getChartHeader() {
        let chartHeader = '';
        if (!this.chartData.value) {
            return chartHeader;
        }
        if (this.chartData.formatHeading && typeof this.chartData.formatHeading === 'function') {
            chartHeader = this.chartData.formatHeading(this.chartData.value);
        }
        return `
            <div data-element="header" class="column-chart__header">
                ${chartHeader || this.chartData.value}
            </div>
        `;
    }

    getChartBars() {
        if (!this.chartData.data || !this.chartData.data.length) {
            return '';
        }
        const maxValue = Math.max(...this.chartData.data);
        return this.chartData.data.map(chartItem => {
            const scale = this.chartHeight / maxValue;
            const value = Math.floor(chartItem * scale);
            const percent = (chartItem / maxValue * 100).toFixed(0);
            return `<div style="--value: ${value}" data-tooltip="${percent}%"></div>`;
        }).join('');
    }

    destroy() {
        this.remove();
        this.element = null;
    }

    remove() {
        if (this.element) {
            this.element.remove();
        }
    }

    update(newData) {
        const chartElement = this.element && this.element.querySelector('.column-chart__chart');
        if (chartElement) {
            this.chartData.data = newData;
            chartElement.innerHTML = this.getChartBars();
        }

    }

    render() {
        const element = document.createElement('div');
        element.innerHTML = this.getTemplate();
        this.element = element.firstElementChild;
        if (this.chartData.data && this.chartData.data.length) {
            this.element.classList.remove('column-chart_loading');
        }
    }
}
