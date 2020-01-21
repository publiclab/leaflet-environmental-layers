/*** Mock Google Maps JavaScript API ***/
// This and the geocoder spy are all that is required for LBLD
// a larger mock exists in LBL if it is necessary later
var google = {
    maps: {
      Geocoder: function(stringObj, functionToDo) {
        functionToDo = functionToDo || function() {};
        functionToDo(response.results, "OK");
      },
    }
  };