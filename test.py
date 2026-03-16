import json

with open("data/countries.json") as f:
    countries = json.load(f)

metrics = ["band_count", "bands_per_million", "bands_per_10k_km2", "bands_per_pop_density"]

for metric in metrics:
    print(f"\nTop 10 by {metric}:")
    sorted_countries = sorted(
        [(name, c[metric]) for name, c in countries.items() if c[metric]],
        key=lambda x: x[1],
        reverse=True
    )[:10]
    for name, value in sorted_countries:
        print(f"  {name}: {value}")