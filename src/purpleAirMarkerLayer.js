require('jquery') ; 
require('leaflet') ; 

L.Icon.PurpleAirMarkerIcon = L.Icon.extend({
   options: {
    iconUrl: 'http://www.clker.com/cliparts/2/3/f/a/11970909781608045989gramzon_Barrel.svg.med.png',
    iconSize:     [30, 20], 
    iconAnchor:   [20 , 0], 
    popupAnchor:  [-5, -5] 
  }
});

L.icon.purpleAirMarkerIcon = function () {
    return new L.Icon.PurpleAirMarkerIcon();
};

L.LayerGroup.PurpleAirMarkerLayer = L.LayerGroup.extend(
    {
        options: {
            url: 'https://www.purpleair.com/json?fetchData=true&minimize=true&sensorsActive2=10080&orderby=L',   
        },

        initialize: function (options) {
            options = options || {};
            L.Util.setOptions(this, options); 
            this._layers = {};  
        },
        
        onAdd: function (map) {
            this._map = map;
            this.requestData();
        },
        
        onRemove: function (map) {
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
              var redDotIcon =new L.icon.purpleAirMarkerIcon();
              var lat = data.Lat ;
              var lng = data.Lon;
              var value = parseFloat(data.PM2_5Value) ;  //PM2.5 VALUE in microgram per metre cube
              var Label = data.Label ;
              var temp_f = data.temp_f ;
              var humidity = data.humidity ;
              var pressure = data.pressure ;

              var type = data.Type ;
              var hardware = data.DEVICE_HARDWAREDISCOVERED ;

              var purpleAirMarker ; 
              purpleAirMarker = L.marker([lat , lng] , {icon: redDotIcon}).bindPopup("Label : " + Label + "<br> <strong>PM2.5 Value : " + value +"</strong><br><strong> lat: " + lat + "</strong><br><strong> lon: " + lng + "</strong>"+"<br>temp_f :"+temp_f+"<br>humidity :" + humidity + "<br>pressure :" + pressure + "<br><br>Hardware type : " + type + "<br>DEVICE_HARDWAREDISCOVERED : "+hardware + "<br><br> <i>Data provided by <a>www.purpleair.com</a></i>") ;
              
              return purpleAirMarker ;
        },

        addMarker: function (data) {
            var marker = this.getMarker(data) ; 
            key = data.FIELD2;   
            if (!this._layers[key]) {
              this._layers[key] = marker;
              this.addLayer(marker);   
            }
        },
        
        parseData: function (data) {
    
            for (i = 0 ; i < data.results.length ; i++) { 
             this.addMarker(data.results[i]) ; 
            }
        }
    }
);


L.layerGroup.purpleAirMarkerLayer = function (options) {
    return new L.LayerGroup.PurpleAirMarkerLayer(options) ;
};
