import sqlite3
import json
import os
import re
from country_map import COUNTRY_MAP
from genre_parser import parse_genre
from theme_normalizer import parse_themes

# --- Config ---
DB_PATH = "bands_with_coords.db"
FACTBOOK_PATH = "factbook.json"
OUTPUT_DIR = "data"

os.makedirs(OUTPUT_DIR, exist_ok=True)

# --- Load bands from db ---
conn = sqlite3.connect(DB_PATH)
conn.row_factory = sqlite3.Row
cursor = conn.cursor()
cursor.execute("SELECT * FROM bands_with_coords")
bands = cursor.fetchall()
conn.close()

print(f"Loaded {len(bands)} bands")

def parse_number(text):
    if not text:
        return None
    # Take only the first part before semicolon or parenthesis
    text = text.split(';')[0].split('(')[0]
    # Remove units and commas
    text = re.sub(r'[^\d.]', '', text)
    if not text:
        return None
    return int(float(text))

# --- Load Factbook data per country ---
factbook_data = {}

for country, entry in COUNTRY_MAP.items():
    if entry is None:
        continue
    code, region = entry
    path = os.path.join(FACTBOOK_PATH, region, f"{code}.json")
    with open(path, encoding="utf-8") as f:
        fb = json.load(f)
    try:
        pop_text = fb["People and Society"]["Population"]["total"]["text"]
        population = parse_number(pop_text)
    except KeyError:
        population = None
    try:
        area_text = fb["Geography"]["Area"]["total "]["text"]
        area_km2 = parse_number(area_text)
    except KeyError:
        area_km2 = None

    factbook_data[country] = {
        "population": population,
        "area_km2": area_km2
    }

print(f"Loaded Factbook data for {len(factbook_data)} countries")

# --- Aggregate bands per country ---
from collections import defaultdict

country_stats = defaultdict(lambda: {
    "band_count": 0,
    "themes": defaultdict(int),
    "genres": defaultdict(int),
    "secondary_tags": defaultdict(int),
    "statuses": defaultdict(int),
    "formed_years": defaultdict(int)
})

for band in bands:
    country = band["country_of_origin"]
    stats = country_stats[country]
    stats["band_count"] += 1

    # Lyrical themes — split on comma, strip whitespace
    for theme in parse_themes(band["lyrical_themes"]):
        stats["themes"][theme] += 1

    # Genre — parse using genre_parser
    primary, secondary = parse_genre(band["genre"])
    for tag in primary:
        stats["genres"][tag] += 1
    for tag in secondary:
        stats["secondary_tags"][tag] += 1

    # Status
    if band["status"]:
        stats["statuses"][band["status"]] += 1

    # Formation year
    if band["formed_in"] and band["formed_in"] != "N/A":
        stats["formed_years"][band["formed_in"]] += 1

print(f"Aggregated stats for {len(country_stats)} countries")

# --- Build countries.json ---
countries_output = {}

for country, stats in country_stats.items():
    fb = factbook_data.get(country)  # None if territory or unknown

    band_count = stats["band_count"]
    population = fb["population"] if fb else None
    area_km2 = fb["area_km2"] if fb else None
    population = fb["population"] if fb else None
    area_km2 = fb["area_km2"] if fb else None
    pop_density = round(population / area_km2, 4) if population and area_km2 else None

    countries_output[country] = {
        "band_count": band_count,
        "population": population,
        "area_km2": area_km2,
        "bands_per_million": round((band_count / population) * 1_000_000, 4) if population else None,
        "bands_per_10k_km2": round((band_count / area_km2) * 10_000, 4) if area_km2 else None,
        "bands_per_pop_density": round(band_count / pop_density, 4) if pop_density else None,
        "themes": dict(stats["themes"]),
        "genres": dict(stats["genres"]),
        "statuses": dict(stats["statuses"]),
        "formed_years": dict(stats["formed_years"])
    }

with open(os.path.join(OUTPUT_DIR, "countries.json"), "w", encoding="utf-8") as f:
    json.dump(countries_output, f, ensure_ascii=False)

print(f"Written countries.json with {len(countries_output)} entries")

# --- Build themes.json (global theme frequencies) ---
global_themes = defaultdict(int)

for stats in country_stats.values():
    for theme, count in stats["themes"].items():
        global_themes[theme] += count

global_themes_sorted = dict(sorted(global_themes.items(), key=lambda x: x[1], reverse=True))

with open(os.path.join(OUTPUT_DIR, "themes.json"), "w", encoding="utf-8") as f:
    json.dump(global_themes_sorted, f, ensure_ascii=False)

print(f"Written themes.json with {len(global_themes_sorted)} unique themes")

# --- Build timeline.json (band counts by formation year) ---
global_years = defaultdict(int)

for stats in country_stats.values():
    for year, count in stats["formed_years"].items():
        global_years[year] += count

global_years_sorted = dict(sorted(global_years.items()))

with open(os.path.join(OUTPUT_DIR, "timeline.json"), "w", encoding="utf-8") as f:
    json.dump(global_years_sorted, f, ensure_ascii=False)

print(f"Written timeline.json with {len(global_years_sorted)} years")

# --- Build bands.geojson ---
features = []

for band in bands:
    if band["latitude"] is None or band["longitude"] is None:
        continue
    feature = {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [band["longitude"], band["latitude"]]
        },
        "properties": {
            "name": band["band_name"],
            "url": band["url"],
            "country": band["country_of_origin"],
            "location": band["location"],
            "status": band["status"],
            "formed": band["formed_in"],
            "genre": band["genre"],
            "themes": band["lyrical_themes"],
            "label": band["current_label"],
            "primary_genres": parse_genre(band["genre"])[0],
            "parsed_themes": parse_themes(band["lyrical_themes"]),
        }
    }
    features.append(feature)

geojson = {
    "type": "FeatureCollection",
    "features": features
}

with open(os.path.join(OUTPUT_DIR, "bands.geojson"), "w", encoding="utf-8") as f:
    json.dump(geojson, f, ensure_ascii=False)

print(f"Written bands.geojson with {len(features)} features")