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

L.Icon.SkyTruthIcon = L.Icon.extend({
  options: {
    iconUrl: 'https://www.clker.com/cliparts/T/G/b/7/r/A/red-dot.svg',
    iconSize:     [30, 20],
    iconAnchor:   [20 , 0],
    popupAnchor:  [-5, -5]
  }
});

L.icon.skyTruthIcon = function () {
  return new L.Icon.SkyTruthIcon();
};

L.Icon.OdorReportIcon = L.Icon.extend({
    options: {
      iconUrl: 'https://www.clker.com/cliparts/T/3/6/T/S/8/ink-splash-md.png',
      iconSize:     [30, 20],
      iconAnchor:   [20 , 0],
      popupAnchor:  [-5, -5]
    }
});

L.icon.odorReportIcon = function () {
    return new L.Icon.OdorReportIcon();
};


L.LayerGroup.LayerCode = L.LayerGroup.extend(

    {
        options: {
            popupOnMouseover: false,
            clearOutsideBounds: false,
            target: '_self',
        },

        initialize: function (name,options) {
            this.layer = name;
            options = options || {};
            L.Util.setOptions(this, options);
            this._layers = {};
        },

        onAdd: function (map) {
            map.on('moveend', this.requestData, this);
            this._map = map;
            this.requestData();
        },

        onRemove: function (map) {
            map.off('moveend', this.requestData, this);
            if(typeof map.spin === 'function'){
              map.spin(false) ;
            }
            this.clearLayers();
            this._layers = {};
        },

        requestData: function () {
           var self = this;
                (function() {
                    var zoom;
                    var Layer_URL;
                    var $ = window.jQuery;

                    if (self.layer == "fractracker"){
                        Layer_URL = "https://spreadsheets.google.com/feeds/list/19j4AQmjWuELuzn1GIn0TFRcK42HjdHF_fsIa8jtM1yw/o4rmdye/public/values?alt=json" ;
                    }
                    if(self.layer == "skytruth"){
                        zoom = self._map.getZoom(), northeast = self._map.getBounds().getNorthEast() , southwest = self._map.getBounds().getSouthWest() ;
                        Layer_URL = "https://alerts1.skytruth.org/json?n=100&l="+(southwest.lat)+","+(southwest.lng)+","+(northeast.lat)+","+(northeast.lng) ;
                    }
                    if(self.layer == "odorreport"){
                        zoom = self._map.getZoom(), origin = self._map.getCenter() ;
                        Layer_URL = "https://odorlog.api.ushahidi.io/api/v3/posts/" ;
                    }

                    if(typeof self._map.spin === 'function'){
                        self._map.spin(true) ;
                    }
                    $.getJSON(Layer_URL , function(data){
                    if(self.layer == "fractracker")
                        self.parseData(data.feed.entry);
                    else
                        self.parseData(data) ;
                    if(typeof self._map.spin === 'function'){
                        self._map.spin(false) ;
                    }
                    });
                })();


        },

        getMarker: function(data) {
            if(this.layer == "fractracker"){
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
           }

           if(this.layer == "skytruth"){
                var redDotIcon =new L.icon.skyTruthIcon();
                var lat = data.lat ;
                var lng = data.lng;
                var title = data.title ;
                var url = data.link ;
                var skymarker ;
                if (!isNaN(lat) && !isNaN(lng) ){
                  skymarker = L.marker([lat , lng] , {icon: redDotIcon}).bindPopup("<a href="+url+">" +title + "</a><br>" + "<br><strong> lat: " + lat + "</strong><br><strong> lon: " + lng + "</strong> <br><br>Data provided by <a href='http://alerts.skytruth.org/'>alerts.skytruth.org/</a>") ;
                }
                return skymarker;
           }

           if(this.layer == "odorreport"){
                var redDotIcon =new L.icon.odorReportIcon() ;
                var lat = data.values["bcc29002-c4d3-4c2c-92c7-1c9032c3b0fd"][0].lat ;
                var lng = data.values["bcc29002-c4d3-4c2c-92c7-1c9032c3b0fd"][0].lon ;
                var title = data.title ;
                var url = data.url ;
                var odormarker ;
                if (!isNaN(lat) && !isNaN(lng) ){
                  odormarker = L.marker([lat , lng] , {icon: redDotIcon}).bindPopup(title + "<br><a href="+url+">" + url +"</a>" + "<br><strong> lat: " + lat + "</strong><br><strong> lon: " + lng + "</strong><br><br>Data provided by <a href='https://odorlog.ushahidi.io'>https://odorlog.ushahidi.io</a>") ;
                }
                return odormarker;
           }
        },

        generatePopup: function(item) {
            if(this.layer == "fractracker"){
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
            }
        },

        addMarker: function (data) {
            if(this.layer == "fractracker"){
            var key = data.gsx$name.$t;
            if (!this._layers[key]) {
                var marker = this.getMarker(data);
                this._layers[key] = marker;
                this.addLayer(marker);
            }
            }

            else{
            var marker = this.getMarker(data),
            key = data.id;
            if (!this._layers[key]) {
                this._layers[key] = marker;
                this.addLayer(marker);
            }
            }
        },

        parseData: function (data) {
            if(this.layer == "fractracker"){
                for (i = 1 ; i < data.length ; i++) {
                 this.addMarker(data[i]) ;
                }
            }
            if(this.layer == "skytruth"){
                if (!!data.feed){
                for (i = 0 ; i < data.feed.length ; i++) {
                this.addMarker(data.feed[i]) ;
                }
                if (this.options.clearOutsideBounds) {
                this.clearOutsideBounds();
                }
                }
            }
            if(this.layer == "odorreport"){
                if (data.total_count != 0 ){
                for (i = 0 ; i < data.total_count ; i++) {
                this.addMarker(data.results[i]) ;
                }

                if (this.options.clearOutsideBounds) {
                this.clearOutsideBounds();
                }
                }
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
  }
);


L.layerGroup.layerCode = function (name,options) {
    return new L.LayerGroup.LayerCode(name,options) ;
};
