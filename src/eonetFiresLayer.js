L.Icon.EonetFiresIcon = L.Icon.extend({
  options: {
    iconUrl: 'https://image.flaticon.com/icons/svg/785/785116.svg',
    iconSize: [30, 20],
    iconAnchor: [20, 0],
    popupAnchor: [-5, -5],
  },
});

L.icon.eonetFiresIcon = function() {
  return new L.Icon.EonetFiresIcon();
};


L.GeoJSON.EonetFiresLayer = L.GeoJSON.extend(
  {
    options: {
      attribution: '<div>Icon made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>',
    },

    initialize: function(options) {
      options = options || {};
      L.Util.setOptions(this, options);
      this._layers = {};
    },

    onAdd: function(map) {
      map.on('moveend', this.requestData, this);
      this._map = map;
      this.requestData();
    },

    onRemove: function(map) {
      map.off('moveend', this.requestData, this);
      if (typeof map.spin === 'function') {
        map.spin(false);
      }
      this.clearLayers();
      this._layers = {};
    },

    requestData: function() {
      var self = this;

      (function() {
        var EonetFire_url = 'https://eonet.sci.gsfc.nasa.gov/api/v2.1/categories/8';
        var request = new XMLHttpRequest();
        request.open('GET', EonetFire_url, true);
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

    parseData: function(data) {
      if (!!data) {
        for (i = 0; i < data.events.length; i++) {
          this.addMarker(data.events[i]);
        }
      }
    },

    getMarker: function(data) {
      var fireIcon = new L.icon.eonetFiresIcon();
      var coords = this.coordsToLatLng(data.geometries[0].coordinates);
      var lat = coords.lat;
      var lng = coords.lng;
      var title = data.title;
      var date = new Date(data.geometries[0].date).toUTCString();
      var source = data.sources && data.sources[0].url;
      var fire_marker;
      var defaultMarker = L.marker([lat, lng], {icon: fireIcon});
      var minimalMarker = L.circleMarker(coords, { radius: 5, weight: 1, fillOpacity: 1, color: '#7c7c7c', fillColor: '#ff421d' });
      if (!isNaN((lat)) && !isNaN((lng)) ) {
        var content = '<strong>Event : </strong>' + title + '<br>Lat : ' + lat + '<br>Lon : '+ lng + '<br>Date : ' + date + '<br><i><a href=' + source + '>source<a></i>';
        fire_marker = this._map && this._map._minimalMode ? minimalMarker.bindPopup(content) : defaultMarker.bindPopup(content);
      }
      return fire_marker;
    },

    addMarker: function(data) {
      var marker;
      var key = data.id;
      if (!this._layers[key]) {
        marker = this.getMarker(data);
        this._layers[key] = marker;
        this.addLayer(marker);
      }
    },

    coordsToLatLng: function(coords) {
      return new L.LatLng(coords[1], coords[0]);
    },

  },
);


L.geoJSON.eonetFiresLayer = function(options) {
  return new L.GeoJSON.EonetFiresLayer(options);
};
