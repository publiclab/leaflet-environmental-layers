L.LayerGroup.AQICNLayer = L.LayerGroup.extend(

    {
        options: {
            popupOnMouseover: true,
            clearOutsideBounds: true,
            tokenID: "566331c289f0aeacd78e0b18362b4bcfa5097572"
        },

        initialize: function (options) {
            options = options || {};
            L.Util.setOptions(this, options);
            this._layers = {};
        },

        onAdd: function (map) {
            map.on('moveend', this.requestRegionData, this);
            this._map = map;
            this.requestRegionData();
        },

        onRemove: function (map) {
            map.off('moveend', this.requestRegionData, this);
            this.clearLayers();
            this._layers = {};
        },

        requestRegionData: function () {
                var self = this ;

                (function() {
                    var script = document.createElement("SCRIPT");
                    script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js';
                    script.type = 'text/javascript';

                    var zoom = self._map.getZoom(), northeast = self._map.getBounds().getNorthEast() , southwest = self._map.getBounds().getSouthWest() ;

                    script.onload = function() {
                        var $ = window.jQuery;
                        var AQI_url = "https://api.waqi.info/map/bounds/?latlng=" + southwest.lat + "," + southwest.lng + "," + northeast.lat + "," + northeast.lng + "&token=" + self.options.tokenID;

                        if(typeof self._map.spin === 'function'){
                         self._map.spin(true) ;
                        }
                         $.getJSON(AQI_url , function(regionalData){

                             self.parseData(regionalData) ;
                             if(typeof self._map.spin === 'function'){
                               self._map.spin(false) ;
                             }
                         });
                    };
                    document.getElementsByTagName("head")[0].appendChild(script);
                })();
        },

        getMarker: function(data) {
            var aqi = data.aqi;
            var lat = data.lat;
            var lon = data.lon;
            var uid = data.uid;
            var clName = "aqiSign ";
            var aqiN;

            if (isNaN(aqi))  { //If it is not a number
                clName += "aqiNull";
            }
            else { //Parsing AQI to see what color to use
                aqiN = parseInt(aqi, 10);
                if (aqiN <= 50) {
                    clName += "aqiGood";
                }
                else if (aqiN <= 100) {
                    clName += "aqiMod";
                }
                else if (aqiN <= 150) {
                    clName += "aqiSens";
                }
                else if (aqiN <= 200) {
                    clName += "aqiUnhealth";
                }
                else if (aqiN <= 300) {
                    clName += "aqiVUnhealth";
                }
                else {
                    clName += "aqiHazard";
                }
            }

            return L.marker([lat, lon], {icon: L.divIcon({className: clName, iconSize: [36,25], iconAnchor: [18, 40], popupAnchor: [0, -25], html: aqi})});

        },

        addMarker: function(data) {
            var self = this;
            var marker = this.getMarker(data);
            var key = data.uid;
            //Code provided by widget API
            (function(w,d,t,f){  w[f]=w[f]||function(c,k,n){s=w[f],k=s['k']=(s['k']||(k?('&k='+k):''));s['c']=
            c=(c  instanceof  Array)?c:[c];s['n']=n=n||0;Apa=d.createElement(t),e=d.getElementsByTagName(t)[0];
            Apa.async=1;Apa.src='http://feed.aqicn.org/feed/'+(c[n].city)+'/'+(c[n].lang||'')+'/feed.v1.js?n='+n+k;
            e.parentNode.insertBefore(Apa,e);  };  })(  window,document,'script','_aqiFeed'  );

            marker.bindPopup( function() { //Fetch popup content only when clicked; else the quota will be reached
                var el = document.createElement('div');
                el.classList.add("city-container");
                el.id = "city-aqi-container";

                var stationURL = "https://api.waqi.info/feed/@" + data.uid + "/?token=" + self.options.tokenID

                $.getJSON(stationURL, function(stationData) {
                    var labels = {
			             pm25: "PM<sub>2.5</sub>",
			             pm10: "PM<sub>10</sub>",
			             o3: "Ozone",
			             no2: "Nitrogen Dioxide",
			             so2: "Sulphur Dioxide",
			             co: "Carbon Monoxide",
			             t: "Temperature",
			             w: "Wind",
			             r: "Rain (precipitation)",
			             h: "Relative Humidity",
			             d: "Dew",
			             p: "Atmostpheric Pressure"
		            }

                    var strContent = "";
                    var name = "<h2>" + stationData.data.city.name + "</h2><br> "; //Set the default content first

                    for(var species in stationData.data.iaqi) {
                        strContent += "<strong>" + labels[species] + "</strong>: " + stationData.data.iaqi[species].v + ";<br>";
                    }
                    strContent += "See <a href=" + stationData.data.city.url + ">AQICN - " + stationData.data.city.name + "</a> for more info. Data provided by aqicn.org.<br>From the <a href=https://github.com/publiclab/leaflet-environmental-layers/pull/79>AQICN Inventory</a> (<a href = https://publiclab.org/notes/sagarpreet/06-06-2018/leaflet-environmental-layer-library?_=1528283515>info</a>)";
                    el.innerHTML = name + strContent;

                    var res = stationData.data.city.url.split("/");

                    //Parse url to see what the city is called by the API; the majority of cities cannot be found.
                    var cityName = res[res.length - 1];
                    if(cityName.length <= 1) cityName = res[res.length - 2];
                    //if city can be found, display is reset to include details
                    _aqiFeed({ display: name + "%details <br>" + strContent, container:"city-aqi-container",  city: cityName  });
                });
                return el;
            });


            if (!this._layers[key]) {
                this._layers[key] = marker;
                this.addLayer(marker);
            }

        },

        parseData: function(regionalData) {
            if(!!regionalData) {

                for(var i = 0; i < regionalData.data.length; i++) {

                    //this.requestStationData(regionalData.data[i].uid);
                    this.addMarker(regionalData.data[i]);
                }

                if(this.options.clearOutsideBounds) {
                    this.clearOutsideBounds();
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

L.layerGroup.aqicnLayer = function(options) {
    return new L.LayerGroup.AQICNLayer(options);
}
