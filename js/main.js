console.log('main.js loaded');
console.log('buildMap type:', typeof buildMap);
loadData().then(() => {
    console.log('Data ready, building map...');
    console.log('buildMap type inside then:', typeof buildMap);
    buildMap();
}).catch(err => {
    console.error('Error:', err);
});