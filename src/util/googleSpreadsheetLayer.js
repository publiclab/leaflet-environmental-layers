L.SpreadsheetLayer = L.LayerGroup.extend({
    //options: {
        //Must be supplied:
        //url: String url of data sheet
        //columns: Array of column names to be used
        //sheet number: n
        //lat, lon columns
    //},

    initialize: function(options) {
        options = options || {};
        L.Util.setOptions(this, options);
        this._layers = {};
        this._urlObtained = false;
        this._columns = this.options.columns || [];
        console.log("columns:", this._columns);
        this._parsedToOrig = {};
        this._lat = this._cleanColumnName(this.options.lat);
        this._lon = this._cleanColumnName(this.options.lon);
        this._columns = this._cleanColumns(this._columns);
        this.getURL();
    },
    
    _cleanColumns: function(columns) {
        console.log("cleaning");
        for(var i = 0; i < columns.length; i++) {
            var parsedColumnName = this._cleanColumnName(columns[i]);
            this._parsedToOrig[parsedColumnName] = columns[i];
            columns[i] = parsedColumnName;
        }
        if(columns.indexOf(this._lat) <= -1) {
            columns.push(this._lat);
            this._parsedToOrig[this._lat] = this.options.lat;
        }
        if(columns.indexOf(this._lon) <= -1) {
            columns.push(this._lon);
            this._parsedToOrig[this._lon] = this.options.lon;
        }
        console.log(columns);
        return columns;
    },
    
    _cleanColumnName: function(columnName) { //Tries to emulate google's conversion of column titles
        return columnName.replace(/^[^a-zA-Z]+/g, '') //remove any non letters from the front till first letter
                         .replace(/\s+|[!@#$%^&*()]+/g, '') //remove most symbols
                         .toLowerCase();
    },
    
    onAdd: function(map) {
        map.on('moveend', this.requestData, this);
        this._map = map;
        this.requestData();
    },

    onRemove: function(map) {
        map.off('moveend', this.requestData, this);
        this.clearLayers();
        map.spin(false);
        this._layers = {};
    },

    getURL: function() {
        //console.log(this.options.url);
        var sections = this.options.url.split('/');
        //console.log(sections);
        var spreadsheetID;
        var len = sections.length;
        for (var i = 1; i < len; i++) {
            if (sections[i - 1].length === 1) {
                spreadsheetID = sections[i];
            }
        }
        //console.log("Spreadsheet ID:", spreadsheetID);
        var self = this;
        var spreadsheetFeedURL = "https://spreadsheets.google.com/feeds/worksheets/" + spreadsheetID + "/public/basic?alt=json";
        //console.log("Spreadsheet Feed URL", spreadsheetFeedURL);
        $.getJSON(spreadsheetFeedURL, function(data) {
            //console.log(data.feed.entry[0].id);
            var tmpLink = data.feed.entry[0].id.$t;
            var sections = tmpLink.split('/');
            var sheetID = sections[sections.length - 1];
            //console.log(sheetID);

            self.options.url = 'https://spreadsheets.google.com/feeds/list/' + spreadsheetID + '/' + sheetID + "/public/values?alt=json";
            self._urlObtained = true;
            //console.log("URL Obtained:", self.options.url);
        });
        //Replace in here: https://spreadsheets.google.com/feeds/worksheets/spreadsheetID/public/basic?alt=json
        //1SMLuC_61MLgGGik4rby-cBCiKM5kQ-t0qITVdSVPNNk
        //https://spreadsheets.google.com/feeds/worksheets/1SMLuC_61MLgGGik4rby-cBCiKM5kQ-t0qITVdSVPNNk/public/basic?alt=json
        //Replace in here: https://spreadsheets.google.com/feeds/list/spreadsheetID/worksheetID/public/values?alt=json
        //Replace in here: https://spreadsheets.google.com/feeds/list/1SMLuC_61MLgGGik4rby-cBCiKM5kQ-t0qITVdSVPNNk/od6/public/values?alt=json
    },

    requestData: function() {
        if (this._urlObtained) {
            var self = this;
            (function() {
                var script = document.createElement("SCRIPT");
                script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js';
                script.type = 'text/javascript';

                script.onload = function() {
                    var $ = window.jQuery;
                    var ssURL = self.options.url || "https://spreadsheets.google.com/feeds/list/19j4AQmjWuELuzn1GIn0TFRcK42HjdHF_fsIa8jtM1yw/o4rmdye/public/values?alt=json";
                    self._map.spin(true);
                    $.getJSON(ssURL, function(data) {
                        console.log("Data fetched:", data.feed.entry);
                        self.parseData(data.feed.entry);
                        self._map.spin(false);
                    });
                };
                document.getElementsByTagName("head")[0].appendChild(script);
            })();
        }

    },

    //generatePopup
    
    _createOrigInfo: function(info) {
        var origInfo = {};
        for(var key in info) {
            var origKey = this._parsedToOrig[key];
            origInfo[origKey] = info[key];
        }
        return origInfo;
    },

    getMarker: function(data) {
        var info = {};
        for (var i = 0; i < this._columns.length; i++) {
            info[this._columns[i]] = data["gsx$" + this._columns[i]].$t;
        }
        console.log("Info for 1 row:", info);
        console.log(this.options.lon);
        console.log(this.options.lat);
        console.log(info[this._lat]);
        console.log(info[this._lon]);
        var latlon = [parseInt(info[this._lat]), parseInt(info[this._lon])];
        console.log(latlon);
        var generatePopup = this.options.generatePopup || this.generatePopup || function() {return;};
        var origInfo = this._createOrigInfo(info);
        return L.marker(latlon).bindPopup(generatePopup(origInfo));
    },
    
    addMarker: function(data) {
        var urlSections = data.id.$t.split('/');
        var key = urlSections[urlSections.length - 1];
        if(!this._layers[key]) {
            var marker = this.getMarker(data);
            this._layers[key] = marker;
            this.addLayer(marker);
        }
    },

    parseData: function(data) {
        for (var i = 0; i < data.length; i++) {
            this.addMarker(data[i]);
        }
    }
});

L.spreadsheetLayer = function(options) {
    return new L.SpreadsheetLayer(options);
};