// require('leaflet-blurred-location') ;
// require('leaflet-blurred-location-display') ;

L.LayerGroup.PLpeopleLayer = L.LayerGroup.extend(

  {
    options: {
      url: 'https://publiclab.org/api/srch/nearbyPeople',
      clearOutsideBounds: false,
    },

    initialize: function(options) {
      options = options || {};
      L.Util.setOptions(this, options);
      this._layers = {};
    },

    onAdd: function(map) {
      this._map = map;
      this.blurred_options = {
        map: this._map,
      };
      this.BlurredLocation = new BlurredLocation(this.blurred_options);
      this.locations = [[23.1, 77.1]]; // testing marker
      this.options_display = {
        blurredLocation: this.BlurredLocation,
        locations: this.locations,
        source_url: 'https://publiclab.org/api/srch/nearbyPeople',
        color_code_markers: false, // by default this is false .
        style: 'both', // or 'heatmap' or 'markers' , by default is 'both'
      };

      this.blurredLocationDisplay = new BlurredLocationDisplay(this.options_display);
    },

    onRemove: function(map) {
      this._layers = {};
      this.blurredLocationDisplay.removeLBLD();
      var lbld = this.blurredLocationDisplay;
      setTimeout(function() { lbld.removeLBLD(); }, 2000);
      setTimeout(function() { lbld.removeLBLD(); }, 5000);
      setTimeout(function() { lbld.removeLBLD(); }, 7000);
      setTimeout(function() { lbld.removeLBLD(); }, 10000);
    },

  },
);


L.layerGroup.pLpeopleLayer = function(options) {
  return new L.LayerGroup.PLpeopleLayer(options);
};
