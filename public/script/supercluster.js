/* global L Supercluster, map */

let points = L.geoJson(null, {
    pointToLayer: createClusterIcon
}).addTo(map);

let ready = false;
const worker = new Worker('script/worker.js');

function useSuperClusters(points) {
    worker.postMessage({
        points: points,
    });
    ready = true;
    map.on('moveend', update);
    update();
}

worker.onmessage = function (e) {
    if (e.data.ready) {
        ready = true;
        update();
    } else if (e.data.expansionZoom) {
        map.flyTo(e.data.center, e.data.expansionZoom);
    } else {
        points.clearLayers();
        points.addData(e.data);
    }
};

function update() {
    if (!ready) {return;}
    const bounds = map.getBounds();

    worker.postMessage({
        bbox: [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()],
        zoom: map.getZoom()
    });
}
function createClusterIcon(feature, latlng) {
    if (!feature.properties.cluster) {
        return L.marker(latlng).bindPopup(feature.properties.popup);
    }

    let count = feature.properties.point_count_abbreviated;
    let icon = L.divIcon({
        html: `<div><span>${count}</span></div>`,
        className: 'marker-cluster',
        iconSize: L.point(40, 40)
    });

    return L.marker(latlng, {
        icon: icon
    });
}

points.on('click', (e) => {
    if (e.layer.feature.properties.cluster_id) {
        worker.postMessage({
            getClusterExpansionZoom: e.layer.feature.properties.cluster_id,
            center: e.latlng
        });
    }
});
