export interface Axis {
    type: string;
    cursorTooltipEnabled: boolean;
    title: {
        text: string;
    };
    groupData?: boolean;
}

export interface Series {
    id: string;
    type: string;
    dataFields: {
        valueY: string;
        dateX: string;
    };
    stroke: string;
    strokeWidth: number;
    name: string;
    tooltipText: string;
}

export interface ScrollbarX {
    type: string;
    series: Array<string>;
}

export interface Cursor {
    lineY: {
        disabled: boolean;
    };
}
