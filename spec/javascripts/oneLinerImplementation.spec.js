var window;   // create window namespace for headless test
var L;
  
describe('One Liner Implementation', function() {

  var map;
  var leafletControl;

  beforeEach(function () {
    
    // var mapContainer = document.createElement('div');
    
    loadFixtures('leaflet.html');

    // map = L.map("map");
    // leafletControl = new L.control.layersBrowser();
    // leafletControl.addTo(map);
  });

  it('leaflet is created', function() {
    expect(window.L).toExist();
  });

  xit('baselayer is added by default', function() {
    L.LayerGroup.EnvironmentalLayers({
    }).addTo(map);
    
    expect(true).toBe(true);
  });

  it('include specific layers', function() {
    
    L.LayerGroup.EnvironmentalLayers({
      include: ['eonetFiresLayer']
    }).addTo(map);
    
    // check that layer exists in menu
    expect($("#menu-eonetFiresLayer"))
  });

  xit('exclude specific layers', function() {
    L.LayerGroup.EnvironmentalLayers({
      exclude: ['eonetFiresLayer']
    }).addTo(map);
    
    // check that layer does not exist in menu
  });

  xit('display shows layer', function() {
    // L.LayerGroup.EnvironmentalLayers({
    //   display: ['eonetFiresLayer'],
    //   include: ['eonetFiresLayer'],
    // }).addTo(map);

    // check that markers are displayed
    // var markers = $("#map .leaflet-marker-pane").children();
    var markers = $("#map").children()[0].childNodes[3].childNodes;
    console.log(markers.length);
    expect(markers.length).toBeGreaterThan(0);
  });

  // test simple menu

  // test min mode
  
  // test embed
  
  });