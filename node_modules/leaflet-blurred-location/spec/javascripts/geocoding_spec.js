describe("Geocoding testing", function() {
  "use strict";
  
  beforeAll(function() {
    setUpGoogleMock();
    createGeocoder();
  });

  beforeEach(function() {
    var fixture = loadFixtures('index.html');
  });

  it("Checks if getPlacenameFromCoordinates returns country name for location precision 0", function() {
    geocoder.geocode.and.callFake(function(request, callback) {
        callback(response.results, google.maps.GeocoderStatus.OK);
    });

    var string = '';
    blurredLocation.getPlacenameFromCoordinates(42, 11, 0, function(result){
      string = result.trim();
    });
    expect(string).toBe('USA');
  });

  it("Checks if getPlacenameFromCoordinates returns full address for location precision 2", function() {
    geocoder.geocode.and.callFake(function(request, callback) {
        callback(response.results, google.maps.GeocoderStatus.OK);
    });

    var string = '';
    blurredLocation.getPlacenameFromCoordinates(42.52, 11.41, 2, function(result){
      string = result.trim();
    });
    expect(string).toBe('Winnetka, IL, USA');
  });

  it("Checks if geocodeStringAndPan recenters the map correctly", function() {
    geocoder.geocode.and.callFake(function(request, callback) {
        callback(response.results, google.maps.GeocoderStatus.OK);
    });

    blurredLocation.geocodeStringAndPan("123 address");
    expect(blurredLocation.getLat()).toBe(25.0);
    expect(blurredLocation.getLon()).toBe(17.0);
  });

});
