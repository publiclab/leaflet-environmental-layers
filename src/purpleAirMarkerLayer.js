require('jquery') ; 
require('leaflet') ; 

L.Icon.PurpleAirMarkerIcon = L.Icon.extend({
   options: {
    iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Location_dot_purple.svg/768px-Location_dot_purple.svg.png',
    iconSize:     [15 , 10], 
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
              if(lat!=null && lng!=null){
              purpleAirMarker = L.marker([lat , lng] , {icon: redDotIcon}).bindPopup("<i style='color: purple ; size : 20px'>Label : " + Label + "</i><br><br> <strong>PM2.5 Value : " + value +"</strong><br><strong> Lat: " + lat + "</strong><br><strong> Lon: " + lng + "<br>Temp (F) : "+temp_f+"<br>Humidity : " + humidity + "<br>Pressure : " + pressure + "<br><br>Hardware type : " + type + "<br>DEVICE_HARDWAREDISCOVERED : "+hardware + "</strong><br><br> <i>Data provided by <a href='www.purpleair.com'>www.purpleair.com</a></i>") ;
              }
              return purpleAirMarker ;
        },

        addMarker: function (data) {

            var marker = this.getMarker(data) ; 
             if(marker != null){ 
             key = data.ID ;   
             if (!this._layers[key]) {
               this._layers[key] = marker;
               this.addLayer(marker);   
             }
            }
        },
        
        parseData: function (data) {
            console.log(data.results.length) ;
            for (i = 0 ; i < data.results.length ; i++) { 
             this.addMarker(data.results[i]) ; 
            }
        }
    }
);


L.layerGroup.purpleAirMarkerLayer = function (options) {
    return new L.LayerGroup.PurpleAirMarkerLayer(options) ;
};
