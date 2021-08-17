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
    this._parsedToOrig = {};
    this._lat = this.options.lat;
    this._lon = this.options.lon;
  },

  onAdd: function (map) {
    this._map = map;
    var self = this;
    this._getURL();
    self.requestData();
  },

  onRemove: function (map) {
    this.clearLayers();
    map.spin(false);
    this._layers = {};
  },

  _getURL: function () {
    var spreadsheetID = this._getSpreadsheetID(); // To find the URL we need, we first need to find the spreadsheetID
    var self = this;
    // Then we have to make another request in order to find the worksheet ID, which is changed by the sheet within the spreadsheet we want
    var spreadsheetFeedURL =
      "https://sheets.googleapis.com/v4/spreadsheets/" +
      spreadsheetID +
      "/values/Sheet1?key=AIzaSyASUPXHvLt2N9fKvI5CnRI6EjV3P39YsMc";
    self.options.url = spreadsheetFeedURL;
    return spreadsheetFeedURL;
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

  // _getWorksheetID: function (spreadsheetID, spreadsheetFeedURL) {
  //   var self = this;
  //   return $.getJSON(spreadsheetFeedURL, function (data) {
  //     // The worksheetID we want is dependent on which sheet we are looking for
  //     var tmpLink = data.feed.entry[self.options.sheetNum].id.$t;
  //     var sections = tmpLink.split("/");
  //     // It is always the last section of the URL
  //     var sheetID = sections[sections.length - 1];
  //     // Set the URL to the final one.
  //     self.options.url =
  //       "https://spreadsheets.google.com/feeds/list/" +
  //       spreadsheetID +
  //       "/" +
  //       sheetID +
  //       "/public/values?alt=json";
  //   });
  // },

  requestData: function () {
    var self = this;
    (function () {
      var $ = window.jQuery;
      var ssURL = self.options.url || "";
      self._map.spin(true);
      // start fetching data from the URL
      $.getJSON(ssURL, function (data) {
        self.parseData(data.values);
        self._map.spin(false);
      });
    })();
  },

  parseData: function (data) {
    //Zeroth element contains column names
    this._columns = data[0];
    for (var i = 1; i < data.length; i++) {
      this.addMarker(data[i]);
    }
  },

  addMarker: function (data) {
    var key = data[0];
    if (!this._layers[key]) {
      var marker = this.getMarker(data);
      this._layers[key] = marker;
      this.addLayer(marker);
    }
  },

  getMarker: function (data) {
    var info = {};
    for (var i = 0; i < this._columns.length; i++) {
      info[this._columns[i]] = data[i] || ""; // Map column name to item index
    }
    // Get coordinates the coordinates; remember that _lat and _lon are the column names, not the actual values
    var latlon = [parseInt(info[this._lat]), parseInt(info[this._lon])];
    var generatePopup =
      this.options.generatePopup ||
      function () {
        return;
      };
    // Generate an object using the original column names as keys
    var origInfo = this._createOrigInfo(info);
    return L.marker(latlon, this.options.imageOptions).bindPopup(
      generatePopup(origInfo)
    );
  },

  _createOrigInfo: function (info) {
    // The user will most likely give their generatePopup in terms of the column names typed in,
    // not the parsed names. So this creates a new object that uses the original typed column
    // names as the keys
    var origInfo = {};
    for (var key in info) {
      var origKey = this._parsedToOrig[key];
      origInfo[origKey] = info[key];
    }
    return origInfo;
  },
});

L.spreadsheetLayer = function (options) {
  return new L.SpreadsheetLayer(options);
};
