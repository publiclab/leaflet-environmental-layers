L.LayerGroup.IndigenousLayers = L.LayerGroup.extend(

  {
    options: {

      popupOnMouseover: false,
      clearOutsideBounds: false,
      target: '_self',
    },

    initialize: function(name, options) {
      this.layer = name;
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
        var zoom = self._map.getZoom(); var origin = self._map.getCenter();
        var $ = window.jQuery;
        var ILL_url;

        if (self.layer === 'Territories' ) {
          ILL_url = 'https://native-land.ca/api/index.php?maps=territories&position=' + parseInt(origin.lat) + ',' + parseInt(origin.lng);
        }
        if (self.layer === 'Languages') {
          ILL_url = 'https://native-land.ca/api/index.php?maps=languages&position=' + parseInt(origin.lat) + ',' + parseInt(origin.lng);
        }
        if (self.layer === 'Treaties' ) {
          ILL_url = 'https://native-land.ca/api/index.php?maps=treaties&position=' + parseInt(origin.lat) + ',' + parseInt(origin.lng);
        }

        if (typeof self._map.spin === 'function') {
          self._map.spin(true);
        }
        $.getJSON(ILL_url, function(data) {
          self.parseData(data);
          if (typeof self._map.spin === 'function') {
            self._map.spin(false);
          }
        }).fail(function() {
            self.onError(self.layer, true)
        });
      })();
    },


    getPoly: function(data) {
      var coords = data.geometry.coordinates;

      for (var j = 0; j < coords[0].length; j++) {
        var temp = coords[0][j][1];
        coords[0][j][1] = coords[0][j][0];
        coords[0][j][0] = temp;
      }


      var nme = data.properties.Name;
      var frNme = data.properties.FrenchName;
      var desc = data.properties.description;
      var frDesc = data.properties.FrenchDescription;
      var clr = data.properties.color;
      var key = data.id;
      var ill_poly;
      if (!isNaN((coords[0][0][0]) && !isNaN((coords[0][0][1]))) ) {
        if (this.layer === 'Territories') {
          ill_poly = L.polygon(coords, {color: clr}).bindPopup('<strong>Name : </strong>' + nme + '<br><strong>Description: </strong> <a href=' + desc + '>Native Lands - ' + nme + '</a><br><i>From the <a href=\'https://github.com/publiclab/leaflet-environmental-layers/pull/77\'>Indigenous Territories Inventory</a> (<a href=\'https://publiclab.org/notes/sagarpreet/06-06-2018/leaflet-environmental-layer-library?_=1528283515\'>info<a>)</i>');
        }
        if (this.layer === 'Languages') {
          ill_poly = L.polygon(coords, {color: clr}).bindPopup('<strong>Name : </strong>' + nme + '<br><strong>Description: </strong> <a href=' + desc + '>Native Lands - ' + nme + '</a><br><i>From the <a href=\'https://github.com/publiclab/leaflet-environmental-layers/pull/76\'>Indigenous Languages Inventory</a> (<a href=\'https://publiclab.org/notes/sagarpreet/06-06-2018/leaflet-environmental-layer-library?_=1528283515\'>info<a>)</i>');
        }
        if (this.layer === 'Treaties') {
          ill_poly = L.polygon(coords, {color: clr}).bindPopup('<strong>Name : </strong>' + nme + '<br><strong>Description: </strong> <a href=' + desc + '>Native Lands - ' + nme + '</a><br><i>From the <a href=\'https://github.com/publiclab/leaflet-environmental-layers/pull/78\'>Indigenous Treaties Inventory</a> (<a href=\'https://publiclab.org/notes/sagarpreet/06-06-2018/leaflet-environmental-layer-library?_=1528283515\'>info<a>)</i>');
        }
      }
      return ill_poly;
    },

    addPoly: function(data) {
      var poly = this.getPoly(data); var key = data.id;

      if (!this._layers[key]) {
        this._layers[key] = poly;
        this.addLayer(poly);
      }
    },

    parseData: function(data) {
      if (!!data) {
        for (var i = 0; i < data.length; i++) {
          this.addPoly(data[i]);
        }
        if (this.options.clearOutsideBounds) {
          this.clearOutsideBounds();
        }
      }
    },

    clearOutsideBounds: function() {
      var bounds = this._map.getBounds();
      var polyBounds;
      var key;

      for (key in this._layers) {
        if (this._layers.hasOwnProperty(key)) {
          polyBounds = this._layers[key].getBounds();

          if (!bounds.intersects(polyBounds)) {
            this.removeLayer(this._layers[key]);
            delete this._layers[key];
          }
        }
      }
    },
  },
);

L.layerGroup.indigenousLayers = function(name, options) {
  return new L.LayerGroup.IndigenousLayers(name, options);
};
