L.Icon.FracTrackerIcon = L.Icon.extend({
   options: {
    iconUrl: 'https://www.clker.com/cliparts/2/3/f/a/11970909781608045989gramzon_Barrel.svg.med.png',
    iconSize:     [30, 20],
    iconAnchor:   [20 , 0],
    popupAnchor:  [-5, -5]
  }
});

L.icon.fracTrackerIcon = function () {
    return new L.Icon.FracTrackerIcon();
};


L.LayerGroup.FracTrackerLayer = L.LayerGroup.extend(

    {
        options: {
            url: 'https://spreadsheets.google.com/feeds/list/19j4AQmjWuELuzn1GIn0TFRcK42HjdHF_fsIa8jtM1yw/o4rmdye/public/values?alt=json',
        },

        initialize: function (options) {
            options = options || {};
            L.Util.setOptions(this, options);
            this._layers = {};
        },

        onAdd: function (map) {
           // map.on('moveend', this.requestData, this);
            this._map = map;
            this.requestData();
        },

        onRemove: function (map) {
           // map.off('moveend', this.requestData, this);
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
                        var FracTracker_URL = "https://spreadsheets.google.com/feeds/list/19j4AQmjWuELuzn1GIn0TFRcK42HjdHF_fsIa8jtM1yw/o4rmdye/public/values?alt=json" ;
                        if(typeof self._map.spin === 'function'){
                          self._map.spin(true) ;
                        }
                        $.getJSON(FracTracker_URL , function(data){
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
            var redDotIcon = new L.icon.fracTrackerIcon();
            var props = ["timestamp", "name", "summary", "website", "contact", "email", "phone", "streetaddress", "city", "state", "zipcode", "latitude", "longitude", "category"];
            var item = {};
            props.forEach(function(element) {
                item[element] = data["gsx$" + element]["$t"];
            });

            item["updated"] = data.updated.$t;
            item["use"] = (data.gsx$useformap.$t.replace(/\s+/g, '').toLowerCase() === "use");
            item["latitude"] = item["latitude"].replace(/[^\d.-]/g, "");
            item["latitude"] = item["latitude"].replace(/[^\d.-]/g, "");

            var fracTracker;
            fracTracker = L.marker([item["latitude"], item["longitude"]], {
                icon: redDotIcon
            }).bindPopup(this.generatePopup(item));

            return fracTracker;
        },

        generatePopup: function(item) {
            var content = "<strong>" + item["name"] + "</strong> ";
            if(item["website"]) content += "(<a href=" + item["website"] + ">website</a>" + ")";
            content += "<hr>";
            if(!!item["Descrition"]) content += "Description: <i>" + item["summary"] + "</i><br>";
            if(!!item["contact"]) content += "<strong>Contact: " + item["contact"] + "<br></strong>";
            var generics = ["phone", "email", "street", "city", "state", "zipcode", "timestamp", "latitude", "longitude"];

            for (var i = 0; i < generics.length; i++) {
                var key = generics[i];
                if (!!item[generics[i]]) {
                    itemContent = item[generics[i]];
                    key = key.charAt(0).toUpperCase() + key.slice(1);
                    content += key + ": " + itemContent + "<br>";
                }
            }

            content += "<hr>Data last updated " + item["updated"] + "<br>";
            content += "<i>Data provided by <a href='http://fractracker.org/'>http://fractracker.org/</a></i>";
            return content;
        },

        addMarker: function (data) {
            var key = data.gsx$name.$t;
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


L.layerGroup.fracTrackerLayer = function (options) {
    return new L.LayerGroup.FracTrackerLayer(options) ;
};
