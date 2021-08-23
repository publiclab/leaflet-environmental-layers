var window;
var response;
var geocoderSpy;
var geocoder;

function setUpGoogleMock() {

   response = {
   "results" : [
      {
         "address_components" : [
            {
               "long_name" : "Winnetka",
               "short_name" : "Winnetka",
               "types" : [ "locality", "political" ]
            },
            {
               "long_name" : "New Trier",
               "short_name" : "New Trier",
               "types" : [ "administrative_area_level_3", "political" ]
            },
            {
               "long_name" : "Cook County",
               "short_name" : "Cook County",
               "types" : [ "administrative_area_level_2", "political" ]
            },
            {
               "long_name" : "Illinois",
               "short_name" : "IL",
               "types" : [ "administrative_area_level_1", "political" ]
            },
            {
               "long_name" : "United States",
               "short_name" : "US",
               "types" : [ "country", "political" ]
            }
         ],
         "formatted_address" : "Winnetka, IL, USA",
         "geometry" : {
            "bounds" : {
               "northeast" : {
                  "lat" : 42.1282269,
                  "lng" : -87.7108162
               },
               "southwest" : {
                  "lat" : 42.0886089,
                  "lng" : -87.7708629
               }
            },
            "location" : {
               "lat" : function() { return 25.0 },
               "lng" : function() { return 17.0 }
            },
            "location_type" : "APPROXIMATE",
            "viewport" : {
               "northeast" : {
                  "lat" : 42.1282269,
                  "lng" : -87.7108162
               },
               "southwest" : {
                  "lat" : 42.0886089,
                  "lng" : -87.7708629
               }
            }
         },
         "place_id" : "ChIJW8Va5TnED4gRY91Ng47qy3Q",
         "types" : [ "locality", "political" ]
      }
   ],
   "status" : "OK"
   }

   /*** Mock Google Maps JavaScript API ***/
   window.google = {
   maps: {
      places: {
         AutocompleteService: function() {},
         PlacesServiceStatus: {
         INVALID_REQUEST: 'INVALID_REQUEST',
         NOT_FOUND: 'NOT_FOUND',
         OK: 'OK',
         OVER_QUERY_LIMIT: 'OVER_QUERY_LIMIT',
         REQUEST_DENIED: 'REQUEST_DENIED',
         UNKNOWN_ERROR: 'UNKNOWN_ERROR',
         ZERO_RESULTS: 'ZERO_RESULTS',
         }
      },
      Geocoder: function(stringObj, functionToDo) {
         functionToDo = functionToDo || function() {};
         functionToDo(response.results, "OK");
      },
      GeocoderStatus: {
         ERROR: 'ERROR',
         INVALID_REQUEST: 'INVALID_REQUEST',
         OK: 'OK',
         OVER_QUERY_LIMIT: 'OVER_QUERY_LIMIT',
         REQUEST_DENIED: 'REQUEST_DENIED',
         UNKNOWN_ERROR: 'UNKNOWN_ERROR',
         ZERO_RESULTS: 'ZERO_RESULTS',
      },
   }
   };

}

function createGeocoder() {
  geocoderSpy = spyOn(google.maps, 'Geocoder');
  geocoder = jasmine.createSpyObj('Geocoder', ['geocode']);
  geocoderSpy.and.returnValue(geocoder);
}