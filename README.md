# Leaflet Environmental Layers (LEL)
[![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/publiclab/leaflet-environmental-layers/)
[![npm version](https://badge.fury.io/js/leaflet-environmental-layers.svg)](https://badge.fury.io/js/leaflet-environmental-layers) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)
[![Code of Conduct](https://img.shields.io/badge/code-of%20conduct-green.svg)](https://publiclab.org/conduct)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
<a href='https://bower.io/search/'><img src="https://benschwarz.github.io/bower-badges/badge@2x.png" width="130" height="30" alt='Bower Version'></a>

A leaflet plugin that has a collection of layers containing environmental data pulled in from different sources. See this [demo page](https://publiclab.github.io/leaflet-environmental-layers/example/index.html#lat=43.00&lon=-4.07&zoom=3&layers=Standard) for a simple demonstration of the plugin.

## Table of Contents
1. [What is LEL](#leaflet-environmental-layers-lel)
2. [Installation](#installation)
3. [Usage](#usage)
4. [Dependencies](#dependencies)
5. [Getting started](#getting-started)
6. [Features](#features)
7. [Layers](#layers)
8. [Adding LEL features individually](#adding-LEL-features-individually)
9. [Adding layers individually](#adding-layers-individually)
10. [Contributing](#contributing)
11. [Reach out to the maintainers](#reach-out-to-the-maintainers)
12. [About PublicLab](#about-publicLab)

## Installation
  
Install using NPM with: `npm install leaflet-environmental-layers`

See [Dependencies](https://github.com/publiclab/leaflet-environmental-layers/#dependencies) below for what you need to include for basic usage and for individual layers.

## Usage

Instantiate a collection of environmentally related Leaflet layers with the `L.LayerGroup.EnvironmentalLayers(options)` function:

```js
L.LayerGroup.EnvironmentalLayers({
  // simpleLayerControl: true,
  addLayersToMap: true,
  include: ['odorreport', 'clouds', 'eonetFiresLayer', 'Unearthing', 'PLpeople'], // display only these layers
  // exclude: ['mapknitter', 'clouds'], // layers to exclude (cannot be used at same time as 'include'
  // display: ['eonetFiresLayer'], // which layers are actually shown as opposed to just being in the menu
  hash: true,
  embed: true,
  // hostname: 'domain name goes here'
}).addTo(map);
```

When specifying layers to include or exclude, use [their names as listed in the table below](https://github.com/publiclab/leaflet-environmental-layers/#layers).

### Options

| Option              | Type    |Default                | Description |
|---------------------|---------|-----------------------|-------------|
| `baseLayers`          | Object  | -                     | Passed in as `{ 'Standard': baselayer }` where `'Standard'` is the name given to the layer and `baselayer` is the variable containing the base tile layer(`L.tileLayer()`). It can have more than one base layer. At least one base layer should be added to the map instance. If no baseLayers are provided it is defaulted to a grey-scale base map. |
| `simpleLayerControl`  | Boolean | false                 | If set to true, it will replace LEL's layer menu with leaflet's default layers control. |
| `addLayersToMap`      | Boolean | false                 | If set to true, adds all layers in the `include` option to the map by default. |
| `include`             | Array   | Array                 | If provided, adds the given layers to the layer menu or layers control. If not provided, adds all the layers to the layer menu or layers control. |
| `exclude`             | Array   | -                     | If provided, excludes the given layers from the layer menu or layers control. |
| `display`             | Array   | -                 | If provided, displays the given layers by default on the map. |
| `hash`                | Boolean | false                 | If true, provides hash support for the map. |
| `embed`               | Boolean | false                 | If true, adds an embed control that generates code to the map for embedding the map on other sites. |
| `hostname`            | String  | 'publiclab.github.io' | Uses the value in place of hostname in the URL generated in the embed code. |

## Dependencies

- Install Bootstrap(Required for the layers menu)
- Install @fortawesome/fontawesome-free
- Add the following to the head of the HTML file that would contain the map

```html
<!-- Required for PLpeople layer - must load before dist/LeafletEnvironmentalLayers.js -->
<script src="../node_modules/leaflet-blurred-location/dist/Leaflet.BlurredLocation.js"></script>
<script src="../node_modules/leaflet.blurred-location-display/dist/Leaflet.BlurredLocationDisplay.js"></script>

<!-- Required for all maps -->
<script src="../node_modules\jquery\dist\jquery.min.js"></script>
<script src="../dist/LeafletEnvironmentalLayers.js"></script>
<link href="../node_modules/leaflet/dist/leaflet.css" rel="stylesheet" />
<link href="../dist/LeafletEnvironmentalLayers.css" rel="stylesheet" />
<link href="../node_modules\@fortawesome\fontawesome-free\css\all.min.css" rel="stylesheet" />

<!-- Bootstrap - not needed if you use simpleLayerControl:true -->
<script src="../node_modules\bootstrap\dist\js\bootstrap.min.js"></script>
<link rel="stylesheet" href="../node_modules\bootstrap\dist\css\bootstrap.min.css">

<!-- Required for setting hash:true -->
<script src="../lib/leaflet-fullUrlHash.js"></script>

<!-- Required for search control -->
<script src="../node_modules/leaflet-google-places-autocomplete/src/js/leaflet-gplaces-autocomplete.js"></script>
<link rel="stylesheet" href="../node_modules/leaflet-google-places-autocomplete/src/css/leaflet-gplaces-autocomplete.css">
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAOLUQngEmJv0_zcG1xkGq-CXIPpLQY8iQ&libraries=places"></script>

<!-- Required for purpleLayer -->
<script src="../node_modules/heatmap.js/build/heatmap.min.js"></script>
<script src="../node_modules/leaflet-heatmap/leaflet-heatmap.js"></script>

<!-- Required for wisconsin Layer -->
<script src="https://unpkg.com/esri-leaflet@2.2.3/dist/esri-leaflet.js"></script>
<script src="https://unpkg.com/esri-leaflet-renderers@2.0.6"></script>

<!-- Required for windRose Layer -->
<script src="../src/windRoseLayer.js"></script>

<!-- Required for Unearthing Layer -->
<script src="../lib/glify.js"></script>
```

## Getting started

### _Installation Instructions_

1. Clone this repository to your local environment.
2. Run `npm install` to install all the necessary packages required.
3. Open `examples/index.html` in your browser to look at the preview of the library.

### _Instructions for a developer_

1. Install grunt - https://gruntjs.com/installing-grunt.
2. Make the changes you are working on in the respective /src files.
3. Run `grunt build` to generate files in the /dist directory.
4. Run `grunt transpile` to transpile es6 code and copy files needed to run the tests to the /dist directory.
5. Run `grunt jasmine` to run tests on the LEL layers and ensure they pass.
6. Run `npm run start` to start a local server.
7. Run `npm run cy:run:chrome` to run e2e and integration tests.
8. Test your changes on a browser by opening `examples/index.html`.

#### Testing in GitPod

To run Cypress tests in GitPod, you'll need to use `npm run start:ci & cypress run --browser electron`

## Features

### _Zoom or Pan_

Click and drag the map to pan it.

### _Change the Base Map and Overlay layers_

Use the button on right-most corner to change the way the background of the map looks.

### _See More Data_

- Toggle certain layers on and off using the Layers button in the toolbar. 
- Layers with near-real-time or real-time data will have the 'NRT/RT' mark on them.
- More information on the layer data will be available when clicking the 'i' button on the layer
- Layers that allow contributions will have a `report` button or `contribute` button.
- Layers will be visible on the menu only when the map view intersects with the layer's bounds or zoom levels.
- A badge displays the number of new layers in the map view when the map intersects with new layers

Read more about the layers menu [here](https://publiclab.org/notes/christie_reni/01-29-2020/new-features-in-leaflet-environmental-layers#Layers+Menu).

### _Click on a Point_

Click on a point or marker on the map to learn more about it.

### _Minimal mode_

Click on the button group on the left, below the zoom controls, to change between default markers mode and minimal markers mode. Use minimal markers mode for a smoother experience when using multiple layers with many markers.

Read more about this feature [here](https://publiclab.org/notes/christie_reni/01-29-2020/new-features-in-leaflet-environmental-layers#Minimal+mode).

### _URL Hash_

The map page's URL hash updates on map movement and when a layer is added or removed from a map. This helps preserve map state when refreshing or copying the URL to another page.

### _Embed Code_

Click on the button at the bottom on the left side of a map to generate an embed code so that the map page can be embedded in other sites.

## Layers
The information of each layer can be found here: [Layer Information](https://publiclab.org/notes/sagarpreet/06-06-2018/leaflet-environmental-layer-library)


| Layer Name                    | Color     |
| ----------------------------- | --------- |
| `PLpeople`                    | N/A       |
| `wisconsin`                   | N/A       |
| `fracTrackerMobile`           | N/A       |
| `purpleLayer`                 | `#8b0000` |
| `purpleairmarker`             | `#800080` |
| `skytruth`                    | `#ff0000` |
| `fractracker`                 | `#ffff00` |
| `pfasLayer`                   | `#00ff00` |
| `toxicReleaseLayer`           | `#008000` |
| `odorreport`                  | `#ff00ff` |
| `mapknitter`                  | `#D50039` |
| `Power`                       | `#ffc0cb` |
| `Telecom`                     | `#0000ff` |
| `Petroleum`                   | `#a52a2a` |
| `Water`                       | `#4B0082` |
| `income`                      | `#006400` |
| `americanIndian`              | `#800000` |
| `asian`                       | `#ffa500` |
| `black`                       | `#FFD700` |
| `multi`                       | `#ffc0cb` |
| `hispanic`                    | `#DCDCDC` |
| `nonWhite`                    | `#808080` |
| `white`                       | `#a52a2a` |
| `plurality`                   | `#800000` |
| `clouds`                      | `#80dfff` |
| `cloudsClassic`               | `#b3f0ff` |
| `precipitation`               | `#00ff55` |
| `precipitationClassic`        | `#00008b` |
| `rain`                        | `#8080ff` |
| `rainClassic`                 | `#1a1aff` |
| `snow`                        | `#80ffe5` |
| `pressure`                    | `#e62e00` |
| `pressureContour`             | `#ff3300` |
| `temperature`                 | `#ff3300` |
| `wind`                        | `#00008b` |
| `city`                        | `#b3ffff` |
| `windrose`                    | `#008000` |
| `Territories`                 | `#000000` |
| `Languages`                   | `#000000` |
| `Treaties`                    | `#000000` |
| `aqicnLayer`                  | `#000000` |
| `openaq`                      | `#000000` |
| `luftdaten`                   | `#000000` |
| `opensense`                   | N/A       |
| `osmLandfillMineQuarryLayer`  | N/A       |
| `eonetFiresLayer`             | `#78fffa` |
| `Unearthing`                  | N/A       |


## Adding LEL features individually
### _Add a legend_

In `src/legendCreation.js`, add `addLayerNameURLPair(layer_var, "img_url");`, where `layer_var` is consistent with the variable used in `example/index.html` and `img_url` is the source of the image to be used as the legend.

### _Add an embed control_

#### Creation

    // Assuming your map instance is in a variable called map
    L.control.embed(options).addTo(map);

The optional options object can be passed in with any of the following properties:
| Option    | Type    | Default     | Description |
|-----------|---------|-------------|-------------|
| position  | String  | 'topleft'   | Other possible values include 'topright', 'bottomleft' or 'bottomright' |
| hostname  | String  | 'publiclab.github.io'   | Sets hostname for the URL in the embed code |

### _Add hash support for easy sharing of map_    
#### Add link

        <script src="../lib/leaflet-fullUrlHash.js"></script>

#### Creation

        // Assuming your map instance is in a variable called map
        // Assuming an object with all the map layers is in a variable called allMapLayers
        var hash = new L.FullHash(map, allMapLayers);  

### _Add the layers menu_

#### Prerequisites

- Bootstrap
- jQuery

#### Dependencies

- Install Bootstrap(Required for the layers menu)
- Install @fortawesome/fontawesome-free
- Add the following to the head of the HTML file that would contain the map

```
<!-- jQuery --> 
<script src="../node_modules\jquery\dist\jquery.min.js"></script>

<!-- Bootstrap --> 
<script src="../node_modules\bootstrap\dist\js\bootstrap.min.js"></script>
<link rel="stylesheet" href="../node_modules\bootstrap\dist\css\bootstrap.min.css">

<!-- Required includes -->
<script src="../dist/LeafletEnvironmentalLayers.js"></script>
<link href="../node_modules/leaflet/dist/leaflet.css" rel="stylesheet" />
<link href="../dist/LeafletEnvironmentalLayers.css" rel="stylesheet" />
<link href="../node_modules\@fortawesome\fontawesome-free\css\all.min.css" rel="stylesheet" />
```

#### Usage example
```js
  var baseMaps = {
    'Standard': L.tileLayer('TILE_LAYER_URL').addTo(map),
    'Dark': L.tileLayer('TILE_LAYER_URL')
  };

  var overlayMaps = {
    'wisconsin': Wisconsin_NM,  // Assuming 'Wisconsin_NM' is the variable that holds the wisconsin layer object
    'indigenousLands': {
      category: 'group', // Let's the control know if this should be rendered as a group
      layers: { // Layers making the group
        'Territories': IndigenousLandsTerritories,  // Assuming 'IndigenousLandsTerritories' is the variable that holds the respective layer object
        'Languages': IndigenousLandsLanguages,  // Assuming 'IndigenousLandsLanguages' is the variable that holds the respective layer object
        'Treaties': IndigenousLandsTreaties,  // Assuming 'IndigenousLandsTreaties' is the variable that holds the respective layer object
      },
    },
  };

  var leafletControl = new L.control.layersBrowser(baseMaps, overlayMaps);
  leafletControl.addTo(map);
```
#### Creation

    L.control.layersBrowser(baseMaps, overlayMaps).addTo(map);

- `baseMaps` and `overlayMaps` are object literals that have layer names as keys and [Layer](https://leafletjs.com/reference-1.6.0.html#layer) objects as values. Read more about [Leaflet's Control.Layers](https://leafletjs.com/reference-1.6.0.html#control-layers).
- `baseMaps` will be hidden if only one base map is provided
- The layer information displayed for each layer is stored in `info.json`
- The layer name(key) in the `overlayMaps` object should match the keys in `info.json`
- The layers are filtered according to the map view
- When there are new layers present in the map view when moving around a badge is displayed near the layer control icon on the top right showing the number of new layers in the view

### _Add minimal mode control_
#### Creation

    // Assuming your map instance is in a variable called map
    // Assuming your layers menu or layers control instance is in a variable called layersControl
    L.control.minimalMode(layersControl).addTo(map);

### _Add search control_

  LEL uses [leaflet-google-places-autocomplete](https://github.com/Twista/leaflet-google-places-autocomplete) for the search control feature.



## Adding layers individually

### _To use Wisconsin Non-Metallic Layer_
#### Add
      <script src="https://unpkg.com/esri-leaflet@2.2.3/dist/esri-leaflet.js"></script>
      <script src="https://unpkg.com/esri-leaflet-renderers@2.0.6"></script>
#### Creation
      var Wisconsin_NM = wisconsinLayer(map) ;

### _To use Fractracker Mobile Layer_
      var FracTracker_mobile = L.geoJSON.fracTrackerMobile();

### _To use Purple Layer_
	<script src="../node_modules/heatmap.js/build/heatmap.min.js"></script>
	<script src="../node_modules/leaflet-heatmap/leaflet-heatmap.js"></script>

### _To use Unearthing Layer_
	<script src="../lib/glify.js"></script>

### _To use PLpeople Layer_
  These must be included in the file before /dist/LeafletEnvironmentalLayers.js:

        <script src="../node_modules/leaflet-blurred-location/dist/Leaflet.BlurredLocation.js"></script>
        <script src="../node_modules/leaflet.blurred-location-display/dist/Leaflet.BlurredLocationDisplay.js"></script>

### _Real Time Layers

#### city (by openWeather)

        var city = L.OWM.current({intervall: 15, minZoom: 3});

#### WindRose (by openWeather)
      
      <script src="../src/windRoseLayer.js"></script>

      var windrose = L.OWM.current({intervall: 15, minZoom: 3, markerFunction: myWindroseMarker, popup: false, clusterSize:       50,imageLoadingBgUrl: 'https://openweathermap.org/img/w0/iwind.png' });
      windrose.on('owmlayeradd', windroseAdded, windrose);

### _Open Infra Map_
#### OpenInfraMap_Power Layer

    var OpenInfraMap_Power = L.tileLayer('https://tiles-{s}.openinframap.org/power/{z}/{x}/{y}.png',{
        maxZoom: 18,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://www.openinframap.org/about.html">About OpenInfraMap</a>'
    });

#### OpenInfraMap_Petroleum Layer

    var OpenInfraMap_Petroleum = L.tileLayer('https://tiles-{s}.openinframap.org/petroleum/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://www.openinframap.org/about.html">About OpenInfraMap</a>'
    });

#### OpenInfraMap_Telecom Layer

    var OpenInfraMap_Telecom = L.tileLayer('https://tiles-{s}.openinframap.org/telecoms/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://www.openinframap.org/about.html">About OpenInfraMap</a>'
    });

#### OpenInfraMap_Water Layer

    var OpenInfraMap_Water = L.tileLayer('https://tiles-{s}.openinframap.org/water/{z}/{x}/{y}.png',{
      maxZoom: 18,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://www.openinframap.org/about.html">About OpenInfraMap</a>'
    });

### _Spreadsheet-based layers_

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

## Contributing
Please read [CONTRIBUTING.md](https://github.com/publiclab/leaflet-environmental-layers/blob/master/CONTRIBUTING.md) for details on our code of conduct, the process for submitting pull requests, and steps to add new layers.

## Reach out to the maintainers
Reach out to the maintainers here: https://github.com/orgs/publiclab/teams/maintainers

## About PublicLab
Public Lab is a community and non-profit democratizing science to address environmental issues that affect people.

[_^back to top_](#leaflet-environmental-layers-lel)
