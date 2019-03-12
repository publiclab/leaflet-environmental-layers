/*
require('./mapboxplugin.js');

L.LayerGroup.PfasLayer = L.LayerGroup.extend({
    
    mapboxgl.accessToken = 'pk.eyJ1IjoiZXdnIiwiYSI6IlYxUUpUTlUifQ.87Ean7pyT-H6eapPSES_pA';
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/ewg/civo2n8hp001p2jox186cka3d',
        center: [-99.6334, 40.9247],
        zoom: 4,
        maxZoom: 10
    });

      var colorList5 = [
    [0, '#e5f5e0'],
    [250, '#a1d99b'],
    [500, '#31a354']
  ]
    var colorList = [
    [0, '#cccccc'],
    [1, '#E6CDAF'],
    [10000, '#C39B6E'],
    [50000, '#A47847'],
    [75000, '#80592E'],
    [100000, '#583A1B'],
    [250000, '#332600']
  ]

    map.addControl(new MapboxGeocoder({
        accessToken: mapboxgl.accessToken
    }));

    map.on('load', function() {

        map.addSource('state', {
            type: 'geojson',
            data: 'StateSimp_2.geojson'
        });
                 map.addLayer({
          'id': 'state-layer',
          'type': 'line',
          'maxzoom': 8,
          'source': 'state',
                  'paint': {
                'line-color': '#6D6D6D',
                'line-width': 1.5
            }
    });
   

    map.addSource('EPA Tap Water Detections', {
        type: 'geojson',
        data: 'UCMR_systems_1_2_2019.geojson'
    });
    map.addLayer({
        'id': 'EPA Tap Water Detections',
        'type': 'circle',
        'source': 'EPA Tap Water Detections',
        'layout': {
            'visibility': 'visible'
},
    'paint': {
                'circle-opacity': .65,
                'circle-blur': 0.25,
                'circle-color': '#06D4F9',
                 'circle-radius': {
                    property: 'Pop',
                        stops: [
                            [0, 3],
                            [30000, 6],
                            [60000, 14]
                        ]
                 },
            }
    });
    map.addSource('Contamination Sites', {
        type: 'geojson',
        data: 'PFAS_7_19_2018.geojson'
   });
    map.addLayer({
        'id': 'Contamination Sites',
        'type': 'circle',
        'source': 'Contamination Sites',
        'layout': {
            'visibility': 'visible'
},
     'paint': {
                'circle-radius': {
                'base':4,
                'stops': [[8, 5], [9, 6], [10, 7], [11, 8], [12, 9]]
              },
                'circle-color': '#CC0000'
            }

    });
    // Add zoom and rotation controls to the map.
    map.addControl(new mapboxgl.NavigationControl(),'bottom-left');
    var toggleableLayerIds = [ 'Contamination Sites' ];

    for (var i = 0; i < toggleableLayerIds.length; i++) {
        var id = toggleableLayerIds[i];

        var link = document.createElement('b');
        link.href = '#';
        link.className = 'active';
        link.textContent = id;

        link.onclick = function (e) {
            var clickedLayer = this.textContent;
            e.preventDefault();
            e.stopPropagation();

            var visibility = map.getLayoutProperty(clickedLayer, 'visibility');

            if (visibility === 'visible') {
                map.setLayoutProperty(clickedLayer, 'visibility', 'none');
                this.className = '';
            } else {
                this.className = 'active';
                map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
            }
        };

    var layers = document.getElementById('menu');
    layers.appendChild(link);
}
var toggleableLayerIds = [ 'EPA Tap Water Detections' ];

        for (var i = 0; i < toggleableLayerIds.length; i++) {
            var id = toggleableLayerIds[i];

            var link = document.createElement('a');
            link.href = '#';
            link.className = 'active';
            link.textContent = id;

            link.onclick = function (e) {
                var clickedLayer = this.textContent;
                e.preventDefault();
                e.stopPropagation();

                var visibility = map.getLayoutProperty(clickedLayer, 'visibility');

                if (visibility === 'visible') {
                    map.setLayoutProperty(clickedLayer, 'visibility', 'none');
                    this.className = '';
                } else {
                    this.className = 'active';
                    map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
                }
            };

            var layers = document.getElementById('menu');
            layers.appendChild(link);
        }  

    // When a click event occurs near a place, open a popup at the location of
    // the feature, with description HTML from its properties.
    map.on('click', function(e) {
      var features = map.queryRenderedFeatures(e.point, { layers: ['Contamination Sites']});
      if (!features.length) {
        return;
      }

      var feature = features[0];

      // Populate the popup and set its coordinates
      // based on the feature found.
      var popup = new mapboxgl.Popup()
        .setLngLat(map.unproject(e.point))

        .setHTML('<div id="popup" class="popup" style="width: 400px;word-wrap: break-word;z-index: 10;text-align:left;"> <h5 style="text-align:center;color:#CC0000;font-family:Franklin Gothic;font-weight: bold; font-size: 11pt;">Contamination Site</h5>' +
        '<ul class="list-group">' +
        '<li class="list-group-item"> Contamination site: <span style="color:#CC0000;">' + feature.properties['Location'] + "</li></span>" +
        '<li class="list-group-item"> Date of Discovery: <span style="color:#CC0000;">' + feature.properties['Date'] + "</li></span>" +
        '<li class="list-group-item"> Contamination type: <span style="color:#CC0000;">' + feature.properties['PFOA_PFOS'] + "</li></span>" +
        '<li class="list-group-item"> Other contaminant: <span style="color:#CC0000;">' + feature.properties['Other_PFAS'] + "</li></span>" +
        '<li class="list-group-item"> Suspected source: <a href=' + feature.properties['Suspected_'] +' target="_blank">' + feature.properties['Suspected'] + "</a></li>" +
        '<li class="list-group-item"> Regulatory response: <span style="color:#CC0000;">' + feature.properties['Reg'] + "</li></span>" +
        '<li class="list-group-item"> Litigation: <span style="color:#CC0000;">' + feature.properties['Litigati_1'] + "</li></span>" +
        '<li class="list-group-item"><a href=' + feature.properties['URL_1'] +' target="_blank">' + feature.properties['Notes'] + "</a></li>" +
        '<li class="list-group-item"> <span style="color:black; font-size: 7pt;">Source: Northeastern University - Social Science Environmental Health Research Institute</a></span></div>')
        .addTo(map);
    });
    map.on('click', function(e) {
      var features = map.queryRenderedFeatures(e.point, { layers: ['EPA Tap Water Detections']});
      if (!features.length) {
        return;
      }

      var feature = features[0];

      // Populate the popup and set its coordinates
      // based on the feature found.
      var popup = new mapboxgl.Popup()
        .setLngLat(map.unproject(e.point))

        .setHTML('<div id="popup" class="popup" style="width: 400px;word-wrap: break-word;z-index: 10;text-align:left;"> <h5 style="text-align:center;color:#06D4F9;font-family:Franklin Gothic;font-weight: bold; font-size: 11pt;">Public Water Supply Testing 2013-2016</h5>' +
          '<ul class="list-group">' +
          '<li class="list-group-item"> System name: <span style="color:#06D4F9;">' + feature.properties['PWSName'] + "</li></span>" +
          '<li class="list-group-item"> PWSID: <span style="color:#06D4F9;">' + feature.properties['PWSID'] + "</li></span>" +
          '<li class="list-group-item"> Population served: <span style="color:#06D4F9;">' + feature.properties['popT'] + "</li></span>" +
          '<li class="list-group-item"> City served: <span style="color:#06D4F9;">' + feature.properties['City'] + "</li></span>" +
          '<li class="list-group-item"> County served: <span style="color:#06D4F9;">' + feature.properties['NAME'] + "</li></span>" +
          '<li class="list-group-item"> State served: <span style="color:#06D4F9;">' + feature.properties['Source'] + "</li></span>" +
          '<li class="list-group-item"> PFOA/PFOS contaminant(s): <span style="color:#06D4F9;">' + feature.properties['PFOApfos'] + "</li></span>" +
          '<li class="list-group-item"> PFOA/PFOS detection: <span style="color:#06D4F9;">' + feature.properties['PFOA_text'] + " " + feature.properties['PFOS_text'] + "</li></span>" +
          '<li class="list-group-item"> Other contaminant(s): <span style="color:#06D4F9;">' + feature.properties['Other'] + "</li></span>" +
          '<li class="list-group-item"> Other detections: <span style="color:#06D4F9;">' + feature.properties['PFHpA_text'] + " " + feature.properties['PFHxS_text'] + " " + feature.properties['PFNA_text'] + " " + feature.properties['PFBS_text'] + "</li></span>" +
          '<li class="list-group-item"> <span style="color:black; font-size: 7pt;">Source: EWG from (USEPA) Third Unregulated Contaminant Monitoring Rule</a></span></div>')
        .addTo(map);
    });
    // Use the same approach as above to indicate that the symbols are clickable
    // by changing the cursor style to 'pointer'.
    map.on('mousemove', function(e) {
      var features = map.queryRenderedFeatures(e.point, {layers: ['Contamination Sites','EPA Tap Water Detections'] });
      map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
    });

  });
  
};

L.layerGroup.pfasLayer = function(options) {
    return new L.LayerGroup.PfasLayer(options);
};

//*/

///*
L.LayerGroup.PfasLayer = L.LayerGroup.extend({
    
    options: {
        url: 'https://docs.google.com/spreadsheets/d/1P9bkJDLNH5mANJiXtXvNfmKOl6f36uiPahgxjpJKMkY/edit?usp=sharing', // String url of data sheet
        lat: 'Lat', // name of latitude column
        lon: 'Lng', // name of longitude column
        columns: ['Contamination Site', 'PFOA_PFOS'],// Array of column names to be used
        //generatePopup: function used to create content of popups
        generatePopup: function() {
        // function used to create content of popups
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

L.layerGroup.pfasLayer = function(options) {
    return new L.LayerGroup.PfasLayer(options);
};
//*/