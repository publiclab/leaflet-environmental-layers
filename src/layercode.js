require('jquery') ;
require('leaflet') ;

L.LayerGroup.LayerCode = L.LayerGroup.extend(

    {
        options: {
            popupOnMouseover: false,
            clearOutsideBounds: true,
            target: '_self',
        },

        initialize: (name,options) => {
            this.layer = name;
            options = options || {};
            L.Util.setOptions(this, options);
            this._layers = {};
        },

        onAdd:  map => {
            map.on('moveend', this.requestData, this);
            this._map = map;
            this.requestData();
        },

        onRemove: map => {
            map.off('moveend', this.requestData, this);
            if(typeof map.spin === 'function'){
              map.spin(false) ;
            }
            this.clearLayers();
            this._layers = {};
        },

        populatePopUp: e => {
        	if(this.layer == "opensense"){
		    if (e) {
		      let popup = e.target.getPopup();
		      let $ = window.jQuery;
		      let url = "https://api.opensensemap.org/boxes/" + e.target.options.boxId;
		      $.getJSON(url, data => {
		        let popUpContent = "";
		        if (data.name && data.grouptag) {
		          popUpContent += "<h3>" + data.name + "," + data.grouptag + "</h3>";
		        }
		        else if (data.name) {
		          popUpContent += "<h3>" + data.name + "</h3>";
		        }
		        for (let i in data.sensors) {
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


        requestData:  () => {
           let self = this;
                (() => {
                    let zoom;
                    let Layer_URL;
                    let $ = window.jQuery;

                    if (self.layer == "fractracker"){
                        Layer_URL = "https://spreadsheets.google.com/feeds/list/19j4AQmjWuELuzn1GIn0TFRcK42HjdHF_fsIa8jtM1yw/o4rmdye/public/values?alt=json" ;
                    }
                    if(self.layer == "skytruth"){
                        zoom = self._map.getZoom(), northeast = self._map.getBounds().getNorthEast() , southwest = self._map.getBounds().getSouthWest() ;
                        Layer_URL = "https://alerts1.skytruth.org/json?n=100&l="+(southwest.lat)+","+(southwest.lng)+","+(northeast.lat)+","+(northeast.lng) ;
                    }
                    if(self.layer == "odorreport"){
                        zoom = self._map.getZoom(), origin = self._map.getCenter() ;
                        Layer_URL = "https://odorlog.api.ushahidi.io/api/v3/posts/" ;
                    }
                    if(self.layer == "mapknitter"){
                        zoom = self._map.getZoom(), northeast = self._map.getBounds().getNorthEast() , southwest = self._map.getBounds().getSouthWest() ;
                        Layer_URL = "https://mapknitter.org/map/region/Gulf-Coast.json?minlon="+(southwest.lng)+"&minlat="+(southwest.lat)+"&maxlon="+(northeast.lng)+"&maxlat="+(northeast.lat);
                    }
                    if(self.layer == "luftdaten"){
                        Layer_URL = "https://maps.luftdaten.info/data/v2/data.dust.min.json";
                    }
                    if(self.layer == "openaq"){
                        Layer_URL = "https://api.openaq.org/v1/latest?limit=5000";
                    }
                    if(self.layer == "opensense"){
      					Layer_URL = "https://api.opensensemap.org/boxes";

                    }
                    if(self.layer == "purpleairmarker"){
                        zoom = self._map.getZoom(), northwest = self._map.getBounds().getNorthWest() , southeast = self._map.getBounds().getSouthEast() ;
                        Layer_URL = "https://www.purpleair.com/data.json?fetchData=true&minimize=true&sensorsActive2=10080&orderby=L&nwlat="+(northwest.lat)+"&selat="+(southeast.lat)+"&nwlng="+(northwest.lng)+"&selng="+(southeast.lng) ;
                    }
                    

                    if(typeof self._map.spin === 'function'){
                        self._map.spin(true) ;
                    }
                    $.getJSON(Layer_URL , data => {
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

        getMarker: data => {
            if(this.layer == "fractracker"){
                let redDotIcon = new L.icon.fracTrackerIcon();
                let props = ["timestamp", "name", "summary", "website", "contact", "email", "phone", "streetaddress", "city", "state", "zipcode", "latitude", "longitude", "category"];
                let item = {};
                props.forEach(element => {
                    item[element] = data["gsx$" + element]["$t"];
                });
                item["updated"] = data.updated.$t;
                item["use"] = (data.gsx$useformap.$t.replace(/\s+/g, '').toLowerCase() === "use");
                item["latitude"] = item["latitude"].replace(/[^\d.-]/g, "");
                item["latitude"] = item["latitude"].replace(/[^\d.-]/g, "");
                let fracTracker;
                fracTracker = L.marker([item["latitude"], item["longitude"]], {
                    icon: redDotIcon
                }).bindPopup(this.generatePopup(item));
                return fracTracker;
           }

           if(this.layer == "skytruth"){
                let redDotIcon = new L.icon.skyTruthIcon();
                let lat = data.lat ;
                let lng = data.lng;
                let title = data.title ;
                let url = data.link ;
                let skymarker ;
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
                let redDotIcon =new L.icon.odorReportIcon() ;
                let lat = data.values["bcc29002-c4d3-4c2c-92c7-1c9032c3b0fd"][0].lat ;
                let lng = data.values["bcc29002-c4d3-4c2c-92c7-1c9032c3b0fd"][0].lon ;
                let title = data.title ;
                let url = data.url ;
                let odormarker ;
                if (!isNaN(lat) && !isNaN(lng) ){
                  odormarker = L.marker([lat , lng] , {icon: redDotIcon}).bindPopup(title + 
                  	"<br><a href="+url+">" + url +"</a>" + 
                  	"<br><strong> lat: " + lat + 
                  	"</strong><br><strong> lon: " + lng + 
                  	"</strong><br><br>Data provided by <a href='https://odorlog.ushahidi.io'>https://odorlog.ushahidi.io</a>") ;
                }
                return odormarker;
           }

           if(this.layer == "mapknitter"){
                let redDotIcon =new L.icon.mapKnitterIcon();
                let lat = data.lat ;
                let lng = data.lon;
                let title = data.name ;
                let location = data.location ;
                let author = data.author ;
                let url = "https://publiclab.org/profile/" + author ;
                let map_page = "https://mapknitter.org/maps/"+ title ;
                let image_url ;
                if(data.image_urls.length > 0){
                  image_url = data.image_urls[0] ;
                }
                let mapknitter ;
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
                  }
                  else{
                    mapknitter = L.marker([lat , lng] , {icon: redDotIcon}).bindPopup(
                      "<strong>Title : </strong>"+ "<a href=" + map_page + ">" + title + "</a>" + 
                      "<br><strong>Author :</strong> " + "<a href="+url+">"  +  author +"</a>" + 
                      "<br><strong>Location : </strong>" + location  + 
                      "<br><strong> Lat : </strong>" + lat + "  ,  <strong> Lon : </strong>" + lng +
                      "<br><i>For more info on <a href='https://github.com/publiclab/leaflet-environmental-layers/issues/10'>MapKnitter Layer</a>, visit <a href='https://mapknitter.org/'>here<a></i>"
                    ) ;
                  }
                }
              return mapknitter ;
             }

             if(this.layer == "luftdaten")
             {
             	let greenIcon = new L.icon.luftdatenIcon();
      			let country = data.location.country;
      			let lng = data.location.longitude;
      			let lat = data.location.latitude;
      			let sensorID = data.sensor.id;
      			let popupContent = "";
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
			 	let redDotIcon = new L.icon.openaqIcon();
                let distance = data.distance;
                let lat = data.coordinates.latitude;
                let lon = data.coordinates.longitude;
                let  contentData = "";
                let labels = {
                    pm25: "PM<sub>2.5</sub>",
                    pm10: "PM<sub>10</sub>",
                    o3: "Ozone",
                    no2: "Nitrogen Dioxide",
                    so2: "Sulphur Dioxide",
                    co: "Carbon Monoxide",
                    };
                for(let i = 0; i < data.measurements.length; i++) {
                    contentData+="<strong>"+labels[data.measurements[i].parameter]+" : </strong>"+data.measurements[i].value+" "+data.measurements[i].unit+"<br>";
                }
                return L.marker([lat, lon], {icon: redDotIcon}).bindPopup(
                    "<h3>"+data.location+", "+data.country+"</h3><br>"+
                    "<strong>distance: "+"</strong>"+data.distance+"<br>"+contentData
                    );
			 }

			 if(this.layer == "opensense")
			 {
			 	let blackCube = new L.icon.openSenseIcon();
			    let lat = data.currentLocation.coordinates[1];
			    let lng = data.currentLocation.coordinates[0];
			    let loadingText = "Loading ...";
			    return L.marker([lat, lng], { icon: blackCube, boxId: data._id }).bindPopup(loadingText);
			 }

             if(this.layer == "purpleairmarker")
             {
                let redDotIcon =new L.icon.purpleAirMarkerIcon();
                let lat = data[25] ;  
                let lng = data[26] ;  
                let value = parseFloat(data[16]) ;  
                let Label = data[24] ;  
                let temp_f = data[21] ;  
                let humidity = data[20] ; 
                let pressure = data[22] ; 
                let purpleAirMarker ;
                if(lat!=null && lng!=null){
                purpleAirMarker = L.marker([lat , lng] , {icon: redDotIcon}).bindPopup("<i style='color: purple ; size : 20px'>Label : " + Label + "</i><br><br> <strong>PM2.5 Value : " + value +"</strong><br><strong> Lat: " + lat + "</strong><br><strong> Lon: " + lng + "<br>Temp (F) : "+temp_f+"<br>Humidity : " + humidity + "<br>Pressure : " + pressure +"<br><br> <i>Data provided by <a href='www.purpleair.com'>www.purpleair.com</a></i>") ;
                }
                return purpleAirMarker ;
                }
        },

        generatePopup: item => {
            if(this.layer == "fractracker"){
                let content = "<strong>" + item["name"] + "</strong> ";
                if(item["website"]) content += "(<a href=" + item["website"] + ">website</a>" + ")";
                content += "<hr>";
                if(!!item["Descrition"]) content += "Description: <i>" + item["summary"] + "</i><br>";
                if(!!item["contact"]) content += "<strong>Contact: " + item["contact"] + "<br></strong>";
                let generics = ["phone", "email", "street", "city", "state", "zipcode", "timestamp", "latitude", "longitude"];
                for (let i = 0; i < generics.length; i++) {
                    let key = generics[i];
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

        addMarker:  data => {
            if(this.layer == "fractracker"){
            let key = data.gsx$name.$t;
            if (!this._layers[key]) {
                let marker = this.getMarker(data);
                this._layers[key] = marker;
                this.addLayer(marker);
            }
            }
            if(this.layer == "purpleairmarker"){
            let marker = this.getMarker(data) ;
            if(marker != null){
            key = data[0] ;  // ID
            if (!this._layers[key]) {
                this._layers[key] = marker;
                this.addLayer(marker);
            }
            }
            }
            else{
            let marker = this.getMarker(data),
            key = data.id;
            if (!this._layers[key]) {
                this._layers[key] = marker;
                this.addLayer(marker);
            }
            }
        },

        addMarker1: (data, i) => {
            if(this.layer == "luftdaten" || this.layer == "openaq"){
            let self = this;
            let marker = this.getMarker(data);
            let key = i;  
            if (!this._layers[key]) {
            this._layers[key] = marker;
            this.addLayer(marker);
            }
            }
            else{
            let marker = this.getMarker(data);
            let key = i;
            if (!this._layers[key]) {
              this._layers[key] = marker;
              marker.on('click', this.populatePopUp);
              this.addLayer(marker);
            }
            }
        },

        parseData: data => {
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
            	for (let i = 0; i < data.length; i++) {
                this.addMarker1(data[i],i);
                }
            }
            if(this.layer == "openaq"){
            	if(!!data) {
                for(let i = 0; i <data.length; i++) {
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

        clearOutsideBounds: () => {
            let bounds = this._map.getBounds(),
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


L.layerGroup.layerCode = (name,options) => new L.LayerGroup.LayerCode(name,options);

L.Icon.FracTrackerIcon = L.Icon.extend({
   options: {
    iconUrl: 'https://www.clker.com/cliparts/2/3/f/a/11970909781608045989gramzon_Barrel.svg.med.png',
    iconSize:     [30, 20],
    iconAnchor:   [20 , 0],
    popupAnchor:  [-5, -5]
  }
});

L.icon.fracTrackerIcon = () => new L.Icon.FracTrackerIcon();


L.Icon.SkyTruthIcon = L.Icon.extend({
  options: {
    iconUrl: 'https://www.clker.com/cliparts/T/G/b/7/r/A/red-dot.svg',
    iconSize:     [30, 20],
    iconAnchor:   [20 , 0],
    popupAnchor:  [-5, -5]
  }
});

L.icon.skyTruthIcon = () => new L.Icon.SkyTruthIcon();

L.Icon.OdorReportIcon = L.Icon.extend({
    options: {
      iconUrl: 'https://www.clker.com/cliparts/T/3/6/T/S/8/ink-splash-md.png',
      iconSize:     [30, 20],
      iconAnchor:   [20 , 0],
      popupAnchor:  [-5, -5]
    }
});

L.icon.odorReportIcon = () => new L.Icon.OdorReportIcon();

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

L.icon.mapKnitterIcon = () => new L.Icon.MapKnitterIcon();


L.Icon.LuftdatenIcon = L.Icon.extend({
  options: {
    iconUrl: 'http://www.myiconfinder.com/uploads/iconsets/256-256-82a679a558f2fe4c3964c4123343f844.png',
    iconSize: [15, 30],
    iconAnchor: [6, 21],
    popupAnchor: [1, -34]
  }
});

L.icon.luftdatenIcon = () => new L.Icon.LuftdatenIcon();


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

L.icon.openaqIcon = () => new L.Icon.OpenAqIcon();

L.Icon.OpenSenseIcon = L.Icon.extend({
  options: {
    iconUrl: 'https://banner2.kisspng.com/20180409/qcw/kisspng-computer-icons-font-awesome-computer-software-user-cubes-5acb63cb589078.9265215315232787953628.jpg',
    iconSize: [10, 10],
    popupAnchor: [1, -34]
  }
});

L.icon.openSenseIcon = () => new L.Icon.OpenSenseIcon();

L.Icon.PurpleAirMarkerIcon = L.Icon.extend({
   options: {
    iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Location_dot_purple.svg/768px-Location_dot_purple.svg.png',
    iconSize:     [11 , 10],
    iconAnchor:   [20 , 0],
    popupAnchor:  [-5, -5]
  }
});

L.icon.purpleAirMarkerIcon = () => new L.Icon.PurpleAirMarkerIcon();
