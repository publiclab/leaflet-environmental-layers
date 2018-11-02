L.LayerGroup.IndigenousLandsLanguagesLayer = L.LayerGroup.extend(

    {
        options: {
            url: 'https://native-land.ca/api/index.php?maps=languages&position=45,-72',
            popupOnMouseover: false,
            clearOutsideBounds: true,
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

                        //Here is the URL that should be used once we are able to request data.
                        //var ILL_url = "https://native-land.ca/api/index.php?maps=languages&position=" + parseInt(origin.lat) + "," + parseInt(origin.lng);

                        //Here is the getJSON that will work as well
                        /*$.getJSON(ILL_url , function(data){
                         // console.log(parseInt(origin.lat) +" and "+parseInt(origin.lng)) ;
                         self.parseData(data) ;
                         });*/

                        //This is the sample set of data I used to test
                        var data = [{"type":"Feature","properties":{"Name":"Laurentian","description":"https:\/\/native-land.ca\/maps\/languages\/laurentian\/","Slug":"laurentian","FrenchName":"Laurentian","color":"#3A00EE","FrenchDescription":"https:\/\/fr.wikipedia.org\/wiki\/Laurentien_(langue)"},"geometry":{"coordinates":[[[-72.13623,46.027482,0],[-72.949219,45.444717,0],[-73.344727,44.653024,0],[-72.79541,44.386692,0],[-72.180176,44.512176,0],[-71.608887,45.629405,0],[-71.894531,46.255847,0],[-72.13623,46.027482,0]]],"type":"Polygon"},"id":"238225dd9c9c4020f9031d8c80ac9125"},{"type":"Feature","properties":{"Name":"Pennacook","description":"https:\/\/native-land.ca\/maps\/languages\/pennacook\/","Slug":"pennacook","FrenchName":"Pennacook","color":"#022233","FrenchDescription":"https:\/\/native-land.ca\/maps\/languages\/pennacook\/"},"geometry":{"coordinates":[[[-72.04834,45.151053,5],[-72.312012,44.746733,5],[-72.79541,44.197959,5],[-72.312012,43.100983,0],[-71.938477,42.585444,0],[-71.103516,42.5207,0],[-70.488281,42.55308,0],[-70.202637,43.229195,0],[-70.708008,43.786958,0],[-71.081543,44.840291,0],[-71.169434,45.429299,0],[-71.938477,45.197522,0],[-72.04834,45.151053,0]]],"type":"Polygon"},"id":"664f06138da4f296820b2867e0ba31ae"}];
                        self.parseData(data);

                        /*Here is a much simpler way to add the layer using geoJSON, because the data is already in geoJSON format
                        This does all that parseData does in a much simpler format.
                        function onEachFeature(feature, layer) {
                         layer.bindPopup("<strong>Name : </strong>" + nme + "<br><strong>Description: </strong> <a href=" + desc + ">Native Lands - " + nme + "</a><br><i>From the  (<a href='https://publiclab.org/notes/sagarpreet/06-06-2018/leaflet-environmental-layer-library?_=1528283515'>info<a>)</i>");
                        }

                        function getStyle(feature, layer) {
                         return {
                           "color": feature.properties.color
                         }
                        }

                        self.addLayer(L.geoJSON(geoData, {style: getStyle, onEachFeature: onEachFeature}));
                        */
                    };
                    document.getElementsByTagName("head")[0].appendChild(script);
                })();


        },


        getPoly: function (data) {
              var coords = data.geometry.coordinates;

              //Because geoJSON has coordinates in lng, lat format, we must reverse them
              for( j = 0; j < coords[0].length; j++) {
                var temp = coords[0][j][1];
                coords[0][j][1] = coords[0][j][0];
                coords[0][j][0] = temp;
              }


              var nme = data.properties.Name;
              var frNme = data.properties.FrenchName;
              var desc = data.properties.description;
              var frDesc = data.properties.FrenchDescription;
              var clr = data.properties.color;
              var ill_poly ;
              if (!isNaN((coords[0][0][0]) && !isNaN((coords[0][0][1]))) ){

              ill_poly = L.polygon(coords, {color: clr}).bindPopup("<strong>Name : </strong>" + nme + "<br><strong>Description: </strong> <a href=" + desc + ">Native Lands - " + nme + "</a><br><i>From the  (<a href='https://publiclab.org/notes/sagarpreet/06-06-2018/leaflet-environmental-layer-library?_=1528283515'>info<a>)</i>") ;

              }
            return ill_poly ;
        },

        addPoly: function (data) {
            var poly = this.getPoly(data), key = data.id ;
            console.log("Entered addPoly; poly below");
            console.log(poly);
            if (!this._layers[key]) {
                this._layers[key] = poly;

                this.addLayer(poly);
                console.log("logging layer");
                console.log(this);

            }
        },

        parseData: function (data) {

        if (!!data){
           for (i = 0 ; i < data.length ; i++) {
            console.log("made it into loop");

            this.addPoly(data[i]) ;
            console.log("finished iter of loop");

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

L.layerGroup.indigenousLandsLanguagesLayer = function (options) {
    return new L.LayerGroup.IndigenousLandsLanguagesLayer(options);
};
