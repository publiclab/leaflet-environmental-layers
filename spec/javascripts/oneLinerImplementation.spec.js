// var window;   // create window namespace for headless test
// var L;
  
describe('One Liner Implementation', function() {

  // var mapContainer;
  // var map;
  // var lel;

  beforeAll(function() {
  });

  beforeEach(function () {
    // mapContainer = document.createElement('div');
    // map = L.map(mapContainer, { }).setView([43, -83], 8);
  });

  afterEach(function() {
    // mapContainer = undefined;
    // map = undefined;
  })

  it('leaflet is created', function() {
    expect(window.L).toExist();
  });

  xit('baselayer is added by default', function() {
    L.LayerGroup.EnvironmentalLayers({
    }).addTo(map);
    
    expect(mapContainer.querySelector('.leaflet-layer .leaflet-tile-container')).toExist();
  });

  xit('include specific layers', function() {
    L.LayerGroup.EnvironmentalLayers({
      include: ['eonetFiresLayer']
    }).addTo(map);

    // check that layer exists in menu
    expect(mapContainer.querySelector('#menu-EONET_Fires')).toExist();
  });

  xit('exclude specific layers', function() {
    L.LayerGroup.EnvironmentalLayers({
      exclude: ['eonetFiresLayer']
    }).addTo(map);
    
    expect(mapContainer.querySelector('#menu-EONET_Fires')).not.toExist();
    expect(mapContainer.querySelector('#menu-Unearthing')).toExist();
  });

  xit('display shows layer', function() {
    L.LayerGroup.EnvironmentalLayers({
      display: ['eonetFiresLayer'],
    }).addTo(map);

    expect(mapContainer.querySelector('#menu-EONET_Fires .leaflet-control-layers-selector').checked).toBe(true);
    expect(mapContainer.querySelector('#menu-Unearthing .leaflet-control-layers-selector').checked).toBe(false);
  });

  it('simpleLayerControl shows simple menu', function() {
    var mapContainer = document.createElement('div');
    var map = L.map(mapContainer, { }).setView([43, -83], 8);
    var lel = L.LayerGroup.EnvironmentalLayers({
      simpleLayerControl: true,  // and this is causing
    });
    lel.addTo(map);
    
    expect(mapContainer.querySelector('.leaflet-control-container .leaflet-control-layers-menu')).not.toExist();
  });

  xit('embed shows embed control', function() {
    var mapContainer = document.createElement('div');
    var map = L.map(mapContainer, { }).setView([43, -83], 8);
    var lel = L.LayerGroup.EnvironmentalLayers({
      embed: true,
    }).addTo(map);
    
    expect(mapContainer.querySelector('.leaflet-control-container .leaflet-control-embed-link')).toExist();
  });

  it('addLayersToMap shows all included layers', function() {
    var mapContainer2 = document.createElement('div');
    mapContainer2.id = "#map2";
    var map2 = L.map(mapContainer2, { }).setView([43, -83], 8);
    var lel2 = L.LayerGroup.EnvironmentalLayers({
      include: ['eonetFiresLayer', 'Unearthing'],
      addLayersToMap: true,  // This is somehow causing issues in the next tests
      // simpleLayerControl: false,
    });
    lel2.addTo(map2);

    expect(mapContainer2.querySelector('.leaflet-control-container .leaflet-control-layers-menu')).toExist();
    expect(mapContainer2.querySelector('#menu-EONET_Fires .leaflet-control-layers-selector').checked).toBe(true);
    expect(mapContainer2.querySelector('#menu-Unearthing .leaflet-control-layers-selector').checked).toBe(true);
  });

});