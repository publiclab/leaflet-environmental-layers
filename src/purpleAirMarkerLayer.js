require('jquery') ;
require('leaflet') ;

L.Icon.PurpleAirMarkerIcon = L.Icon.extend({
   options: {
    iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Location_dot_purple.svg/768px-Location_dot_purple.svg.png',
    iconSize:     [11 , 10],
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
            url: 'https://www.purpleair.com/data.json?fetchData=true&minimize=true&sensorsActive2=10080&orderby=L&nwlat=71.01695975726373&selat=4.390228926463396&nwlng=-172.79296875&selng=80.33203125',
        },

        initialize: function (options) {
            options = options || {};
            L.Util.setOptions(this, options);
            this._layers = {};
        },

        onAdd: function (map) {
            map.setZoom(7) ;
            map.on('moveend', this.requestData, this);
            this._map = map;
            this.requestData();
        },

        onRemove: function (map) {
            map.off('moveend', this.requestData, this);
            this.clearLayers();
            if(typeof map.spin === 'function'){
              map.spin(false) ;
            }
            this._layers = {};
        },

        requestData: function () {
          if(this._map.getZoom() >= 7){
             var self = this;
                  (function() {
                      var script = document.createElement("SCRIPT");
                      script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js';
                      script.type = 'text/javascript';
                      var zoom = self._map.getZoom(), northwest = self._map.getBounds().getNorthWest() , southeast = self._map.getBounds().getSouthEast() ;
                      script.onload = function() {
                          var $ = window.jQuery;
                          var PurpleLayer_url = "https://www.purpleair.com/data.json?fetchData=true&minimize=true&sensorsActive2=10080&orderby=L&nwlat="+(northwest.lat)+"&selat="+(southeast.lat)+"&nwlng="+(northwest.lng)+"&selng="+(southeast.lng) ;
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
          }
        },

        getMarker: function (data) {
              var redDotIcon =new L.icon.purpleAirMarkerIcon();
              var lat = data[25] ;  // Lat
              var lng = data[26] ;  //Lon
              var value = parseFloat(data[16]) ;  //PM2.5 VALUE in microgram per metre cube
              var Label = data[24] ;  //Label
              var temp_f = data[21] ;  // temperature (F)
              var humidity = data[20] ; // Humidity
              var pressure = data[22] ; //Pressure

            //  var type = data.Type ;
            //  var hardware = data.DEVICE_HARDWAREDISCOVERED ;

              var purpleAirMarker ;
              if(lat!=null && lng!=null){
              purpleAirMarker = L.marker([lat , lng] , {icon: redDotIcon}).bindPopup("<i style='color: purple ; size : 20px'>Label : " + Label + "</i><br><br> <strong>PM2.5 Value : " + value +"</strong><br><strong> Lat: " + lat + "</strong><br><strong> Lon: " + lng + "<br>Temp (F) : "+temp_f+"<br>Humidity : " + humidity + "<br>Pressure : " + pressure +"<br><br> <i>Data provided by <a href='www.purpleair.com'>www.purpleair.com</a></i>") ;
              }
              return purpleAirMarker ;
        },

        addMarker: function (data) {

            var marker = this.getMarker(data) ;
             if(marker != null){
             key = data[0] ;  // ID
             if (!this._layers[key]) {
               this._layers[key] = marker;
               this.addLayer(marker);
             }
            }
        },

        parseData: function (data) {
            for (i = 0 ; i < data.data.length ; i++) {
             this.addMarker(data.data[i]) ;
            }
        }
    }
);


L.layerGroup.purpleAirMarkerLayer = function (options) {
    return new L.LayerGroup.PurpleAirMarkerLayer(options) ;
};
