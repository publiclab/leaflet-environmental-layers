/*global L*/

require('jquery') ; 
require('leaflet') ; 



L.Icon.MapKnitterIcon = L.Icon.extend({
    options: {
      iconUrl: 'http://static1.squarespace.com/static/5426194de4b0fb1d443aaaeb/t/542619a0e4b0a449ee28423c/1492072406427/',
      iconSize:     [35, 50], // size of the icon
      iconAnchor:   [20 , 0], // point of the icon which will correspond to marker's location
      popupAnchor:  [-5, -5] // point from which the popup should open relative to the iconAnchor
    }
});

L.icon.mapKnitterIcon = function () {
    return new L.Icon.MapKnitterIcon();
};


L.LayerGroup.MapKnitterLayer = L.LayerGroup.extend(

    {
        options: {
            url: 'https://mapknitter.org/map/region/Gulf-Coast.json?minlon=-98.8&minlat=23.6&maxlon=-79.1&maxlat=31.8',
            //limit: 100,
            popupOnMouseover: false,
            clearOutsideBounds: true ,       // clears the marker which are outside the current bound
            target: '_self',       // where to open the wikipedia page
           // images: 'images/',
            minZoom: 0,
            maxZoom: 18
        },
        /*
            Create the layer group using the passed options.
        */
        initialize: function (options) {
            options = options || {};
            L.Util.setOptions(this, options);  // this function merges the options to this.option
            this._layers = {};  // hash map to check if a marker (at long / lat) is not already added to map , all markers are as value in this hash-map .

        },
        /*
            Store a reference to the map and call the requestData() method.
        */
        onAdd: function (map) {
            map.on('moveend', this.requestData, this);
            this._map = map;
            this.requestData();

        },
        /**
            Remove the 'moveend' event listener and clear all the markers.
        */
        onRemove: function (map) {
            map.off('moveend', this.requestData, this);
            this.clearLayers();
            this._layers = {};
        },
        /**
            Send a query request for JSONP data.
        */
        requestData: function () {
           var self = this;

       
              // Anonymous "self-invoking" function

             // "https://alerts.skytruth.org/json?n=100&l="+origin.lat+100+","+origin.lng-100+","+origin.lat-100+","+origin.lng+100
                (function() {
                    // Load the script
                    var script = document.createElement("SCRIPT");
                    script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js';
                    script.type = 'text/javascript';
                    var zoom = self._map.getZoom(), northeast = self._map.getBounds().getNorthEast() , southwest = self._map.getBounds().getSouthWest() ;
                    
                    script.onload = function() {
                        var $ = window.jQuery;
                    //    console.log(southwest.lat+" "+southwest.lng) ; 
                        var MapKnitter_url = "https://mapknitter.org/map/region/Gulf-Coast.json?minlon="+parseInt(southwest.lng)+"&minlat="+parseInt(southwest.lat)+"&maxlon="+parseInt(northeast.lng)+"&maxlat="+parseInt(northeast.lat);
                        $.getJSON(MapKnitter_url , function(data){
                        	 self.parseData(data) ;    
            		    });
                    };
                    
                    document.getElementsByTagName("head")[0].appendChild(script);
                })(); 
            
            
        },
        /*
            Create a new marker.
        */
        getMarker: function (data) {
          
              var redDotIcon =new L.icon.mapKnitterIcon();
              var lat = data.lat ;
              var lng = data.lon;
              var title = data.name ;
              var url = data.location ;
              var mapknitter ; 
              if (!isNaN(lat) && !isNaN(lng) ){
                mapknitter = L.marker([lat , lng] , {icon: redDotIcon}).bindPopup(title + "<br><a>" + url +"</a>" + "<br><strong> lat: " + lat + "</strong><br><strong> lon: " + lng + "</strong>"+"<br><i>For more info on <a href='https://github.com/publiclab/leaflet-environmental-layers/issues/10'>MapKnitter Layer</a>, visit <a href='https://publiclab.org/notes/sagarpreet/06-06-2018/leaflet-environmental-layer-library?_=1528283515'>here<a></i>" ) ;
              //  console.log(mapknitter) ;
              }
            return mapknitter ;
        },
        /*
            Add a marker by calling the addMarker() method.
        */
        addMarker: function (data) {
            var marker = this.getMarker(data),
            
            key = data.id;   // key is a unique value corresponding to a marker which will be used to access the value from the hash_map this._layer  , see API .

            if (!this._layers[key]) {
                this._layers[key] = marker;
                this.addLayer(marker);   // this function adds marker to map 1 at a time .
            }
        },
        
        /*
            Parse the response data and call the addMarker() method for each result.   
        */
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

                    if (!bounds.contains(latLng)) {          // contains is a leaflet class function which returns TRUE if the marker is in the current map bounds .
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
