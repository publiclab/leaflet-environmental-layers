L.Icon.PfasLayerIcon = L.Icon.extend({
   options: {
    iconUrl: 'https://openclipart.org/image/300px/svg_to_png/117253/1297044906.png',
    iconSize:     [10, 10],
    iconAnchor:   [20 , 0],
    popupAnchor:  [-5, -5]
  }
});

L.icon.pfasLayerIcon = function () {
    return new L.Icon.PfasLayerIcon();
};

L.LayerGroup.PfasLayer = L.LayerGroup.extend(

    {
        options: {
            url: 'https://spreadsheets.google.com/feeds/list/1cjQ3H_DX-0dhVL5kMEesFEKaoJKLfC2wWAhokMnJxV4/1/public/values?alt=json',
        },

        initialize: function (options) {
            options = options || {};
            L.Util.setOptions(this, options);
            this._layers = {};
        },

        onAdd: function (map) {
            this._map = map;
            this.requestData();
        },

        onRemove: function (map) {
            this.clearLayers();
            if(typeof map.spin === 'function'){
              map.spin(false) ;
            }
            this._layers = {};
        },

        requestData: function () {
           var self = this;
                (function() {
                    var script = document.createElement("SCRIPT");
                    script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js';
                    script.type = 'text/javascript';

                    script.onload = function() {
                        var $ = window.jQuery;
                        var PFAS_URL = "https://spreadsheets.google.com/feeds/list/1cjQ3H_DX-0dhVL5kMEesFEKaoJKLfC2wWAhokMnJxV4/1/public/values?alt=json" ;
                        if(typeof self._map.spin === 'function'){
                          self._map.spin(true) ;
                        }
                        $.getJSON(PFAS_URL , function(data){
                        self.parseData(data.feed.entry);
                        if(typeof self._map.spin === 'function'){
                          self._map.spin(false) ;
                        }
            		    });
                    };
                    document.getElementsByTagName("head")[0].appendChild(script);
                })();


        },

        getMarker: function(data) {
            var redDotIcon = new L.icon.pfasLayerIcon();
            //added the column names which are formatted here and called in the generatePopup function
            var props = ["contaminationsite", "natureofsources", "location", "pfoapfos","dateofdiscovery","suspectedcontaminationsource","suspectedsourceurl", "otherpfas", "reggovresponse", "litigationdetails", "latitude", "longitude"];
            var item = {};
            props.forEach(function(element) {
                item[element] = data["gsx$" + element]["$t"];
            });

            item["latitude"] = item["latitude"].replace(/[^\d.-]/g, "");
            item["latitude"] = item["latitude"].replace(/[^\d.-]/g, "");

            var pfasTracker;
            pfasTracker = L.marker([item["latitude"], item["longitude"]], {
                icon: redDotIcon
            }).bindPopup(this.generatePopup(item));

            return pfasTracker;
        },

        generatePopup: function(item) {
            var content = "<strong><center>" + item["contaminationsite"] + "</strong></center><hr /><br />";
            
            var regResponse = item["reggovresponse"];
            var regResponseTruncate = regResponse.split(" ").splice(0,30).join(" ");
            var litigation = item["litigationdetails"];
            var litigationTruncate = 
            litigation.split(" ").splice(0,30).join(" ");
            
            if(item["dateofdiscovery"]) content += "<strong> Date of Discovery:</strong> " + item["dateofdiscovery"] + '</span>' + "<br>";

            if(item["pfoapfos"]) content += "<strong>Contamination type: </strong>" + item["pfoapfos"] + "<br>";
            
            if(item["otherpfas"]) content += "<strong>Other contaminant: </strong>" + item["otherpfas"] + "<br>";
            
            if(item["suspectedcontaminationsource"]) content += "<strong>Suspected source:</strong> " + "<a href=" + item["suspectedsourceurl"] + ">" +     
            item["suspectedcontaminationsource"]+"</a>" + "<br>";
            
            if(item["natureofsources"]) content += "<strong>Nature of Sources:</strong> " + item["natureofsources"] + "<br>";
            
            if(item["reggovresponse"]) content += "<strong>Regulatory Response:</strong> " + "<a href='https://pfasproject.com/pfas-contamination-site-tracker/'> " + regResponseTruncate + " [...]</a><br>";
            
            if(item["litigationdetails"] == "No data") 
            {
                content += "<strong>Litigation:</strong> " + litigationTruncate + "<br><hr>";
            } else if (item["litigationdetails"] == "No Data"){
                content += "<strong>Litigation:</strong> " + litigationTruncate + "<br><hr>";
            } else{
                content += "<strong>Litigation:</strong> " + litigationTruncate + " <a href='https://pfasproject.com/pfas-contamination-site-tracker/'>[...]</a><br><hr>";
            }

            
            var generics = ["location"];

            for (var i = 0; i < generics.length; i++) {
                var key = generics[i];
                if (!!item[generics[i]]) {
                    var itemContent = item[generics[i]];
                    key = key.charAt(0).toUpperCase() + key.slice(1);
                    content += key + ": " + itemContent + "<br>";
                }
               
            }
            
            content += "<hr><i>Data provided by <a href='https://pfasproject.com/pfas-contamination-site-tracker/'>Source: Northeastern University - Social Science Environmental Health Research Institute</a></i>";
            return content;
        },

        addMarker: function (data) {
            //changed this to the value from my dataset
            //var key = data.gsx$name.$t; 
            var key = data.gsx$contaminationsite.$t;
            if (!this._layers[key]) {
                var marker = this.getMarker(data);
                this._layers[key] = marker;
                this.addLayer(marker);
            }
        },

        parseData: function (data) {
            for (i = 1 ; i < data.length ; i++) {
             this.addMarker(data[i]) ;
            }
        }
    }
);


L.layerGroup.pfasLayer = function (options) {
    return new L.LayerGroup.PfasLayer(options) ;
};



//googlesheet util layer, not working, errorUncaught Error: Invalid LatLng object: (NaN, NaN)

/*
L.LayerGroup.PfasLayer = L.LayerGroup.extend({
    
    options: {              
        url:'https://docs.google.com/spreadsheets/d/1P9bkJDLNH5mANJiXtXvNfmKOl6f36uiPahgxjpJKMkY/edit?usp=sharing', // String url of data sheet
        lat: 'latitude', // name of latitude column
        lon: 'longitude', // name of longitude column
        //columns: ["contaminationsite", "natureofsources", "location", "pfoapfos","dateofdiscovery"],// Array of column names to be used
        
        //generatePopup: function used to create content of popups
        generatePopup: function() {
        // function used to create content of popups
             var content = "<strong>" + 'help me' + "</strong> ";
            //if(!!item["dateofdiscovery"]) content += "Date of Discovery: " + `<span style="color:#CC0000;">` + item["dateofdiscovery"] + '</span>' + "<br>";
            //if(item["website"]) content += "(<a href=" + item["website"] + ">website</a>" + ")";
            content += "<hr>";
            //if(!!item["Descrition"]) content += "Description: <i>" + item["summary"] + "</i><br>";
            //if(!!item["contact"]) content += "<strong>Contact: " + item["contact"] + "<br></strong>";
            //////////////

   
                        
            //content += "<hr>Data last updated " + item["updated"] + "<br>";
            //content += "<i>Data provided by <a href='http://fractracker.org/'>http://fractracker.org/</a></i>";
            return content;
        },
        
        //Optional:
        //imageOptions: defaults to blank
        //sheet index: defaults to 0 (first sheet)
    },

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
    
    _cleanColumnName: function(columnName) { 
        //Tries to emulate google's conversion of column titles
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

L.layerGroup.pfasLayer = function(options) {
    return new L.LayerGroup.PfasLayer(options);
};
*/