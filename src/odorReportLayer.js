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


L.LayerGroup.OdorReportLayer = L.LayerGroup.extend(

    {
        options: {
            url: ' https://odorlog.api.ushahidi.io/api/v3/posts/',
            clearOutsideBounds: false
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
                    var script = document.createElement("SCRIPT");
                    script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js';
                    script.type = 'text/javascript';
                    var zoom = self._map.getZoom(), origin = self._map.getCenter() ;
                    script.onload = function() {
                        var $ = window.jQuery;
                        var OdorReport_url = "https://odorlog.api.ushahidi.io/api/v3/posts/" ;
                        if(typeof self._map.spin === 'function'){
                          self._map.spin(true) ;
                        }
                        $.getJSON(OdorReport_url , function(data){
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

          if (data.total_count != 0 ){
            for (i = 0 ; i < data.total_count ; i++) {
             this.addMarker(data.results[i]) ;
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

L.layerGroup.odorReportLayer = function (options) {
    return new L.LayerGroup.OdorReportLayer(options);
};
