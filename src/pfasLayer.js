L.Icon.PfasLayerIcon = L.Icon.extend({
   options: {
    iconUrl: 'https://openclipart.org/image/300px/svg_to_png/117253/1297044906.png',
    iconSize:     [10, 10],
    iconAnchor:   [20 , 0],
    popupAnchor:  [-5, -5]
  }
});

L.icon.pfasLayerIcon = () => new L.Icon.PfasLayerIcon();


L.LayerGroup.PfasLayer = L.LayerGroup.extend(

    {
        options: {
            url: 'https://spreadsheets.google.com/feeds/list/1cjQ3H_DX-0dhVL5kMEesFEKaoJKLfC2wWAhokMnJxV4/1/public/values?alt=json',
        },

        initialize: options => {
            options = options || {};
            L.Util.setOptions(this, options);
            this._layers = {};
        },

        onAdd: map => {
            this._map = map;
            this.requestData();
        },

        onRemove: map => {
            this.clearLayers();
            if(typeof map.spin === 'function'){
              map.spin(false) ;
            }
            this._layers = {};
        },

        requestData: () => {
           let self = this;
                (() => {
                    let script = document.createElement("SCRIPT");
                    script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js';
                    script.type = 'text/javascript';

                    script.onload = () => {
                        let $ = window.jQuery;
                        let PFAS_URL = "https://spreadsheets.google.com/feeds/list/1cjQ3H_DX-0dhVL5kMEesFEKaoJKLfC2wWAhokMnJxV4/1/public/values?alt=json" ;
                        if(typeof self._map.spin === 'function'){
                          self._map.spin(true) ;
                        }
                        $.getJSON(PFAS_URL , data => {
                        self.parseData(data.feed.entry);
                        if(typeof self._map.spin === 'function'){
                          self._map.spin(false) ;
                        }
            		    });
                    };
                    document.getElementsByTagName("head")[0].appendChild(script);
                })();


        },

        getMarker: data => {
            let redDotIcon = new L.icon.pfasLayerIcon();
            //added the column names which are formatted here and called in the generatePopup function
            let props = ["contaminationsite", "natureofsources", "location", "pfoapfos","dateofdiscovery","suspectedcontaminationsource","suspectedsourceurl", "otherpfas", "reggovresponse", "litigationdetails", "latitude", "longitude"];
            let item = {};
            props.forEach(element => {
                item[element] = data["gsx$" + element]["$t"];
            });

            item["latitude"] = item["latitude"].replace(/[^\d.-]/g, "");
            item["latitude"] = item["latitude"].replace(/[^\d.-]/g, "");

            let pfasTracker;
            pfasTracker = L.marker([item["latitude"], item["longitude"]], {
                icon: redDotIcon
            }).bindPopup(this.generatePopup(item));

            return pfasTracker;
        },

        generatePopup: item => {
            let content = "<strong><center>" + item["contaminationsite"] + "</strong></center><hr /><br />";
            
            let regResponse = item["reggovresponse"];
            let regResponseTruncate = regResponse.split(" ").splice(0,30).join(" ");
            let litigation = item["litigationdetails"];
            let litigationTruncate = 
            litigation.split(" ").splice(0,30).join(" ");
            
            if(item["dateofdiscovery"]) content += "<strong> Date of Discovery:</strong> " + item["dateofdiscovery"] + '</span>' + "<br>";

            if(item["pfoapfos"]) content += "<strong>Contamination type: </strong>" + item["pfoapfos"] + "<br>";
            
            if(item["otherpfas"]) content += "<strong>Other contaminant: </strong>" + item["otherpfas"] + "<br>";
            
            if(item["suspectedcontaminationsource"]) content += "<strong>Suspected source:</strong> " + "<a href=" + item["suspectedsourceurl"] + ">" +     
            item["suspectedcontaminationsource"]+"</a>" + "<br>";
            
            if(item["natureofsources"]) content += "<strong>Nature of Sources:</strong> " + item["natureofsources"] + "<br>";
            
            if(item["reggovresponse"]) content += "<strong>Regulatory Response:</strong> " + "<a href='https://pfasproject.com/pfas-contamination-site-tracker/'> " + regResponseTruncate + " [...]</a><br>";
            
            if(item["litigationdetails"] == "No data") 
            {
                content += "<strong>Litigation:</strong> " + litigationTruncate + "<br><hr>";
            } else if (item["litigationdetails"] == "No Data"){
                content += "<strong>Litigation:</strong> " + litigationTruncate + "<br><hr>";
            } else{
                content += "<strong>Litigation:</strong> " + litigationTruncate + " <a href='https://pfasproject.com/pfas-contamination-site-tracker/'>[...]</a><br><hr>";
            }

            
            let generics = ["location"];

            for (let i = 0; i < generics.length; i++) {
                let key = generics[i];
                if (!!item[generics[i]]) {
                    let itemContent = item[generics[i]];
                    key = key.charAt(0).toUpperCase() + key.slice(1);
                    content += key + ": " + itemContent + "<br>";
                }
               
            }
            
            content += "<hr><i>Data provided by <a href='https://pfasproject.com/pfas-contamination-site-tracker/'>Source: Northeastern University - Social Science Environmental Health Research Institute</a></i>";
            return content;
        },

        addMarker: data => {
            //changed this to the value from my dataset
            //let key = data.gsx$name.$t; 
            let key = data.gsx$contaminationsite.$t;
            if (!this._layers[key]) {
                let marker = this.getMarker(data);
                this._layers[key] = marker;
                this.addLayer(marker);
            }
        },

        parseData: data => {
            for (i = 1 ; i < data.length ; i++) {
             this.addMarker(data[i]) ;
            }
        }
    }
);


L.layerGroup.pfasLayer = options => new L.LayerGroup.PfasLayer(options);


