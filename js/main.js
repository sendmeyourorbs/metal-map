loadData().then(() => {
    buildMap();
    buildSidebar();
    buildSearch();
    return loadBands();
}).then(() => {
    buildClusters();
}).catch(err => {
});