/*global L*/

require('jquery') ; 
require('leaflet') ; 



L.Icon.SkyTruthIcon = L.Icon.extend({
    options: {
      iconUrl: 'https://www.clker.com/cliparts/T/G/b/7/r/A/red-dot.svg',
      iconSize:     [30, 20], // size of the icon
      iconAnchor:   [20 , 0], // point of the icon which will correspond to marker's location
      popupAnchor:  [-5, -5] // point from which the popup should open relative to the iconAnchor
    }
});

L.icon.skyTruthIcon = function () {
    return new L.Icon.SkyTruthIcon();
};


L.LayerGroup.SkyTruthLayer = L.LayerGroup.extend(

);

/*
    Creates a new SkyTruthLayerl layer.
*/
L.layerGroup.skyTruthLayer = function (options) {
    return new L.LayerGroup.SkyTruthLayer(options);
};
