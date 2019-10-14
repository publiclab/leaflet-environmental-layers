activeLayersBadge = function(map) {
    var touched = false;
    var activeOverlays = leafletControl.getActiveOverlayNames();
    var badge = L.control.badge(activeOverlays.length, { position: 'topright' }).addTo(map);

    map.on('layeradd', function(ev) {
        // Displays badge on page load
        $(badge.getContainer()).css("display", "block");
        if(touched) {
            $(badge.getContainer()).css("display", "none");
        }
    }); 

    map.on('overlayadd', function(ev) {
        this.removeControl(badge);
        $(badge.getContainer()).css("display", "none");
        activeOverlays = leafletControl.getActiveOverlayNames();
        badge = L.control.badge(activeOverlays.length, { position: 'topright' }).addTo(map);
        $(badge.getContainer()).css("display", "none");
    });

    map.on('overlayremove', function(ev) {
        this.removeControl(badge);
        activeOverlays = leafletControl.getActiveOverlayNames();
        badge = L.control.badge(activeOverlays.length, { position: 'topright' }).addTo(map);
        $(badge.getContainer()).css("display", "none");
    }); 

    L.DomEvent.on(leafletControl.getContainer(), 'mouseover', function (ev) {
        touched = true;
        $(badge.getContainer()).css("display", "none");
    });

    L.DomEvent.on(leafletControl.getContainer(), 'mouseout', function (ev) {
        touched = false;
        $(badge.getContainer()).css("display", "block");
    });
    
    return badge;
}