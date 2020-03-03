import { Fragment, FunctionalComponent, h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { createFromConfig, useTheme } from '@amcharts/amcharts4/core';
import { XYChart } from '@amcharts/amcharts4/charts';
import am4themesAnimated from '@amcharts/amcharts4/themes/animated';
import graph from 'assets/icons/bar-chart.png';
import { xAxis, yAxis, lineSeries, scrollbar, chartCursor } from './config';

const BurnDown: FunctionalComponent = () => {
    const [BurnDownChart, setBurnDownChart] = useState(null);
    const [showChart, setShowchart] = useState(false);
    useTheme(am4themesAnimated);
    useEffect(() => {
        const chart = createFromConfig(
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
            XYChart,
        );
        setBurnDownChart(chart);
    }, [showChart]);

    const toggleChart = (): void => {
        setShowchart(!showChart);
    };

    return (
        <Fragment>
            <button className="toggle-chart" title="Toggle Chart" onClick={(): void => toggleChart()}>
                <img src={graph} />
            </button>
            {showChart ? (
                <div id="chartdiv" style={{ width: '100%', height: '500px' }} />
            ) : (
                <div id="chartdiv" style="display: none;" />
            )}
        </Fragment>
    );
};

export default BurnDown;
