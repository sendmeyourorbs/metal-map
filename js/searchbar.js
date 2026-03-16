function buildSearch() {
    const input = document.getElementById('search-input');
    const results = document.getElementById('search-results');
    
    if (!input) return;

    let debounceTimer;

    input.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const query = input.value.trim().toLowerCase();
            if (query.length < 2) {
                results.innerHTML = '';
                return;
            }
            runSearch(query, results);
        }, 300);
    });
}

function runSearch(query, resultsEl) {
    // Search countries
    const countryMatches = Object.keys(STATE.countries)
        .filter(name => name.toLowerCase().includes(query))
        .slice(0, 3)
        .map(name => ({ type: 'country', name }));

    // Search bands
    const bandMatches = STATE.bands.features
        .filter(f => f.properties.name.toLowerCase().includes(query))
        .slice(0, 7)
        .map(f => ({ type: 'band', name: f.properties.name, feature: f }));

    const all = [...countryMatches, ...bandMatches];

    if (!all.length) {
        resultsEl.innerHTML = '<div class="search-result">No results</div>';
        return;
    }

    resultsEl.innerHTML = all.map((r, i) =>
        `<div class="search-result" data-index="${i}">
            <span class="result-type">${r.type === 'country' ? '🌍' : '🎸'}</span>
            ${r.name}
            ${r.type === 'band' ? `<span class="result-country">${r.feature.properties.country}</span>` : ''}
        </div>`
    ).join('');

    resultsEl.querySelectorAll('.search-result').forEach((el, i) => {
        el.addEventListener('click', () => {
            const r = all[i];
            if (r.type === 'band') {
                const coords = r.feature.geometry.coordinates;
                map.setView([coords[1], coords[0]], 8);
                showBandSidebar(r.feature.properties);
            } else {
                showCountrySidebar(r.name);
            }
            resultsEl.innerHTML = '';
            input.value = '';
        });
    });
}