L.GeoJSON.FracTrackerMobile = L.GeoJSON.extend(
  {
    options: { },

    initialize: function(options) {
      options = options || {};
      L.Util.setOptions(this, options);
      this._layers = {};
    },

    onAdd: function(map) {
      var info = require('./info.json');
      this._map = map;
      map.on('moveend', function() {
        if (this._map && this._map.getZoom() > info.fracTrackerMobile.extents.minZoom - 1) {
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

      (function() {
        var bounds = self._map.getBounds();
        var northEast = bounds.getNorthEast();
        var southWest = bounds.getSouthWest();
        var left = southWest.lng;
        var right = northEast.lng;
        var top = northEast.lat;
        var bottom = southWest.lat;
        var polygon = left + ' ' + top + ',' + right + ' ' + top + ',' + right + ' ' + bottom + ',' + left + ' ' + bottom + ',' + left + ' ' + top;
        var $ = window.jQuery;
        var fractrackerMobile_url = 'https://cors-anywhere.herokuapp.com/https://api.fractracker.org/v1/data/report?page=1&results_per_page=250&q={"filters":[{"name":"geometry","op":"intersects","val":"SRID=4326;POLYGON((' + polygon +'))"}],"order_by":[{"field":"report_date","direction":"desc"},{"field":"id","direction":"desc"}]}';

        if (typeof self._map.spin === 'function') {
          self._map.spin(true);
        }
        var timeout = setTimeout(function() {
          if (typeof self._map.spin === 'function') {
            self._map.spin(false);
          }
        }, 10000);
        var fetchedData = $.getJSON(fractrackerMobile_url);
        return {fetchedData, timeout};
      })().done(function(data) {
        console.log(data);
        self.parseData(data.fetchedData);
        if (typeof self._map.spin === 'function') {
          self._map.spin(false);
          clearTimeout(data.timeout);
        }
      }).fail(function() {
        self.onError('fracTrackerMobile');
      });
    },

    parseData: function(data) {
      if (!!data) {
        for ( var i = 0; i < data.features.length; i++) {
          this.addMarker(data.features[i]);
        }
      }
    },

    getMarker: function(data) {
      var coords = this.coordsToLatLng(data.geometry.coordinates || data.geometry.geometries[0].coordinates);
      var lat = coords.lat;
      var lng = coords.lng;
      var description = data.properties.description ? data.properties.description : '';
      var date = new Date(data.properties.report_date).toUTCString();
      var dateModified = new Date(data.properties.modified_on).toUTCString();
      var organizationName = data.properties.created_by.organization_name ? data.properties.created_by.organization_name : '';
      var imageUrl = data.properties.images[0] && data.properties.images[0].properties.square;
      var imageElement = imageUrl ? '<img src="' + imageUrl + '" alt="User image" width="100%" />' : '';
      var marker;
      if (!isNaN((lat)) && !isNaN((lng)) ) {
        marker = new L.circleMarker([lat, lng], {radius: 5, color: '#e4458b'})
          .bindPopup(imageElement + '<br><strong>'+ description + '</strong><br>Lat : ' + lat + '<br>Lon : '+ lng + '<br>Reported on : ' + date + '<br>Modified on : ' + dateModified + '<br>' + organizationName);
      }
      return marker;
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


L.geoJSON.fracTrackerMobile = function(options) {
  return new L.GeoJSON.FracTrackerMobile(options);
};
