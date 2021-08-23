module.exports = function Interface (options) {

    options.latId = options.latId || 'lat';
    options.lngId = options.lngId || 'lng';
    options.placenameInputId = options.placenameInputId || 'placenameInput'; // the placename input box id
    options.placenameDisplayId = options.placenameDisplayId || 'placenameDisplay'; // the placename display box id

    // what will be shown in placenameDisplay when google api call has an error
    // test this way because a blank string is a valid option
    options.placenameDisplayOnError = ("placenameDisplayOnError" in options) ? options.placenameDisplayOnError : 'Location unavailable';

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
      result = (result) ? result : options.placenameDisplayOnError; // this makes jasmine pass, other formats don't
      $("#"+options.placenameDisplayId).val(result.trim());
    }

    var preventOverwrite = $("#"+options.placenameDisplayId).attr('data-preventOverwrite') || "false";
    if(preventOverwrite.toLowerCase() !== ("true" || "1")) {
      options.getPlacenameFromCoordinates(options.getLat(), options.getLon(), options.getPrecision(), onPlacenameReturned);
    }
  }

  options.onDrag(); // trigger on load
  options.map.on('moveend', options.onDrag);
  options.map.on('zoomend', options.onDrag);

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
