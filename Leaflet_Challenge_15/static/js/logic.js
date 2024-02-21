// Set up the Leaflet map with a specified view and add a tile layer from OpenStreetMap
//  Store the API endpoint to call the Map

var map = L.map('map').setView([30, -10], 2);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


// Add a marker to the map with a popup
L.marker([51.5, -0.09]).addTo(map)
    .bindPopup('A pretty CSS popup.<br> Easily customizable.')
    .openPopup();


// Define the URL for fetching earthquake data
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson";


// Use D3 to fetch JSON data from the provided URL and process it
d3.json(url).then(function (data) {
    function markerSize(magnitude) {
        return magnitude * 5;
    }

// Define function to determine marker color based on earthquake magnitude
    
    function markerColor(magnitude) {
        return magnitude > 5 ? '#FF0000' :
            magnitude > 4 ? '#FFA500' :
            magnitude > 3 ? '#FFFF00' :
            magnitude > 2 ? '#ADFF2F' :
            '#00FF00';
    }

 // Create a GeoJSON layer with circle markers for each earthquake feature    
    L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: markerSize(feature.properties.mag),
                fillColor: markerColor(feature.properties.mag),
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        },

    // Bind a popup to each feature showing place, time, and magnitude    
        onEachFeature: function (feature, layer) {
            layer.bindPopup('<h3>' + feature.properties.place + '</h3><hr><p>' + new Date(feature.properties.time) + '</p><p>Magnitude: ' + feature.properties.mag + '</p>');
        }
    }).addTo(map);

// Call function to create legend
    createLegend();
});

// Function to create legend for earthquake magnitudes
function createLegend() {
    let legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (map) {
        let div = L.DomUtil.create('div', 'info legend');
        // let grades = [0, 2, 3, 4, 5];
        let grades = [-10, 10, 30, 50, 70, 90];
        let colors = ['#00FF00', '#ADFF2F', '#FFFF00', '#FFA500', '#FF0000', '#800080'];
        // let legendContent = '';

        for (let i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + colors[i] + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(map);
}

    // Creating earthquake features and defining marker size based on the magnitude
    function createFeatures(earthquake) {
        function markerSize(magnitude) {
            return magnitude * 5;
        }


        

        //  Define function to run once for each feature in array and provide popup to describe place, time, and earthquake magnitude
        function onEachFeature(feature, layer) {
            layer.bindPopup('<h3>${feature.properties.place}</h3><hr><p>${new Date (feature.properties.time)}</p><p>Magnitude:${feature.properties.mag}</p>');
        }

        // Using earthquake data to create a GeoJSON layer with markers   //earthquakeData changed to earthquke on first line
        let earthquakes = L.geoJSON(earthquake, {
            pointTolayer: function (feature, latlng) {
                return L.circleMarker(latlng, {
                    radius: markerSize(feature.properties.mag),
                    fillColor: markerColor(feature.properties.mag),
                    color: "#000",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                });
            },
            onEachFeature: onEachFeature
        });

        // Send earthquake layer to the createMap function  // I added s to the earthquake in the parenthesis
        createmap(earthquakes);
    }

    // Function to create the Map
    function createmap(earthquake) {

        // Create the base layers
        let street = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        });
        let topo = L.tileLayer('https://tile.opentopomap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data:&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>'
        });

        // Create a baseMaps object
        let baseMaps = {
            "Street Map": street,
            "Topographic Map": topo
        };

        //  Create an overlay object to hold our overlay // I removed s from earthquake after the colon
        let overlayMaps = {
            Earthquakes: earthquake
        };

        // Create our Maps, giving it the streetmap and earthquake layers to display on load
        let myMap = L.map("map", {
            center: [
                55.0, -120.0],
            zoom: 6,
            layers: [street, earthquakes]
        });

        // Add the layer control to the Map   // Mymap in the parenthesis on the last line chaged to myMap
        L.control.layers(baseMaps, overlayMaps, {
            collapsed: false
        }).addTo(myMap);

        // Add legend to the Map
        // info.addTo(Mymap);
        createLegend().addTo(myMap);
    }    
