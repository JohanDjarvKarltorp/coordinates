/* global L, map, coordinates, country, bounds, nrOfMarkers, markers, geoJSON */

let allMarkerToggle = false;
let countryToggle = false;
let boundsToggle = true;
let markersToggle = false;


let customControl = (data) => {
    let myCustomControl = L.Control.extend({
        options: {
            position: 'topleft'
        },

        onAdd: () => {
            let classNames = 'leaflet-bar leaflet-control leaflet-control-custom tooltip';
            let container = L.DomUtil.create('div', classNames);

            container.id = data.id;

            // Disables map events when the button is clicked
            L.DomEvent.disableClickPropagation(container);

            let icon = L.DomUtil.create('span');

            icon.className = `mdi ${data.iconName}`;

            let tooltip = L.DomUtil.create('span');

            tooltip.className = 'control-tooltiptext';
            tooltip.innerHTML = data.tooltipText;

            container.appendChild(icon);
            container.appendChild(tooltip);
            return container;
        }
    });

    map.addControl(new myCustomControl());
};

let addListener = (data) => {
    document.getElementById(data.id).addEventListener('click', (event) => {
        if (!data.toggle) {
            if (!map.hasLayer(data.layer)) {
                map.removeLayer(geoJSON); // if marker cluster is hidden (should find a better solution)
            } else {
                map.removeLayer(data.layer);
            }
            event.target.parentElement.firstChild.className = `mdi ${data.trueIcon}`;

            let tooltip = event.target.parentElement.lastChild;
            let tooltipText = tooltip.innerHTML;

            tooltip.innerHTML = tooltipText.replace('Hide', 'Show');
        } else {
            if (allMarkerToggle && data.id === 'markers') {
                map.addLayer(geoJSON); // if marker cluster is hidden (should find a better solution)
            } else {
                map.addLayer(data.layer);
            }
            event.target.parentElement.firstChild.className = `mdi ${data.falseIcon}`;

            let tooltip = event.target.parentElement.lastChild;
            let tooltipText = tooltip.innerHTML;

            tooltip.innerHTML = tooltipText.replace('Show', 'Hide');
        }
        data.toggle = !data.toggle;
    });
};

let displayAllMarkers = (event) => {
    map.removeLayer(markers);
    event.target.parentElement.firstChild.className = `mdi mdi-hexagon-multiple-outline`;

    map.addLayer(geoJSON);
};

let addCustomControls = () => {
    if (nrOfMarkers <= 50000) {AddMarkerOptionsBtn();}
    AddCountryBtn();
    AddBoundsBtn();
    AddDisplayMarkersBtn();
    AddDownloadBtn();
};

function AddMarkerOptionsBtn() {
    let controlData = {
        iconName: 'mdi-map-marker-multiple-outline',
        id: 'display-all-markers',
        tooltipText: 'Hide marker clusters',
    };

    customControl(controlData);
    addAllMarkersListener();
}

function AddDownloadBtn() {
    let controlData = {
        iconName: 'mdi-file-download-outline',
        id: 'download',
        tooltipText: 'Download all coordinates',
    };

    customControl(controlData);
    addDownloadListener();
}

function AddCountryBtn() {
    let controlData = {
        iconName: 'mdi-earth-off',
        id: 'country-border',
        tooltipText: 'Hide country border line',
    };

    let listenerData = {
        id: 'country-border',
        layer: country,
        trueIcon: 'mdi-earth',
        falseIcon: 'mdi-earth-off',
        toggle: countryToggle,
    };

    customControl(controlData);
    addListener(listenerData);
}

function AddBoundsBtn() {
    let controlData = {
        iconName: 'mdi-checkbox-blank-outline',
        id: 'eye',
        tooltipText: 'Show bound rectangle',
    };

    let listenerData = {
        id: 'eye',
        layer: bounds,
        trueIcon: 'mdi-checkbox-blank-outline',
        falseIcon: 'mdi-checkbox-blank-off-outline',
        toggle: boundsToggle,
    };

    customControl(controlData);
    addListener(listenerData);
}

function AddDisplayMarkersBtn() {
    let controlData = {
        iconName: 'mdi-map-marker-off-outline',
        id: 'markers',
        tooltipText: 'Hide all markers',
    };

    let listenerData = {
        id: 'markers',
        layer: markers,
        trueIcon: 'mdi-map-marker-outline',
        falseIcon: 'mdi-map-marker-off-outline',
        toggle: markersToggle,
    };

    customControl(controlData);
    addListener(listenerData);
    return controlData;
}


let addAllMarkersListener = () => {
    document.getElementById('display-all-markers').addEventListener('click', (event) => {
        if (!allMarkerToggle) {
            if (nrOfMarkers >= 1000) {
                let first = 0;
                let modal = document.getElementById("myModal");
                let close = document.getElementsByClassName('close')[first];
                let cancel = document.getElementsByClassName('cancelbtn')[first];
                let yes = document.getElementsByClassName('yesbtn')[first];

                modal.style.display = "block";

                close.onclick = () => modal.style.display = "none";
                cancel.onclick = () => modal.style.display = "none";

                window.onclick = function (event) {
                    if (event.target === modal) {
                        modal.style.display = "none";
                    }
                };

                yes.onclick = () => {
                    displayAllMarkers(event);
                    modal.style.display = "none";

                    let tooltip = event.target.nextElementSibling;
                    let tooltipText = tooltip.innerHTML;

                    tooltip.innerHTML = tooltipText.replace('Hide', 'Show');
                };
            } else {
                displayAllMarkers(event);

                let tooltip = event.target.parentElement.lastChild;
                let tooltipText = tooltip.innerHTML;

                tooltip.innerHTML = tooltipText.replace('Hide', 'Show');
            }
        } else {
            map.removeLayer(geoJSON);
            map.addLayer(markers);
            event.target.parentElement.firstChild.className = `mdi mdi-map-marker-multiple-outline`;

            let tooltip = event.target.parentElement.lastChild;
            let tooltipText = tooltip.innerHTML;

            tooltip.innerHTML = tooltipText.replace('Show', 'Hide');
        }
        allMarkerToggle = !allMarkerToggle;
    });
};

let addDownloadListener =() => {
    document.getElementById('download').addEventListener('click', () => {
        let dataStr = {
            coordinates: coordinates
        };
        dataStr = JSON.stringify(dataStr);

        let dataUri = 'data:coordinates/json;charset=utf-8,' + encodeURIComponent(dataStr);

        let exportFileDefaultName = 'coordinates.json';

        let linkElement = document.createElement('a');

        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    });
};
