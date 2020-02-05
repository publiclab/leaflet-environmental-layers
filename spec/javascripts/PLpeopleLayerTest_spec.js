describe("Testing for PLpeopleLayer", function() {

  beforeEach(function () {

    var mapContainer = document.createElement('div');
    mapContainer.setAttribute('id', 'map');
    var map = L.map(mapContainer).setView([23, 77], 3);
 
    var baselayer = L.tileLayer(
      "https://a.tiles.mapbox.com/v3/jywarren.map-lmrwb2em/{z}/{x}/{y}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }
    ).addTo(map);
  
    var PLpeople = L.layerGroup.PLpeople().addTo(map);

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
