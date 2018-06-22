require('jquery') ; 
require('leaflet') ; 
require('heatmap.js') ;
require('leaflet-heatmap') ;
/*
L.Icon.MapKnitterIcon = L.Icon.extend({
    options: {
      iconUrl: 'http://static1.squarespace.com/static/5426194de4b0fb1d443aaaeb/t/542619a0e4b0a449ee28423c/1492072406427/',
      iconSize:     [35, 50], 
      iconAnchor:   [20 , 0], 
      popupAnchor:  [-5, -5] 
    }
});

L.icon.mapKnitterIcon = function () {
    return new L.Icon.MapKnitterIcon();
};

*/
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
                        $.getJSON(PurpleLayer_url , function(data){
                        	 self.parseData(data) ;    
            		    });
                    };
                    document.getElementsByTagName("head")[0].appendChild(script);
                })(); 
            
            
        },
       
        getMarker: function (data) {
              var lat = data.Lat ;
              var lng = data.Lon;
              var PM2_5Value = data.PM2_5Value ;

              var purpleLayer_object = new Object() ; 
              purpleLayer_object.lat = lat ;
              purpleLayer_object.lng = lng ;
              purpleLayer_object.count = parseFloat(PM2_5Value) ;
              return purpleLayer_object ;
        },

        addMarker: function (data) {
            this._purpleLayerArray.push(this.getMarker(data)) ;
        },
        
        parseData: function (data) {
    
            for (i = 0 ; i < data.results.length ; i++) { 
             this.addMarker(data.results[i]) ; 
            }
            console.log(this._purpleLayerArray) ;
            this.heatmapLayer.setData({data: this._purpleLayerArray}) ;
            this._map.addLayer(this.heatmapLayer) ;
        }
    }
);


L.layerGroup.purpleLayer = function (options) {
    return new L.LayerGroup.PurpleLayer(options) ;
};
