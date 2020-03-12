describe("UI testing", function() {
  "use strict";

  it("Checks if input listeners change maps position to the entered latitude and longitude", function() {
    var fixture = loadFixtures('index.html');

    var latEl = $("#lat");
    var lngEl = $("#lng");

    latEl.val(20);
    lngEl.val(15);

    expect(parseFloat(latEl.val())).toBe(20);
    expect(parseFloat(lngEl.val())).toBe(15);

    latEl.change();

    expect(blurredLocation.getLat()).toBe(20);
    expect(blurredLocation.getLon()).toBe(15);

    latEl.val(2);
    lngEl.val(23);

    latEl.change();

    expect(blurredLocation.getLat()).toBe(2);
    expect(blurredLocation.getLon()).toBe(23);
  });

  it("Checks if panning map changes fields in the UI section", function() {
    var fixture = loadFixtures('index.html');

    var latEl = $("#lat");
    var lngEl = $("#lng");
    blurredLocation.map.panTo(new L.LatLng(40.737, -73.923));
    blurredLocation.setZoomByPrecision(2);

    expect(parseFloat(latEl.val())).toBe(40.73);
    expect(parseFloat(lngEl.val())).toBe(-73.92);
  });

  it("Checks if precision changes when location is unblurred or blurred", function() {
    var fixture = loadFixtures('index.html');

    var latEl = $("#lat");
    var lngEl = $("#lng");
    
    blurredLocation.map.panTo(new L.LatLng(40.737232, -73.923232));
    blurredLocation.setZoomByPrecision(2);    
    blurredLocation.setBlurred(false);

    expect(parseFloat(latEl.val())).toBe(40.737232);
    expect(parseFloat(lngEl.val())).toBe(-73.923232);

    blurredLocation.setBlurred(true);

    expect(parseFloat(latEl.val())).toBe(40.73);
    expect(parseFloat(lngEl.val())).toBe(-73.92);
  });

  it("Checks scale listener output the correct scale of the boxes", function() {
    var fixture = loadFixtures('index.html');

    blurredLocation.setZoomByPrecision(2);
    var scale = blurredLocation.getDistanceMetrics()

    expect(scale).toBe(1.57);

    blurredLocation.setZoomByPrecision(3);

    var scale = blurredLocation.getDistanceMetrics()
    expect(scale).toBe(0.15);
  });

  it("Checks blurry scale listener output the correct scale of the boxes", function() {
    var fixture = loadFixtures('index.html');

    blurredLocation.setZoomByPrecision(2);
    var rural = blurredLocation.getBlurryScale("rural")
    var urban = blurredLocation.getBlurryScale("urban")

    expect(rural).toBe("town");
    expect(urban).toBe("district");

    blurredLocation.setZoomByPrecision(2);
    
    rural = blurredLocation.getBlurryScale("rural")
    urban = blurredLocation.getBlurryScale("urban")

    expect(rural).toBe("town");
    expect(urban).toBe("district");
  });

});
