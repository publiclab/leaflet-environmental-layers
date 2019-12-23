# Leaflet Environmental Layers
[![Build Status](https://travis-ci.org/publiclab/leaflet-environmental-layers.svg)](https://travis-ci.org/publiclab/leaflet-environmental-layers)
[![npm version](https://badge.fury.io/js/leaflet-environmental-layers.svg)](https://badge.fury.io/js/leaflet-environmental-layers) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)
[![Code of Conduct](https://img.shields.io/badge/code-of%20conduct-green.svg)](https://publiclab.org/conduct)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
<a href='https://bower.io/search/'><img src="https://benschwarz.github.io/bower-badges/badge@2x.png" width="130" height="30" alt='Bower Version'></a>

## Use cases

The library is integrated to following places

* https://mapknitter.org/
* https://publiclab.org/maps/

## About

The information of each layer can be found here:

https://publiclab.org/notes/sagarpreet/06-06-2018/leaflet-environmental-layer-library

### Layers

| Layer Name                  | Color   |
| --------------------------- | ------- |
| wisconsin                   | N/A     |
| fracTrackerMobile           | N/A     |
| purpleLayer                 | #8b0000 |
| purpleairmarker             | #800080 |
| skyTruth                    | #ff0000 |
| fractracker                 | #ffff00 |
| pfasLayer                   | #00ff00 |
| toxicReleaseLayer           | #008000 |
| odorreport                  | #ff00ff |
| mapknitter                  | #D50039 |
| Power                       | #ffc0cb |
| Telecom                     | #0000ff |
| Petroleum                   | #a52a2a |
| Water                       | #4B0082 |
| income                      | #006400 |
| americanIndian              | #800000 |
| asian                       | #ffa500 |
| black                       | #FFD700 |
| multi                       | #ffc0cb |
| hispanic                    | #DCDCDC |
| nonWhite                    | #808080 |
| white                       | #a52a2a |
| plurality                   | #800000 |
| clouds                      | #80dfff |
| cloudsClassic               | #b3f0ff |
| precipitation               | #00ff55 |
| precipitationClassic        | #00008b |
| rain                        | #8080ff |
| rainClassic                 | #1a1aff |
| snow                        | #80ffe5 |
| pressure                    | #e62e00 |
| pressureContour             | #ff3300 |
| temperature                 | #ff3300 |
| wind                        | #00008b |
| city                        | #b3ffff |
| windrose                    | #008000 |
| Territories                 | #000000 |
| Languages                   | #000000 |
| Treaties                    | #000000 |
| aqicnLayer                  | #000000 |
| openaq                      | #000000 |
| luftdaten                   | #000000 |
| opensense                   | N/A     |
| osmLandfillMineQuarryLayer  | N/A     |
| eonetFiresLayer             | #78fffa |


## Quick Setup :

### Installation Instructions: 
1. Clone this repository to your local environment. 
2. Run `npm install` to install all the necessary packages required. 
3. Open `examples/index.html` in your browser to look at the preview of the library.

### Instructions for a developer:
1. Install grunt - https://gruntjs.com/installing-grunt.
2. Make the changes you are working on in respective /src files.
3. Run `grunt build` to generate files in the /dist directory.
4. Run `grunt jasmine` to run tests on the LEL layers and ensure they pass.
5. Test your changes on a browser by opening `examples/index.html`.

## Demo :

Checkout this demo : https://publiclab.github.io/leaflet-environmental-layers/example/index.html#3/43.00/-46.23

## Features :

#### Zoom or Pan

Click and drag the map to pan it.

#### Change the Base Map and Overlay layers

Use the button on right-most corner to change the way the background of the map looks .

#### See More Data

Toggle certain layers on and off using the Layers button in the toolbar .

#### Click on a Point

Click on a point or marker on the map to learn more about it .

#### Add a legend

In `src/legendCreation.js`, add `addLayerNameURLPair(layer_var, "img_url");`, where `layer_var` is consistent with the variable used in `example/index.html` and `img_url` is the source of the image to be used as the legend. 

### Spreadsheet-based layers

We can source locations from a spreadsheet in a format like this:

| Title  | Latitude | Longitude   | Notes             |
|--------|----------|-------------|-------------------|
| First	 | 29.671282 | -95.17829  | The first marker  |
| Second | 29.760371 | -95.504828 | The second marker |
| Third  | 29.917755 | -95.283494 | The third marker  |

The layer is constructed like this:

```js
var layer = L.SpreadsheetLayer({
  url: 'https://docs.google.com/spreadsheets/d/14BvU3mEqvI8moLp0vANc7jeEvb0mnmYvH4I0GkwVsiU/edit?usp=sharing', // String url of data sheet
  lat: 'Latitude', // name of latitude column
  lon: 'Longitude', // name of longitude column
  columns: ['Title', 'Notes'], // Array of column names to be used
  generatePopup: function() {
    // function used to create content of popups
  },
  // imageOptions: // optional, defaults to blank
  // sheetNum: // optional, defaults to 0 (first sheet)
});
layer.addTo(map);
```

Read more here: https://github.com/publiclab/leaflet-environmental-layers/blob/master/src/util/googleSpreadsheetLayer.js

We're going to try spinning this out into its own library; see: https://github.com/publiclab/leaflet-environmental-layers/issues/121

## Dependencies :

### General (required for all layers) :

           <script src="../dist/LeafletEnvironmentalLayers.js"></script>
           <link href="../node_modules/leaflet/dist/leaflet.css" rel="stylesheet">
	   <script src="../node_modules/leaflet-spin/example/spin/dist/spin.min.js"></script>  <!-- Compulsory to add -->
 	   <script src="../node_modules/leaflet-spin/example/leaflet.spin.min.js"></script>

### To use Wind Rose Layer :

            <script src="../src/windRoseLayer.js"></script>
            <link href="../dist/LeafletEnvironmentalLayers.css" rel="stylesheet">

### To use Wisconsin Non-Metallic Layer :

            <script src="https://unpkg.com/esri-leaflet@2.2.3/dist/esri-leaflet.js"></script>
            <script src="https://unpkg.com/esri-leaflet-renderers@2.0.6"></script>

              var Wisconsin_NM = wisconsinLayer(map) ;

### To use Fractracker Mobile Layer :

* Same dependencies as of wisconsin Non-Metallic Layer .

              var FracTracker_mobile = fracTrackerMobileLayer(map) ;


### To use Purple Layer :

			<script src="../node_modules/heatmap.js/build/heatmap.min.js"></script>
			<script src="../node_modules/leaflet-heatmap/leaflet-heatmap.js"></script>


## Real Time Layers :

1.) city (by openWeather)

        var city = L.OWM.current({intervall: 15, minZoom: 3});

2.) WindRose (by openWeather)

        var windrose = L.OWM.current({intervall: 15, minZoom: 3, markerFunction: myWindroseMarker, popup: false, clusterSize:       50,imageLoadingBgUrl: 'https://openweathermap.org/img/w0/iwind.png' });
    windrose.on('owmlayeradd', windroseAdded, windrose);

## Open Infra Map :

##### OpenInfraMap_Power Layer :

    var OpenInfraMap_Power = L.tileLayer('https://tiles-{s}.openinframap.org/power/{z}/{x}/{y}.png',{
        maxZoom: 18,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://www.openinframap.org/about.html">About OpenInfraMap</a>'
    });

##### OpenInfraMap_Petroleum Layer :

    var OpenInfraMap_Petroleum = L.tileLayer('https://tiles-{s}.openinframap.org/petroleum/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://www.openinframap.org/about.html">About OpenInfraMap</a>'
    });

##### OpenInfraMap_Telecom Layer :

    var OpenInfraMap_Telecom = L.tileLayer('https://tiles-{s}.openinframap.org/telecoms/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://www.openinframap.org/about.html">About OpenInfraMap</a>'
    });

##### OpenInfraMap_Water Layer :

    var OpenInfraMap_Water = L.tileLayer('https://tiles-{s}.openinframap.org/water/{z}/{x}/{y}.png',{
      maxZoom: 18,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://www.openinframap.org/about.html">About OpenInfraMap</a>'
    });   

## Add hash support for easy sharing of map :    

### Steps To add :

1.) Add link :

       <script src="../lib/leaflet-fullUrlHash.js"></script>

2.) Once you have initialized the map (an instance of L.Map), add the following code :

     // Assuming your map instance is in a variable called map and an object with all the map layers is 
    in a variable called allMapLayers
    var hash = new L.FullHash(map, allMapLayers);    
    
    
  
 ## Add all LEL Layers at once:
 
 	 L.LayerGroup.EnvironmentalLayers().addTo(map);
	 
## Add all layers except some layers: 

	 L.LayerGroup.EnvironmentalLayers({
            exclude: ['mapknitter', 'clouds'],
         }).addTo(map);
	 
## Add some layers only: 

	 L.LayerGroup.EnvironmentalLayers({
            include: ['mapknitter', 'clouds'],
         }).addTo(map);

## Turn on Leaflet Hash in the URL: 

	 L.LayerGroup.EnvironmentalLayers({
            exclude: ['mapknitter', 'clouds'],
	    hash: true,             // by default this is FALSE
         }).addTo(map);
	
