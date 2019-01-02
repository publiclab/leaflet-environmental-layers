L.LayerGroup.OSMLandfillMineQuarryLayer = L.LayerGroup.extend(

    {
        options: {
            url: 'www.overpass-api.de/api/xapi?*[landuse=landfill][bbox=-119.89105224609376,34.1379517234964,-117.34634399414064,34.76192255039478]',
            clearOutsideBounds: false,
            minZoom: 7
        },

        initialize: function(options) {
            options = options || {};
            L.Util.setOptions(this, options);
            this._layers = {};
            this._nodes = {}; //Used to store position data for each node
            this._colorOptions = {
                landfill: "red",
                mine: "blue",
                quarry: "green"
            }; //Colors for each of the 3 usage types
        },

        onAdd: function(map) {
            map.on('moveend', this.requestData, this);
            this._map = map;
            this.requestData();

        },

        onRemove: function(map) {
            map.off('moveend', this.requestData, this);
            if(typeof map.spin === 'function'){
              map.spin(false);
            }
            this.clearLayers();
            this._layers = {};
        },

        requestData: function() {
            var self = this;
            (function() {
                var script = document.createElement("SCRIPT");
                script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js';
                script.type = 'text/javascript';
                var northeast = self._map.getBounds().getNorthEast(),
                    southwest = self._map.getBounds().getSouthWest();

                script.onload = function() {
                    var $ = window.jQuery;
                    var countLayers = 0;
                    for (var key in self._colorOptions) {
                        //Generate URL for each type
                        var LMQ_url = "http://www.overpass-api.de/api/xapi?*[landuse=" + key + "][bbox=" + (southwest.lng) + "," + (southwest.lat) + "," + (northeast.lng) + "," + (northeast.lat) + "]";
                        if(typeof self._map.spin === 'function'){
                          self._map.spin(true);
                        }
                        $.ajax({
                            url: LMQ_url,
                            dataType: "xml",
                            success: function(data) {
                                self.parseData(data);
                                if(typeof self._map.spin === 'function'){
                                  self._map.spin(false);
                                }
                            }
                        });
                        /* The structure of the document is as follows:
                            <node id="node_id", lat="", lon="">
                            . Rest of nodes here
                            .
                            <way id="">
                                <nd ref="node_id">
                                . Rest of nodes here, with the node_id defined beforehand
                                .
                                <tag k="key", v="value">
                                . Each object has different keys so it is hard to create a uniform popup
                                .
                            .. More ways
                        */
                    }
                };
                document.getElementsByTagName("head")[0].appendChild(script);
            })();


        },

        getPolygon: function(selector) {
            var latlngs = [];
            var self = this;

            var id = $(selector).attr('id');
            $(selector).find('nd').each(function() {
                if (self._nodes[$(this).attr('ref')]) { //Find the coordinates based on the node id
                    var coords = self._nodes[$(this).attr('ref')];
                    latlngs.push([coords.lat, coords.lng]); //Add node coordinates
                } else {
                    console.log("ERROR: COULDN'T FIND THE NODE ID");
                }
            });
            var LSMPoly;
            LSMPoly = L.polygon(latlngs, {
                color: self._colorOptions[$(selector).find('tag[k="landuse"]').attr('v')] //Selects color based on the value for the landuse key
            }).bindPopup(self.getPopupContent(selector));

            return LSMPoly;
        },

        getPopupContent: function(selector) {
            var content = '';
            //Add each key value pair found
            $(selector).find('tag').each(function() {
                var key = $(this).attr('k');
                var val = $(this).attr('v');
                if (key === 'landuse') val = val.charAt(0).toUpperCase() + val.slice(1); //Capitalize first letter of the landuse
                key = key.charAt(0).toUpperCase() + key.slice(1); //Capitalize first letter
                content += "<strong>" + key + ": </strong>" + val + "<br>";
            });
            content += "<hr>The data included in this layer is from www.openstreetmap.org. The data is made available under ODbL.<br>";
            content += "From the <a href=https://github.com/publiclab/leaflet-environmental-layers/pull/94>OSM LMQ Inventory</a> (<a href = https://publiclab.org/notes/sagarpreet/06-06-2018/leaflet-environmental-layer-library?_=1528283515>info</a>).";
            return content;
        },

        addPolygon: function(selector) {
            var key = $(selector).attr('id'); //Use the id for the way as the key
            if (!this._layers[key]) {
                var poly = this.getPolygon(selector, key);
                this._layers[key] = poly;
                this.addLayer(poly);
            }
        },

        parseData: function(data) {
            var self = this;

            (function() {
                //Create the map of nodes
                $(data).find('node').each(function() {
                    var id = $(this).attr('id'); //Use id as the key
                    var nodeLat = $(this).attr('lat');
                    var nodeLng = $(this).attr('lon');

                    if (!self._nodes[id]) {
                        self._nodes[id] = { //Set value as lat, lng pair provided key doesn't exist
                            lat: nodeLat,
                            lng: nodeLng
                        };
                    }

                });
            })();

            (function() {
                $(data).find('way').each(function() { //Add for each way
                    self.addPolygon(this);
                })
            })();

            if (this.options.clearOutsideBounds) {
               this.clearOutsideBounds();
            }
        },

        clearOutsideBounds: function() {
            var bounds = this._map.getBounds(),
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


L.layerGroup.osmLandfillMineQuarryLayer = function(options) {
    return new L.LayerGroup.OSMLandfillMineQuarryLayer(options);
};
