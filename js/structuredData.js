//
// Create structured and useful data sets in various formats from the raw data sets in data.js.
//

'use strict';

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

        const minutesAndSecondsTotalSeconds = (mm_ss, force = false) => {
            if (force || mm_ss.startsWith('+')) {
                const minutesAndSeconds = mm_ss.split('.');
                return Number.parseInt(minutesAndSeconds[0], 10) * 60 + Number.parseInt(minutesAndSeconds[1], 10);
            }
            else {
                return 0;
            }
        };

        const isMistake = (percentage) => (relativeLegTime, index) => {
            const relativeLegTimeInSeconds = minutesAndSecondsTotalSeconds(relativeLegTime);
            const bestLegTimeInSeconds = minutesAndSecondsTotalSeconds(orienteeringData.bestLegTimes[index], true);

            const isMistake = relativeLegTimeInSeconds > bestLegTimeInSeconds * percentage / 100;

            return isMistake;
        };

        // Only use the ten best athletes.
        orienteeringData.results = orienteeringData.results.slice(0, 10);

        const orienteering = {
            event: orienteeringData.event,
            localDate: orienteeringData.localDate,
            class: orienteeringData.class,
            numberOf: orienteeringData.results.length,
            totalWinningTime: orienteeringData.results[0].totalTime,
            names: orienteeringData.results.map(athlete => athlete.name),

            controls: orienteeringData.results[0].relativeSplitTimes
                .map((split, index) => 'Control ' + (index + 1)),

            // splitTimes: orienteeringData.results
            //     .map(athlete => athlete.splitTimes
            //         .map(splitTime => minutesAndSecondsTotalSeconds(splitTime))),

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
        orienteering.controls.unshift('Start');
        // orienteering.splitTimes.forEach(athleteArray => athleteArray.unshift(0));
        orienteering.relativeLegTimes.forEach(athleteArray => athleteArray.unshift(0));
        orienteering.relativeSplitTimes.forEach(athleteArray => athleteArray.unshift(0));

        // The last control is 'Finish'.
        orienteering.controls[orienteering.controls.length - 1] = 'Finish';

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