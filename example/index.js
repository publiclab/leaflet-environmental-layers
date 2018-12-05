$(window).one('load', function() {
    var layerSelected = false;
    $('.leaflet-control-layers-overlays input').each(function() {
        if ($(this).prop("checked") === true) {
            layerSelected = true;
            return;
        }
    });

    if (!layerSelected) {
        leafletControl.expand();
        $('body').append($('<div class="popup" id="baseMaps" style="top: 20px">'));
        $('#baseMaps').html("Change the base layer by selecting it here:");

        $('body').append($('<div class="popup" id="overlays" style="top: 200px">'));
        $('#overlays').html("Add overlays by selecting them here:");
        $('#overlays').append($('<img src="https://raw.githubusercontent.com/kevinzluo/leaflet-environmental-layers/assets/selecting.gif">'));
        $('#overlays.popup, #baseMaps.popup').append($('<div class="popup-close">').html("&times;"));

        $('.leaflet-control-layers').one('mouseleave click', function() {
            $('.popup').addClass('hide');
        });

        $('.popup-close').on('click', function(e) {
            $(e.target).parent().addClass('hide');;
        });
    }


});
