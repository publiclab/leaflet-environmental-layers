describe('FracTrackerMobile Layer', function() {
  
  var mapContainer = document.createElement('div');
  var map = L.map(mapContainer);
  var FracTracker_mobile = L.geoJSON.fracTrackerMobile();
  
  it('adds layer to map', function() {
      map.addLayer(FracTracker_mobile);
      expect(Object.keys(map._layers)).toHaveLength(1);
  });

});