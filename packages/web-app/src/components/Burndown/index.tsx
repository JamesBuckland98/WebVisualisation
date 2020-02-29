import { Component, h } from 'preact';
import { ReactPropTypes } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated'; // eslint-disable-line
import graph from 'assets/icons/bar-chart.png';
import { xAxis, yAxis, lineSeries, scrollbar, chartCursor } from './config';

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
        am4core.useTheme(am4themes_animated);
        const chart = am4core.createFromConfig(
            {
                data: [
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
                ],
                xAxes: [xAxis],
                yAxes: [yAxis],
                series: [lineSeries],
                scrollbarX: scrollbar,
                cursor: chartCursor,
            },
            'chartdiv',
            am4charts.XYChart,
        );
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
