describe('Minimal Mode Control', function() {
  var mapContainer = document.createElement('div');
  var map = L.map(mapContainer);
  var leafletControl = new L.control.layers();
  leafletControl.addTo(map);
  var modeControl = new L.control.minimalMode(leafletControl);
  modeControl.addTo(map);

  describe('control is added to map', function() {
    
    it('control is defined', function() {
      expect(modeControl).toBeDefined();
    });

    it('control exists in map', function() {
      expect(mapContainer.querySelector('.leaflet-control-mode')).toExist();
    });

  });

  describe('control toggles mode', function() {
    var buttons = mapContainer.querySelectorAll('.leaflet-control-mode-link');
    var defaultModeBtn = buttons[0];
    var minimalModeBtn = buttons[1];

    it('has default mode upon initialization', function() {
      expect(defaultModeBtn.title).toEqual('Default mode');
      expect(defaultModeBtn).toHaveClass('leaflet-disabled');
      expect(minimalModeBtn).not.toHaveClass('leaflet-disabled');
      expect(map._minimalMode).toBeFalsy();
    });

    it('turns on minimal mode', function() {
      expect(minimalModeBtn.title).toEqual('Minimal mode');
      minimalModeBtn.click();
      expect(minimalModeBtn).toHaveClass('leaflet-disabled');
      expect(defaultModeBtn).not.toHaveClass('leaflet-disabled');
      expect(map._minimalMode).toBeTruthy();
    });

    // Checks if default mode can be turned on after activating minimal mode
    it('turns on default mode', function() {
      expect(defaultModeBtn.title).toEqual('Default mode');
      defaultModeBtn.click();
      expect(defaultModeBtn).toHaveClass('leaflet-disabled');
      expect(minimalModeBtn).not.toHaveClass('leaflet-disabled');
      expect(map._minimalMode).toBeFalsy();
    });

  });

});