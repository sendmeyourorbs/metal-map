import json

with open("data/cities.json") as f:
    cities = json.load(f)

city = cities.get("St. Petersburg|Russia")
if city:
    print(city['lat'], city['lng'])     