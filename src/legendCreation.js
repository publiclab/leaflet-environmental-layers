$(window).one('load', function() {
  function getLayerKey(overlayObject) {
    return Object.keys(overlayMaps).find((key) => overlayMaps[key] === overlayObject);
  }
  function addLayerNameURLPair(layerObj, url) {
    legendPairs[getLayerKey(layerObj)] = url;
  }
  var legendPairs = {}; // key: layer name from overlayMaps; val: url for legend;

  // Add any legend using addLayerNameURLPair(layer_var, img_url);
  addLayerNameURLPair(Justicemap_income, 'https://raw.githubusercontent.com/kevinzluo/leaflet-environmental-layers/assets/JMImages/JMIncome.png');
  addLayerNameURLPair(JusticeMap_americanIndian, 'https://raw.githubusercontent.com/kevinzluo/leaflet-environmental-layers/assets/JMImages/JMAmericanIndian.png');
  addLayerNameURLPair(JusticeMap_asian, 'https://raw.githubusercontent.com/kevinzluo/leaflet-environmental-layers/assets/JMImages/JMAsian.png');
  addLayerNameURLPair(JusticeMap_black, 'https://raw.githubusercontent.com/kevinzluo/leaflet-environmental-layers/assets/JMImages/JMBlack.png');
  addLayerNameURLPair(JusticeMap_multi, 'https://raw.githubusercontent.com/kevinzluo/leaflet-environmental-layers/assets/JMImages/JMMultiRacial.png');
  addLayerNameURLPair(JusticeMap_hispanic, 'https://raw.githubusercontent.com/kevinzluo/leaflet-environmental-layers/assets/JMImages/JMHispanic.png');
  addLayerNameURLPair(JusticeMap_nonWhite, 'https://raw.githubusercontent.com/kevinzluo/leaflet-environmental-layers/assets/JMImages/JMNonWhite.png');
  addLayerNameURLPair(JusticeMap_white, 'https://raw.githubusercontent.com/kevinzluo/leaflet-environmental-layers/assets/JMImages/JMWhite.png');
  addLayerNameURLPair(JusticeMap_plurality, 'https://raw.githubusercontent.com/kevinzluo/leaflet-environmental-layers/assets/JMImages/JMPlurality.png');

  // create the legend control
  var legendControl = L.control.legendControl();
  legendControl.addTo(map);

  // Add for any layers that are already present on map load
  var activeLayers = leafletControl.getActiveOverlayNames();
  for (var i = 0; i < activeLayers.length; i++) {
    var layerName = activeLayers[i];
    if (legendPairs[layerName]) legendControl.addLegend(legendPairs[layerName]);
  }

  // Add whenever new layers are added
  map.on('overlayadd', function(eventLayer) {
    var layerName = eventLayer.name;
    if (legendPairs[layerName]) legendControl.addLegend(legendPairs[layerName]);
  });

  // remove upon layer removal;
  map.on('overlayremove', function(eventLayer) {
    var layerName = eventLayer.name;
    if (legendPairs[layerName]) legendControl.removeLegend(legendPairs[layerName]);
  });
});
