describe("Testing for PLpeopleLayer", function() {

  beforeEach(function () {
    loadFixtures('PLpeopleLayer.html');
  });

  it("Basic Test", function () {
    expect(true).toBe(true);
  });

  it("Checks if LBLD Heatmap is present", function () {
    // This calculates the number of rectangles in the grid which forms the heatmap .  
    expect($("#map").children()[0].childNodes[2].childNodes[1].childNodes[0].childNodes.length).toBeGreaterThan(10) ;
  });

  it("Checks if LBLD marker is present", function () {
    map.setView([23,77],5) ;
    // There should be atleast one people marker in the LBLD layer always .
    expect($("#map").children()[0].childNodes[3].childNodes.length).toBe(1) ;
  });

});
