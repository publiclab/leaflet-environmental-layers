 L.Icon.MapKnitterIcon = L.Icon.extend({
    options: {
      iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [12, 21],
      iconAnchor: [6, 21],
      popupAnchor: [1, -34],
      shadowSize: [20, 20]
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
            if(typeof map.spin === 'function'){
              map.spin(false) ;
            }
            this.clearLayers();
            this._layers = {};
        },

        requestData: function () {
           var self = this;
                (function() {
                    var zoom = self._map.getZoom(), northeast = self._map.getBounds().getNorthEast() , southwest = self._map.getBounds().getSouthWest() ;
                    var $ = window.jQuery;
                    var MapKnitter_url = "https://mapknitter.org/map/region/Gulf-Coast.json?minlon="+(southwest.lng)+"&minlat="+(southwest.lat)+"&maxlon="+(northeast.lng)+"&maxlat="+(northeast.lat);
                    if(typeof self._map.spin === 'function'){
                        self._map.spin(true) ;
                    }
                    $.getJSON(MapKnitter_url , function(data){
                            self.parseData(data) ;
                        if(typeof self._map.spin === 'function'){
                            self._map.spin(false) ;
                        }
                    });
                })();


        },

        getMarker: function (data) {

              var redDotIcon =new L.icon.mapKnitterIcon();
              var lat = data.lat ;
              var lng = data.lon;
              var title = data.name ;
              var location = data.location ;
              var author = data.author ;
              var url = "https://publiclab.org/profile/" + author ;
              var map_page = "https://mapknitter.org/maps/"+ title ;
              var image_url ;
              if(data.image_urls.length > 0){
                image_url = data.image_urls[0] ;
              }
              var mapknitter ;
              if (!isNaN(lat) && !isNaN(lng) ){
                if (image_url !== undefined){
                  mapknitter = L.marker([lat , lng] , {icon: redDotIcon}).bindPopup(
                    "<div class='mapknitter-info'><h4>"+ "<a href=" + map_page + ">" + title + "</a></h4>" + 
                    "<p>by " + "<a href=" + url + ">" + author + "</a>" + 
                    " near " + location  + 
                    "</p><a href=" + map_page + "><img src="+image_url+" style='width: 245px;'></a></div>"
                  ) ;
                }
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
