/*global L*/

require('jquery') ; 
require('leaflet') ; 


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
            clearOutsideBounds: true ,      
        },
        
        initialize: function (options) {
            options = options || {};
            L.Util.setOptions(this, options);  
            this._layers = {};  
        },
    }

);


L.layerGroup.skyTruthLayer = function (options) {
    return new L.LayerGroup.SkyTruthLayer(options);
};
