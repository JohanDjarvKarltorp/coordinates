/*global importScripts Supercluster */

importScripts('https://unpkg.com/supercluster@6.0.2/dist/supercluster.min.js');

const index = new Supercluster({
    radius: 100,
    maxZoom: 13
});

self.onmessage = function (e) {
    if (e.data.points) {
        index.load(e.data.points.features);
    } else if (e.data.getClusterExpansionZoom) {
        postMessage({
            expansionZoom: index.getClusterExpansionZoom(e.data.getClusterExpansionZoom),
            center: e.data.center
        });
    } else if (e.data) {
        postMessage(index.getClusters(e.data.bbox, e.data.zoom));
    }
};
