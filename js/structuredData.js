//
// Create structured and useful data sets in various formats from the raw data sets in data.js.
//

'use strict';

// We depend on Luxon's date and time library, version 1.24.1 or above.
// const luxon = require('luxon');
const DateTime = luxon.DateTime;
const Duration = luxon.Duration;

const structuredData = (() => {

    console.log('Creating structured data sets...');

    const {diceData, planetData, countryData, continentData, volleyballOlympicMedalsData, orienteeringData} = data;

    const dices = {
        totalThrows: diceData.map(dice => dice.frequency).reduce((a, b) => a + b, 0),
        faces: diceData.map(dice => dice.face),
        frequencies: diceData.map(dice => dice.frequency)
    };

    const planets = {
        numberOf: planetData.length,
        names: planetData.map(planet => planet.name),
        diametersIn1000Km: planetData.map(planet => planet.diameter / 1000),
        distanceInMillionKm: planetData.map(planet => planet.distance / 1000000)
    };

    const countries = {
        numberOf: countryData.length,
        names: countryData.map(country => country.name),
        areasIn1000Km2: countryData.map(country => country.area / 1000),
        populationsInMillion: countryData.map(country => (country.population / 1000000).toFixed(1)),
        densities: countryData.map(country => (country.population / country.area).toFixed(0)),

        bubble: countryData.map(country => {
            const density = (country.population / country.area).toFixed(0);
            // const density = country.population / country.area;
            return {
                label: [country.name],
                data: [{
                    x: (country.area / 1000).toFixed(0),
                    y: density,
                    r: (country.population / 1000000).toFixed(1)
                }]
            };
        })
    };

    const continents = {
        numberOf: continentData.length,
        names: continentData.map(continent => continent.name),
        highestPointNames: continentData.map(continent => continent.highestPoint.name),
        highestPointElevation: continentData.map(continent => continent.highestPoint.elevation),
        lowestPointNames: continentData.map(continent => continent.lowestPoint.name),
        lowestPointElevation: continentData.map(continent => continent.lowestPoint.elevation)
    };

    const volleyballOlympicMedals = {
        numberOf: volleyballOlympicMedalsData.length,
        names: volleyballOlympicMedalsData.map(country => country.name),
        goldMedals: volleyballOlympicMedalsData.map(country => country.gold),
        silverMedals: volleyballOlympicMedalsData.map(country => country.silver),
        bronzeMedals: volleyballOlympicMedalsData.map(country => country.bronze),

        bubble: volleyballOlympicMedalsData.map(country => {
            return {
                label: [country.name],
                data: [{
                    x: country.silver,
                    y: country.bronze,
                    r: country.gold * 20
                }]
            };
        })
    };

    const createOrienteering = () => {

        const toHMS = totalSeconds => {

            const duration = Duration.fromObject({seconds: totalSeconds});

            const formattedDuration = duration.toFormat('hh:mm:ss');

            return formattedDuration;
        }

        const minutesAndSecondsTotalSeconds = (mm_ss, force = false) => {
            if (force || mm_ss.startsWith('+')) {
                const minutesAndSeconds = mm_ss.split('.');
                return Number.parseInt(minutesAndSeconds[0], 10) * 60 + Number.parseInt(minutesAndSeconds[1], 10);
            }
            else {
                return 0;
            }
        };

        const hoursAndMinutesAndSecondsTotalSeconds = (hh_mm_ss) => {
            // The formats are either "h:mm.ss" or "m.ss".

            let hours = 0;
            let mm_ss = null;

            if (hh_mm_ss.includes(':')) {
                const hoursAndMinutesSeconds = hh_mm_ss.split(':');

                hours = Number.parseInt(hoursAndMinutesSeconds[0], 10);
                mm_ss = hoursAndMinutesSeconds[1];
            } else {
                mm_ss = hh_mm_ss;
            }

            const totalSeconds = hours * 3600 + minutesAndSecondsTotalSeconds(mm_ss, true);

            return totalSeconds;
        };

        const isMistake = (percentage) => (relativeLegTime, index) => {
            const relativeLegTimeInSeconds = minutesAndSecondsTotalSeconds(relativeLegTime);
            const bestLegTimeInSeconds = minutesAndSecondsTotalSeconds(orienteeringData.bestLegTimes[index], true);

            const isMistake = relativeLegTimeInSeconds > bestLegTimeInSeconds * percentage / 100;

            return isMistake;
        };

        const asTime = totalSeconds => DateTime.fromISO('2020-01-01T01:00:00').plus(Duration.fromObject({seconds: totalSeconds})).toJSDate();

        // Only use the ten best athletes.
        orienteeringData.results = orienteeringData.results.slice(0, 10);
        // orienteeringData.results = orienteeringData.results.slice(0, 5).concat(orienteeringData.results.slice(45, 50));

        const createControls = () => {
            const controls = orienteeringData.results[0].relativeSplitTimes
                .map((split, index) => 'Control ' + (index + 1));
            controls.unshift('Start');
            controls[controls.length - 1] = 'Finish'; // Rename last control to 'Finish'.
            return controls;
        };


        const orienteering = {
            event: orienteeringData.event,
            localDate: orienteeringData.localDate,
            class: orienteeringData.class,
            numberOf: orienteeringData.results.length,
            totalWinningTime: orienteeringData.results[0].totalTime,
            names: orienteeringData.results.map(athlete => athlete.name),

            controls: createControls(),

            splitTimes: orienteeringData.results
                .map(athlete => athlete.relativeSplitTimes
                    .map((splitTime, control) => {

                        const splitTimeInSecondsForAthlete =
                            hoursAndMinutesAndSecondsTotalSeconds(orienteeringData.bestSplitTimes[control]) +
                            minutesAndSecondsTotalSeconds(splitTime);

                        const splitTimeStringForAthlete = toHMS(splitTimeInSecondsForAthlete);

                        return {
                            t: splitTimeStringForAthlete,
                            y: control + 1 < athlete.relativeSplitTimes.length ? 'Control ' + (control + 1) : 'Finish'
                            // y: (control + 1)
                        }
                    })),

            relativeLegTimes: orienteeringData.results
                .map(athlete => athlete.relativeLegTimes
                    .map(relativeLegTime => minutesAndSecondsTotalSeconds(relativeLegTime))),

            relativeSplitTimes: orienteeringData.results
                .map(athlete => athlete.relativeSplitTimes
                    .map(relativeSplitTime => minutesAndSecondsTotalSeconds(relativeSplitTime))),

            legFirstPlace: orienteeringData.results
                .map(athlete => athlete.legPlaces
                    .filter(legPlace => legPlace === 1)
                    .length),

            legSecondPlace: orienteeringData.results
                .map(athlete => athlete.legPlaces
                    .filter(legPlace => legPlace === 2)
                    .length),

            legThirdPlace: orienteeringData.results
                .map(athlete => athlete.legPlaces
                    .filter(legPlace => legPlace === 3)
                    .length),

            legBeyondBestHalf: orienteeringData.results
                .map(athlete => athlete.legPlaces
                    .filter(legPlace => legPlace > orienteeringData.participants / 2)
                    .length),

            legMinorMistake: orienteeringData.results
                .map(athlete => athlete.relativeLegTimes
                    .filter((relativeLegTime, index) => isMistake(30)(relativeLegTime, index))
                    .length),

            legMajorMistake: orienteeringData.results
                .map(athlete => athlete.relativeLegTimes
                    .filter((relativeLegTime, index) => isMistake(60)(relativeLegTime, index))
                    .length),

            legGreenPlace: orienteeringData.results
                .map(athlete => athlete.legPlaces
                    .filter(legPlace => legPlace > 3 && legPlace <= orienteeringData.participants / 10)
                    .length),

            legOrangePlace: orienteeringData.results
                .map(athlete => athlete.legPlaces
                    .filter(legPlace => legPlace > 3 && legPlace > orienteeringData.participants / 10 && legPlace <= orienteeringData.participants / 2)
                    .length),

            legRedPlace: orienteeringData.results
                .map(athlete => athlete.legPlaces
                    .filter(legPlace => legPlace > 3 && legPlace > orienteeringData.participants / 2)
                    .length),
        };

        // Add 'Start' times for every athlete.
        orienteering.splitTimes.forEach(athleteArray => athleteArray.unshift({t: toHMS(0), y: 'Start'}));
        orienteering.relativeLegTimes.forEach(athleteArray => athleteArray.unshift(0));
        orienteering.relativeSplitTimes.forEach(athleteArray => athleteArray.unshift(0));

        return orienteering;
    };

    console.log('Creating structured data sets - DONE');

    return {
        planets,
        countries,
        continents,
        dices,
        volleyballOlympicMedals,
        orienteering: createOrienteering()
    };

})();