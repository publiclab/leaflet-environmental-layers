describe('Layer Browser Control', function() {
  
  describe('Layers menu exists', function() {

    var mapContainer = document.createElement('div');
    var map = L.map(mapContainer);
    var leafletControl = new L.control.layersBrowser();
    leafletControl.addTo(map);
    
    it('control is not undefined', function() {
      expect(leafletControl).toBeDefined();
    });

    it('control exists in map', function() {
      expect(mapContainer.querySelector('.leaflet-control-layers-menu')).toExist();
    });

  });

  describe('Layers are added to the menu', function() {

    var mapContainer = document.createElement('div');
    var map = L.map(mapContainer).setView([43, -83], 3);
    var leafletControl;
    
    describe('Base layers', function() {
      
      var baselayer1 = L.tileLayer('').addTo(map);
      var baselayer2 = L.tileLayer('').addTo(map);
      
      afterEach(function() {
        map.removeControl(leafletControl);
      });

      afterAll(function() {
        map.removeLayer(baselayer1);
        map.removeLayer(baselayer2);
      });

      it('base layer section hidden when there is only one base layer', function() {
        var baseMaps = {
          'Standard': baselayer1,
        };
        leafletControl = new L.control.layersBrowser(baseMaps).addTo(map);
        
        expect(mapContainer.querySelector('.leaflet-control-layers-base').childNodes).toHaveLength(1);
        expect(mapContainer.querySelector('.leaflet-control-layers-base')).toHaveCss({display: 'none'});

      });

      it('base layer section visible when there is more than one base layers', function() {
        var baseMaps = {
          'Standard': baselayer1,
          'Grey-scale': baselayer2
        };
        leafletControl = new L.control.layersBrowser(baseMaps).addTo(map);
        
        expect(mapContainer.querySelector('.leaflet-control-layers-base').childNodes).toHaveLength(2);
        expect(mapContainer.querySelector('.leaflet-control-layers-base')).not.toHaveCss({display: 'none'});

      });

    });

    describe('Overlays', function() {
      afterEach(function() {
        map.removeControl(leafletControl);
      });
      
      var baselayer1 = L.tileLayer('').addTo(map);
      var baseMaps = {
        'Standard': baselayer1,
      };
    
      it('layers are added to control', function() {
        var overlayMaps = {
          overlay1: L.marker([0, 0]),
          overlay2: L.marker([0, 0])
        }
        
        leafletControl = new L.control.layersBrowser(baseMaps, overlayMaps).addTo(map);
        // console.log(mapContainer.querySelector('.leaflet-control-layers-overlays'));
        expect(mapContainer.querySelector('.leaflet-control-layers-selector')).toExist();
        expect(mapContainer.querySelectorAll('.leaflet-control-layers-overlays input[type=checkbox]')).toHaveLength(2);

      });

    });

  });

});
