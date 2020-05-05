const process = require("process");
const bt = require('geojson-bounds');
const classifyPoint = require("robust-point-in-polygon");
const countries = require('./countries-geojson.json');
const LoadingBar = require('./loadingBar');

const loadingBarSize = 50;
const loadingBar = new LoadingBar(loadingBarSize);

const country = {
    get: (id) => countries.features.find((element) => element.properties.ISO_A3 === id),
    bounds: (shape) => bt.envelope(shape.geometry),
    coordinates: (shape, nrOfCoordinates) => {
        let data = {
            type: "FeatureCollection",
            features: []
        };

        let countryName = shape.properties.ADMIN;
        let amount = nrOfCoordinates.toLocaleString();
        const start = process.hrtime();

        console.log(`Creating \x1b[1m\x1b[32m${amount}\x1b[0m random coordinates` +
            ` within ${countryName}'s borders`);

        loadingBar.init();

        for (let i = 0; i < nrOfCoordinates; i++) {
            let current = getCoordinates(shape);

            data.features.push(toGeoJSON(current));
            loadingBar.update(i, nrOfCoordinates);
        }

        loadingBar.update(nrOfCoordinates, nrOfCoordinates);
        printCompletionTime(start);

        return data;
    }
};


function toGeoJSON(coordinates) {
    let lat = 1;
    let lng = 0;
    let string = `${coordinates[lat]},${coordinates[lng]}`;

    return {
        type: "Feature",
        geometry: {
            type: "Point",
            coordinates: coordinates
        },
        properties: {
            popup: `<b>Lat:&nbsp;&nbsp;${coordinates[lat]}<br> Lng: ${coordinates[lng]}</b><br>` +
                "<span onclick='copyCoords(this)' onmouseout='reset(this)" +
                "'class='mdi mdi-content-copy tooltip'> " +
                `<span class='tooltiptext'>Copy</span></span><p>${string}</p>`,
        }
    };
}


function getPolygon(shape, index) {
    let first = 0;

    if (shape.geometry.type === 'MultiPolygon') {
        return shape.geometry.coordinates[index][first];
    } else if (shape.geometry.type === 'Polygon') {
        return shape.geometry.coordinates[index];
    }
}

function getCoordinates(shape) {
    let bound = bt.extent(shape.geometry);
    let west = 0, south = 1, east = 2, north = 3;
    let point = [getRandom(bound[west], bound[east]), getRandom(bound[south], bound[north])];
    let match = false;
    let insidePolygon = -1;

    while (!match) {
        for (let i = 0; i < shape.geometry.coordinates.length; i++) {
            let polygon = getPolygon(shape, i);

            if (classifyPoint(polygon, point) === insidePolygon) {
                match = true;
                break;
            }
        }
        if (!match) {
            point = [getRandom(bound[west], bound[east]), getRandom(bound[south], bound[north])];
        }
    }

    return point;
}

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

function printCompletionTime(start) {
    let minutes, seconds, milliseconds, nanoseconds;
    let oneMillion = 1000000;
    let oneMinutes = 60;
    let zero = 0;

    [seconds, nanoseconds] = process.hrtime(start);

    minutes = Math.floor(seconds / oneMinutes);
    seconds = seconds - (minutes * oneMinutes);
    milliseconds = Math.floor(nanoseconds / oneMillion);

    let minutesString = minutes > zero ? `${minutes} minutes and ` : "";

    console.info('Completed in %s%d.%d seconds\n', minutesString, seconds, milliseconds);
}

module.exports = country;
