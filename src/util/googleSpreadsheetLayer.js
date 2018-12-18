L.SpreadsheetLayer = L.LayerGroup.extend({
    //options: {
        //Must be supplied:
        //url: String url of data sheet
        //columns: Array of column names to be used
        //lat, lon column names
        //generatePopup: function used to create content of popups
        
        //Optional:
        //imageOptions: defaults to blank
        //sheet index: defaults to 0 (first sheet)
    //},

    initialize: function(options) {
        options = options || {};
        L.Util.setOptions(this, options);
        this._layers = {};
        this._columns = this.options.columns || [];
        this.options.imageOptions = this.options.imageOptions || {};
        this.options.sheetNum = this.options.sheetNum || 0;
        this._parsedToOrig = {};
        this._lat = this._cleanColumnName(this.options.lat);
        this._lon = this._cleanColumnName(this.options.lon);
        this._columns = this._cleanColumns(this._columns);
    },
    
    _cleanColumns: function(columns) {
        for(var i = 0; i < columns.length; i++) { //the names of the columns are processed before given in JSON, so we must parse these column names too
            var parsedColumnName = this._cleanColumnName(columns[i]);
            this._parsedToOrig[parsedColumnName] = columns[i]; //Here we create an object with the parsed names as keys and original names as values;
            columns[i] = parsedColumnName;
        }
        if(L.Util.indexOf(columns, this._lat) <= -1) { //parse lat and lon names the same way, then add them to columns if not there
            columns.push(this._lat);
            this._parsedToOrig[this._lat] = this.options.lat;
        }
        if(L.Util.indexOf(columns, this._lon) <= -1) {
            columns.push(this._lon);
            this._parsedToOrig[this._lon] = this.options.lon;
        }
        return columns;
    },
    
    _cleanColumnName: function(columnName) { //Tries to emulate google's conversion of column titles
        return columnName.replace(/^[^a-zA-Z]+/g, '') //remove any non letters from the front till first letter
                         .replace(/\s+|[!@#$%^&*()]+/g, '') //remove most symbols
                         .toLowerCase();
    },
    
    onAdd: function(map) {
        this._map = map;
        var self = this;
        this._getURL().then(function() { //Wait for getURL to finish before requesting data. This way we can do it just once
            self.requestData();
        });
    },

    onRemove: function(map) {
        this.clearLayers();
        map.spin(false);
        this._layers = {};
    },

    _getURL: function() {
        var spreadsheetID = this._getSpreadsheetID(); //To find the URL we need, we first need to find the spreadsheetID
        var self = this;
        //Then we have to make another request in order to find the worksheet ID, which is changed by the sheet within the spreadsheet we want
        var spreadsheetFeedURL = 'https://spreadsheets.google.com/feeds/worksheets/' + spreadsheetID + '/public/basic?alt=json';
        //Here we return the getjson request so that the previous code may know when it has completed
        return this._getWorksheetID(spreadsheetID, spreadsheetFeedURL);
    },
    
    _getSpreadsheetID: function() {
        var sections = this.options.url.split('/'); //The spreadsheet ID generally comes after a section with only 1 character, usually a D.
        var spreadsheetID;
        var len = sections.length;
        for (var i = 1; i < len; i++) {
            if (sections[i - 1].length === 1) { //Here we check to see if the previous one was 1 character
                spreadsheetID = sections[i];
                break;
            }
        }
        return spreadsheetID;
    },
    
    _getWorksheetID: function(spreadsheetID, spreadsheetFeedURL) {
        var self = this;
        return $.getJSON(spreadsheetFeedURL, function(data) {
            //The worksheetID we want is dependent on which sheet we are looking for
            var tmpLink = data.feed.entry[self.options.sheetNum].id.$t;
            var sections = tmpLink.split('/');
            //It is always the last section of the URL
            var sheetID = sections[sections.length - 1];
            //Set the URL to the final one.
            self.options.url = 'https://spreadsheets.google.com/feeds/list/' + spreadsheetID + '/' + sheetID + '/public/values?alt=json';
        });
    },

    requestData: function() {
        var self = this;
        (function() {
            var script = document.createElement("SCRIPT");
            script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js';
            script.type = 'text/javascript';
            script.onload = function() {
                var $ = window.jQuery;
                var ssURL = self.options.url || '';
                self._map.spin(true);
                //start fetching data from the URL
                $.getJSON(ssURL, function(data) {
                    self.parseData(data.feed.entry);
                    self._map.spin(false);
                });
            };
            document.getElementsByTagName("head")[0].appendChild(script);
        })();
        
    },
    
    parseData: function(data) {
        for (var i = 0; i < data.length; i++) {
            this.addMarker(data[i]);
        }
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
    
    getMarker: function(data) {
        var info = {};
        for (var i = 0; i < this._columns.length; i++) {
            info[this._columns[i]] = data['gsx$' + this._columns[i]].$t || ''; //The JSON has gsx$ appended to the front of each columnname
        }
        //Get coordinates the coordinates; remember that _lat and _lon are the column names, not the actual values
        var latlon = [parseInt(info[this._lat]), parseInt(info[this._lon])];
        var generatePopup = this.options.generatePopup || function() {return;};
        //Generate an object using the original column names as keys
        var origInfo = this._createOrigInfo(info);
        return L.marker(latlon, this.options.imageOptions).bindPopup(generatePopup(origInfo));
    },
    
    _createOrigInfo: function(info) {
        //The user will most likely give their generatePopup in terms of the column names typed in,
        //not the parsed names. So this creates a new object that uses the original typed column
        //names as the keys
        var origInfo = {};
        for(var key in info) {
            var origKey = this._parsedToOrig[key];
            origInfo[origKey] = info[key];
        }
        return origInfo;
    }
    
});

L.spreadsheetLayer = function(options) {
    return new L.SpreadsheetLayer(options);
};