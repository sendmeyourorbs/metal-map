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
        <div class="sidebar-header">THE METAL ATLAS</div>
        <div class="stat-block">
            <div class="stat-number">${total.toLocaleString()}</div>
            <div class="stat-label">BANDS WORLDWIDE</div>
        </div>

        <div class="section-title">BANDS </div>
<div style="padding: 8px 16px;">
    <select id="metric-select" style="width:100%;background:#1a1a1a;color:#e0e0e0;border:1px solid #333;padding:4px;font-size:12px;">
        <option value="off">— off —</option>
        <option value="band_count">Total bands</option>
        <option value="bands_per_million">Per million people</option>
    </select>
</div>
        <div class="section-title">THEMES</div>
<div style="padding: 8px 16px;">
    <select id="theme-choropleth-select" style="width:100%;background:#1a1a1a;color:#e0e0e0;border:1px solid #333;padding:4px;font-size:12px;">
        <option value="">— select theme —</option>
        ${Object.entries(STATE.themes)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 50)
            .map(([theme]) => `<option value="${theme}">${theme}</option>`)
            .join('')}
    </select>
    <div id="theme-reset-btn" style="display:none;margin-top:6px;padding:4px 8px;background:#1a1a1a;border:1px solid #333;color:#c0392b;font-size:11px;cursor:pointer;text-align:center;">
        ✕ RESET
    </div>
</div>
  <div class="section-title">GENRE TIMELINE</div>
        <div style="padding: 8px 16px;">
            <select id="genre-timeline-select" style="width:100%;background:#1a1a1a;color:#e0e0e0;border:1px solid #333;padding:4px;font-size:12px;margin-bottom:8px;">
    <option value="">— select genre —</option>
    ${STATE.genre_timeline ? Object.keys(STATE.genre_timeline).sort().map(g => `
        <option value="${g}">${g}</option>
    `).join('') : ''}
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
        </div>

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
    document.getElementById('theme-choropleth-select').addEventListener('change', e => {
        const theme = e.target.value;
        const resetBtn = document.getElementById('theme-reset-btn');
        if (!theme) {
            resetBtn.style.display = 'none';
            return;
        }
    document.getElementById('theme-reset-btn').addEventListener('click', () => {
    document.getElementById('theme-choropleth-select').value = '';
    document.getElementById('theme-reset-btn').style.display = 'none';
    updateChoroplethMetric(document.getElementById('metric-select').value);
});
        buildThemeChoropleth(theme);
        resetBtn.style.display = 'block';
        if (!map.hasLayer(window.choroplethLayer)) {
            window.choroplethLayer.addTo(map);
        }
    });
    // Country row clicks
    document.querySelectorAll('.country-row').forEach(el => {
        el.addEventListener('click', () => {
            showCountrySidebar(el.dataset.country);
        });
    });


    // Metric selector
    document.getElementById('metric-select').addEventListener('change', e => {
        const value = e.target.value;
        if (value === 'off') {
            map.removeLayer(window.choroplethLayer);
        } else {
            updateChoroplethMetric(value);
            if (!map.hasLayer(window.choroplethLayer)) {
                window.choroplethLayer.addTo(map);
            }
        }
    });

    // Genre timeline
    document.getElementById('genre-timeline-select').addEventListener('change', e => {
        const genre = e.target.value;
        if (!genre) return;
        buildGenreChart(genre);
    });
}

function buildGenreChart(genre) {
    const data = STATE.genre_timeline[genre];
    if (!data) return;

    const labels = Object.keys(data);
    const values = Object.values(data);

    const panel = document.getElementById('chart-panel');
    panel.style.display = 'block';
    document.getElementById('chart-panel-title').textContent = genre.toUpperCase() + ' — FORMATION TIMELINE';

    const canvas = document.getElementById('genre-chart');
    if (!canvas) return;

    if (window.genreChart) {
        window.genreChart.destroy();
    }

    window.genreChart = new Chart(canvas, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: genre,
                data: values,
                borderColor: '#c0392b',
                backgroundColor: 'rgba(192,57,43,0.1)',
                borderWidth: 2,
                pointRadius: 0,
                tension: 0.3,
                fill: true
            }]
        },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        bottom: 40,
                        right: 40
                    }
                },
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: {
                        ticks: { 
                            color: '#888', 
                            font: { size: 9 },
                            maxTicksLimit: 10
                        },
                        grid: { color: '#222' }
                    },
                    y: {
                        ticks: { color: '#888', font: { size: 9 } },
                        grid: { color: '#222' }
                    }
                }
            }
    });

    document.getElementById('chart-panel-close').onclick = () => {
        panel.style.display = 'none';
        if (window.genreChart) {
            window.genreChart.destroy();
            window.genreChart = null;
        }
    };
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

function showCitySidebar(key) {
    const city = STATE.cities[key];
    if (!city) {
        console.log('City not found for key:', key);
        return;
    }

    document.getElementById('sidebar-content').innerHTML = `
        <div class="back-btn" id="back-btn">← BACK</div>
        <div class="sidebar-header">${city.location}</div>
        <div class="stat-block">
            <div class="stat-number">${city.band_count.toLocaleString()}</div>
            <div class="stat-label">BANDS</div>
        </div>
        <div class="section-title">BANDS</div>
        <div id="band-list">
            ${city.bands.map(b => `
                <div class="band-row" data-url="${b.url}" data-name="${b.name}"
                     data-genre="${b.genre || ''}" data-themes="${b.themes || ''}"
                     data-formed="${b.formed || ''}" data-status="${b.status || ''}">
                    <span class="band-name">${b.name}</span>
                    <span class="band-status">${b.status || '—'}</span>
                </div>
            `).join('')}
        </div>
    `;

    document.getElementById('back-btn').addEventListener('click', showGlobalSidebar);

    document.querySelectorAll('.band-row').forEach(el => {
        el.addEventListener('click', () => {
            showBandSidebar({
                name:     el.dataset.name,
                url:      el.dataset.url,
                genre:    el.dataset.genre,
                themes:   el.dataset.themes,
                formed:   el.dataset.formed,
                status:   el.dataset.status,
                country:  city.country,
                location: city.location
            });
        });
    });
}

function showClusterSidebar(cities) {
    document.getElementById('sidebar-content').innerHTML = `
        <div class="back-btn" id="back-btn">← BACK</div>
        <div class="sidebar-header">CITIES IN AREA</div>
        <div class="section-title">${cities.length} CITIES</div>
        <div id="city-list">
            ${cities.map(c => `
                <div class="country-row" data-key="${c.cityKey}">
                    <span>${c.location}</span>
                    <span>${c.band_count.toLocaleString()}</span>
                </div>
            `).join('')}
        </div>
    `;

    document.getElementById('back-btn').addEventListener('click', showGlobalSidebar);

    document.querySelectorAll('#city-list .country-row').forEach(el => {
        el.addEventListener('click', () => {
            showCitySidebar(el.dataset.key);
        });
    });
}