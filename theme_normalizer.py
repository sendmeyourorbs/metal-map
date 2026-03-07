# theme_normalizer.py

THEME_MAP = {
    # Hate
    "hatred": "Hate",

    # Satanism
    "satan": "Satanism",
    "satanic": "Satanism",
    "devil worship": "Satanism",
    "luciferianism": "Satanism",
    "demonology": "Satanism",
    

    # Anti-Christianity
    "anti-christian": "Anti-Christianity",
    "anti-religious": "Anti-Christianity",
    "anti-religion": "Anti-Christianity",

    # Occultism
    "occult": "Occultism",
    "the occult": "Occultism",
    "black magic": "Occultism",
    "black Magic": "Occultism",
    "magick": "Occultism",
    "sorcery": "Occultism",
    "necromancy": "Occultism",
    "witchcraft": "Occultism",
    "witchery": "Occultism",
    "witches": "Occultism",
    "alchemy": "Occultism",

    # Society
    "social issues": "Society",
    "social": "Society",
    "social problems": "Society",
    "social themes": "Society",
    "social criticism": "Society",
    "social commentary": "Society",
    "social denounce": "Society",

    # Personal Struggles
    "inner struggles": "Personal Struggles",
    "personal struggles": "Personal Struggles",
    "internal struggles": "Personal Struggles",
    "inner struggle": "Personal Struggles",
    "personal issues": "Personal Struggles",
    "life struggles": "Personal Struggles",
    "struggle": "Personal Struggles",
    "struggles": "Personal Struggles",
    "personal experiences": "Personal Struggles",
    "personal thoughts": "Personal Struggles",
    "personal feelings": "Personal Struggles",
    "personal": "Personal Struggles",
    "life experiences": "Personal Struggles",

    # Politics
    "political": "Politics",
    "political issues": "Politics",

    # Mythology
    "myths": "Mythology",

    # Norse Mythology
    "norse mythology": "Norse Mythology",

    # Insanity
    "madness": "Insanity",
    "mental illness": "Insanity",
    "mental disorders": "Insanity",
    "psychosis": "Insanity",

    # Lovecraft
    "h.p. lovecraft": "Lovecraft",

    # Battles
    "battle": "Battles",
    "epic battles": "Battles",

    # War
    "warfare": "War",
    "wars": "War",

    # Murder
    "murders": "Murder",
    "killing": "Murder",

    # Instrumental
    "mostly instrumental": "Instrumental",

    # Emotions
    "feelings": "Emotions",
    "human feelings": "Emotions",
    "human nature": "Emotions",
    "human behaviour": "Emotions",
    "inner thoughts": "Emotions",
    "thoughts": "Emotions",

    # Drugs
    "weed": "Drugs",
    "marijuana": "Drugs",
    "drug abuse": "Drugs",
    "addiction": "Drugs",

    # Alcohol
    "booze": "Alcohol",
    "drinking": "Alcohol",
    "alcoholism": "Alcohol",
    "beer": "Alcohol",

    # Humour
    "sick humour": "Humour",
    "dark humour": "Humour",
    "comedy": "Humour",
    "parody": "Humour",
    "nonsense": "Humour",
    "fun": "Humour",
    "sarcasm": "Humour",

    # Esotericism
    "esoteric": "Esotericism",

    # Misanthropy
    "anti-human": "Misanthropy",
    "anti-humanity": "Misanthropy",

    # Spirituality
    "spiritual": "Spirituality",
    "spiritualism": "Spirituality",

    # Abstract
    "abstract themes": "Abstract",

    # Epic
    "epic themes": "Epic",
    "epic fantasy": "Epic",
    "epic battles": "Battles",

    # Disease
    "diseases": "Disease",

    # Perversion
    "perversions": "Perversion",

    # Metal (bands singing about metal itself)
    "metal": "Metal",
    "heavy metal": "Metal",
    "rock": "Metal",
    "rock 'n' roll": "Metal",
    "thrashing": "Metal",
    "thrash": "Metal",
    "hard rock": "Metal",

    # Far Right
    "national socialism": "Far Right",
    "antisemitism": "Far Right",
    "racism": "Far Right",
    "aryanism": "Far Right",
    "white nationalism": "Far Right",
    "nationalism": "Far Right",

    # Discard — return None
    "patriotism": None,
    "various": None,
    "stories": None,

}

# Themes to discard entirely
DISCARD_THEMES = {
    "patriotism", "various", "stories",
}

def normalize_theme(raw_theme):
    """
    Takes a single theme string, returns canonical form or None if discarded.
    """
    if not raw_theme:
        return None
    cleaned = raw_theme.strip()
    lookup = cleaned.lower()
    if lookup in THEME_MAP:
        return THEME_MAP[lookup]
    # Return title-cased original if not in map
    return cleaned.title() if cleaned else None


def parse_themes(raw):
    """
    Takes a raw lyrical themes string from Metal Archives.
    Returns a list of normalized theme strings.
    """
    if not raw or raw.strip() == "N/A":
        return []

    themes = []
    for part in raw.split(","):
        normalized = normalize_theme(part)
        if normalized and normalized not in themes:
            themes.append(normalized)

    return themes

if __name__ == "__main__":
    tests = [
        "Death, War, Satanism",
        "Anti-Christian, Blasphemy, Satan",
        "National Socialism, Racism, War",
        "Inner struggles, Personal issues, Depression",
        "H.P. Lovecraft, Mythology, Fantasy",
        "Weed, Alcohol, Partying",
        "Mostly instrumental",
        "N/A",
        "Social issues, Politics, Corruption",
    ]
    for t in tests:
        print(f"Input:  {t}")
        print(f"Output: {parse_themes(t)}")
        print()