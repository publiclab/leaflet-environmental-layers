L.LayerGroup.IndigenousLayers = L.LayerGroup.extend(

    {
        options: {
            
            popupOnMouseover: false,
            clearOutsideBounds: false,
            target: '_self',
        },

        initialize: (name,options) => {
        
            this.layer = name;
            options = options || {};
            L.Util.setOptions(this, options);
            this._layers = {};

        },

        onAdd: map => {
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

        requestData: () => {
                let self = this ;
                (() => {
                    let zoom = self._map.getZoom(), origin = self._map.getCenter() ;
                    let $ = window.jQuery;
                    let ILL_url;
       
                    if(self.layer === "Territories" ){
                        ILL_url = "https://native-land.ca/api/index.php?maps=territories&position=" + parseInt(origin.lat) + "," + parseInt(origin.lng);
                    }
                    if (self.layer === "Languages"){
                        ILL_url = "https://native-land.ca/api/index.php?maps=languages&position=" + parseInt(origin.lat) + "," + parseInt(origin.lng);
                    }
                    if(self.layer === "Treaties" ){
                         ILL_url = "https://native-land.ca/api/index.php?maps=treaties&position=" + parseInt(origin.lat) + "," + parseInt(origin.lng);
                    }

                    if(typeof self._map.spin === 'function'){
                        self._map.spin(true) ;
                    }
                    $.getJSON(ILL_url , function(data){
                        self.parseData(data) ;
                        if(typeof self._map.spin === 'function'){
                        self._map.spin(false) ;
                        }
                    });

                })();
        },


        getPoly: data => {
              let coords = data.geometry.coordinates;

              for(let j = 0; j < coords[0].length; j++) {
                let temp = coords[0][j][1];
                coords[0][j][1] = coords[0][j][0];
                coords[0][j][0] = temp;
              }


              let nme = data.properties.Name;
              let frNme = data.properties.FrenchName;
              let desc = data.properties.description;
              let frDesc = data.properties.FrenchDescription;
              let clr = data.properties.color;
              let key = data.id;
              let ill_poly ;
               if (!isNaN((coords[0][0][0]) && !isNaN((coords[0][0][1]))) ){
                
              	if(this.layer === "Territories"){
              		ill_poly = L.polygon(coords, {color: clr}).bindPopup("<strong>Name : </strong>" + nme + "<br><strong>Description: </strong> <a href=" + desc + ">Native Lands - " + nme + "</a><br><i>From the <a href='https://github.com/publiclab/leaflet-environmental-layers/pull/77'>Indigenous Territories Inventory</a> (<a href='https://publiclab.org/notes/sagarpreet/06-06-2018/leaflet-environmental-layer-library?_=1528283515'>info<a>)</i>") ;
              	}
                if(this.layer === "Languages") {
                    ill_poly = L.polygon(coords, {color: clr}).bindPopup("<strong>Name : </strong>" + nme + "<br><strong>Description: </strong> <a href=" + desc + ">Native Lands - " + nme + "</a><br><i>From the <a href='https://github.com/publiclab/leaflet-environmental-layers/pull/76'>Indigenous Languages Inventory</a> (<a href='https://publiclab.org/notes/sagarpreet/06-06-2018/leaflet-environmental-layer-library?_=1528283515'>info<a>)</i>") ;
                }
                if(this.layer === "Treaties"){ 
                 	ill_poly = L.polygon(coords, {color: clr}).bindPopup("<strong>Name : </strong>" + nme + "<br><strong>Description: </strong> <a href=" + desc + ">Native Lands - " + nme + "</a><br><i>From the <a href='https://github.com/publiclab/leaflet-environmental-layers/pull/78'>Indigenous Treaties Inventory</a> (<a href='https://publiclab.org/notes/sagarpreet/06-06-2018/leaflet-environmental-layer-library?_=1528283515'>info<a>)</i>") ;
                }

              }
            return ill_poly ;
        },

        addPoly: data => {
            let poly = this.getPoly(data), key = data.id ;

            if (!this._layers[key]) {
                this._layers[key] = poly;
                this.addLayer(poly);

            }
        },

        parseData: data => {

        if (!!data){
           for (let i = 0 ; i < data.length ; i++) {

            this.addPoly(data[i]) ;

           }
             if (this.options.clearOutsideBounds) {
                this.clearOutsideBounds();
            }
          }
        },

        clearOutsideBounds: () => {
            let bounds = this._map.getBounds(),
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

L.layerGroup.indigenousLayers = (name,options) => new L.LayerGroup.IndigenousLayers(name,options);
