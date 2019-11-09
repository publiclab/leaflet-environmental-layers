require('jquery') ;
require('leaflet') ;

L.LayerGroup.LayerCode = L.LayerGroup.extend(

    {
        options: {
            popupOnMouseover: false,
            clearOutsideBounds: true,
            target: '_self',
        },

        initialize: function (name,options) {
            this.layer = name;
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
            map.closePopup();
            // oms.clearMarkers();
            this._layers = {};
        },

        populatePopUp: function (e) {
        	if(this.layer == "opensense"){
		    if (e) {
		      var popup = e.target.getPopup();
		      var $ = window.jQuery;
		      var url = "https://api.opensensemap.org/boxes/" + e.target.options.boxId;
		      $.getJSON(url, function (data) {
		        var popUpContent = "";
		        if (data.name && data.grouptag) {
		          popUpContent += "<h3>" + data.name + "," + data.grouptag + "</h3>";
		        }
		        else if (data.name) {
		          popUpContent += "<h3>" + data.name + "</h3>";
		        }
		        for (var i in data.sensors) {
		          if (data.sensors[i].lastMeasurement) {
		            popUpContent += "<span><b>" + data.sensors[i].title + ": </b>" +
		              data.sensors[i].lastMeasurement.value +
		              data.sensors[i].unit + "</span><br>";
		          }
		        }
		        if (data.lastMeasurementAt) {
		          popUpContent += "<br><small>Measured at <i>" + data.lastMeasurementAt + "</i>";
		        }
		        popup.setContent(popUpContent);
		      });
		    }
		}
        },


        requestData: function () {
           var self = this;
           var info = require("./info.json");
                (function() {
                    var zoom;
                    var Layer_URL;
                    var $ = window.jQuery;

                    if (self.layer === "fractracker"){
                        Layer_URL = info.fractracker.api_url; ;
                    }
                    if(self.layer === "skytruth"){
                        zoom = self._map.getZoom(), northeast = self._map.getBounds().getNorthEast() , southwest = self._map.getBounds().getSouthWest() ;
                        Layer_URL = info.skytruth.api_url + "?n=100&l="+(southwest.lat)+","+(southwest.lng)+","+(northeast.lat)+","+(northeast.lng) ;
                    }
                    if(self.layer === "odorreport"){
                        zoom = self._map.getZoom(), origin = self._map.getCenter() ;
                        Layer_URL =  info.odorreport.api_url ;
                    }
                    if(self.layer === "mapknitter"){
                        zoom = self._map.getZoom(), northeast = self._map.getBounds().getNorthEast() , southwest = self._map.getBounds().getSouthWest() ;
                        Layer_URL = info.mapknitter.api_url + "?minlon="+(southwest.lng)+"&minlat="+(southwest.lat)+"&maxlon="+(northeast.lng)+"&maxlat="+(northeast.lat);
                    }
                    if(self.layer === "luftdaten"){
                        Layer_URL = "https://maps.luftdaten.info/data/v2/data.dust.min.json";
                    }
                    if(self.layer === "openaq"){
                        Layer_URL = "https://api.openaq.org/v1/latest?limit=5000";
                    }
                    if(self.layer === "opensense"){
      					Layer_URL = "https://api.opensensemap.org/boxes";

                    }
                    if(self.layer == "purpleairmarker"){
                        zoom = self._map.getZoom(), northwest = self._map.getBounds().getNorthWest() , southeast = self._map.getBounds().getSouthEast() ;
                        if(zoom < info.purpleairmarker.extents.minZoom){
                          return;
                        }
                        Layer_URL = info.purpleairmarker.api_url + "?fetchData=true&minimize=true&sensorsActive2=10080&orderby=L&nwlat="+(northwest.lat)+"&selat="+(southeast.lat)+"&nwlng="+(northwest.lng)+"&selng="+(southeast.lng) ;
                    }
                    

                    if(typeof self._map.spin === 'function'){
                        self._map.spin(true) ;
                    }
                    $.getJSON(Layer_URL , function(data){
                    if(self.layer == "fractracker")
                        self.parseData(data.feed.entry);
                    if(self.layer == "openaq")
                        self.parseData(data.results) ;
                    else
                        self.parseData(data) ;
                    if(typeof self._map.spin === 'function'){
                        self._map.spin(false) ;
                    }
                    });
                })();


        },

        getMarker: function(data) {
            if(this.layer == "fractracker"){
                var redDotIcon = new L.icon.fracTrackerIcon();
                var props = ["timestamp", "name", "summary", "website", "contact", "email", "phone", "streetaddress", "city", "state", "zipcode", "latitude", "longitude", "category"];
                var item = {};
                props.forEach(function(element) {
                    item[element] = data["gsx$" + element]["$t"];
                });
                item["updated"] = data.updated.$t;
                item["use"] = (data.gsx$useformap.$t.replace(/\s+/g, '').toLowerCase() === "use");
                item["latitude"] = item["latitude"].replace(/[^\d.-]/g, "");
                item["latitude"] = item["latitude"].replace(/[^\d.-]/g, "");
                var fracTracker;
                fracTracker = L.marker([item["latitude"], item["longitude"]], {
                    icon: redDotIcon
                }).bindPopup(this.generatePopup(item));
                return fracTracker;
           }

           if(this.layer == "skytruth"){
                var redDotIcon =new L.icon.skyTruthIcon();
                var lat = data.lat ;
                var lng = data.lng;
                var title = data.title ;
                var url = data.link ;
                var skymarker ;
                if (!isNaN(lat) && !isNaN(lng) ){
                  skymarker = L.marker([lat , lng] , {icon: redDotIcon}).bindPopup(
                  	"<a href="+url+">" +title + "</a><br>" + 
                  	"<br><strong> lat: " + lat + 
                  	"</strong><br><strong> lon: " + lng + 
                  	"</strong> <br><br>Data provided by <a href='http://alerts.skytruth.org/'>alerts.skytruth.org/</a>") ;
                }
                return skymarker;
           }

           if(this.layer == "odorreport"){
                var redDotIcon =new L.icon.odorReportIcon() ;
                var lat = data.values["bcc29002-c4d3-4c2c-92c7-1c9032c3b0fd"][0].lat ;
                var lng = data.values["bcc29002-c4d3-4c2c-92c7-1c9032c3b0fd"][0].lon ;
                var title = data.title ;
                var url = data.url ;
                var odormarker ;
                if (!isNaN(lat) && !isNaN(lng) ){
                  odormarker = L.marker([lat , lng] , {icon: redDotIcon}).bindPopup(title + 
                  	"<br><a href="+url+">" + url +"</a>" + 
                  	"<br><strong> lat: " + lat + 
                  	"</strong><br><strong> lon: " + lng + 
                  	"</strong><br><br>Data provided by <a href='https://odorlog.ushahidi.io'>https://odorlog.ushahidi.io</a>") ;
                }
                // oms.addMarker(odormarker);
                return odormarker;
           }

           if(this.layer == "mapknitter"){
                var redDotIcon =new L.icon.mapKnitterIcon();
                var lat = data.lat ;
                var lng = data.lon;
                var title = data.name ;
                var location = data.location ;
                var author = data.author ;
                var url = "https://publiclab.org/profile/" + author ;
                var map_page = "https://mapknitter.org/maps/"+ title ;
                var image_url ;
                if(data.image_urls.length > 0){
                  image_url = data.image_urls[0] ;
                }
                var mapknitter ;
                if (!isNaN(lat) && !isNaN(lng) ){
                  if(image_url !== undefined){
                    mapknitter = L.marker([lat , lng] , {icon: redDotIcon}).bindPopup(
                      "<strong>Title : </strong>"+ "<a href=" + map_page + ">" + title + "</a>" + 
                      "<br><strong>Author :</strong> " + "<a href="+url+">"  +  author +"</a>" + 
                      "<br><strong>Location : </strong>" + location  + 
                      "<br><strong> Lat : </strong>" + lat + "  ,  <strong> Lon : </strong>" + lng +
                      "<br><a href=" + image_url + "><img src="+image_url+" style='height: 202px ; width: 245px;'></a>"+
                      "<br><i>For more info on <a href='https://github.com/publiclab/leaflet-environmental-layers/issues/10'>MapKnitter Layer</a>, visit <a href='https://mapknitter.org/'>here<a></i>"
                    ) ;
                    // oms.addMarker(mapknitter);
                  }
                  else{
                    mapknitter = L.marker([lat , lng] , {icon: redDotIcon}).bindPopup(
                      "<strong>Title : </strong>"+ "<a href=" + map_page + ">" + title + "</a>" + 
                      "<br><strong>Author :</strong> " + "<a href="+url+">"  +  author +"</a>" + 
                      "<br><strong>Location : </strong>" + location  + 
                      "<br><strong> Lat : </strong>" + lat + "  ,  <strong> Lon : </strong>" + lng +
                      "<br><i>For more info on <a href='https://github.com/publiclab/leaflet-environmental-layers/issues/10'>MapKnitter Layer</a>, visit <a href='https://mapknitter.org/'>here<a></i>"
                    ) ;
                    // oms.addMarker(mapknitter);
                  }
                }
              return mapknitter ;
             }

             if(this.layer == "luftdaten")
             {
             	var greenIcon = new L.icon.luftdatenIcon();
      			var country = data.location.country;
      			var lng = data.location.longitude;
      			var lat = data.location.latitude;
      			var sensorID = data.sensor.id;
      			var popupContent = "";
			    if(country){
			        popupContent += "<h3>Country: " + country + "</h3>";
			      }
			    if(sensorID){
			        popupContent += "<h4><b>Sensor ID: </b>" + sensorID + "</h4>";
			      }
			    if(data.sensordatavalues.length > 0){
			      for(let i in data.sensordatavalues){
			          popupContent += "<b>" + data.sensordatavalues[i].value_type + "</b>: " + data.sensordatavalues[i].value + "<br/>";
			        }
			      }

			      return L.marker([lat,lng], { icon: greenIcon }).bindPopup(popupContent);	
			 }

			 if(this.layer == "openaq")
			 {
			 	var redDotIcon = new L.icon.openaqIcon();
                var distance = data.distance;
                var lat = data.coordinates.latitude;
                var lon = data.coordinates.longitude;
                var  contentData = "";
                var labels = {
                    pm25: "PM<sub>2.5</sub>",
                    pm10: "PM<sub>10</sub>",
                    o3: "Ozone",
                    no2: "Nitrogen Dioxide",
                    so2: "Sulphur Dioxide",
                    co: "Carbon Monoxide",
                    };
                for(var i = 0; i < data.measurements.length; i++) {
                    contentData+="<strong>"+labels[data.measurements[i].parameter]+" : </strong>"+data.measurements[i].value+" "+data.measurements[i].unit+"<br>";
                }
                return L.marker([lat, lon], {icon: redDotIcon}).bindPopup(
                    "<h3>"+data.location+", "+data.country+"</h3><br>"+
                    "<strong>distance: "+"</strong>"+data.distance+"<br>"+contentData
                    );
			 }

			 if(this.layer == "opensense")
			 {
			 	var blackCube = new L.icon.openSenseIcon();
			    var lat = data.currentLocation.coordinates[1];
			    var lng = data.currentLocation.coordinates[0];
			    var loadingText = "Loading ...";
			    return L.marker([lat, lng], { icon: blackCube, boxId: data._id }).bindPopup(loadingText);
			 }

             if(this.layer == "purpleairmarker")
             {
                var redDotIcon =new L.icon.purpleAirMarkerIcon();
                var lat = data[25] ;  
                var lng = data[26] ;  
                var value = parseFloat(data[16]) ;  
                var Label = data[24] ;  
                var temp_f = data[21] ;  
                var humidity = data[20] ; 
                var pressure = data[22] ; 
                var purpleAirMarker ;
                if(lat!=null && lng!=null){
                purpleAirMarker = L.marker([lat , lng] , {icon: redDotIcon}).bindPopup("<i style='color: purple ; size : 20px'>Label : " + Label + "</i><br><br> <strong>PM2.5 Value : " + value +"</strong><br><strong> Lat: " + lat + "</strong><br><strong> Lon: " + lng + "<br>Temp (F) : "+temp_f+"<br>Humidity : " + humidity + "<br>Pressure : " + pressure +"<br><br> <i>Data provided by <a href='www.purpleair.com'>www.purpleair.com</a></i>") ;
                }
                return purpleAirMarker ;
                }
        },

        generatePopup: function(item) {
            if(this.layer == "fractracker"){
                var content = "<strong>" + item["name"] + "</strong> ";
                if(item["website"]) content += "(<a href=" + item["website"] + ">website</a>" + ")";
                content += "<hr>";
                if(!!item["Descrition"]) content += "Description: <i>" + item["summary"] + "</i><br>";
                if(!!item["contact"]) content += "<strong>Contact: " + item["contact"] + "<br></strong>";
                var generics = ["phone", "email", "street", "city", "state", "zipcode", "timestamp", "latitude", "longitude"];
                for (var i = 0; i < generics.length; i++) {
                    var key = generics[i];
                    if (!!item[generics[i]]) {
                        itemContent = item[generics[i]];
                        key = key.charAt(0).toUpperCase() + key.slice(1);
                        content += key + ": " + itemContent + "<br>";
                    }
                }
                content += "<hr>Data last updated " + item["updated"] + "<br>";
                content += "<i>Data provided by <a href='http://fractracker.org/'>http://fractracker.org/</a></i>";
                return content;
            }
        },

        addMarker: function (data) {
            if(this.layer == "fractracker"){
            var key = data.gsx$name.$t;
            if (!this._layers[key]) {
                var marker = this.getMarker(data);
                this._layers[key] = marker;
                this.addLayer(marker);
            }
            }
            if(this.layer == "purpleairmarker"){
            var marker = this.getMarker(data) ;
            if(marker != null){
            key = data[0] ;  // ID
            if (!this._layers[key]) {
                this._layers[key] = marker;
                this.addLayer(marker);
            }
            }
            }
            else{
            var marker = this.getMarker(data),
            key = data.id;
            if (!this._layers[key]) {
                this._layers[key] = marker;
                this.addLayer(marker);
            }
            }
        },

        addMarker1: function (data, i) {
            if(this.layer == "luftdaten" || this.layer == "openaq"){
            var self = this;
            var marker = this.getMarker(data);
            var key = i;  
            if (!this._layers[key]) {
            this._layers[key] = marker;
            this.addLayer(marker);
            }
            }
            else{
            var marker = this.getMarker(data);
            var key = i;
            if (!this._layers[key]) {
              this._layers[key] = marker;
              marker.on('click', this.populatePopUp);
              this.addLayer(marker);
            }
            }
        },

        parseData: function (data) {
            if(this.layer == "fractracker"){
                for (i = 1 ; i < data.length ; i++) {
                 this.addMarker(data[i]) ;
                }
            }
            if(this.layer == "skytruth"){
                if (!!data.feed){
                for (i = 0 ; i < data.feed.length ; i++) {
                this.addMarker(data.feed[i]) ;
                }
                if (this.options.clearOutsideBounds) {
                this.clearOutsideBounds();
                }
                }
            }
            if(this.layer == "odorreport"){
                if (data.total_count != 0 ){
                for (i = 0 ; i < data.total_count ; i++) {
                this.addMarker(data.results[i]) ;
                }
                if (this.options.clearOutsideBounds) {
                this.clearOutsideBounds();
                }
                }
            }
            if(this.layer == "mapknitter"){
                for (i = 0 ; i < data.length ; i++) {
                this.addMarker(data[i]) ;
                }
                if (this.options.clearOutsideBounds) {
                this.clearOutsideBounds();
                }
            }
            if(this.layer == "luftdaten" || this.layer == "opensense"){
            	for (var i = 0; i < data.length; i++) {
                this.addMarker1(data[i],i);
                }
            }
            if(this.layer == "openaq"){
            	if(!!data) {
                for(var i = 0; i <data.length; i++) {
                if(!!data[i].coordinates){
                this.addMarker1(data[i],i);
                }
                }
                if(this.options.clearOutsideBounds) {
                    this.clearOutsideBounds();
                }
                }
            }
            if(this.layer == "purpleairmarker"){
                for (i = 0 ; i < data.data.length ; i++) {
                this.addMarker(data.data[i]) ;
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


L.layerGroup.layerCode = function (name,options) {
    return new L.LayerGroup.LayerCode(name,options) ;
};


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

L.Icon.SkyTruthIcon = L.Icon.extend({
  options: {
    iconUrl: 'https://www.clker.com/cliparts/T/G/b/7/r/A/red-dot.svg',
    iconSize:     [30, 20],
    iconAnchor:   [20 , 0],
    popupAnchor:  [-5, -5]
  }
});

L.icon.skyTruthIcon = function () {
  return new L.Icon.SkyTruthIcon();
};

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

L.Icon.MapKnitterIcon = L.Icon.extend({
    options: {
      iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [12, 21],
      iconAnchor: [6, 21],
      popupAnchor: [1, -34],
      shadowSize: [20, 20]
    }
});

L.icon.mapKnitterIcon = function () {
    return new L.Icon.MapKnitterIcon();
};

L.Icon.LuftdatenIcon = L.Icon.extend({
  options: {
    iconUrl: 'http://www.myiconfinder.com/uploads/iconsets/256-256-82a679a558f2fe4c3964c4123343f844.png',
    iconSize: [15, 30],
    iconAnchor: [6, 21],
    popupAnchor: [1, -34]
  }
});

L.icon.luftdatenIcon = function () {
  return new L.Icon.LuftdatenIcon();
};

L.Icon.OpenAqIcon = L.Icon.extend({
  options: {
     iconUrl: 'https://i.stack.imgur.com/6cDGi.png',
     shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
     iconSize: [12, 21],
     iconAnchor: [6, 21],
     popupAnchor: [1, -34],
     shadowSize: [20, 20]
  }
});

L.icon.openaqIcon = function () {
  return new L.Icon.OpenAqIcon();
};

L.Icon.OpenSenseIcon = L.Icon.extend({
  options: {
    iconUrl: 'https://banner2.kisspng.com/20180409/qcw/kisspng-computer-icons-font-awesome-computer-software-user-cubes-5acb63cb589078.9265215315232787953628.jpg',
    iconSize: [10, 10],
    popupAnchor: [1, -34]
  }
});

L.icon.openSenseIcon = function () {
  return new L.Icon.OpenSenseIcon();
};

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