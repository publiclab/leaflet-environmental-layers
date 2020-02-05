describe('One Liner Implementation', function() {

  beforeEach(function () {
    
    var mapContainer = document.createElement('div');
    var map = L.map(mapContainer);
    var leafletControl = new L.control.layersBrowser();
    leafletControl.addTo(map);
  
  });

  // xit('baselayer is added by default', function() {
  //   expect(true).toBe(true);
  // });

  it('include specifies layers', function() {
    
    L.LayerGroup.EnvironmentalLayers({
      include: ['eonetFiresLayer'],
      display: ['eonetFiresLayer']
    }).addTo(map);
    
    // check that layer exists

    // check that markers are displayed
    expect($("#map .leaflet-marker-pane").children().length).toBeGreaterThan(0);
  });

  xit('exclude specifies layers', function() {
  });

  xit('display shows layer', function() {
  });
  
  
  });