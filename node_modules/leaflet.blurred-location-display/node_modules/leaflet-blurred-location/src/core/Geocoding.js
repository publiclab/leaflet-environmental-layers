module.exports = function Geocoding(options) {

  var map = options.map || document.getElementById("map") || L.map('map');
  var google = window.google || undefined;
  var geocoder = google ? new google.maps.Geocoder() : undefined;

  function getPlacenameFromCoordinates(lat, lng, precision, onResponse) {
    if(geocoder) {
      geocoder.geocode( { 'location': {lat: lat, lng: lng}}, function(results, status) {
          if(status === "OK") {

            var country;
            var fullAddress = results[0].formatted_address.split(",");
            for (i in results) {
              if(results[i].types.indexOf("country") != -1) {
                //If the type of location is a country assign it to the input box value
                country = results[i].formatted_address;
              }
            }
            if (!country) country = fullAddress[fullAddress.length - 1];

            if(precision <= 0) onResponse(country);

            else if(precision == 1) {
              if (fullAddress.length>=2) onResponse(fullAddress[fullAddress.length - 2] + "," + country);
              else onResponse(country);
            }

            else if(precision >= 2) {
              if (fullAddress.length >= 3) onResponse(fullAddress[fullAddress.length - 3] + "," + fullAddress[fullAddress.length - 2] + "," + country);
              else if (fullAddress.length == 2) onResponse(fullAddress[fullAddress.length - 2] + "," + country);
              else onResponse(country);
            }

            else onResponse(results[0].formatted_address);
          } else {
            console.log("Geocode not successful: " + status);
            onResponse();
          }
      });
    } else {
      onResponse();
    }
  }

  function panMapByBrowserGeocode(checkbox) {
    var x = document.getElementById("location");
      if(checkbox.checked == true) {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(displayPosition);
        } else {
          x.innerHTML = "Geolocation is not supported by this browser.";
        }

        function displayPosition(position) {
          panMap(parseFloat(position.coords.latitude), parseFloat(position.coords.longitude));
        }
    }
  }

  function panMapToGeocodedLocation(selector) {
    
    var input = document.getElementById(selector);

    var autocomplete = new google.maps.places.Autocomplete(input);

    autocomplete.addListener('place_changed', function() {
      setTimeout(function () {
        var str = input.value;
        geocodeStringAndPan(str);
      }, 10);
    });

    $("#"+selector).keypress(function(e) {
      setTimeout(function () {
        if(e.which == 13) {
          var str = input.value;
          geocodeStringAndPan(str);
        }
      }, 10);
    });

  };

  function geocodeWithBrowser(success) {
    if(success) {
      var label = document.createElement("label");
      label.classList.add("spinner");
      var i = document.createElement("i");
      i.classList.add("fa");
      i.classList.add("fa-spinner");
      i.classList.add("fa-spin");
      label.appendChild(i);
      var element = document.getElementById(options.geocodeButtonId);
      element.appendChild(label);
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function(position) {
        options.goTo(position.coords.latitude, position.coords.longitude,options.zoom);
        i.classList.remove("fa") ;
        i.classList.remove("fa-spinner") ;
        i.classList.remove("fa-spin") ;
        }, function(error) {
          console.log(error);
        });
      }
    }
  }

  function geocodeStringAndPan(string, onComplete) {
    if(geocoder) {
      if(typeof map.spin == 'function'){
        map.spin(true) ;
      }

      onComplete = onComplete || function(results, status) {
        if(status === "OK") {
          var lat = results[0].geometry.location.lat();
          var lng = results[0].geometry.location.lng();
          $("#lat").val(lat);
          $("#lng").val(lng);
          map.setView([lat, lng], options.zoom);
        } else {
          console.log("Geocode not successful: " + status);
        }
        if(typeof map.spin == 'function'){
          map.spin(false) ;
        }
      }

      geocoder.geocode( { 'address': string }, onComplete);
    } else {
      onResponse();
    }
  }

  return {
    geocodeStringAndPan: geocodeStringAndPan,
    getPlacenameFromCoordinates: getPlacenameFromCoordinates,
    panMapByBrowserGeocode: panMapByBrowserGeocode,
    panMapToGeocodedLocation: panMapToGeocodedLocation,
    geocodeWithBrowser: geocodeWithBrowser
  }
}
