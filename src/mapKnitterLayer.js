 L.Icon.MapKnitterIcon = L.Icon.extend({
    options: {
      iconUrl: 'http://images.clipartpanda.com/google-map-icon-marker.png',
      iconSize:     [10,25], 
      iconAnchor:   [20 , 0], 
      popupAnchor:  [-5, -5] 
    }
});

L.icon.mapKnitterIcon = function () {
    return new L.Icon.MapKnitterIcon();
};


L.LayerGroup.MapKnitterLayer = L.LayerGroup.extend(

    {
        options: {
            url: 'https://mapknitter.org/map/region/Gulf-Coast.json?minlon=-98.8&minlat=23.6&maxlon=-79.1&maxlat=31.8',
            clearOutsideBounds: true ,     
        },
        
        initialize: function (options) {
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
            this.clearLayers();
            this._layers = {};
        },
        
        requestData: function () {
           var self = this;
                (function() {
                    var script = document.createElement("SCRIPT");
                    script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js';
                    script.type = 'text/javascript';
                    var zoom = self._map.getZoom(), northeast = self._map.getBounds().getNorthEast() , southwest = self._map.getBounds().getSouthWest() ;
                    
                    script.onload = function() {
                        var $ = window.jQuery;
                        var MapKnitter_url = "https://mapknitter.org/map/region/Gulf-Coast.json?minlon="+parseInt(southwest.lng)+"&minlat="+parseInt(southwest.lat)+"&maxlon="+parseInt(northeast.lng)+"&maxlat="+parseInt(northeast.lat);
                        $.getJSON(MapKnitter_url , function(data){
                             self.parseData(data) ;    
                        });
                    };
                    document.getElementsByTagName("head")[0].appendChild(script);
                })(); 
            
            
        },
       
        getMarker: function (data) {
          
              var redDotIcon =new L.icon.mapKnitterIcon();
              var lat = data.lat ;
              var lng = data.lon;
              var title = data.name ;
              var url = data.location ;
              var mapknitter ; 
              if (!isNaN(lat) && !isNaN(lng) ){
                mapknitter = L.marker([lat , lng] , {icon: redDotIcon}).bindPopup(title + "<br><a>" + url +"</a>" + "<br><strong> lat: " + lat + "</strong><br><strong> lon: " + lng + "</strong>"+"<br><i>For more info on <a href='https://github.com/publiclab/leaflet-environmental-layers/issues/10'>MapKnitter Layer</a>, visit <a href='https://publiclab.org/notes/sagarpreet/06-06-2018/leaflet-environmental-layer-library?_=1528283515'>here<a></i>" ) ;
              }
            return mapknitter ;
        },
        addMarker: function (data) {
            var marker = this.getMarker(data),
            
            key = data.id;  

            if (!this._layers[key]) {
                this._layers[key] = marker;
                this.addLayer(marker);  
            }
        },
        
        parseData: function (data) {
    

            for (i = 0 ; i < data.length ; i++) { 
             this.addMarker(data[i]) ; 
            }

             if (this.options.clearOutsideBounds) {
                this.clearOutsideBounds();
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


L.layerGroup.mapKnitterLayer = function (options) {
    return new L.LayerGroup.MapKnitterLayer(options) ;
};
