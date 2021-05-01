'use strict';

const myCharts = (() => {

    const initCharts = () => {
        console.log('Initializing charts on page...');

        console.log('structuredData', structuredData);

        const {dices, planets, countries, continents, volleyballOlympicMedals, orienteering} = structuredData;

        nnmCharts.verticalBarChart({
            canvasId: 'dicesChart',
            title: `Frequency for ${dices.totalThrows} dice throws`,
            xAxesLabel: 'Dice face',
            yAxesLabel: 'Frequency',
            labels: dices.faces,
            datasets: [
                {
                    label: 'Frequency',
                    data: dices.frequencies
                }
            ]
        });

        nnmCharts.horizontalBarChart({
            canvasId: 'planetsDiameterChart',
            title: `Diameter of ${planets.numberOf} planets`,
            xAxesLabel: 'Diameter (1000 km)',
            labels: planets.names,
            datasets: [
                {
                    data: planets.diametersIn1000Km
                }
            ]
        });

        nnmCharts.horizontalBarChart({
            canvasId: 'planetsDistanceChart',
            title: `Distance from the Sun for ${planets.numberOf} planets`,
            xAxesLabel: 'Distance from the Sun (million km)',
            labels: planets.names,
            datasets: [
                {
                    data: planets.distanceInMillionKm
                }
            ]
        });

        nnmCharts.horizontalBarChart({
            canvasId: 'countriesAreaChart',
            title: `Area of ${countries.numberOf} countries`,
            xAxesLabel: 'Area (1000 km2)',
            labels: countries.names,
            datasets: [
                {
                    data: countries.areasIn1000Km2
                }
            ]
        });

        nnmCharts.horizontalBarChart({
            canvasId: 'countriesPopulationChart',
            title: `Population in ${countries.numberOf} countries`,
            xAxesLabel: 'Population (millions)',
            labels: countries.names,
            datasets: [
                {
                    data: countries.populationsInMillion
                }
            ]
        });

        nnmCharts.bubbleChart({
            canvasId: 'countriesBubbleChart',
            title: `Population (in millions), area and density in ${countries.numberOf} countries`,
            xAxesLabel: 'Area (1000 km2)',
            yAxesLabel: 'Density (/km2)',
            labels: countries.names,
            datasets: countries.bubble
        });

        nnmCharts.verticalBarChart({
            canvasId: 'continentsHighestPointChart',
            title: `Highest and lowest points in ${continents.numberOf} continents`,
            yAxesLabel: 'Elevation (meters)',
            labels: continents.names,
            datasets: [
                {
                    label: 'Highest point',
                    data: continents.highestPointElevation
                },
                {
                    label: 'Lowest point',
                    data: continents.lowestPointElevation
                }
            ]
        });

        nnmCharts.stackedVerticalBarChart({
            canvasId: 'volleyballStackedChart',
            title: `Olympic medals for top ${volleyballOlympicMedals.numberOf} countries`,
            yAxesLabel: 'Number of medals',
            labels: volleyballOlympicMedals.names,
            colors: [
                {backgroundColor: 'rgba(255, 215, 0, 0.6)'},
                {backgroundColor: 'rgba(192, 192, 192, 0.6)'},
                {backgroundColor: 'rgba(205, 127, 50, 0.6)'}
                ],
            datasets: [
                {
                    label: 'Gold',
                    data: volleyballOlympicMedals.goldMedals
                },
                {
                    label: 'Silver',
                    data: volleyballOlympicMedals.silverMedals
                },
                {
                    label: 'Bronze',
                    data: volleyballOlympicMedals.bronzeMedals
                }
            ]
        });

        nnmCharts.lineChart({
            canvasId: 'orienteeringRelativeLegTimesChart',
            title: `Relative leg times for ${orienteering.numberOf} best athletes in ${orienteering.class} and ${orienteering.controls.length - 2} controls (total winning time ${orienteering.totalWinningTime}). ${orienteering.event}, ${orienteering.localDate}`,
            xAxesLabel: `${orienteering.event}, ${orienteering.class}`,
            yAxesLabel: 'Relative leg time (seconds)',
            labels: orienteering.controls,
            datasets: orienteering.names.map((name, index) => {
                return {
                    label: name,
                    data: orienteering.relativeLegTimes[index]
                };
            })
        });

        nnmCharts.lineChart({
            canvasId: 'orienteeringRelativeSplitTimesByControlChart',
            title: `Relative split times for ${orienteering.numberOf} best athletes in ${orienteering.class} and ${orienteering.controls.length - 2} controls (total winning time ${orienteering.totalWinningTime}). ${orienteering.event}, ${orienteering.localDate}`,
            xAxesLabel: `${orienteering.event}, ${orienteering.class}`,
            yAxesLabel: 'Relative split time (seconds)',
            labels: orienteering.controls,
            datasets: orienteering.names.map((name, index) => {
                return {
                    label: name,
                    data: orienteering.relativeSplitTimes[index]
                };
            })
        });

        nnmCharts.timeChart({
            canvasId: 'orienteeringRelativeSplitTimesByTimeChart',
            title: `Split times for ${orienteering.numberOf} best athletes in ${orienteering.class} and ${orienteering.controls.length - 2} controls (total winning time ${orienteering.totalWinningTime}). ${orienteering.event}, ${orienteering.localDate}`,
            xAxesLabel: `Split time`,
            // xAxesLabel: `${orienteering.event}, ${orienteering.class}`,
            // yAxesLabel: 'Control',
            yLabels: orienteering.controls,
            datasets: orienteering.names.map((name, index) => {
                return {
                    label: name,
                    data: orienteering.splitTimes[index]
                };
            })
        });

        nnmCharts.stackedVerticalBarChart({
            canvasId: 'orienteeringStackedChart',
            title: `Leg places for ${orienteering.numberOf} best athletes in ${orienteering.class} and ${orienteering.controls.length - 2} controls (total winning time ${orienteering.totalWinningTime}). ${orienteering.event}, ${orienteering.localDate}`,
            yAxesLabel: 'Frequency',
            labels: orienteering.names,
            colors: [
                {backgroundColor: 'rgba(255, 215, 0, 0.6)'},
                {backgroundColor: 'rgba(192, 192, 192, 0.6)'},
                {backgroundColor: 'rgba(205, 127, 50, 0.6)'},
                // {backgroundColor: 'rgba(0, 0, 0, 0.6)'},
                // {backgroundColor: 'rgba(0, 200, 0, 0.6)'},
                // {backgroundColor: 'rgba(0, 0, 205, 0.6)'},
                // {backgroundColor: 'rgba(0, 0, 0, 0.6)'},
                {backgroundColor: 'rgba(255, 165, 0, 0.6)'},
                {backgroundColor: 'rgba(200, 0, 0, 0.6)'},
                // {backgroundColor: 'rgba(125, 0, 200, 0.6)'}
            ],
            datasets: [
                {
                    label: '1st place on leg',
                    data: orienteering.legFirstPlace
                },
                {
                    label: '2nd place on leg',
                    data: orienteering.legSecondPlace
                },
                {
                    label: '3rd place on leg',
                    data: orienteering.legThirdPlace
                },
                // {
                //     label: 'Beyond best half on leg',
                //     data: orienteering.legBeyondBestHalf
                // },
                // {
                //     label: 'Good performance on leg',
                //     data: orienteering.legGreenPlace
                // },
                // {
                //     label: 'Okay performance on leg',
                //     data: orienteering.legOrangePlace
                // },
                // {
                //     label: 'Bad performance on leg',
                //     data: orienteering.legRedPlace
                // },
                {
                    label: 'Minor mistake on leg',
                    data: orienteering.legMinorMistake
                },
                {
                    label: 'Major mistake on leg',
                    data: orienteering.legMajorMistake
                }
            ]
        });

        const topAthletes = orienteering.names.slice(0, 5);

        nnmCharts.groupedVerticalBarChart({
            canvasId: 'orienteeringGroupedChart',
            title: `Relative leg times for ${topAthletes.length} best athletes in ${orienteering.class} and ${orienteering.controls.length - 2} controls (total winning time ${orienteering.totalWinningTime}). ${orienteering.event}, ${orienteering.localDate}`,
            xAxesLabel: `${orienteering.event}, ${orienteering.class}`,
            yAxesLabel: 'Relative leg time (seconds)',
            labels: orienteering.controls,
            datasets: topAthletes.map((name, index) => {
                return {
                    label: name,
                    data: orienteering.relativeLegTimes[index]
                };
            })
        });

        nnmCharts.pieChart({
            canvasId: 'dices2Chart',
            title: `Frequency for ${dices.totalThrows} dice throws`,
            labels: dices.faces,
            datasets: [
                {
                    label: 'Frequency',
                    data: dices.frequencies
                }
            ]
        });

        nnmCharts.pieChart({
            canvasId: 'countriesPopulation2Chart',
            title: `Population (in millions) in ${countries.numberOf} countries`,
            labels: countries.names,
            datasets: [
                {
                    data: countries.populationsInMillion
                }
            ]
        });

        console.log(`Initializing ${nnmCharts.getNumberOfCharts()} charts on page - DONE`);
    };

    return {
        initCharts
    }
})();

document.addEventListener('DOMContentLoaded', myCharts.initCharts);