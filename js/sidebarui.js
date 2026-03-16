function buildSidebar() {
    showGlobalSidebar();
}

function showGlobalSidebar() {
    const total = Object.values(STATE.countries)
        .reduce((sum, c) => sum + c.band_count, 0);

    const topCountries = Object.entries(STATE.countries)
        .filter(([name, c]) => c.band_count > 0)
        .sort((a, b) => b[1].band_count - a[1].band_count)
        .slice(0, 5);

    const topThemes = Object.entries(STATE.themes)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    const topGenres = Object.entries(STATE.countries)
        .reduce((acc, [name, c]) => {
            Object.entries(c.genres || {}).forEach(([genre, count]) => {
                acc[genre] = (acc[genre] || 0) + count;
            });
            return acc;
        }, {});

    const topGenresSorted = Object.entries(topGenres)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
        
    document.getElementById('sidebar-content').innerHTML = `
        <div class="sidebar-header">METAL ATLAS</div>
        <div class="stat-block">
            <div class="stat-number">${total.toLocaleString()}</div>
            <div class="stat-label">BANDS WORLDWIDE</div>
        </div>
        <div class="section-title">CHOROPLETH</div>
        <div style="padding: 8px 16px;">
            <label style="display:flex; align-items:center; gap:8px; font-size:12px; cursor:pointer;">
                <input type="checkbox" id="choropleth-toggle"> Show density map
            </label>
            <select id="metric-select" style="margin-top:8px; width:100%; background:#1a1a1a; color:#e0e0e0; border:1px solid #333; padding:4px;">
                <option value="band_count">Total bands</option>
                <option value="bands_per_million">Per million people</option>  
            </select>
        </div>
        <div class="section-title">TOP COUNTRIES</div>
        <div id="country-list">
            ${topCountries.map(([name, c]) => `
                <div class="country-row" data-country="${name}">
                    <span class="country-name">${name}</span>
                    <span class="country-count">${c.band_count.toLocaleString()}</span>
                </div>
            `).join('')}
        </div>
        <div class="section-title">TOP THEMES</div>
        <div id="theme-list">
            ${topThemes.map(([theme, count]) => `
                <div class="theme-row">
                    <span>${theme}</span>
                    <span>${count.toLocaleString()}</span>
                </div>
            `).join('')}
            <div class="section-title">TOP GENRES</div>
            <div style="padding: 4px 16px; font-size: 10px; color: #666;">
    * Bands with multiple genres are counted in each
</div>
        <div id="genre-list">
            ${topGenresSorted.map(([genre, count]) => `
                <div class="genre-row">
                    <span>${genre}</span>
                    <span>${count.toLocaleString()}</span>
                </div>
            `).join('')}
        
        </div>
    `;

    // Click on country row to fly to it
        document.querySelectorAll('.country-row').forEach(el => {
            el.addEventListener('click', () => {
                showCountrySidebar(el.dataset.country);
            });
        }); // ← close forEach here

        document.getElementById('choropleth-toggle').addEventListener('change', e => {
            toggleChoropleth(e.target.checked);
        });

        document.getElementById('metric-select').addEventListener('change', e => {
            updateChoroplethMetric(e.target.value);
        });
    }

function showCountrySidebar(name) {
    const c = STATE.countries[name];
    if (!c) return;

    document.getElementById('sidebar-content').innerHTML = `
        <div class="back-btn" id="back-btn">← BACK</div>
        <div class="sidebar-header">${name.toUpperCase()}</div>
        <div class="stat-block">
            <div class="stat-number">${c.band_count.toLocaleString()}</div>
            <div class="stat-label">BANDS</div>
        </div>
        <div class="section-title">STATISTICS</div>
        <div class="stat-row">
            <span>Per million people</span>
            <span>${c.bands_per_million ? c.bands_per_million.toFixed(1) : 'N/A'}</span>
        </div>
        <div class="stat-row">
            <span>Per 100k km²</span>
            <span>${c.bands_per_100k_km2 ? c.bands_per_100k_km2.toFixed(1) : 'N/A'}</span>
        </div>
        <div class="section-title">TOP THEMES</div>
        ${Object.entries(c.themes)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8)
            .map(([theme, count]) => `
                <div class="theme-row">
                    <span>${theme}</span>
                    <span>${count}</span>
                </div>
            `).join('')}
        <div class="section-title">TOP GENRES</div>
        <div style="padding: 4px 16px; font-size: 10px; color: #666;">
    * Bands with multiple genres are counted in each
</div>
        ${Object.entries(c.genres)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8)
            .map(([genre, count]) => `
                <div class="genre-row">
                    <span>${genre}</span>
                    <span>${count}</span>
                </div>
            `).join('')}
    `;

    document.getElementById('back-btn').addEventListener('click', showGlobalSidebar);
}

function showBandSidebar(p) {
    document.getElementById('sidebar-content').innerHTML = `
        <div class="back-btn" id="back-btn">← BACK</div>
        <div class="sidebar-header">${p.name}</div>
        <div class="stat-block">
            <div class="stat-label">LOCATION</div>
            <div>${p.location || p.country || '—'}</div>
        </div>
        <div class="section-title">INFO</div>
        <div class="stat-row">
            <span>Genre</span>
            <span>${p.genre || '—'}</span>
        </div>
        <div class="stat-row">
            <span>Formed</span>
            <span>${p.formed || '—'}</span>
        </div>
        <div class="stat-row">
            <span>Status</span>
            <span>${p.status || '—'}</span>
        </div>
        <div class="section-title">LYRICAL THEMES</div>
        <div style="padding: 8px 16px; font-size: 12px;">
            ${p.themes || '—'}
        </div>
        <div style="padding: 16px;">
            <a href="${p.url}" target="_blank" style="color: #c0392b;">
                Metal Archives →
            </a>
        </div>
    `;
    document.getElementById('back-btn').addEventListener('click', showGlobalSidebar);
}