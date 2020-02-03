L.LayerGroup.OSMLandfillMineQuarryLayer = L.LayerGroup.extend(

  {
    options: {
      url: 'www.overpass-api.de/api/xapi?*[landuse=landfill][bbox=-119.89105224609376,34.1379517234964,-117.34634399414064,34.76192255039478]',
      clearOutsideBounds: false,
    },

    initialize: function(options) {
      options = options || {};
      L.Util.setOptions(this, options);
      this._layers = {};
      this._nodes = {}; // Used to store position data for each node
      this._colorOptions = {
        landfill: 'red',
        mine: 'blue',
        quarry: 'green',
      }; // Colors for each of the 3 usage types
    },

    onAdd: function(map) {
      map.on('moveend', this.requestData, this);
      this._map = map;
      this.requestData();
    },

    onRemove: function(map) {
      map.off('moveend', this.requestData, this);
      if (self._map && typeof self._map.spin === 'function') {
        self._map.spin(false);
      } else {
        map.spin(false);
      }
      this.clearLayers();
      this._layers = {};
    },

    requestData: function() {
      var self = this;
      var info = require('./info.json');
      (function() {

        var request = new XMLHttpRequest();
        
        var northeast = self._map.getBounds().getNorthEast();
        var southwest = self._map.getBounds().getSouthWest();

        var currentMapZoom = self._map.getZoom();
        if (currentMapZoom < info.OSMLandfillMineQuarryLayer.extents.minZoom) {
          return;
        }
        for (var key in self._colorOptions) {
        // Generate URL for each type
          var LMQ_url = info.OSMLandfillMineQuarryLayer.api_url + '?*[landuse=' + key + '][bbox=' + (southwest.lng) + ',' + (southwest.lat) + ',' + (northeast.lng) + ',' + (northeast.lat) + ']';
          request.open('GET', LMQ_url, true);
          if (typeof self._map.spin === 'function') {
            self._map.spin(true);
          }

          request.onload = function() {     
            if (this.status >= 200 && this.status < 400) {
              // Success!
              var data = request.responseXML;
              self.parseData(data);
              if (self._map && typeof self._map.spin === 'function') {
                self._map.spin(false);
              } else {
                map.spin(false);
              }
            } else {
              // We reached our target server, but it returned an error
              console.log('server error')
              if (self._map && typeof self._map.spin === 'function') {
                self._map.spin(false);
              } else {
                map.spin(false);
              }
            }
          };
          request.onerror = function() {
            // There was a connection error of some sort
            console.log('Something went wrong')
            if (self._map && typeof self._map.spin === 'function') {
              self._map.spin(false);
            } else {
              map.spin(false);
            }
          };
          request.send();
          /* The structure of the response document is as follows:
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
      })();
    },

    getPolygon: function(selector) {
      var latlngs = [];
      var self = this;

      var nds = selector.querySelectorAll('nd');
      [].forEach.call(nds, function(nd) {
        if (self._nodes[nd.getAttribute('ref')]) { // Find the coordinates based on the node id
          var coords = self._nodes[nd.getAttribute('ref')];
          latlngs.push([coords.lat, coords.lng]); // Add node coordinates
        } else {
          console.log('ERROR: COULDN\'T FIND THE NODE ID');
        }
      });
      var LSMPoly;
      LSMPoly = L.polygon(latlngs, {
        color: self._colorOptions[selector.querySelector('tag[k="landuse"]').getAttribute('v')], // Selects color based on the value for the landuse key
      }).bindPopup(self.getPopupContent(selector));

      return LSMPoly;
    },

    getPopupContent: function(selector) {
      var content = '';
      // Add each key value pair found
      var tags = selector.querySelectorAll('tag');
      [].forEach.call(tags, function(tag) {
        var key = tag.getAttribute('k');
        var val = tag.getAttribute('v');
        if (key === 'landuse') val = val.charAt(0).toUpperCase() + val.slice(1); // Capitalize first letter of the landuse
        key = key.charAt(0).toUpperCase() + key.slice(1); // Capitalize first letter
        // Check if the value is a link
        if (/^((http|https|ftp):\/\/)/.test(val)) {
          content += '<strong>' + key + ': </strong><a href=\'' + val + '\' target=\'_blank\'>' + val + '</a><br>';
        }
        else {
          content += '<strong>' + key + ': </strong>' + val + '<br>';
        }
      });
      content += '<hr>The data included in this layer is from www.openstreetmap.org. The data is made available under ODbL.<br>';
      content += 'From the <a href=https://github.com/publiclab/leaflet-environmental-layers/pull/94>OSM LMQ Inventory</a> (<a href = https://publiclab.org/notes/sagarpreet/06-06-2018/leaflet-environmental-layer-library?_=1528283515>info</a>).';
      return content;
    },

    addPolygon: function(selector) {
      var key = selector.getAttribute('id'); // Use the id for the way as the key
      if (!this._layers[key]) {
        var poly = this.getPolygon(selector, key);
        this._layers[key] = poly;
        this.addLayer(poly);
      }
    },

    parseData: function(data) {
      var self = this;
      if (self._map && typeof self._map.spin === 'function') {
        self._map.spin(false);
      } else {
        map.spin(false);
      }
      (function() {
        // Create the map of nodes
        var nodes = data.querySelectorAll('node');
        [].forEach.call(nodes, function(node) {
          var id = node.getAttribute('id'); // Use id as the key
          var nodeLat = node.getAttribute('lat');
          var nodeLng = node.getAttribute('lon');

          if (!self._nodes[id]) {
            self._nodes[id] = { // Set value as lat, lng pair provided key doesn't exist
              lat: nodeLat,
              lng: nodeLng,
            };
          }
        });
      })();

      (function() {
        var ways = data.querySelectorAll('way');
        [].forEach.call(ways, function(way) { // Add for each way
          self.addPolygon(way);
        });
      })();

      if (this.options.clearOutsideBounds) {
        this.clearOutsideBounds();
      }
    },

    clearOutsideBounds: function() {
      var bounds = this._map.getBounds();
      var polyBounds;
      var key;

      for (key in this._layers) {
        if (this._layers.hasOwnProperty(key)) {
          polyBounds = this._layers[key].getBounds();

          if (!bounds.intersects(polyBounds)) {
            this.removeLayer(this._layers[key]);
            delete this._layers[key];
          }
        }
      }
    },
  },
);


L.layerGroup.osmLandfillMineQuarryLayer = function(options) {
  return new L.LayerGroup.OSMLandfillMineQuarryLayer(options);
};
