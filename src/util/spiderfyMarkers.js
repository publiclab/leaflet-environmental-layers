omsUtil = function (map, options) {
    var oms = new OverlappingMarkerSpiderfier(map);

    var popup = new L.Popup();
    oms.addListener('click', function(marker) {
        popup.setContent(marker._popup._content);
        popup.setLatLng(marker.getLatLng());
        map.openPopup(popup);
    });

    oms.addListener('spiderfy', function(markers) {
        map.closePopup();
    });

    console.log('util working');
    return oms;
}