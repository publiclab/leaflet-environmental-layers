module.exports = function Interface (options) {

    options.latId = options.latId || 'lat';
    options.lngId = options.lngId || 'lng';
    options.placenameInputId = options.placenameInputId || 'placenameInput'; // the placename as input by the user
    options.placenameDisplayId = options.placenameDisplayId || 'placenameDisplay'; // the placename as will be stored/displaye

    function panMapWhenInputsChange() {
      var lat = document.getElementById(options.latId);
      var lng = document.getElementById(options.lngId);

      function panIfValue() {
        if(lat.value && lng.value) {
          options.panMap(lat.value, lng.value);
        };
      }

      $(lat).change(panIfValue);
      $(lng).change(panIfValue);
  }

  panMapWhenInputsChange();


  options.onDrag = options.onDrag || function onDrag() {
    function onPlacenameReturned(result) {
      $("#"+options.placenameDisplayId).val(result);
    }

      options.getPlacenameFromCoordinates(options.getLat(), options.getLon(), options.getPrecision(), onPlacenameReturned);
  }


  options.map.on('move', options.onDrag);
  options.map.on('zoom', options.onDrag);

  function updateLatLngInputListeners() {
    if (options.isBlurred()){
      $("#"+options.latId).val(options.getLat().toFixed(Math.max(0,options.getPrecision())));
      $("#"+options.lngId).val(options.getLon().toFixed(Math.max(0,options.getPrecision())));
    }
    else {
      $("#"+options.latId).val(options.getLat().toFixed(options.DEFAULT_PRECISION));
      $("#"+options.lngId).val(options.getLon().toFixed(options.DEFAULT_PRECISION));      
    }
  };

  function enableLatLngInputTruncate() {
    options.map.on('moveend', updateLatLngInputListeners);
  };

  function disableLatLngInputTruncate() {
    options.map.off('moveend', updateLatLngInputListeners);
  };

  enableLatLngInputTruncate()

  return {
    panMapWhenInputsChange: panMapWhenInputsChange,
    onDrag: options.onDrag,
    updateLatLngInputListeners: updateLatLngInputListeners,
    disableLatLngInputTruncate: disableLatLngInputTruncate,
    enableLatLngInputTruncate: enableLatLngInputTruncate,
  }

}
