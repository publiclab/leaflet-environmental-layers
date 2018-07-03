# Leaflet Environmental Layers

## About :

The information of each layer can be found here :
https://publiclab.org/notes/sagarpreet/06-06-2018/leaflet-environmental-layer-library

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

### General (required for all layers) :

           <script src="../dist/LeafletEnvironmentalLayers.js"></script> 
           <link href="../node_modules/leaflet/dist/leaflet.css" rel="stylesheet">

### To use Wind Rose Layer : 

            <script src="../dist/windRoseLayer.js"></script> 
            <link href="../dist/LeafletEnvironmentalLayers.css" rel="stylesheet">

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

## Add Leaflet-Hash for easy sharing of map :    

### Steps To add : 

1.) Add link : 
    
    <script src="../node_modules/leaflet-hash/leaflet-hash.js"></script>

2.) Once you have initialized the map (an instance of L.Map), add the following code :

    // Assuming your map instance is in a variable called map
    var hash = new L.Hash(map);    

  Read more about Leaflet-Hash here : https://github.com/mlevans/leaflet-hash

