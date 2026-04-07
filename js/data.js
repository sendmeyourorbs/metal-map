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
        fetch(DATA_PATHS.genre_timeline).then(r => r.json()),
    ]).then(([countries, world, themes, timeline, genre_timeline]) => {
        STATE.countries = countries;
        STATE.world = world;
        STATE.themes = themes;
        STATE.timeline = timeline;
        STATE.genre_timeline = genre_timeline;
        console.log('genre_timeline keys:', Object.keys(STATE.genre_timeline));
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

function loadCities() {
    return fetch(DATA_PATHS.cities)
        .then(r => r.json())
        .then(cities => {
            STATE.cities = cities;
            console.log('Cities loaded:', Object.keys(cities).length);
        });
}