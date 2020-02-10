xdescribe('Basic LEL Implementation', function() {

  var mapContainer;
  var map;

  beforeEach(function () {
    mapContainer = document.createElement('div');
    map = L.map(mapContainer, { }).setView([43, -83], 8);
  });

  it('leaflet is created', function() {
    expect(window.L).toExist();
  });

  it('baselayer is added by default', function() {
    L.LayerGroup.EnvironmentalLayers({
    }).addTo(map);
    
    expect(mapContainer.querySelector('.leaflet-layer .leaflet-tile-container')).toExist();
  });

  it('include specific layers', function() {
    L.LayerGroup.EnvironmentalLayers({
      include: ['eonetFiresLayer']
    }).addTo(map);

    expect(mapContainer.querySelector('#menu-EONET_Fires')).toExist();
  });

  it('exclude specific layers', function() {
    L.LayerGroup.EnvironmentalLayers({
      exclude: ['eonetFiresLayer']
    }).addTo(map);
    
    expect(mapContainer.querySelector('#menu-EONET_Fires')).not.toExist();
    expect(mapContainer.querySelector('#menu-Unearthing')).toExist();
  });

  it('display shows layer', function() {
    L.LayerGroup.EnvironmentalLayers({
      display: ['eonetFiresLayer'],
    }).addTo(map);

    expect(mapContainer.querySelector('#menu-EONET_Fires .leaflet-control-layers-selector').checked).toBe(true);
    expect(mapContainer.querySelector('#menu-Unearthing .leaflet-control-layers-selector').checked).toBe(false);
  });

  it('addLayersToMap shows all included layers', function() {
    L.LayerGroup.EnvironmentalLayers({
      include: ['eonetFiresLayer', 'Unearthing'],
      addLayersToMap: true,
    }).addTo(map);

    expect(mapContainer.querySelector('.leaflet-control-container .leaflet-control-layers-menu')).toExist();
    expect(mapContainer.querySelector('#menu-EONET_Fires .leaflet-control-layers-selector').checked).toBe(true);
    expect(mapContainer.querySelector('#menu-Unearthing .leaflet-control-layers-selector').checked).toBe(true);
  });

  it('simpleLayerControl shows simple menu', function() {
    L.LayerGroup.EnvironmentalLayers({
      simpleLayerControl: true,
    }).addTo(map);
    
    expect(mapContainer.querySelector('.leaflet-control-container .leaflet-control-layers-menu')).not.toExist();
  });

  it('embed shows embed control', function() {
    L.LayerGroup.EnvironmentalLayers({
      embed: true,
    }).addTo(map);
    
    expect(mapContainer.querySelector('.leaflet-control-container .leaflet-control-embed-link')).toExist();
  });

});