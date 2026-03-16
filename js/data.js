// Global application state — populated by loadData()
const STATE = {
    countries: null,
    world:     null,
    themes:    null,
    timeline:  null,
    bands:     null
};

function loadData() {
    
    return Promise.all([
        fetch(DATA_PATHS.countries).then(r => r.json()),
        fetch(DATA_PATHS.world).then(r => r.json()),
        fetch(DATA_PATHS.themes).then(r => r.json()),
        fetch(DATA_PATHS.timeline).then(r => r.json()),
    ]).then(([countries, world, themes, timeline]) => {
        STATE.countries = countries;
        STATE.world     = world;
        STATE.themes    = themes;
        STATE.timeline  = timeline;
        console.log('Core data loaded');
    });
}
function loadBands() {
    return fetch(DATA_PATHS.bands)
        .then(r => r.json())
        .then(bands => {
            STATE.bands = bands;
            console.log('Bands loaded:', bands.features.length);
        });
}