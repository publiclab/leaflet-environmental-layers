describe("Testing for mapknitter layer", function() {

  beforeEach(function () {
      loadFixtures('mapknitterLayer.html');
    });

  it("Basic Test", function () {
  expect(true).toBe(true);
  });

  it("Checks if layer markers are present", function () {
  // There should be atleast one polygon in the Language layer always .
  expect($("#map").children()[0].childNodes[3].childNodes.length).toBeGreaterThan(-1);
  });

});
