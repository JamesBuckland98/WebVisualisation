import { Component, h } from 'preact';
import { ReactPropTypes } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import graph from 'assets/icons/bar-chart.png';

type MyState = { chart: any; showChart: boolean };

class BurnDown extends Component<{}, MyState> {
    constructor(props: ReactPropTypes) {
        super(props);
        this.state = {
            chart: '',
            showChart: false,
        };
    }

    componentDidMount() {
        const chart = am4core.create('chartdiv', am4charts.XYChart);
        // chart config goes here
        const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.startLocation = 0;
        dateAxis.endLocation = 1;
        dateAxis.title.text = 'Time';
        const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.title.text = 'Issues';
        valueAxis.cursorTooltipEnabled = false;
        const series = chart.series.push(new am4charts.LineSeries());
        series.name = 'Burn Down';
        series.stroke = am4core.color('#CDA2AB');
        series.strokeWidth = 3;
        series.dataFields.dateX = 'date';
        series.dataFields.valueY = 'value';
        series.tooltipText = '[bold]{valueY}[/]';
        const circleBullet = series.bullets.push(new am4charts.CircleBullet());
        circleBullet.circle.stroke = am4core.color('#CDA2AB');
        circleBullet.circle.strokeWidth = 2;
        chart.cursor = new am4charts.XYCursor();
        chart.cursor.lineY.opacity = 0;
        const scrollbarX = new am4charts.XYChartScrollbar();
        scrollbarX.series.push(series);
        chart.scrollbarX = scrollbarX;
        // chart data (this will be changed to use real data once connected to API)
        chart.data = [
            {
                date: new Date(2020, 1, 20),
                value: 10,
            },
            {
                date: new Date(2020, 1, 21),
                value: 9,
            },
            {
                date: new Date(2020, 1, 22),
                value: 7,
            },
            {
                date: new Date(2020, 1, 23),
                value: 4,
            },
            {
                date: new Date(2020, 1, 24),
                value: 3,
            },
            {
                date: new Date(2020, 1, 25),
                value: 0,
            },
        ];
        this.setState({
            chart: chart,
        });
    }

    componentWillUnmount() {
        if (this.state.chart) {
            this.state.chart.dispose();
        }
    }

    toggleChart() {
        this.setState({
            showChart: !this.state.showChart,
        });
    }

    render() {
        return (
            <div>
                <button className="toggle-chart" onClick={() => this.toggleChart()}>
                    <img src={graph} />
                </button>
                {this.state.showChart ? (
                    <div id="chartdiv" style={{ width: '100%', height: '500px' }}></div>
                ) : (
                    <div id="chartdiv" style="display: none;"></div>
                )}
            </div>
        );
    }
}

export default BurnDown;
