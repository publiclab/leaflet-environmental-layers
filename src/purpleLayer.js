require('heatmap.js');
require('leaflet-heatmap');

L.LayerGroup.PurpleLayer = L.LayerGroup.extend(

  {

    options: {
      'radius': 2,
      'maxOpacity': 1,
      'scaleRadius': true,
      'useLocalExtrema': true,
      'latField': 'lat',
      'lngField': 'lng',
      'valueField': 'count',
      'blur': 0.75,
    },

    initialize: function(options) {
      options = options || {};
      L.Util.setOptions(this, options);
      this._layers = {};
      this._purpleLayerArray = [];
      this.heatmapLayer;
    },

    onAdd: function(map) {
      this._map = map;
      this.heatmapLayer = new HeatmapOverlay(this.options);
      this.requestData();
    },

    onRemove: function(map) {
      this._map.removeLayer(this.heatmapLayer);
      if (typeof map.spin === 'function') {
        map.spin(false);
      }
      this.clearLayers();
      this._layers = {};
    },

    requestData: function() {
      var self = this;
      (function() {
        var PurpleLayer_url = 'https://www.purpleair.com/json?fetchData=true&minimize=true&sensorsActive2=10080&orderby=L';
        var request = new XMLHttpRequest();
        request.open('GET', PurpleLayer_url, true);
        if (typeof self._map.spin === 'function') {
          self._map.spin(true);
        }
        request.onload = function() {     
          if (this.status >= 200 && this.status < 400) {
            // Success!
            var data = JSON.parse(this.response);
            self.parseData(data);
            if (self._map && typeof self._map.spin === 'function') {
              self._map.spin(false);
            } else {
              map.spin(false);
            }
          } else {
            // We reached our target server, but it returned an error
            console.log('server error')
            if (self._map && typeof self._map.spin === 'function') {
              self._map.spin(false);
            } else {
              map.spin(false);
            }
          }
        };
        request.onerror = function() {
          // There was a connection error of some sort
          console.log('Something went wrong')
          if (self._map && typeof self._map.spin === 'function') {
            self._map.spin(false);
          } else {
            map.spin(false);
          }
        };
        request.send();
        
      })();
    },

    getMarker: function(data) {
      var lat = data.Lat;
      var lng = data.Lon;

      var value = parseFloat(data.PM2_5Value); // PM2.5 VALUE in microgram per metre cube
      var isLocationPresent = lat || lng || value;

      if (!isLocationPresent) {
        return;
      }
      var purpleLayer_object = {};
      purpleLayer_object.lat = parseFloat(lat);
      purpleLayer_object.lng = parseFloat(lng);
      purpleLayer_object.count = value;
      /*
              var aqi ;
              if(value>=0 && value<=12.0)
              {
                aqi = ((50-0)*(value-0))/(12-0) + 0 ;
              }
              else if(value<=35.4){
                aqi = ((100-51)*(value-12.1))/(35.4-12.1) + 51 ;
              }
              else if(value<=55.4){
                aqi = ((150-101)*(value-35.5))/(55.4-35.5) + 101 ;
              }
              else if(value<=150.4){
                aqi = ((200-151)*(value-55.5))/(150.4-55.5) + 151 ;
              }
              else if(value<=250.4){
                aqi = ((3000-201)*(value-150.5))/(250.4-150.5) + 201 ;
              }
              else if(value<=350.4){
                aqi = ((400-301)*(value-250.5))/(350.4-250.5) + 301 ;
              }
              else{
                aqi = ((500-401)*(value-350.5))/(500.4-350.5) + 401 ;
              }

              purpleLayer_object.count = aqi ;
              */
      return purpleLayer_object;
    },

    addMarker: function(data) {
      var marker = this.getMarker(data);

      if (marker && marker.lat && marker.lng) {
        this._purpleLayerArray.push(marker);
      }
    },

    parseData: function(data) {
      for (i = 0; i < data.results.length; i++) {
        this.addMarker(data.results[i]);
      }
      this.heatmapLayer.setData({data: this._purpleLayerArray});
      this._map.addLayer(this.heatmapLayer);
    },
  },
);


L.layerGroup.purpleLayer = function(options) {
  return new L.LayerGroup.PurpleLayer(options);
};
