loadData().then(() => {
    buildMap();
    buildSidebar();
    buildSearch();
    return Promise.all([loadBands(), loadCities()]);
}).then(() => {
    buildClusters();
}).catch(err => {
    console.error('Error:', err);
});