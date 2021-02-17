describe("Testing for indigenous Language layer", function() {

  beforeEach(function () {
      loadFixtures('indigenousLanguagesLayers.html');
    });

  it("Basic Test", function () {
  expect(true).toBe(true);
  });

  it("Checks if layer polygons are present", function () {
  // There should be atleast one polygon in the Language layer always .
  expect($("#map").children()[0].childNodes[2].childNodes[0].childNodes[0].childNodes.length).toBeGreaterThan(0);
  });

});
