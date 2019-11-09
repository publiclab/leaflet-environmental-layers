L.LayerGroup.environmentalLayers = L.LayerGroup.extend(

    {
        options: {
        	hash: false,
        	embed: false, // activates layers on map by default if true.
        	 // Source of Truth of Layers name .
        	 // please put name of Layers carefully in the the appropriate layer group.
		    layers0: ["purpleLayer","toxicReleaseLayer","pfasLayer","aqicnLayer","osmLandfillMineQuarryLayer", "Unearthing"],
		    layers1: ["purpleairmarker","skytruth","fractracker","odorreport","mapknitter","openaq","luftdaten","opensense"],
	        layers2: ["Power","Petroleum","Telecom","Water"],
	        layers3: ["wisconsin","fracTrackerMobile"],
	        layers4: ["income","americanIndian","asian","black","multi","hispanic","nonWhite","white","plurality"],
	        layers5: ["clouds","cloudsClassic","precipitation","precipitationClassic","rain","rainClassic","snow","pressure","pressureContour","temperature","wind","city"],
       		layers6: ["eonetFiresLayer"],

		    OpenInfraMap_Power: L.tileLayer('https://tiles-{s}.openinframap.org/power/{z}/{x}/{y}.png',{
		        maxZoom: 18,
		        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://www.openinframap.org/about.html">About OpenInfraMap</a>'
		    }),
		    OpenInfraMap_Petroleum: L.tileLayer('https://tiles-{s}.openinframap.org/petroleum/{z}/{x}/{y}.png', {
		      maxZoom: 18,
		      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://www.openinframap.org/about.html">About OpenInfraMap</a>'
		    }),
		    OpenInfraMap_Telecom: L.tileLayer('https://tiles-{s}.openinframap.org/telecoms/{z}/{x}/{y}.png', {
		      maxZoom: 18,
		      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://www.openinframap.org/about.html">About OpenInfraMap</a>'
		    }),
		    OpenInfraMap_Water: L.tileLayer('https://tiles-{s}.openinframap.org/water/{z}/{x}/{y}.png',{
		      maxZoom: 18,
		      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://www.openinframap.org/about.html">About OpenInfraMap</a>'
		    }),
        },

        initialize: function (param) {
        	param = param || {};
        	if(!!param.hash) {
        		this.options.hash = param.hash;
        	}
        	param.all =  [...this.options.layers0 , ...this.options.layers1 , ...this.options.layers2 , ...this.options.layers3 , ...this.options.layers4 , ...this.options.layers5 , ...this.options.layers6];
        	if(!param.include || !param.include.length) {
        		param.include = param.all;
        	}
        	if(!!param.exclude && param.exclude.length > 0) {
        		param.include =param.include.filter(function (a) {
       			 return param.exclude.indexOf(a) == -1;
    			});	
        	}
            
            this.options.layers = param;

            if(!!param.embed) {
            	this.options.embed = param.embed;
            }
        },

        onAdd: function (map) {

            this._map = map ;
          
		    var baselayer = L.tileLayer(
		        "https://a.tiles.mapbox.com/v3/jywarren.map-lmrwb2em/{z}/{x}/{y}.png",
		        {
		          attribution:
		            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
		        }
		      );
		   
		    this.overlayMaps = {};
		    var baseMaps = {
		      "Grey-scale": baselayer ,
		    };

		    for(let layer of this.options.layers.include) {

		       if(this.options.layers0.includes(layer)) {
	               this.overlayMaps[layer] = window["L"]["layerGroup"][layer]();
	           }
	           else if(this.options.layers1.includes(layer)) {
	               this.overlayMaps[layer] = window["L"]["layerGroup"]["layerCode"](layer);
	           }
	           else if(this.options.layers2.includes(layer)){
	              switch(layer) {
	               	case "Power": 
	               	this.overlayMaps[layer] = this.options.OpenInfraMap_Power;
	               		break;
	               	case "Petroleum": 
	               	this.overlayMaps[layer] = this.options.OpenInfraMap_Petroleum;
	               		break;
	               	case "Telecom": 
	               	this.overlayMaps[layer] =  this.options.OpenInfraMap_Telecom;
	               		break;
	               	case "Water": 
	               	this.overlayMaps[layer] = this.options.OpenInfraMap_Water;
	               		break;
	              }
	           }
	           else if(this.options.layers3.includes(layer)) {
	               this.overlayMaps[layer] =  window[layer + "Layer"](map);
	           }
	           else if(this.options.layers4.includes(layer)){
	               this.overlayMaps[layer] = window["L"]["tileLayer"]["provider"]('JusticeMap.'+layer);
	           }
	           else if(this.options.layers5.includes(layer)) {
	               let obj = {};
	               if(layer === "clouds"){
	                   obj = {showLegend: true, opacity: 0.5};
	               }
	               if(layer === "city"){
	                   layer = "current";
	                   obj = {intervall: 15, minZoom: 3};
	               }
	               this.overlayMaps[layer] = window["L"]["OWM"][layer](obj);
	           } 
	           else if (this.options.layers6.includes(layer)) {
	           	   this.overlayMaps[layer] = window["L"]["geoJSON"][layer]();
	           }
	           else {
	           	console.log("Incorrect Layer Name");
	           }

	           if(this.options.embed) {
	           		this.overlayMaps[layer].addTo(map);
	           }

	       }

           L.control.layers(baseMaps,this.overlayMaps).addTo(map);

		   if(this.options.hash)
		     var hash = new L.Hash(map, this.overlayMaps);
		          
        },

        onRemove: function (map) {},
    }
);


L.LayerGroup.EnvironmentalLayers = function (options) {
    return new L.LayerGroup.environmentalLayers(options) ;
};
