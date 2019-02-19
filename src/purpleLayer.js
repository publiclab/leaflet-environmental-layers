require('heatmap.js') ;
require('leaflet-heatmap') ;

L.LayerGroup.PurpleLayer = L.LayerGroup.extend(

    {

        options: {
            "radius": 2,
            "maxOpacity": 1 ,
            "scaleRadius": true,
            "useLocalExtrema": true,
             latField: 'lat',
             lngField: 'lng',
             valueField: 'count' ,
             blur: .75
        },

        initialize: function (options) {
            options = options || {};
            L.Util.setOptions(this, options);
            this._layers = {};
            this._purpleLayerArray = [] ;
            this.heatmapLayer ;
        },

        onAdd: function (map) {
             this._map = map;
             this.heatmapLayer = new HeatmapOverlay(this.options) ;
             this.requestData();


        },

        onRemove: function (map) {
            this._map.removeLayer(this.heatmapLayer) ;
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

                    script.onload = function() {
                        var $ = window.jQuery;
                        var PurpleLayer_url = "https://www.purpleair.com/json?fetchData=true&minimize=true&sensorsActive2=10080&orderby=L";
                        if(typeof self._map.spin === 'function'){
                          self._map.spin(true) ;
                        }
                        $.getJSON(PurpleLayer_url , function(data){
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
              var lat = data.Lat ;
              var lng = data.Lon;
              var value = parseFloat(data.PM2_5Value) ;  //PM2.5 VALUE in microgram per metre cube

              var purpleLayer_object = new Object() ;
              purpleLayer_object.lat = lat ;
              purpleLayer_object.lng = lng ;
              purpleLayer_object.count = value ;
              /*
              var aqi ;
              if(value>=0 && value<=12.0)
              {
                aqi = ((50-0)*(value-0))/(12-0) + 0 ;
              }
              else if(value<=35.4){
                aqi = ((100-51)*(value-12.1))/(35.4-12.1) + 51 ;
              }
              else if(value<=55.4){
                aqi = ((150-101)*(value-35.5))/(55.4-35.5) + 101 ;
              }
              else if(value<=150.4){
                aqi = ((200-151)*(value-55.5))/(150.4-55.5) + 151 ;
              }
              else if(value<=250.4){
                aqi = ((3000-201)*(value-150.5))/(250.4-150.5) + 201 ;
              }
              else if(value<=350.4){
                aqi = ((400-301)*(value-250.5))/(350.4-250.5) + 301 ;
              }
              else{
                aqi = ((500-401)*(value-350.5))/(500.4-350.5) + 401 ;
              }

              purpleLayer_object.count = aqi ;
              */
              return purpleLayer_object ;
        },

        addMarker: function (data) {
            this._purpleLayerArray.push(this.getMarker(data)) ;
        },

        parseData: function (data) {

            for (i = 0 ; i < data.results.length ; i++) {
             this.addMarker(data.results[i]) ;
            }
            //console.log(this._purpleLayerArray) ;
            this.heatmapLayer.setData({data: this._purpleLayerArray}) ;
            this._map.addLayer(this.heatmapLayer) ;
        }
    }
);


L.layerGroup.purpleLayer = function (options) {
    return new L.LayerGroup.PurpleLayer(options) ;
};
