leaflet-fullHash
================

Add dynamic URL hash for Leaflet map (map view and active layers). For those who also lack layers state in [leaflet-hash plugin](https://github.com/mlevans/leaflet-hash). Now you can easily link user to specific map view with certain active layers. 

### Demo
You can view a demo of leaflet-fullHash here: [kogor.github.io/leaflet-fullHash](http://kogor.github.io/leaflet-fullHash/index.html).

### Getting started
1. Include [leaflet-fullHash.js](https://github.com/KoGor/leaflet-fullHash/blob/master/leaflet-fullHash.js).

2. Once you have initialized the map (an instance of [L.Map](http://leafletjs.com/reference.html#map-class)), add the following code:

	```javascript
        // Assuming your map instance is in a variable called map
        var allMapLayers = {'base_layer_name': leaflet_layer_object,
                            'overlay_name': leaflet_layer_object,
                            'another_overlay_name': leaflet_layer_object};
        var hash = new L.Hash(map, allMapLayers);
    ```
Here `leaflet_layer_object` should be instance of any Leaflet layer (based on [ILayer](http://leafletjs.com/reference.html#ilayer)).

### License

MIT License. See [LICENSE](https://github.com/KoGor/leaflet-fullHash/blob/master/LICENSE) for details.
