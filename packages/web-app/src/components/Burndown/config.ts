import { Axis, Series, ScrollbarX, Cursor } from 'models/Chart';

export const xAxis: Axis = {
    type: 'DateAxis',
    cursorTooltipEnabled: true,
    title: {
        text: 'date',
    },
};

export const yAxis: Axis = {
    type: 'ValueAxis',
    cursorTooltipEnabled: false,
    title: {
        text: 'value',
    },
};

export const lineSeries: Series = {
    id: 's1',
    name: 'Units',
    type: 'LineSeries',
    stroke: '#CDA2AB',
    strokeWidth: 3,
    tooltipText: '[bold]{valueY}[/]',
    dataFields: {
        valueY: 'value',
        dateX: 'date',
    },
};

export const scrollbar: ScrollbarX = {
    type: 'XYChartScrollbar',
    series: ['s1'],
};

export const chartCursor: Cursor = {
    lineY: {
        disabled: true,
    },
};
