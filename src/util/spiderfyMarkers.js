omsUtil = function (map, options) {
    var oms = new OverlappingMarkerSpiderfier(map);

    oms.addListener('click', function(marker) {
        map.openPopup();
    });

    oms.addListener('spiderfy', function(markers) {
        map.closePopup();
    });

    console.log('util working');
    return oms;
}