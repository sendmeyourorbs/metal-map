# Maps country names as they appear in bands_with_coords.db
# to their corresponding CIA Factbook JSON file paths.
# Value is (cia_code, region_folder) — used to build path:
#   factbook.json/{region_folder}/{cia_code}.json
#
# Countries marked None have no Factbook entry (territories, special cases).
# These will be excluded from per-capita analysis but still appear on the map.

COUNTRY_MAP = {
    # --- Sovereign states with Factbook entries ---
    "Afghanistan":              ("af", "south-asia"),
    "Albania":                  ("al", "europe"),
    "Algeria":                  ("ag", "africa"),
    "Andorra":                  ("an", "europe"),
    "Angola":                   ("ao", "africa"),
    "Argentina":                ("ar", "south-america"),
    "Armenia":                  ("am", "middle-east"),
    "Australia":                ("as", "australia-oceania"),
    "Austria":                  ("au", "europe"),
    "Azerbaijan":               ("aj", "middle-east"),
    "Bahrain":                  ("ba", "middle-east"),
    "Bangladesh":               ("bg", "south-asia"),
    "Barbados":                 ("bb", "central-america-n-caribbean"),
    "Belarus":                  ("bo", "europe"),
    "Belgium":                  ("be", "europe"),
    "Belize":                   ("bh", "central-america-n-caribbean"),
    "Bolivia":                  ("bl", "south-america"),
    "Bosnia and Herzegovina":   ("bk", "europe"),
    "Botswana":                 ("bc", "africa"),
    "Brazil":                   ("br", "south-america"),
    "Brunei":                   ("bx", "east-n-southeast-asia"),
    "Bulgaria":                 ("bu", "europe"),
    "Cambodia":                 ("cb", "east-n-southeast-asia"),
    "Canada":                   ("ca", "north-america"),
    "Chile":                    ("ci", "south-america"),
    "China":                    ("ch", "east-n-southeast-asia"),
    "Colombia":                 ("co", "south-america"),
    "Costa Rica":               ("cs", "central-america-n-caribbean"),
    "Croatia":                  ("hr", "europe"),
    "Cuba":                     ("cu", "central-america-n-caribbean"),
    "Cyprus":                   ("cy", "europe"),
    "Czechia":                  ("ez", "europe"),
    "Denmark":                  ("da", "europe"),
    "Dominican Republic":       ("dr", "central-america-n-caribbean"),
    "East Timor":               ("tt", "east-n-southeast-asia"),
    "Ecuador":                  ("ec", "south-america"),
    "Egypt":                    ("eg", "africa"),
    "El Salvador":              ("es", "central-america-n-caribbean"),
    "Estonia":                  ("en", "europe"),
    "Ethiopia":                 ("et", "africa"),
    "Finland":                  ("fi", "europe"),
    "France":                   ("fr", "europe"),
    "Georgia":                  ("gg", "middle-east"),
    "Germany":                  ("gm", "europe"),
    "Greece":                   ("gr", "europe"),
    "Guatemala":                ("gt", "central-america-n-caribbean"),
    "Guyana":                   ("gy", "south-america"),
    "Honduras":                 ("ho", "central-america-n-caribbean"),
    "Hong Kong":                ("hk", "east-n-southeast-asia"),
    "Hungary":                  ("hu", "europe"),
    "Iceland":                  ("ic", "europe"),
    "India":                    ("in", "south-asia"),
    "Indonesia":                ("id", "east-n-southeast-asia"),
    "Iran":                     ("ir", "middle-east"),
    "Iraq":                     ("iz", "middle-east"),
    "Ireland":                  ("ei", "europe"),
    "Israel":                   ("is", "middle-east"),
    "Italy":                    ("it", "europe"),
    "Jamaica":                  ("jm", "central-america-n-caribbean"),
    "Japan":                    ("ja", "east-n-southeast-asia"),
    "Jordan":                   ("jo", "middle-east"),
    "Kazakhstan":               ("kz", "central-asia"),
    "Kenya":                    ("ke", "africa"),
    "Korea, South":             ("ks", "east-n-southeast-asia"),
    "Kuwait":                   ("ku", "middle-east"),
    "Kyrgyzstan":               ("kg", "central-asia"),
    "Laos":                     ("la", "east-n-southeast-asia"),
    "Latvia":                   ("lg", "europe"),
    "Lebanon":                  ("le", "middle-east"),
    "Libya":                    ("ly", "africa"),
    "Liechtenstein":            ("ls", "europe"),
    "Lithuania":                ("lh", "europe"),
    "Luxembourg":               ("lu", "europe"),
    "Madagascar":               ("ma", "africa"),
    "Malawi":                   ("mi", "africa"),
    "Malaysia":                 ("my", "east-n-southeast-asia"),
    "Maldives":                 ("mv", "south-asia"),
    "Malta":                    ("mt", "europe"),
    "Mauritius":                ("mp", "africa"),
    "Mexico":                   ("mx", "north-america"),
    "Moldova":                  ("md", "europe"),
    "Monaco":                   ("mn", "europe"),
    "Mongolia":                 ("mg", "east-n-southeast-asia"),
    "Montenegro":               ("mj", "europe"),
    "Morocco":                  ("mo", "africa"),
    "Mozambique":               ("mz", "africa"),
    "Myanmar":                  ("bm", "east-n-southeast-asia"),
    "Namibia":                  ("wa", "africa"),
    "Nepal":                    ("np", "south-asia"),
    "Netherlands":              ("nl", "europe"),
    "New Zealand":              ("nz", "australia-oceania"),
    "Nicaragua":                ("nu", "central-america-n-caribbean"),
    "North Macedonia":          ("mk", "europe"),
    "Norway":                   ("no", "europe"),
    "Oman":                     ("mu", "middle-east"),
    "Pakistan":                 ("pk", "south-asia"),
    "Palestine":                ("we", "middle-east"),  # West Bank; Gaza is gz
    "Panama":                   ("pm", "central-america-n-caribbean"),
    "Paraguay":                 ("pa", "south-america"),
    "Peru":                     ("pe", "south-america"),
    "Philippines":              ("rp", "east-n-southeast-asia"),
    "Poland":                   ("pl", "europe"),
    "Portugal":                 ("po", "europe"),
    "Qatar":                    ("qa", "middle-east"),
    "Romania":                  ("ro", "europe"),
    "Russia":                   ("rs", "central-asia"),  # Factbook puts Russia in central-asia
    "Saudi Arabia":             ("sa", "middle-east"),
    "San Marino":               ("sm", "europe"),
    "Serbia":                   ("ri", "europe"),
    "Singapore":                ("sn", "east-n-southeast-asia"),
    "Slovakia":                 ("lo", "europe"),
    "Slovenia":                 ("si", "europe"),
    "South Africa":             ("sf", "africa"),
    "Spain":                    ("sp", "europe"),
    "Sri Lanka":                ("ce", "south-asia"),
    "Suriname":                 ("ns", "south-america"),
    "Sweden":                   ("sw", "europe"),
    "Switzerland":              ("sz", "europe"),
    "Syria":                    ("sy", "middle-east"),
    "Taiwan":                   ("tw", "east-n-southeast-asia"),
    "Tajikistan":               ("ti", "central-asia"),
    "Thailand":                 ("th", "east-n-southeast-asia"),
    "Trinidad and Tobago":      ("td", "central-america-n-caribbean"),
    "Tunisia":                  ("ts", "africa"),
    "Türkiye":                  ("tu", "middle-east"),
    "Turkmenistan":             ("tx", "central-asia"),
    "Uganda":                   ("ug", "africa"),
    "Ukraine":                  ("up", "europe"),
    "United Arab Emirates":     ("ae", "middle-east"),
    "United Kingdom":           ("uk", "europe"),
    "United States":            ("us", "north-america"),
    "Uruguay":                  ("uy", "south-america"),
    "Uzbekistan":               ("uz", "central-asia"),
    "Venezuela":                ("ve", "south-america"),
    "Vietnam":                  ("vm", "east-n-southeast-asia"),
    "Zimbabwe":                 ("zi", "africa"),

    # --- Territories / special cases: no Factbook per-capita data ---
    # These bands still appear on the map but are excluded from
    # per-capita analysis. Set to None to make this explicit.
    "Aruba":                    None,  # Dutch territory
    "Curaçao":                  None,  # Dutch territory
    "Falkland Islands":         None,  # British overseas territory
    "Faroe Islands":            None,  # Danish autonomous territory
    "French Polynesia":         None,  # French collectivity
    "Gibraltar":                None,  # British overseas territory
    "Greenland":                None,  # Danish autonomous territory
    "Guam":                     None,  # US territory
    "Guernsey":                 None,  # British crown dependency
    "Isle of Man":              None,  # British crown dependency
    "Jersey":                   None,  # British crown dependency
    "New Caledonia":            None,  # French special collectivity
    "Puerto Rico":              None,  # US territory
    "Reunion":                  None,  # French overseas department
    "Saint Pierre and Miquelon": None, # French collectivity
    "Svalbard":                 None,  # Norwegian archipelago
    "Åland Islands":            None,  # Finnish autonomous region

    # --- Unresolvable entries ---
    "International":            None,  # No single country
    "Unknown":                  None,  # No location data
}