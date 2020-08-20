/* global L, useSuperClusters, map */

let markers = L.markerClusterGroup({
    spiderfyOnMaxZoom: false,
    showCoverageOnHover: false,
    disableClusteringAtZoom: 13,
    maxClusterRadius: 100,

});

let geoJSON;

let loadCoordinates = (points) => {
    if (points.features.length > 50000) {
        useSuperClusters(points);
    } else {
        geoJSON = L.geoJson(points, {
            onEachFeature: (feature, layer) => layer.bindPopup(feature.properties.popup),
        });

        markers.addLayer(geoJSON);
        map.addLayer(markers);
    }
};

let reset = (target) => target.firstChild.nextSibling.innerHTML = "Copy";

let copyCoords = (target) => {
    let range = document.createRange();

    range.selectNode(target.nextElementSibling);
    window.getSelection().addRange(range);

    document.execCommand('copy');

    window.getSelection().removeAllRanges();

    target.firstChild.nextSibling.innerHTML = "Copied";
};
