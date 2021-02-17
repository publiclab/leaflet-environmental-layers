L.Icon.ToxicReleaseIcon = L.Icon.extend({
  options: {
    iconUrl: 'https://www.clker.com/cliparts/r/M/L/o/R/i/green-dot.svg',
    iconSize: [30, 20],
    iconAnchor: [20, 0],
    popupAnchor: [-5, -5],
  },
});

L.icon.toxicReleaseIcon = function() {
  return new L.Icon.ToxicReleaseIcon();
};


L.LayerGroup.ToxicReleaseLayer = L.LayerGroup.extend(

  {
    options: {
      popupOnMouseover: false,
      clearOutsideBounds: false,
      target: '_self',
    },

    initialize: function(options) {
      options = options || {};
      L.Util.setOptions(this, options);
      this._layers = {};
    },

    onAdd: function(map) {
      var info = require('./info.json');
      this._map = map;
      map.on('moveend', function() {
        if(this._map && this._map.getZoom() > info.toxicReleaseLayer.extents.minZoom - 1) {
          this.requestData();
        }
      }, this);
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
      var info = require('./info.json');
      (function() {
        var $ = window.jQuery;
        var zoom = self._map.getZoom(); var origin = self._map.getCenter();
        var extents = info.toxicReleaseLayer.extents;
        var latLngbounds = extents.bounds;
        if (zoom < extents.minZoom) {
          return;
        }
        var bounds = new L.LatLngBounds(latLngbounds);

        if (!bounds.contains(new L.LatLng(origin.lat, origin.lng))) {
          return;
        }
        var TRI_url = info.toxicReleaseLayer.api_url + parseInt(origin.lat)+'/PREF_LONGITUDE/BEGINNING/'+parseInt(-1*origin.lng)+'/rows/0:300/JSON';
        if (typeof self._map.spin === 'function') {
          self._map.spin(true);
        }
        $.getJSON(TRI_url, function(data) {
          // console.log(parseInt(origin.lat) +" and "+parseInt(origin.lng)) ;
          self.parseData(data);
          if (typeof self._map.spin === 'function') {
            self._map.spin(false);
          }
        }).fail(function() {
          self.onError('toxicReleaseLayer')
        });
      })();
    },

    getMarker: function(data) {
      var greenDotIcon =new L.icon.toxicReleaseIcon();
      var lat = data.PREF_LATITUDE;
      var lng = -1*data.PREF_LONGITUDE;
      // console.log(lat +"  "+lng) ;
      var fac_name = data.FACILITY_NAME;
      var city = data.CITY_NAME;
      var mail_street_addr = data.MAIL_STREET_ADDRESS;
      var contact = data.ASGN_PUBLIC_PHONE;
      var defaultMarker = L.marker([lat, lng], {icon: greenDotIcon});
      var minimalMarker = L.circleMarker(L.latLng([lat, lng]), { radius: 5, weight: 1, fillOpacity: 1, color: '#7c7c7c', fillColor: '#6ccc00' });
      var content = '<strong>Name : </strong>' + fac_name + '<br><strong> City :' + city +'</strong>' + '<br><strong> Street address : ' + mail_street_addr + '</strong><br><strong> Contact : ' + contact + '</strong><br>Lat :'+lat+'<br>Lon :'+lng +'<br><i>From the <a href=\'https://github.com/publiclab/leaflet-environmental-layers/pull/8\'>Toxic Release Inventory</a> (<a href=\'https://publiclab.org/notes/sagarpreet/06-06-2018/leaflet-environmental-layer-library?_=1528283515\'>info<a>)</i>';
      var tri_marker;
      if (!isNaN((lat)) && !isNaN((lng)) ) {
        tri_marker = this._map && this._map._minimalMode ? minimalMarker.bindPopup(content) : defaultMarker.bindPopup(content);
      }
      return tri_marker;
    },

    addMarker: function(data) {
      var marker = this.getMarker(data);

      var key = data.TRI_FACILITY_ID;

      if (!this._layers[key]) {
        this._layers[key] = marker;
        this.addLayer(marker);
      }
    },

    parseData: function(data) {
      if (!!data) {
        for (i = 0; i < data.length; i++) {
          this.addMarker(data[i]);
        }

        if (this.options.clearOutsideBounds) {
          this.clearOutsideBounds();
        }
      }
    },

    clearOutsideBounds: function() {
      var bounds = this._map.getBounds();
      var latLng;
      var key;

      for (key in this._layers) {
        if (this._layers.hasOwnProperty(key)) {
          latLng = this._layers[key].getLatLng();

          if (!bounds.contains(latLng)) {
            this.removeLayer(this._layers[key]);
            delete this._layers[key];
          }
        }
      }
    },
  },
);

L.layerGroup.toxicReleaseLayer = function(options) {
  return new L.LayerGroup.ToxicReleaseLayer(options);
};
