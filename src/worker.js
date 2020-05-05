const { parentPort } = require('worker_threads');
const bt = require('geojson-bounds');
const classifyPoint = require("robust-point-in-polygon");

function coordinates(shape, nrOfCoordinates) {
    let data = [];
    let current;
    let onePercent = 0.01;
    let count = 0;
    let onePercentOfTotal = Math.floor(onePercent * nrOfCoordinates);

    for (let i = 1; i <= nrOfCoordinates; i++) {
        current = getCoordinates(shape);
        data.push(toGeoJSON(current));
        count++;

        if (count >= onePercentOfTotal) {
            let empty = 0;

            parentPort.postMessage({type: "loadingBar", completed: count});
            count = empty;
        }
    }
    return data;
}

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

parentPort.on('message', data => {
    let result = coordinates(data.shape, data.nrOfCoordinates);

    parentPort.postMessage({type: "done", result: result});
});
