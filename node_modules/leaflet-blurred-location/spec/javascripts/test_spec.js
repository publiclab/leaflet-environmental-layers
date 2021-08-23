describe("Basic testing", function() {
  "use strict";

  var fixture;

  beforeAll(function() {
    window.google = undefined; // reset back to undefined after using mock in geocoding_spec
    fixture = loadFixtures('index.html');
  });

  it("Checks if getLat returns the correct latitude with correct precision", function () {
    blurredLocation.setZoom(13);
    expect(blurredLocation.getLat()).toBe(1.0);
    blurredLocation.setZoom(10);
    expect(blurredLocation.getLat()).toBe(1.0);
  });

  it("Checks if getLon returns the correct longitude with correct precision", function () {
    blurredLocation.setZoom(13);
    expect(blurredLocation.getLon()).toBe(10);
    blurredLocation.setZoom(10);
    expect(blurredLocation.getLon()).toBe(10);
  });

  it("Checks if goTo changes the map location to given parameters", function() {
    expect(blurredLocation.getLat()).toBe(1.0);
    expect(blurredLocation.getLon()).toBe(10);
    blurredLocation.goTo(51.50223, -0.09123213, 13);
    expect(blurredLocation.getLat()).toBe(51.50);
    expect(blurredLocation.getLon()).toBe(-0.09);
  });

  it("Checks if blurredLocation has a property named gridSystem", function() {
    expect(blurredLocation.hasOwnProperty("gridSystem")).toBe(true);
  });

  // it("Checks if cellSize changes with change in zoom", function() {
  //
  //   blurredLocation.setZoom(13);
  //
  //   expect(blurredLocation.gridSystem.getCellSize().rows).toBe(58.25);
  //   expect(blurredLocation.gridSystem.getCellSize().cols).toBe(94.63);
  //
  //   blurredLocation.setZoom(10);
  //
  //   expect(blurredLocation.gridSystem.getCellSize().rows).toBe(72.8);
  //   expect(blurredLocation.gridSystem.getCellSize().cols).toBe(118.3);
  //
  // });

  it("Checks if getPrecision works and changes on zoom", function() {
    blurredLocation.goTo(54.232, 45.324,13);
    expect(blurredLocation.getPrecision()).toBe(2);
    blurredLocation.goTo(blurredLocation.getLat(), blurredLocation.getLon(),10);
    expect(blurredLocation.getPrecision()).toBe(1);
  });

  it("Checks if getFullLat returns the full latitude of the map", function() {
    blurredLocation.goTo(45.324324234,-53.32423234234,13);
    expect(blurredLocation.getFullLat()).toBe(45.324324234);

    blurredLocation.setZoom(10);
    expect(blurredLocation.getFullLat()).not.toBe(blurredLocation.getLat());

  });

  it("Checks if getFullLon returns the full latitude of the map", function() {
    blurredLocation.goTo(45.324324234,-53.32423234234,13);
    expect(blurredLocation.getFullLon()).toBe(-53.32423234234);

    blurredLocation.setZoom(10);
    expect(blurredLocation.getFullLon()).not.toBe(blurredLocation.getLon());
  });

  it("Checks if setBlurred toggles the grid on and off", function() {
    blurredLocation.setBlurred(true);
    expect(blurredLocation.isBlurred()).toBe(true);
    blurredLocation.setBlurred(false);
    expect(blurredLocation.isBlurred()).toBe(false);
  });

  it("Checks if panMap changes the map's center to provided latitude and longitude", function() {
    blurredLocation.panMap(38.24, 34.55);
    expect(blurredLocation.getFullLat()).toBe(38.24);
    expect(blurredLocation.getFullLon()).toBe(34.55);
  });

  it("Checks if truncateToPrecision returns the correct output", function() {
    expect(blurredLocation.truncateToPrecision(56.21414,3)).toBe(56.214);
  });

  it("Checks if setZoomByPrecision pans the map to correct zoom", function() {
    blurredLocation.setZoomByPrecision(2);
    expect(blurredLocation.getZoom()).toBe(13);
    blurredLocation.setZoomByPrecision(1);
    expect(blurredLocation.getZoom()).toBe(10);
  });

  it("Checks if getZoomByPrecision returns the correct zoom", function() {
    expect(blurredLocation.getZoomByPrecision(2)).toBe(13);
    expect(blurredLocation.getZoomByPrecision(-1)).toBe(3);
  });
  
  it("Checks if getDistanceMetrics returns correct scale", function() {
    blurredLocation.setZoomByPrecision(2);
    expect(blurredLocation.getDistanceMetrics()).toBe(1.41);
  });

  // it("geocode spec", function() {
  //   var geometry = blurredLocation.geocode("Buenos Aires");
  //   console.log(blurredLocation.getLat());
  //   console.log(map.getCenter().lat);
  //   expect(blurredLocation.getLat()).toBe(-34.6036844);
  //   expect(blurredLocation.getLon()).toBe(-58.3815591);
  // });

  it("Checks if getZoom returns the correct zoom", function() {
    blurredLocation.setZoom(5);
    expect(blurredLocation.getZoom()).toBe(5);
  });

  it("Checks if getPrecisionFromNum returns the correct precision value", function() {
    expect(blurredLocation.getPrecisionFromNum(5.321)).toBe(3);
    expect(blurredLocation.getPrecisionFromNum(5)).toBe(0);
    expect(blurredLocation.getPrecisionFromNum(60)).toBe(-1);
  });

  it("Checks if getPrecisionFromCoordinates returns the highest precision", function() {
    expect(blurredLocation.getPrecisionFromCoordinates(5.321, 1.12)).toBe(3);
    expect(blurredLocation.getPrecisionFromCoordinates(5.32, 10.1)).toBe(2);
    expect(blurredLocation.getPrecisionFromCoordinates(50, 55)).toBe(0);
  });
  
  it("Checks if getZoomFromCoordinates returns the correct zoom", function() {
    expect(blurredLocation.getZoomFromCoordinates(5.321, 1.122)).toBe(16);
    expect(blurredLocation.getZoomFromCoordinates(5.32, 10.15)).toBe(13);
    expect(blurredLocation.getZoomFromCoordinates(51, 55)).toBe(6);
  });

});
