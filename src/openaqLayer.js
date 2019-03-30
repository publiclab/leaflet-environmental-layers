L.Icon.OpenAqIcon = L.Icon.extend({
            options: {
                iconUrl: 'https://i.stack.imgur.com/6cDGi.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [12, 21],
                iconAnchor: [6, 21],
                popupAnchor: [1, -34],
                shadowSize: [20, 20]
            }
    });

    L.icon.openaqIcon = function () {
            return new L.Icon.OpenAqIcon();
    };
    L.LayerGroup.OpenAqLayer = L.LayerGroup.extend(
    
            {
                    options: {
                            popupOnMouseover: true,
                            clearOutsideBounds: true
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
                        var $ = window.jQuery;
                        var url = "https://api.openaq.org/v1/latest?limit=5000";

                        if(typeof self._map.spin === 'function'){
                        self._map.spin(true) ;
                        }
                        $.getJSON(url , function(regionalData){

                                self.parseData(regionalData.results) ;
                                if(typeof self._map.spin === 'function'){
                                        self._map.spin(false) ;
                                }
                        });
                        })();
                    },
    
                    getMarker: function(data) {
                            var redDotIcon = new L.icon.openaqIcon()
                            var distance = data.distance;
                            var lat = data.coordinates.latitude;
                            var lon = data.coordinates.longitude;
                        var  contentData = "";
                        var labels = {
                                pm25: "PM<sub>2.5</sub>",
                                pm10: "PM<sub>10</sub>",
                                o3: "Ozone",
                                no2: "Nitrogen Dioxide",
                                so2: "Sulphur Dioxide",
                                co: "Carbon Monoxide",
                        }
                        for(var i = 0; i < data.measurements.length; i++) {
                            contentData+="<strong>"+labels[data.measurements[i].parameter]+" : </strong>"+data.measurements[i].value+" "+data.measurements[i].unit+"<br>"
                        }
                            return L.marker([lat, lon], {icon: redDotIcon}).bindPopup(
                                "<h3>"+data.location+", "+data.country+"</h3><br>"+
                                "<strong>distance: "+"</strong>"+data.distance+"<br>"+contentData
                            );
    
                    },
    
                    addMarker: function(data,i) {
                            var self = this;
                            var marker = this.getMarker(data);
                            var key = i;    
                            if (!this._layers[key]) {
                                    this._layers[key] = marker;
                                    this.addLayer(marker);
                            }
    
                    },
    
                    parseData: function(regionalData) {
                            if(!!regionalData) {
                                    for(var i = 0; i < regionalData.length; i++) {

                                            if(!!regionalData[i].coordinates){
                                                this.addMarker(regionalData[i],i);
                                            }
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
    
    L.layerGroup.openaqLayer = function(options) {
            return new L.LayerGroup.OpenAqLayer(options);
    }
    