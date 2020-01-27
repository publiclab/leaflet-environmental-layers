# Leaflet Environmental Layers
[![Build Status](https://travis-ci.org/publiclab/leaflet-environmental-layers.svg)](https://travis-ci.org/publiclab/leaflet-environmental-layers)
[![npm version](https://badge.fury.io/js/leaflet-environmental-layers.svg)](https://badge.fury.io/js/leaflet-environmental-layers) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)
[![Code of Conduct](https://img.shields.io/badge/code-of%20conduct-green.svg)](https://publiclab.org/conduct)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
<a href='https://bower.io/search/'><img src="https://benschwarz.github.io/bower-badges/badge@2x.png" width="130" height="30" alt='Bower Version'></a>

A leaflet plugin that has a collection of layers containing environmental data pulled in from different sources. See this [demo page](https://publiclab.github.io/leaflet-environmental-layers/example/index.html#lat=43.00&lon=-4.07&zoom=3&layers=Standard) for a simple demonstration of the plugin.

## Installation
- Run 
  
        npm install leaflet-environmental-layers

- Install Bootstrap(Required for the layers menu)
- Install @fortawesome/fontawesome-free
- Add the following to the head of the HTML file that would contain the map

        <!-- Bootstrap --> 
        <link rel="stylesheet" href="node_modules\bootstrap\dist\css\bootstrap.min.css">
        <script src="node_modules\jquery\dist\jquery.slim.min.js"></script>
        <script src="node_modules\bootstrap\dist\js\bootstrap.min.js"></script>
        
        <!-- Leaflet --> 
        <link href="node_modules/leaflet/dist/leaflet.css" rel="stylesheet" />
        <script src="node_modules/leaflet/dist/leaflet.js"></script>

        <!-- Blurred Location -->
        <script src="node_modules/leaflet-blurred-location/dist/Leaflet.BlurredLocation.js"></script>
        <script src="node_modules/leaflet.blurred-location-display/dist/Leaflet.BlurredLocationDisplay.js"></script>

        <!-- Leaflet Environmental Layers -->
        <link href="node_modules/leaflet-environmental-layers/dist/LeafletEnvironmentalLayers.css" rel="stylesheet" />
        <script src="node_modules/leaflet-environmental-layers/dist/LeafletEnvironmentalLayers.js"></script>
        <link rel="stylesheet" href="node_modules\leaflet-environmental-layers\example\styles.css">
        
        <!-- Leaflet Spin -->
        <script src="node_modules/leaflet-spin/example/spin/dist/spin.min.js"></script>
        <script src="node_modules/leaflet-spin/example/leaflet.spin.min.js"></script>

        <!-- Layer dependencies -->
        <script src="node_modules/heatmap.js/build/heatmap.min.js"></script>
        <script src="node_modules/leaflet-heatmap/leaflet-heatmap.js"></script>
        <script src="node_modules/leaflet-environmental-layers/src/windRoseLayer.js"></script>

        <!-- Other dependencies -->
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js" type="text/javascript"></script>
        <link href="node_modules\@fortawesome\fontawesome-free\css\all.min.css" rel="stylesheet" />
        <script src="https://unpkg.com/esri-leaflet@2.2.3/dist/esri-leaflet.js"></script>
        <script src="https://unpkg.com/esri-leaflet-renderers@2.0.6"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/OverlappingMarkerSpiderfier-Leaflet/0.2.6/oms.min.js"></script>
        <script src="node_modules\leaflet-environmental-layers\lib\glify.js"></script>
        <script src="node_modules\leaflet-environmental-layers\lib\leaflet-fullUrlHash.js"></script>


## Basic usage

      L.LayerGroup.EnvironmentalLayers().addTo(map);


### Content
1. What is LEL
2. Terminologies
3. Get started
4. Basic usage
5. About Layers
6. embed
7. custom control Bar
8. Hash
9. Testing
10. How to contribute?
11. Reach out the maintainers
12. About PublicLab