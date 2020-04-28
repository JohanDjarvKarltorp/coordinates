/* global L, loadCoordinates, addCustomControls */

let url = new URL(window.location.href);
let countryCode = url.searchParams.get("country");
let nrOfMarkers = url.searchParams.get("nrOfMarkers");
let seconds = 0;
let oneSecond = 1;
let country;
let bounds;
let coordinates = [];
let once = false;

let fadein = [
    {bottom: 0, opacity: 0},
    {bottom: "30px", opacity: 1}
];

let fadeout = [
    {bottom: "30px", opacity: 1},
    {bottom: 0, opacity: 0}
];

let map = L.map('mapid').setView([0, 0], 0);

L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
    maxZoom: 20,
    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, ' +
        '&copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> ' +
        '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
}).addTo(map);

fetch(`http://localhost:1337/data/country?ISO=${countryCode}`)
    .then((response) => {
        return response.json();
    })
    .then((res) => {
        country = L.geoJSON(res.shape).addTo(map);
        bounds = L.geoJSON(res.bounds);

        map.fitBounds(country.getBounds());

        addCustomControls();
    });

let fetchCoordsInterval = setIntervalAndExecute(whileFetchingCoordinates, oneSecond);

fetch(`http://localhost:1337/data/coordinates?country=${countryCode}&nrOfMarkers=${nrOfMarkers}`)
    .then((response) => {
        clearInterval(fetchCoordsInterval);
        let snackbar = document.getElementById("snackbar");
        let halfSecond = 500;
        let animation = snackbar.animate(fadeout, {duration: halfSecond});

        animation.onfinish = () => {
            snackbar.className = snackbar.className.replace("show", "");
        };

        return response.json();
    })
    .then((res) => {
        loadCoordinates(res.geoJSON);
    });

function whileFetchingCoordinates() {
    seconds++;
    if (seconds > oneSecond && !once) {
        once = true;
        let snackbar = document.getElementById("snackbar");

        snackbar.className = "show";
        snackbar.animate(fadein, {duration: 500});
    }
}

function setIntervalAndExecute(fn, t) {
    fn();
    return (setInterval(fn, t));
}
