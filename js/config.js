// Name translation: GeoJSON names → our database names
const NAME_FIX = {
    "United States of America": "United States",
    "South Korea":              "Korea, South",
    "Turkey":                   "Türkiye",
    "Republic of Serbia":       "Serbia",
    "Hong Kong S.A.R.":         "Hong Kong",
};

// Jenks classification colors (7 classes, ColorBrewer YlOrRd)
const COLORS = ['#ffffb2','#fed976','#feb24c','#fd8d3c','#fc4e2a','#e31a1c','#b10026'];

// Map starting position
const MAP_CENTER = [20, 10];
const MAP_ZOOM   = 3;

// Tile layer URL and options
const TILE_URL = 'https://tiles.stadiamaps.com/tiles/stamen_toner_dark/{z}/{x}/{y}{r}.{ext}';
const TILE_OPTIONS = {
    minZoom: 0,
    maxZoom: 20,
    attribution: '&copy; Stadia Maps &copy; Stamen Design &copy; OpenMapTiles &copy; OpenStreetMap contributors',
    ext: 'png'
};

// Data file paths
const DATA_PATHS = {
    countries: 'data/countries.json',
    world:     'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson',
    bands:     'data/bands.geojson',
    themes:    'data/themes.json',
    timeline:  'data/timeline.json'
};