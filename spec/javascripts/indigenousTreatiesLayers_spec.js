describe("Testing for indigenous Treaties layer", function() {

  beforeEach(function () {
      loadFixtures('indigenousTreatiesLayer.html');
    });

  it("Basic Test", function () {
  expect(true).toBe(true);
  });

  it("Checks if layer polygons are present", function () {
  // There should be atleast one polygon in the Treaties layer always .
  expect($("#map").children()[0].childNodes[2].childNodes[0].childNodes[0].length).toBe(1) ;
  });

});
