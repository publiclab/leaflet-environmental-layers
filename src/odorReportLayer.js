require('jquery') ; 
require('leaflet') ; 



L.Icon.OdorReportIcon = L.Icon.extend({
    options: {
      iconUrl: 'https://www.clker.com/cliparts/T/3/6/T/S/8/ink-splash-md.png',
      iconSize:     [30, 20], 
      iconAnchor:   [20 , 0], 
      popupAnchor:  [-5, -5] 
});

L.icon.odorReportIcon = function () {
    return new L.Icon.OdorReportIcon();
};


L.LayerGroup.OdorReportLayer = L.LayerGroup.extend(
    {
        
    }
);

L.layerGroup.odorReportLayer = function (options) {
    return new L.LayerGroup.OdorReportLayer(options);
};
