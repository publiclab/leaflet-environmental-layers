# Leaflet Environmental Layers

## Quick Setup : 

To set up the library first clone this repo to your local environment; then run 'npm install' to install all the neccessary packages required. Open examples/index.html to look at the preview of the library.


## Demo : 

Checkout this demo : https://publiclab.github.io/leaflet-environmental-layers/example/mapSimple.html

## Features : 

#### Zoom or Pan

Click and drag the map to pan it. 

#### Change the Base Map and Overlay layers

Use the button on right-most corner to change the way the background of the map looks .

#### See More Data

Toggle certain layers on and off using the Layers button in the toolbar .

#### Click on a Point

Click on a point or marker on the map to learn more about it .

## Dependencies : 

### General (required for all layers)

<script src="../dist/LeafletEnvironmentalLayers.js"></script> 
<link href="../node_modules/leaflet/dist/leaflet.css" rel="stylesheet">

### To use Wind Rose Layer , add : 

<script src="../dist/windRoseLayer.js"></script> 
<link href="../dist/LeafletEnvironmentalLayers.css" rel="stylesheet">



