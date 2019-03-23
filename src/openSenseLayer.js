L.Icon.OpenSenseIcon = L.Icon.extend({
  options: {
    iconUrl: 'https://banner2.kisspng.com/20180409/qcw/kisspng-computer-icons-font-awesome-computer-software-user-cubes-5acb63cb589078.9265215315232787953628.jpg',
    iconSize: [10, 10],
    popupAnchor: [1, -34]
  }
});

L.icon.openSenseIcon = function () {
  return new L.Icon.OpenSenseIcon();
};

L.LayerGroup.OpenSenseLayer = L.LayerGroup.extend({

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
    this._map = map;
    this.requestRegionData();
  },

  onRemove: function (map) {
    this.clearLayers();
    this._layers = {};
  },

  populatePopUp: function (e) {
    if (e) {
      var popup = e.target.getPopup();
      var $ = window.jQuery;
      var url = "https://api.opensensemap.org/boxes/" + e.target.options.boxId;
      $.getJSON(url, function (data) {
        var popUpContent = "";
        if (data.name && data.grouptag) {
          popUpContent += "<h3>" + data.name + "," + data.grouptag + "</h3>";
        }
        else if (data.name) {
          popUpContent += "<h3>" + data.name + "</h3>";
        }
        for (var i in data.sensors) {
          if (data.sensors[i].lastMeasurement) {
            popUpContent += "<span><b>" + data.sensors[i].title + ": </b>" +
              data.sensors[i].lastMeasurement.value +
              data.sensors[i].unit + "</span><br>";
          }
        }
        if (data.lastMeasurementAt) {
          popUpContent += "<br><small>Measured at <i>" + data.lastMeasurementAt + "</i>";
        }
        popup.setContent(popUpContent);
      });
    }
  },

  requestRegionData: function () {
    var self = this;

    (function () {
      var $ = window.jQuery;
      var url = "https://api.opensensemap.org/boxes";

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

    var blackCube = new L.icon.openSenseIcon();

    var lat = data.currentLocation.coordinates[1];
    var lng = data.currentLocation.coordinates[0];

    var loadingText = "Loading ...";

    return L.marker([lat, lng], { icon: blackCube, boxId: data._id }).bindPopup(loadingText);

  },

  addMarker: function (data, i) {
    var marker = this.getMarker(data);
    var key = i;
    if (!this._layers[key]) {
      this._layers[key] = marker;
      marker.on('click', this.populatePopUp);
      this.addLayer(marker);
    }
  },

  parseData: function (data) {
    for (var i = 0; i < data.length; i++) {
      this.addMarker(data[i], i);
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

});

L.layerGroup.openSenseLayer = function (options) {
  return new L.LayerGroup.OpenSenseLayer(options);
};