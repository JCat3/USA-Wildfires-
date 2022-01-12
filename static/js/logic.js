// Choropleth

console.log("logic.js loaded")


let myMap = L.map("us_map", {
    center: [37.8, -96],
    zoom: 3
});

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + API_KEY, {
    id: 'mapbox/light-v9',
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    // attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
}).addTo(myMap);

var getNumFires = {};

function LoadNumFires(data)  {
    console.log("LoadNumFires()"); 
    console.log(data); 
    for (var i = 0; i < data.length; i++) {
        getNumFires[data[i].State] = data[i].FireCount; 
    }
}; 

d3.json("/choropleth_data").then(LoadNumFires);

console.log('LOADED CHOROPLETH FIRE DATA getNumFires');
console.log(getNumFires);

let link = "geojson/states.geojson";

// load US state borders geojson
d3.json(link).then(function(data) {    
    L.geoJson(data).addTo(myMap);
});

// function to assign color according to bin
function getColor(size) {
    return size > 5000 ? '#800026' :
            size > 2500  ? '#BD0026' :
            size > 1000  ? '#E31A1C' :
            size > 500  ? '#FC4E2A' :
            size > 250   ? '#FD8D3C' :
            size > 100   ? '#FEB24C' :
            size > 50   ? '#FED976' :
                        '#FFEDA0';
}

// function to add styling features, fill each state w/ color according to fireCount
function myStyle(Feature) {
    let fireCount = getNumFires[Feature.properties.STUSPS];
    return {
        fillColor: getColor(fireCount),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

// d3.json(link).then(function(data) {
//     L.geoJson(data, {
//         style: myStyle
//     }).addTo(myMap);
// });

// Add interactions with mouse

let geojson;
let info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props, count) {
    this._div.innerHTML = '<h4>Number of Wildfires in US</h4>' +  (props ?
        '<b>' + props.NAME + '</b><br />' + count + ' wildfires'
        : 'Hover over a state');
};

info.addTo(myMap);


// layover mouse event
function highlightFeature(e) {
    let layer = e.target;

    let stateAbbrev = layer.feature.properties.STUSPS;
    console.log('MOUSE OVER', stateAbbrev);
    let fireCount = getNumFires[stateAbbrev];

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    info.update(layer.feature.properties, fireCount);
}
// mouseout event
function resetHighlight(e) {
    
    // geojson.resetStyle(e.target);

    let layer = e.target;

    let stateAbbrev = layer.feature.properties.STUSPS;
    console.log('MOUSE OVER', stateAbbrev);
    let fireCount = getNumFires[stateAbbrev];

    layer.setStyle( {
        fillColor: getColor(fireCount),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    });

    info.update();
}

// zoom feature on chosen state
function zoomToFeature(e) {

    let state = e.target.feature.properties.STUSPS;
    console.log('ZOOM', state);

    myMap.fitBounds(e.target.getBounds());
    drawPie(state);
}

// add listeners to state layers
function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

geojson = d3.json(link).then(function(data) {
    L.geoJson(data, {
        style: myStyle,
        onEachFeature: onEachFeature
    }).addTo(myMap);
});

// //Custom Legend Control

let legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 50, 100, 250, 500, 1000, 2500, 5000],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap);

