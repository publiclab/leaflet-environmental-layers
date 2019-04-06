L.Icon.LuftdatenIcon = L.Icon.extend({
  options: {
    iconUrl: 'http://www.myiconfinder.com/uploads/iconsets/256-256-82a679a558f2fe4c3964c4123343f844.png',
    iconSize: [15, 30],
    iconAnchor: [6, 21],
    popupAnchor: [1, -34]
  }
});

L.icon.luftdatenIcon = function () {
  return new L.Icon.LuftdatenIcon();
};

L.LayerGroup.LuftdatenLayer = L.LayerGroup.extend(
	
  {
    options: {
      popupOnMouseover: true,
      clearOutsideBounds: true
    },

    initialize: function (options) {
      options = options || {};
      L.Util.setOptions(this, options);
      this._layers = {};
    },

    onAdd: function (map) {
      map.on('moveend', this.requestRegionData, this);
      this._map = map;
      this.requestRegionData();
    },

    onRemove: function (map) {
      map.off('moveend', this.requestRegionData, this);
      this.clearLayers();
      this._layers = {};
    },

    requestRegionData: function () {
      var self = this;

      (function () {
          var $ = window.jQuery;
          var url = "https://maps.luftdaten.info/data/v2/data.dust.min.json";

          if (typeof self._map.spin === 'function') {
            self._map.spin(true);
          }
          $.getJSON(url, function (records) {
            self.parseData(records);
            if (typeof self._map.spin === 'function') {
              self._map.spin(false);
            }
          });
      })();
    },

    getMarker: function (data) {

      var greenIcon = new L.icon.luftdatenIcon();
      var country = data.location.country;
      var lng = data.location.longitude;
      var lat = data.location.latitude;
      var sensorID = data.sensor.id;
      var popupContent = "";

      if(country){
        popupContent += "<h3>Country: " + country + "</h3>";
      }
      if(sensorID){
        popupContent += "<h4><b>Sensor ID: </b>" + sensorID + "</h4>";
      }
      if(data.sensordatavalues.length > 0){
        for(let i in data.sensordatavalues){
          popupContent += "<b>" + data.sensordatavalues[i].value_type + "</b>: " + data.sensordatavalues[i].value + "<br/>";
        }
      }

      return L.marker([lat,lng], { icon: greenIcon }).bindPopup(popupContent);	

    },

    addMarker: function(data,i) {
      var self = this;
      var marker = this.getMarker(data);
      var key = i;	
      if (!this._layers[key]) {
          this._layers[key] = marker;
          this.addLayer(marker);
      }
    },

    parseData: function (data) {
      for (var i = 0; i < data.length; i++) {
        this.addMarker(data[i],i);
      }
    },

    clearOutsideBounds: function () {
      var bounds = this._map.getBounds(),
        latLng,
        key;

      for (key in this._layers) {
        if (this._layers.hasOwnProperty(key)) {
          latLng = this._layers[key].getLatLng();

          if (!bounds.contains(latLng)) {
            this.removeLayer(this._layers[key]);
            delete this._layers[key];
          }
        }
      }

    }

  }
);

L.layerGroup.luftdatenLayer = function (options) {
  return new L.LayerGroup.LuftdatenLayer(options);
};