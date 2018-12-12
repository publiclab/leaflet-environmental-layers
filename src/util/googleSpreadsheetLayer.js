L.SpreadsheetLayer = L.LayerGroup.extend({
  options: {
      //Must be supplied:
      //url: String url of data sheet
      //columns: Array of column names
  },

  initialize: function (options) {
      options = options || {};
      L.Util.setOptions(this, options);
      this._layers = {};
  },

  onAdd: function (map) {
      //map.on('moveend', this.requestData, this);
      this._map = map;
      this.requestData();
  },

  onRemove: function (map) {
      //map.off('moveend', this.requestData, this);
      this.clearLayers();
      map.spin(false) ;
      this._layers = {};
  },

  getURL: function() {
    console.log(this.options.url);
    var sections = this.options.url.split('/');
    console.log(sections);
    var spreadsheetID;
    var len = sections.length;
    for(var i = 1; i < len; i++) {
      if(sections[i - 1].length === 1) {
        spreadsheetID = sections[i];
      }
    }
    console.log(spreadsheetID);
    var spreadsheetFeedURL = "https://spreadsheets.google.com/feeds/worksheets/" + spreadsheetID + "/public/basic?alt=json";
    console.log(spreadsheetFeedURL);
    $.getJSON(spreadsheetFeedURL, function(data) {
      console.log(data.feed.entry[0].id);
      var tmpLink = data.feed.entry[0].id.$t;
      var sections = tmpLink.split('/');
      var sheetID = sections[sections.length - 1];
      console.log(sheetID);

      var sheetFeedURL = "https://spreadsheets.google.com/feeds/list/" + spreadsheetID + "/" + sheetID + "/public/values?alt=json";
    });
    //Replace in here: https://spreadsheets.google.com/feeds/worksheets/spreadsheetID/public/basic?alt=json
    //1SMLuC_61MLgGGik4rby-cBCiKM5kQ-t0qITVdSVPNNk
    //https://spreadsheets.google.com/feeds/worksheets/1SMLuC_61MLgGGik4rby-cBCiKM5kQ-t0qITVdSVPNNk/public/basic?alt=json
    //Replace in here: https://spreadsheets.google.com/feeds/list/spreadsheetID/worksheetID/public/values?alt=json
    //Replace in here: https://spreadsheets.google.com/feeds/list/1SMLuC_61MLgGGik4rby-cBCiKM5kQ-t0qITVdSVPNNk/od6/public/values?alt=json
  },

  requestData: function () {
    /*
     var self = this;
          (function() {
              var script = document.createElement("SCRIPT");
              script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js';
              script.type = 'text/javascript';

              script.onload = function() {
                  var $ = window.jQuery;
                  var ssURL = self.options.url || "https://spreadsheets.google.com/feeds/list/19j4AQmjWuELuzn1GIn0TFRcK42HjdHF_fsIa8jtM1yw/o4rmdye/public/values?alt=json";
                  self._map.spin(true) ;
                  $.getJSON(ssURL , function(data){
                    self.parseData(data.feed.entry);
                    self._map.spin(false) ;
              });
              };
              document.getElementsByTagName("head")[0].appendChild(script);
          })();
          */
  },

  //generatePopup

  addMarker: function(data) {
    var info = {};
    for(var i = 0; i < columns.length; i++) {
      info[columns[i]] = data["gsx$" + columns[i].toLowerCase()];
    }
  },

  parseData: function(data) {
    for(var i = 0; i < data.length; i ++) {
      this.addMarker(data[i]);
    }
  }
});
