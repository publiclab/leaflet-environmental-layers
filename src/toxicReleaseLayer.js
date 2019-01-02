L.Icon.ToxicReleaseIcon = L.Icon.extend({
    options: {
      iconUrl: 'https://www.clker.com/cliparts/r/M/L/o/R/i/green-dot.svg',
      iconSize:     [30, 20],
      iconAnchor:   [20 , 0],
      popupAnchor:  [-5, -5]
    }
});

L.icon.toxicReleaseIcon = function () {
    return new L.Icon.ToxicReleaseIcon();
};


L.LayerGroup.ToxicReleaseLayer = L.LayerGroup.extend(

    {
        options: {
            url: 'https://iaspub.epa.gov/enviro/efservice/tri_facility/pref_latitude/BEGINNING/45/PREF_LONGITUDE/BEGINNING/72/rows/0:500/JSON',
            popupOnMouseover: false,
            clearOutsideBounds: false,
            target: '_self',
            minZoom: 0,
            maxZoom: 18
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
                var self = this ;
                (function() {
                    var script = document.createElement("SCRIPT");
                    script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js';
                    script.type = 'text/javascript';
                    var zoom = self._map.getZoom(), origin = self._map.getCenter() ;
                    script.onload = function() {
                        var $ = window.jQuery;
                        var TRI_url = "https://iaspub.epa.gov/enviro/efservice/tri_facility/pref_latitude/BEGINNING/"+parseInt(origin.lat)+"/PREF_LONGITUDE/BEGINNING/"+parseInt(-1*origin.lng)+"/rows/0:300/JSON" ;
                        if(typeof self._map.spin === 'function'){
                          self._map.spin(true) ;
                        }
                        $.getJSON(TRI_url , function(data){
                         // console.log(parseInt(origin.lat) +" and "+parseInt(origin.lng)) ;
                         self.parseData(data) ;
                         if(typeof self._map.spin === 'function'){
                           self._map.spin(false) ;
                         }
                        });
                    };
                    document.getElementsByTagName("head")[0].appendChild(script);
                })();


        },

        getMarker: function (data) {

            var greenDotIcon =new L.icon.toxicReleaseIcon();
              var lat = data.PREF_LATITUDE ;
              var lng = -1*data.PREF_LONGITUDE;
             // console.log(lat +"  "+lng) ;
              var fac_name = data.FACILITY_NAME ;
              var city = data.CITY_NAME ;
              var mail_street_addr = data.MAIL_STREET_ADDRESS ;
              var contact = data.ASGN_PUBLIC_PHONE ;
              var tri_marker ;
              if (!isNaN((lat)) && !isNaN((lng)) ){
                tri_marker = L.marker([lat , lng] , {icon: greenDotIcon}).bindPopup("<strong>Name : </strong>" + fac_name + "<br><strong> City :" + city +"</strong>" + "<br><strong> Street address : " + mail_street_addr + "</strong><br><strong> Contact : " + contact + "</strong><br>Lat :"+lat+"<br>Lon :"+lng +"<br><i>From the <a href='https://github.com/publiclab/leaflet-environmental-layers/pull/8'>Toxic Release Inventory</a> (<a href='https://publiclab.org/notes/sagarpreet/06-06-2018/leaflet-environmental-layer-library?_=1528283515'>info<a>)</i>") ;
              }
            return tri_marker ;
        },

        addMarker: function (data) {
            var marker = this.getMarker(data),

             key = data.TRI_FACILITY_ID ;

            if (!this._layers[key]) {
                this._layers[key] = marker;
                this.addLayer(marker);
            }
        },

        parseData: function (data) {

        if (!!data){
           for (i = 0 ; i < data.length ; i++) {
            this.addMarker(data[i]) ;
           }

             if (this.options.clearOutsideBounds) {
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

L.layerGroup.toxicReleaseLayer = function (options) {
    return new L.LayerGroup.ToxicReleaseLayer(options);
};
