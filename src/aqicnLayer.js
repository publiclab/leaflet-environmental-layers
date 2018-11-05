L.LayerGroup.AQICNLayer = L.LayerGroup.extend(
    
    {
        options: {
            popupOnMouseover: true,
            clearOutsideBounds: false,
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
                        console.log(AQI_url);
                        
                         $.getJSON(AQI_url , function(regionalData){
                             // console.log(parseInt(origin.lat) +" and "+parseInt(origin.lng)) ;
                             console.log(regionalData);
                             self.parseData(regionalData) ;    
                         });
                    };
                    document.getElementsByTagName("head")[0].appendChild(script);
                })();             
        }, 
        
        requestStationData: function(stationID) {

            
            console.log("Trying to request data here");

            if(!this._layers[stationID]) { //catch here to prevent extra parsing
                var self = this;
                var $ = window.jQuery;
                
                var AQI_station_url = "https://api.waqi.info/feed/@" + stationID + "/?token=" + this.options.tokenID;
                console.log(AQI_station_url);
                $.getJSON(AQI_station_url, function(data) {
                    console.log("Fetched Station Data:");
                    console.log(data);
                    self.addMarker(data);
                }); 
            }
        },
        
        addMarker: function(stationData) {            
            var aqi = stationData.data.aqi;
            var latlng = stationData.data.city.geo;
            var name = stationData.data.city.name;
            var url = stationData.data.url;
            var key = stationData.data.idx;
            var AQI_marker = L.marker(latlng).bindPopup(name);
            this._layers[key] = AQI_marker;
            this.addLayer(AQI_marker);
            
        },
        
        parseData: function(regionalData) {
            if(!!regionalData) {
                console.log("made line 90");
                for(var i = 0; i < regionalData.data.length; i++) {
                    //console.log(regionalData.data[i]);
                    this.requestStationData(regionalData.data[i].uid);
                }
                
                if(this.options.clearOutsideBounds) {
                    this.clearOutsideBounds();
                }
            }
            
        }
    }
);

L.layerGroup.aqicnLayer = function(options) {
    return new L.LayerGroup.AQICNLayer(options);
}