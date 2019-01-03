L.LayerGroup.IndigenousLandsTerritoriesLayer = L.LayerGroup.extend(

    {
        options: {
            url: 'https://native-land.ca/api/index.php?maps=territories&position=45,-72',
            popupOnMouseover: false,
            clearOutsideBounds: false,
            target: '_self',
            //minZoom: 0,
            //maxZoom: 18
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

                        //Here is the URL that should be for loading 1 region at a time
                        var ILT_url = "https://native-land.ca/api/index.php?maps=territories&position=" + parseInt(origin.lat) + "," + parseInt(origin.lng);
                        //this url loads all regions at once
                        //var ILT_url = "https://native-land.ca/api/index.php?maps=territories";
                        //Here is the getJSON method designed after the other layers
                        if(typeof self._map.spin === 'function'){
                          self._map.spin(true) ;
                        }
                        $.getJSON(ILT_url , function(data){
                          self.parseData(data) ;
                          if(typeof self._map.spin === 'function'){
                            self._map.spin(false) ;
                          }
                        });

                        /*Here is a much simpler way to add the layer using geoJSON, because the data is already in geoJSON format
                        This does all that parseData does in a much simpler format.*/

                        /*$.getJSON(ILT_url , function(data){
                          function onEachFeature(feature, layer) {
                            layer.bindPopup("<strong>Name : </strong>" + feature.properties.Name + "<br><strong>Description: </strong> <a href=" + feature.properties.description + ">Native Lands - " + feature.properties.Name + "</a><br><i>From the <a href=https://github.com/publiclab/leaflet-environmental-layers/pull/77>Indigenous Territories Inventory</a> (<a href='https://publiclab.org/notes/sagarpreet/06-06-2018/leaflet-environmental-layer-library?_=1528283515'>info<a>)</i>");
                          }

                          function getStyle(feature, layer) {
                            return {
                              "color": feature.properties.color;
                            }
                          }

                          self.addLayer(L.geoJSON(data, {style: getStyle, onEachFeature: onEachFeature}));
                        });*/

                    };
                    document.getElementsByTagName("head")[0].appendChild(script);
                })();


        },


        getPoly: function (data) {
              var coords = data.geometry.coordinates;

              //Because geoJSON has coordinates in lng, lat format, we must reverse them
              for(var j = 0; j < coords[0].length; j++) {
                var temp = coords[0][j][1];
                coords[0][j][1] = coords[0][j][0];
                coords[0][j][0] = temp;
              }


              var nme = data.properties.Name;
              var frNme = data.properties.FrenchName;
              var desc = data.properties.description;
              var frDesc = data.properties.FrenchDescription;
              var clr = data.properties.color;
              var key = data.id;
              var ill_poly ;
              if (!isNaN((coords[0][0][0]) && !isNaN((coords[0][0][1]))) ){

                ill_poly = L.polygon(coords, {color: clr}).bindPopup("<strong>Name : </strong>" + nme + "<br><strong>Description: </strong> <a href=" + desc + ">Native Lands - " + nme + "</a><br><i>From the <a href='https://github.com/publiclab/leaflet-environmental-layers/pull/77'>Indigenous Territories Inventory</a> (<a href='https://publiclab.org/notes/sagarpreet/06-06-2018/leaflet-environmental-layer-library?_=1528283515'>info<a>)</i>") ;

              }
            return ill_poly ;
        },

        addPoly: function (data) {
            var poly = this.getPoly(data), key = data.id ;

            if (!this._layers[key]) {
                this._layers[key] = poly;
                this.addLayer(poly);

            }
        },

        parseData: function (data) {

        if (!!data){
           for (var i = 0 ; i < data.length ; i++) {

            this.addPoly(data[i]) ;

           }


             if (this.options.clearOutsideBounds) {
                this.clearOutsideBounds();
            }
          }
        },

        clearOutsideBounds: function () {
            var bounds = this._map.getBounds(),
                polyBounds,
                key;

            for (key in this._layers) {
                if (this._layers.hasOwnProperty(key)) {
                    polyBounds = this._layers[key].getBounds();

                    if (!bounds.intersects(polyBounds)) {
                        this.removeLayer(this._layers[key]);
                        delete this._layers[key];
                    }
                }
            }
        }
    }
);

L.layerGroup.indigenousLandsTerritoriesLayer = function (options) {
    return new L.LayerGroup.IndigenousLandsTerritoriesLayer(options);
};
