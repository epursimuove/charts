//
// Charts - Javascript for adding different chart blocks to any HTML page.
// Project homepage: https://github.com/epursimuove/charts
// Created by Anders Gustafson, May 2020.
//

'use strict';

const nnmCharts = (() => {

    console.log('Starting up charts functionality...');

    Chart.defaults.global.elements.line.fill = false;

    const defaultColors = [
        '225, 0, 0',
        '0, 225, 0',
        '0, 0, 225',
        '225, 225, 0',
        '225, 0, 225',
        '0, 225, 225',
        '0, 0, 0',
    ];

    const getDefaultColors = index => {
        const color = defaultColors[index % defaultColors.length];
        const backgroundColor = `rgba(${color}, 0.3)`;
        const borderColor = `rgba(${color}, 1)`;

        return {
            backgroundColor,
            borderColor
        }
    };

    const opacityColors = dataItems => opacity => dataItems.map((item, index) => {
        const color = defaultColors[index % defaultColors.length];
        const backgroundColor = `rgba(${color}, ${opacity})`;
        return backgroundColor;
    });

    const enhanceMultipleDatasets = (datasets, ownColors) => datasets
        .forEach((dataset, index) => {
            const colors = ownColors ? ownColors[index] : getDefaultColors(index);
            dataset.backgroundColor = colors.backgroundColor;
            dataset.borderColor = colors.borderColor;
            dataset.borderWidth = 1;
        });

    const enhanceSingleDataset = dataset => {
        // const colors = getDefaultColors(index);
        dataset.backgroundColor = opacityColors(dataset.data)(0.5);
        // dataset.borderColor = colors.borderColor;
        // dataset.borderWidth = 1;
    };

    let numberOfCharts = 0;

    const createChart = (type, extra = {}) => (configuration) => {
        const {canvasId, title, xAxesLabel, yAxesLabel, labels, datasets, colors} = configuration;
        const context = document.getElementById(canvasId).getContext('2d');

        if (datasets.length === 1) {
            enhanceSingleDataset(datasets[0]);
        } else {
            enhanceMultipleDatasets(datasets, colors);
        }

        const barChartData = {
            labels: labels,
            datasets: datasets
        };

        const computed = {
            displayLegend: barChartData.datasets.length > 1 || ['line', 'pie', 'bubble'].includes(type),
            displayScales: ['line', 'horizontalBar', 'bar', 'bubble'].includes(type)
        };

        const options = {
            legend: {
                display: computed.displayLegend
            },
            title: {
                display: title,
                text: title
            }
        };

        if (computed.displayScales) {
            options.scales = {
                xAxes: [{
                    stacked: extra.stacked,
                    scaleLabel: {
                        display: xAxesLabel,
                        labelString: xAxesLabel
                    },
                    ticks: {
                        beginAtZero: true
                    }
                }],
                yAxes: [{
                    stacked: extra.stacked,
                    scaleLabel: {
                        display: yAxesLabel,
                        labelString: yAxesLabel
                    },
                    ticks: {
                        beginAtZero: true
                    }
                }]
            };
        }

        // console.log('type', type);
        // console.log('options', options);
        // console.log('barChartData', barChartData);

        const chart = new Chart(context, {
            type,
            data: barChartData,
            options
        });

        numberOfCharts++;
    };

    console.log('Starting up charts functionality - DONE');

    return {
        getNumberOfCharts: () => numberOfCharts,
        horizontalBarChart: createChart('horizontalBar'),
        verticalBarChart: createChart('bar'),
        lineChart: createChart('line'),
        pieChart: createChart('pie'),
        bubbleChart: createChart('bubble'),
        stackedVerticalBarChart: createChart('bar', {stacked: true}),
        groupedVerticalBarChart: createChart('bar')
    }

})();