
// Map instance — declared here so other files can access it
var map;
function buildMap() {
    try {
        map = L.map('map').setView(MAP_CENTER, MAP_ZOOM);
        L.tileLayer(TILE_URL, TILE_OPTIONS).addTo(map);
        buildChoropleth('band_count');
    } catch(err) {
        console.error('buildMap crashed:', err);
    }
}
    
function buildClusters() {
    const clusterGroup = L.markerClusterGroup();
    for (let feature of STATE.bands.features) {
        const coords = feature.geometry.coordinates;
        const marker = L.circleMarker([coords[1], coords[0]], {
            radius: 8,
            fillColor: '#c0392b',
            color: '#000',
            weight: 1,
            fillOpacity: 0.8
        });
        const p = feature.properties;
marker.on('click', e => {
    L.DomEvent.stopPropagation(e);
    showBandSidebar(feature.properties);
});
        clusterGroup.addLayer(marker);
    }
    map.addLayer(clusterGroup);

}

function buildChoropleth(metric) {
    metric = metric || 'band_count';

    const values = Object.values(STATE.countries)
        .map(c => c[metric])
        .filter(v => v !== null && v > 0);

    const breaks = ss.jenks(values, 7);

    function getColor(value) {
        if (!value || value <= 0) return '#1a1a1a';
        for (let i = 0; i < breaks.length - 3; i++) {
            if (value <= breaks[i + 1]) return COLORS[i];
        }
        return COLORS[COLORS.length - 1];
    }

    if (window.choroplethLayer) {
        map.removeLayer(window.choroplethLayer);
    }

    window.choroplethLayer = L.geoJSON(STATE.world, {
        style: feature => {
            const geoName  = feature.properties.name;
            const dataName = NAME_FIX[geoName] || geoName;
            const country  = STATE.countries[dataName];
            const value    = country ? country[metric] : 0;
            return {
                fillColor:   getColor(value),
                fillOpacity: 0.8,
                color:       '#333',
                weight:      0.5
            };
        },
        onEachFeature: (feature, layer) => {
            layer.on({
                mouseover: e => {
                    e.target.setStyle({
                        weight:      2,
                        color:       '#fff',
                        fillOpacity: 0.9
                    });
                },
                mouseout: e => {
                    window.choroplethLayer.resetStyle(e.target);
                },
                click: e => {
                    const geoName  = feature.properties.name;
                    const dataName = NAME_FIX[geoName] || geoName;
                    map.fitBounds(e.target.getBounds());
                    showCountrySidebar(dataName);
                }
            });
        }
    });
}

function toggleChoropleth(show) {
    if (show) {
        window.choroplethLayer.addTo(map);
    } else {
        map.removeLayer(window.choroplethLayer);
    }
}

function updateChoroplethMetric(metric) {
    // rebuild choropleth with new metric
    map.removeLayer(window.choroplethLayer);
    buildChoropleth(metric);
    window.choroplethLayer.addTo(map);
}