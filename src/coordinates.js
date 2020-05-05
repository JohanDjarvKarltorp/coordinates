const { Worker } = require('worker_threads');
const process = require("process");
const bt = require('geojson-bounds');
const countries = require('./countries-geojson.json');
const LoadingBar = require('./loadingBar');

const loadingBarSize = 50;
const loadingBar = new LoadingBar(loadingBarSize);

const country = {
    get: (id) => countries.features.find((element) => element.properties.ISO_A3 === id),
    bounds: (shape) => bt.envelope(shape.geometry),
    coordinates: (shape, nrOfCoordinates) => {
        let limit = 100;
        let oneWorker = 1;
        let fourWorkers = 4;
        let nrOfWorkers = nrOfCoordinates <= limit ? oneWorker : fourWorkers;
        let countryName = shape.properties.ADMIN;
        let amount = nrOfCoordinates.toLocaleString();

        console.log(`Creating \x1b[1m\x1b[32m${amount}\x1b[0m random coordinates ` +
            `with \u001b[36m${nrOfWorkers}\x1b[0m threads within ${countryName}'s borders`);

        return webWorkers(nrOfWorkers, shape, nrOfCoordinates);
    }
};

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

const webWorkers = (nrOfWorkers, shape, size) => {
    return new Promise(function(resolve) {
        let data = {
            type: "FeatureCollection",
            features: []
        };
        let running = 0;
        let completed = 0;
        let zero = 0;
        let chunk = size / nrOfWorkers;

        const start = process.hrtime();

        loadingBar.init();

        for (let i = 0; i < nrOfWorkers; i++) {
            const worker = new Worker("./src/worker.js");

            worker.on("message", async message => {
                switch (message.type) {
                    case "loadingBar":
                        completed += message.completed;
                        loadingBar.update(completed, size);
                        break;
                    case "done":
                        data.features = data.features.concat(message.result);
                        running--;
                        await worker.terminate();

                        if (running === zero) {
                            printCompletionTime(start);
                            resolve(data);
                        }
                }
            });

            chunk += checkLeftOverValues(i, size, nrOfWorkers);

            worker.postMessage({shape: shape, nrOfCoordinates: chunk});
            running++;
        }
    });
};

const checkLeftOverValues = (index, size, nrOfWorkers) => {
    let empty = 0;
    let leftOver = size % nrOfWorkers;

    if (leftOver === empty) {
        return empty;
    }

    let includeZero = 1;
    let lastWorker = nrOfWorkers - includeZero;

    if  (index === lastWorker) {
        return leftOver;
    }

    return empty;
};

module.exports = country;
