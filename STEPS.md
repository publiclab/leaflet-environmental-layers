## Steps to add a new layer

1) Find the data source and go through the documentation to get data for our new layer.

2) Depending on the data, create a layer using leaflet's built-in classes such as [L.tileLayer](https://leafletjs.com/reference-1.5.0.html#tilelayer), [L.layerGroup](https://leafletjs.com/reference-1.5.0.html#layergroup), and [L.featureGroup](https://leafletjs.com/reference-1.5.0.html#featuregroup). For more information on other available classes please refer to leaflet's [documentation](https://leafletjs.com/reference-1.5.0.html).

3) Below is a sample code to create a new layer with `L.layerGroup`. Create a new file, `src/layerName.js` and add the code  along with any additional methods that may be needed for building the layer.

    ```javascript
    L.LayerGroup.LayerName = L.LayerGroup.extend(

      {
          options: {
            // key-value pairs of options
          },

          initialize: function (options) {
              options = options || {};
              L.Util.setOptions(this, options); // Merge options passed to constructor with the defaults in the class
              this._layers = {};
          },

          onAdd: function (map) { // Required to display layer on the map
              map.on('moveend', this.requestData, this);
              this.requestData();

          },

          onRemove: function (map) { // Required to remove from map
              map.off('moveend', this.requestData, this);
              this.clearLayers();
              this._layers = {};
          },

          requestData: function () {
            // Get layer data
          },
      }
    );
    ``` 

4) Add a function to create an instance of the layer

    ```javascript
    L.layerGroup.layerName = function(options) {
      return new L.LayerGroup.LayerName(options);
    };
    ```

5) Create a custom icon for the layer's marker.

    ```javascript
    L.Icon.LayerName = L.Icon.extend({
        options: {
          iconUrl: '', // Url to icon location
          iconSize:     [30, 20], // Size of the icon
          iconAnchor:   [20 , 0], // Point of the icon that correspond's to the marker's location
          popupAnchor:  [-5, -5] // Point at which the popup opens relative to iconAnchor
        }
    });

    L.icon.layerName = function () {
        return new L.Icon.LayerName();
    };
    ```

6) In `src/leafletEnvironmentalLayers.js`, add `require('./layerName')` to make the layer available to use in the project.

7) In `example/layers.js`:
    - Add the below line to instantiate the new layer
    ```var LayerName = L.layerGroup.layerName();```
    - Add the layer to the list of overlay maps in the layers control by adding a key-value pair, where the key is the layer name and the value is the layer object, to the `overlayMaps` object. The keys can have HTML where additional styling can be given to the layer names.
    `"<span style='color: #000'><strong>Layer name</strong></span>": LayerName`
    - Add `"LayerName": LayerName` to `allMapLayers` object.

8) (Optional) Write tests for the new layer to check if it is working as intended.
