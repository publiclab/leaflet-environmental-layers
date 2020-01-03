describe('layer browser exists', function() {
  var leafletControl = new L.control.layersBrowser();
  it('control exists', function() {
    expect(leafletControl).toBeDefined();
  });
});