console.log('map.js parsing started');

// Map instance — declared here so other files can access it
var map;
var buildMap = function() {
    
    console.log('buildMap called');
    console.log('STATE.countries:', STATE.countries);
    console.log('STATE.world:', STATE.world);
    // Initialise map
    map = L.map('map').setView(MAP_CENTER, MAP_ZOOM);

    // Add tile layer
    L.tileLayer(TILE_URL, TILE_OPTIONS).addTo(map);

    // Build choropleth using STATE data
    const values = Object.values(STATE.countries)
        .map(c => c.band_count)
        .filter(v => v > 0);

    const breaks = ss.jenks(values, 7);

    function getColor(count) {
        if (count <= 0) return '#1a1a1a';
        for (let i = 0; i < breaks.length - 3; i++) {
            if (count <= breaks[i + 1]) return COLORS[i];
        }
        return COLORS[COLORS.length - 1];
    }

    const choropleth = L.geoJSON(STATE.world, {
        style: feature => {
            const geoName  = feature.properties.name;
            const dataName = NAME_FIX[geoName] || geoName;
            const country  = STATE.countries[dataName];
            const count    = country ? country.band_count : 0;
            return {
                fillColor:   getColor(count),
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
                    choropleth.resetStyle(e.target);
                },
                click: e => {
                    const geoName  = feature.properties.name;
                    const dataName = NAME_FIX[geoName] || geoName;
                    map.fitBounds(e.target.getBounds());
                    showCountrySidebar(dataName);
                }
            });
        }
    }).addTo(map);
}
console.log('map.js parsing finished');