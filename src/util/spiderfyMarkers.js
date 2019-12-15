omsUtil = function(map, options) {
  var oms = new OverlappingMarkerSpiderfier(map, options);

  var popup;
  oms.addListener('click', function(marker) {
    popup = marker.getPopup();
    map.openPopup(popup);
  });

  oms.addListener('spiderfy', function(markers) {
    map.closePopup();
  });

  return oms;
};
