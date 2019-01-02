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

L.LayerGroup.SkyTruthLayer = L.LayerGroup.extend(
  {
    options: {
      url: 'https://alerts.skytruth.org/json?n=100',
      popupOnMouseover: false,
      clearOutsideBounds: false ,
    },
    initialize: function (options) {
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
      this._layers = {};
    },
    requestData: function () {
      var self = this;
      (function() {
        var script = document.createElement("SCRIPT");
        script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js';
        script.type = 'text/javascript';
        var zoom = self._map.getZoom(), northeast = self._map.getBounds().getNorthEast() , southwest = self._map.getBounds().getSouthWest() ;
        script.onload = function() {
        var $ = window.jQuery;
        var SkyTruth_url = "https://alerts.skytruth.org/json?n=100&l="+(southwest.lat)+","+(southwest.lng)+","+(northeast.lat)+","+(northeast.lng) ;
        if(typeof self._map.spin === 'function'){
          self._map.spin(true) ;
        }
        $.getJSON(SkyTruth_url , function(data){
          self.parseData(data) ;
          if(typeof self._map.spin === 'function'){
            self._map.spin(false) ;
          }
        });
        };
      document.getElementsByTagName("head")[0].appendChild(script);
      })();
    },
    getMarker: function (data) {
      var redDotIcon =new L.icon.skyTruthIcon();
      var lat = data.lat ;
      var lng = data.lng;
      var title = data.title ;
      var url = data.link ;
      var skymarker ;
      if (!isNaN(lat) && !isNaN(lng) ){
        skymarker = L.marker([lat , lng] , {icon: redDotIcon}).bindPopup("<a href="+url+">" +title + "</a><br>" + "<br><strong> lat: " + lat + "</strong><br><strong> lon: " + lng + "</strong> <br><br>Data provided by <a href='http://alerts.skytruth.org/'>alerts.skytruth.org/</a>") ;
      }
      return skymarker;
    },
    addMarker: function (data) {
      var marker = this.getMarker(data),
      key = data.id;
      if (!this._layers[key]) {
        this._layers[key] = marker;
        this.addLayer(marker);
      }
    },
    parseData: function (data) {
      if (!!data.feed){
        for (i = 0 ; i < data.feed.length ; i++) {
          this.addMarker(data.feed[i]) ;
        }
        if (this.options.clearOutsideBounds) {
          this.clearOutsideBounds();
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

L.layerGroup.skyTruthLayer = function (options) {
  return new L.LayerGroup.SkyTruthLayer(options);
};
