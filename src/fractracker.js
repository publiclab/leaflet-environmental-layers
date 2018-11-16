L.Icon.FracTrackerIcon = L.Icon.extend({
   options: {
    iconUrl: 'https://www.clker.com/cliparts/2/3/f/a/11970909781608045989gramzon_Barrel.svg.med.png',
    iconSize:     [30, 20],
    iconAnchor:   [20 , 0],
    popupAnchor:  [-5, -5]
  }
});

L.icon.fracTrackerIcon = function () {
    return new L.Icon.FracTrackerIcon();
};


L.LayerGroup.FracTrackerLayer = L.LayerGroup.extend(

    {
        options: {
            url: 'https://sagarpreet-chadha.github.io/FractrackerCSV.json',
        },

        initialize: function (options) {
            options = options || {};
            L.Util.setOptions(this, options);
            this._layers = {};
        },

        onAdd: function (map) {
           // map.on('moveend', this.requestData, this);
            this._map = map;
            this.requestData();
        },

        onRemove: function (map) {
           // map.off('moveend', this.requestData, this);
            this.clearLayers();
            map.spin(false) ;
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
                        var FracTracker_URL = "https://sagarpreet-chadha.github.io/FractrackerCSV.json" ;
                        self._map.spin(true) ;
                        $.getJSON(FracTracker_URL , function(data){
                        	 self.parseData(data) ;
                           self._map.spin(false) ;
            		    });
                    };
                    document.getElementsByTagName("head")[0].appendChild(script);
                })();


        },

        getMarker: function (data) {

              var redDotIcon =new L.icon.fracTrackerIcon();
              var lat = parseFloat(data.FIELD12) ;
              var lng = parseFloat(data.FIELD13) ;
              var title = data.FIELD2 ;
              var summary = data.FIELD3 ;
              var city = data.FIELD9 ;
              var state = data.FIELD10 ;
              var website = data.FIELD4 ;
              var contact = data.FIELD5 ;
              var email = data.FIELD6 ;
              var phone = data.FIELD7 ;
              var street = data.FIELD8 ;
              var fracTracker ;
              fracTracker = L.marker([lat , lng] , {icon: redDotIcon}).bindPopup(title + "<br><a href=" + website + ">" + website +"</a>" + "<br><strong> lat: " + lat + "</strong><br><strong> lon: " + lng + "</strong>"+"<br>Contact :"+contact+"<br>Phone :" + phone + "<br>Email :" + email + "<br>Street : " + street + "<br>State : "+state + "<br>City :"+ city +"<br><i>"+summary+"</i><br><br> <i>Data provided by <a href='http://fractracker.org/'>http://fractracker.org/</a></i>") ;

              return fracTracker ;
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

            for (i = 1 ; i < data.length ; i++) {
             this.addMarker(data[i]) ;
            }

        }
    }
);


L.layerGroup.fracTrackerLayer = function (options) {
    return new L.LayerGroup.FracTrackerLayer(options) ;
};
