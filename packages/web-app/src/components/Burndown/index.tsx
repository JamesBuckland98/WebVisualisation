import { Component, h } from 'preact';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themesAnimated from '@amcharts/amcharts4/themes/animated';
import graph from 'assets/icons/bar-chart.png';
import { xAxis, yAxis, lineSeries, scrollbar, chartCursor } from './config';

interface ComponentState {
    chart: any;
    showChart: boolean;
}

class BurnDown extends Component<{}, ComponentState> {
    constructor(props: any) {
        super(props);
        this.state = {
            chart: '',
            showChart: false,
        };
    }

    componentDidMount(): void {
        am4core.useTheme(am4themesAnimated);
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
        this.setChart(chart);
    }

    componentWillUnmount(): void {
        if (this.state.chart) {
            this.state.chart.dispose();
        }
    }

    setChart(chart: any): void {
        this.setState({
            chart,
        });
    }
    toggleChart(): void {
        this.setState({
            showChart: !this.state.showChart,
        });
    }

    render(): JSX.Element {
        return (
            <div>
                <button className="toggle-chart" title="Toggle Chart" onClick={(): void => this.toggleChart()}>
                    <img src={graph} />
                </button>
                {this.state.showChart ? (
                    <div id="chartdiv" style={{ width: '100%', height: '500px' }} />
                ) : (
                    <div id="chartdiv" style="display: none;" />
                )}
            </div>
        );
    }
}

export default BurnDown;
