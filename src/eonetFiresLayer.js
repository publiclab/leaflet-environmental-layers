L.Icon.EonetFiresIcon = L.Icon.extend({
    options: {
      iconUrl: 'https://www.clker.com/cliparts/r/M/L/o/R/i/green-dot.svg',
      iconSize:     [30, 20],
      iconAnchor:   [20 , 0],
      popupAnchor:  [-5, -5]
    }
});

L.icon.eonetFiresIcon = function () {
    return new L.Icon.EonetFiresIcon();
};

L.GeoJSON.EonetFiresLayer = L.GeoJSON.extend(
    {
        options: {
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, geojsonMarkerOptions);
            },
            onEachFeature: function (feature, layer) {},
            coordsToLatLng: this.coordsToLatLng
        },
        initialize: function (options) {
            // console.log('fires')
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
            // var info = require('./info.json');
            var self = this;

            (function() {
                var $ = window.jQuery;
                var EonetFire_url = "https://eonet.sci.gsfc.nasa.gov/api/v2.1/categories/8";
                if(typeof self._map.spin === 'function'){
                  self._map.spin(true) ;
                }
                
                $.getJSON(EonetFire_url , function(data){
                    self.parseData(data) ;
                    if(typeof self._map.spin === 'function'){
                      self._map.spin(false) ;
                    }
                }); 
            })();
        },

        parseData: function (data) {
            // console.log(data.events);
            if (!!data){
                for (i = 0 ; i < data.events.length ; i++) {
                    // console.log(data.events[i]);
                    this.addMarker(data.events[i]) ;
                }

                // if (this.options.clearOutsideBounds) {
                //     this.clearOutsideBounds();
                // }
            }
        },

        getMarker: function (data) {
            // console.log(data);
            var fireIcon = new L.icon.eonetFiresIcon();
            var coords = this.coordsToLatLng(data.geometries[0].coordinates);
              var lat = coords.lat;
              var lng = coords.lng;
              var title = data.title;
              var date = data.geometries[0].date;
              var source = data.sources && data.sources[0].url
              var fire_marker ;
              if (!isNaN((lat)) && !isNaN((lng)) ){
                fire_marker = L.marker([lat , lng] , {icon: fireIcon}).bindPopup("<strong>Name : </strong>" + title + "<br>Lat :"+lat+"<br>Lon :"+lng + "<br>Lat :"+date+"<br><i><a href='https://github.com/publiclab/leaflet-environmental-layers/pull/8'>Toxic Release Inventory</a> (<a href='+source+'>source<a>)</i>") ;
              }
            return fire_marker ;
            // console.log(coords, lat, lng);
        },

        addMarker: function (data) {
            var marker = this.getMarker(data);
        },

        coordsToLatLng: function (coords) {
            return new L.LatLng(coords[1], coords[0]);
        },
        

    }
);



L.geoJSON.eonetFiresLayer = function (options) {
    return new L.GeoJSON.EonetFiresLayer(options);
};
