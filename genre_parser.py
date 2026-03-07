# genre_parser.py

# Maps raw genre tokens (lowercase) to primary tags
PRIMARY_MAP = {
    # Death Metal family
    "death metal": "Death Metal",
    "death": "Death Metal",
    "death 'n' roll": "Death Metal",
    "thrash 'n' roll": "Death Metal",
    "brutal death metal": "Death Metal",
    "brutal death": "Death Metal",
    "technical death metal": "Death Metal",
    "technical death": "Death Metal",
    "industrial black metal": "Black Metal",
    "industrial black": "Black Metal",
    "industrial death metal": "Death Metal",
    "industrial death": "Death Metal",

    # Black Metal family
    "black metal": "Black Metal",
    "black": "Black Metal",
    "black 'n' roll": "Black Metal",
    "raw black metal": "Black Metal",
    "raw black": "Black Metal",

    # Thrash Metal family
    "thrash metal": "Thrash Metal",
    "thrash": "Thrash Metal",
    "speed metal": "Thrash Metal",
    "speed": "Thrash Metal",

    # Heavy Metal family
    "heavy metal": "Heavy Metal",
    "heavy": "Heavy Metal",
    "nwobhm": "Heavy Metal",
    "southern metal": "Heavy Metal",
    "southern rock": "Heavy Metal",
    "southern": "Heavy Metal",

    # Doom Metal family
    "doom metal": "Doom Metal",
    "doom": "Doom Metal",
    "stoner metal": "Doom Metal",
    "stoner rock": "Doom Metal",
    "stoner doom": "Doom Metal",
    "stoner": "Doom Metal",
    "drone metal": "Doom Metal",
    "drone doom": "Doom Metal",
    "funeral doom metal": "Doom Metal",
    "funeral doom": "Doom Metal",
    "death doom metal": "Doom Metal",
    "death doom": "Doom Metal",
    "doom death metal": "Doom Metal",
    "doom death": "Doom Metal",

    # Sludge Metal family
    "sludge metal": "Sludge Metal",
    "sludge": "Sludge Metal",
    "sludge doom": "Sludge Metal",
    "doom sludge": "Sludge Metal",
    "sludge doom metal": "Sludge Metal",
    "doom sludge metal": "Sludge Metal",
    "sludge/doom metal": "Sludge Metal",
    "doom/sludge metal": "Sludge Metal",
    "sludge/doom": "Sludge Metal",
    "doom/sludge": "Sludge Metal",
    
    # Grindcore family
    "grindcore": "Grindcore",
    "goregrind": "Grindcore",
    "cybergrind": "Grindcore",
    "grind": "Grindcore",

    # Progressive Metal family
    "progressive metal": "Progressive Metal",
    "progressive": "Progressive Metal",
    "avant-garde metal": "Progressive Metal",
    "avant-garde": "Progressive Metal",
    "shred": "Progressive Metal",
    "avant garde metal": "Progressive Metal",
    "avant garde": "Progressive Metal",

    # Power Metal family
    "power metal": "Power Metal",
    "power": "Power Metal",

    # Gothic Metal family
    "gothic metal": "Gothic Metal",
    "gothic": "Gothic Metal",
    "symphonic metal": "Gothic Metal",
    "darkwave": "Gothic Metal",

    # Metalcore / Deathcore
    "metalcore": "Metalcore",
    "deathcore": "Deathcore",

    # Hardcore / Punk family
    "hardcore": "Hardcore",
    "powerviolence": "Hardcore",
    "crossover": "Hardcore",
    "oi!": "Punk",
    "oi": "Punk",
    "punk": "Punk",
    "crust punk": "Crust Punk",
    "crust": "Crust Punk",
    "rac": "Punk",

    # Industrial
    "industrial metal": "Industrial Metal",
    "industrial": "Industrial Metal",

    # Nu Metal / Groove
    "nu metal": "Nu Metal",
    "nu-metal": "Nu Metal",
    "groove metal": "Nu Metal",
    "groove": "Nu Metal",

    # Post Metal
    "post-metal": "Post Metal",
    "post metal": "Post Metal",

    # Folk Metal family
    "folk metal": "Folk Metal",
    "folk": "Folk Metal",
    "viking metal": "Folk Metal",
    "viking": "Folk Metal",
    "pagan metal": "Folk Metal",
    "pagan": "Folk Metal",

    # Ambient
    "ambient": "Ambient",
    "dark ambient": "Ambient",
    "dungeon synth": "Ambient",

    # Rock family
    "hard rock": "Rock",
    "rock": "Rock",
    "grunge": "Rock",
    "alternative rock": "Rock",
    "alternative": "Rock",
}

# Secondary tags — these modify primary tags
SECONDARY_TAGS = {
    "melodic", "atmospheric", "raw", "blackened", "brutal",
    "depressive", "epic", "technical", "experimental", "neoclassical",
    "symphonic", "progressive", "funeral", "drone", "noise",
    "slam", "post", "shoegaze"
}

# Tokens to discard entirely
DISCARD = {
    "djent", "psychedelic", "fusion", "various", "electronic",
    "rap", "jazz", "classical", "country"
}   

import re

def parse_genre(raw):
    """
    Takes a raw genre string from Metal Archives.
    Returns a tuple of (primary_tags, secondary_tags) where both are lists.
    """
    # Try matching the full unsplit string first
    full = raw.strip().lower()
    full = re.sub(r'\(.*?\)', '', full).strip()
    if full in PRIMARY_MAP:
        return [PRIMARY_MAP[full]], []

    if not raw or raw.strip() == "N/A":
        return [], []

    primary_tags = []
    secondary_tags = []

    # Strip (early), (later), (early-mid) etc. but process both sides
    raw = re.sub(r'(?<=[a-zA-Z])-(?=[a-zA-Z])', ' ', raw)

    # Split on / and comma — each part is a potential genre token
    parts = re.split(r'[/,]', raw)

    for part in parts:
        part = part.strip().lower()

        if not part:
            continue

        # Check discard list first
        if part in DISCARD:
            continue
        
        # Extract secondary modifiers before primary lookup
        for secondary in SECONDARY_TAGS:
            if part.startswith(secondary + " "):
                if secondary not in secondary_tags:
                    secondary_tags.append(secondary)
                part = part[len(secondary):].strip()
                break


        # Check primary map
        if part in PRIMARY_MAP:
            tag = PRIMARY_MAP[part]
            if tag not in primary_tags:
                primary_tags.append(tag)
            continue

        # Check secondary tags
        if part in SECONDARY_TAGS:
            if part not in secondary_tags:
                secondary_tags.append(part)
            continue

        # Try matching multi-word secondaries within the part
        # e.g. "melodic death" should give Death Metal + Melodic secondary
        for secondary in SECONDARY_TAGS:
            if secondary in part:
                if secondary not in secondary_tags:
                    secondary_tags.append(secondary)
                # Strip the secondary word and check remainder
                remainder = part.replace(secondary, "").strip()
                if remainder in PRIMARY_MAP:
                    tag = PRIMARY_MAP[remainder]
                    if tag not in primary_tags:
                        primary_tags.append(tag)

    # Special case: drone always adds secondary tag
    if "Doom Metal" in primary_tags and "drone" not in secondary_tags:
        for part in re.split(r'[/,]', raw.lower()):
            if "drone" in part:
                secondary_tags.append("drone")
                break

    return primary_tags, secondary_tags

if __name__ == "__main__":
    tests = [
        "Depressive Black/Doom Metal",
        "Post-Black Metal/Shoegaze",
        "Industrial Black/Death Metal",
        "Pagan/Folk Metal",
        "NWOBHM/Heavy Metal",
        "Ambient/Drone",
        "Funeral Doom/Death Metal",
        "Avant-garde/Progressive Metal",
        "Avant-garde Metal",
    ]

    for t in tests:
        primary, secondary = parse_genre(t)
        print(f"Input:     {t}")
        print(f"Primary:   {primary}")
        print(f"Secondary: {secondary}")
        print()