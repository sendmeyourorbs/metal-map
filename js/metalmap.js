
var map;
function buildMap() {
    try {
        map = L.map('map').setView(MAP_CENTER, MAP_ZOOM);
        L.tileLayer(TILE_URL, TILE_OPTIONS).addTo(map);
        buildChoropleth('band_count');

        window.clickLayer = L.geoJSON(STATE.world, {
            style: { fillOpacity: 0, opacity: 0, weight: 0 },
            onEachFeature: (feature, layer) => {
                layer.on({
                    click: e => {
                        L.DomEvent.stopPropagation(e);
                        const geoName  = feature.properties.name;
                        const dataName = NAME_FIX[geoName] || geoName;
                        const center   = COUNTRY_CENTERS[dataName];
                        if (center) {
                            map.flyTo(center, 5);
                        } else {
                            const bounds = e.target.getBounds();
                            const size   = bounds.getNorthEast().distanceTo(bounds.getSouthWest());
                            if (size > 5000000) {
                                map.flyTo(bounds.getCenter(), 5);
                            } else {
                                map.fitBounds(bounds, { padding: [20, 20] });
                            }
                        }
                        showCountrySidebar(dataName);
                    }
                });
            }
        }).addTo(map);

        window.clickLayer.bringToFront();

    } catch(err) {
        console.error('buildMap crashed:', err);
    }
}
    
function buildClusters() {
const clusterGroup = L.markerClusterGroup({
    zoomToBoundsOnClick: true,
    spiderfyOnMaxZoom: false,
    iconCreateFunction: cluster => {
        const markers = cluster.getAllChildMarkers();
        const total = markers.reduce((sum, m) => sum + m.bandCount, 0);
        const size = total > 1000 ? 44 : total > 100 ? 36 : 28;
        return L.divIcon({
            html: `<div style="width:${size}px;height:${size}px;line-height:${size}px;text-align:center;background:rgba(192,57,43,0.8);border-radius:50%;color:white;font-size:11px;">${total.toLocaleString()}</div>`,
            className: '',
            iconSize: [size, size]
        });
    }
});
    for (let city of Object.values(STATE.cities)) {
        const key = `${city.location}|${city.country}`;
        const marker = L.circleMarker([city.lat, city.lng], {
            radius: 8,
            fillColor: '#c0392b',
            color: '#000',
            weight: 1,
            fillOpacity: 0.8
        });
        marker.bandCount = city.band_count; 
        marker.cityKey = key;
        marker.cityLocation = city.location;
        marker.cityCountry = city.country;
     marker.on('click', e => {
    console.log('city clicked:', key);
    showCitySidebar(key);
});
        clusterGroup.addLayer(marker);
    
    }
    clusterGroup.on('clusterclick', e => {
    const markers = e.layer.getAllChildMarkers();
    console.log('first marker:', markers[0].cityKey, markers[0].cityLocation);
    const cities = markers.map(m => ({
        cityKey: m.cityKey,
        location: m.cityLocation,
        country: m.cityCountry,
        band_count: m.bandCount
    })).sort((a, b) => b.band_count - a.band_count)
    ;
    
    showClusterSidebar(cities);
    L.DomEvent.stopPropagation(e);
});
    map.addLayer(clusterGroup);
}
function buildChoropleth(metric, customData) {
    metric = metric || 'band_count';

    const values = Object.entries(STATE.countries).map(([name, c]) => {
        if (customData) return customData[name] || 0;
        return c[metric] || 0;
    }).filter(v => v > 0);

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
            let value;
            if (customData) {
                value = customData[dataName] || 0;
            } else {
                value = country ? country[metric] : 0;
            }
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
                    e.target.setStyle({ weight: 2, color: '#fff', fillOpacity: 0.9 });
                },
                mouseout: e => {
                    window.choroplethLayer.resetStyle(e.target);
                }
            });
        }
    });
}
function toggleChoropleth(show) {
    if (show) {
        window.choroplethLayer.addTo(map);
        window.clickLayer.bringToFront();
    } else {
        map.removeLayer(window.choroplethLayer);
    }
}
function updateChoroplethMetric(metric) {
    const isVisible = map.hasLayer(window.choroplethLayer);
    buildChoropleth(metric);
    if (isVisible) window.choroplethLayer.addTo(map);
}

function buildThemeChoropleth(theme) {
    const customData = {};
    Object.entries(STATE.countries).forEach(([name, c]) => {
        const count = c.themes[theme] || 0;
if (count > 0 && c.band_count >= 10) {
    customData[name] = Math.round((count / c.band_count) * 10000) / 100;
}
    });
    const isVisible = map.hasLayer(window.choroplethLayer);
    buildChoropleth(null, customData);
    if (isVisible || true) window.choroplethLayer.addTo(map);
}