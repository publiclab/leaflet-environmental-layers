const PublicGoogleSheetsParser = require("public-google-sheets-parser");
const parser = new PublicGoogleSheetsParser();

L.SpreadsheetLayer = L.LayerGroup.extend({
  // options: {
  // Must be supplied:
  // url: String url of data sheet
  // columns: Array of column names to be used
  // lat, lon column names
  // generatePopup: function used to create content of popups

  // Optional:
  // imageOptions: defaults to blank
  // sheet index: defaults to 0 (first sheet)
  // },

  initialize: function (options) {
    options = options || {};
    L.Util.setOptions(this, options);
    this._layers = {};
    this._columns = [];
    this.options.imageOptions = this.options.imageOptions || {};
    this.options.sheetNum = this.options.sheetNum || 0;
    this._lat = this.options.lat;
    this._lon = this.options.lon;
  },

  onAdd: function (map) {
    this._map = map;
    var self = this;
    self.requestData();
  },

  onRemove: function (map) {
    this.clearLayers();
    map.spin(false);
    this._layers = {};
  },

  _getSpreadsheetID: function () {
    var sections = this.options.url.split("/"); // The spreadsheet ID generally comes after a section with only 1 character, usually a D.
    var spreadsheetID;
    var len = sections.length;
    for (var i = 1; i < len; i++) {
      if (sections[i - 1].length === 1) {
        // Here we check to see if the previous one was 1 character
        spreadsheetID = sections[i];
        break;
      }
    }
    return spreadsheetID;
  },

  requestData: function () {
    var self = this;
    var spreadsheetID = this._getSpreadsheetID();
    parser.id = spreadsheetID;
    parser
      .parse()
      .then((data) => {
        self.parseData(data);
        if (typeof self._map.spin === "function") {
          self._map.spin(false);
        }
      })
      .catch(function (error) {
        console.log(error);
        self.onError("pfasLayer");
      });
  },

  parseData: function (data) {
    for (var i = 0; i < data.length; i++) {
      this.addMarker(data[i]);
    }
  },

  addMarker: function (data) {
    //Set key to data in first column
    var key = data[Object.keys(data)[0]];
    if (!this._layers[key]) {
      var marker = this.getMarker(data);
      this._layers[key] = marker;
      this.addLayer(marker);
    }
  },

  getMarker: function (data) {
    var info = data;
    // Get coordinates the coordinates; remember that _lat and _lon are the column names, not the actual values
    var latlon = [parseInt(info[this._lat]), parseInt(info[this._lon])];
    var generatePopup =
      this.options.generatePopup ||
      function () {
        return;
      };
    return L.marker(latlon, this.options.imageOptions).bindPopup(
      generatePopup(info)
    );
  },
});

L.spreadsheetLayer = function (options) {
  return new L.SpreadsheetLayer(options);
};
