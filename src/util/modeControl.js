L.Control.MinimalMode = L.Control.extend({

    options: {
      position: 'topleft',
      minimalMode: false
    },
  
    initialize: function(options) {
      L.Util.setOptions(this, options);
      this._modeBtnContainer = L.DomUtil.create('div', 'leaflet-control-mode leaflet-bar leaflet-control');
      var link = L.DomUtil.create('a', 'leaflet-control-mode-link', this._modeBtnContainer);
      link.href = '#';
      link.title = 'displayMode'
      link.setAttribute('role', 'button');
      link.setAttribute('aria-labelledby', 'displayMode');
      this._minimalModeIcon = L.DomUtil.create('i', 'fas fa-map-marker-alt', link);
      L.DomEvent.disableClickPropagation(link);
      L.DomEvent.on(link, 'click', L.DomEvent.stop);
      L.DomEvent.on(link, 'click', this.toggleMode, this);
    },
  
    onAdd: function(map) {
      this._map = map;
      this._map._minimalMode = this.options.minimalMode;
      return this._modeBtnContainer;
    },
  
    toggleMode: function() {
      this.options.minimalMode = !this.options.minimalMode;
      this._minimalModeIcon.classList = this.options.minimalMode ? 'far fa-circle' : 'fas fa-map-marker-alt';
      this._map._minimalMode = this.options.minimalMode;
    },
  
    onRemove: function(map) {},
  
  });
  
  L.control.minimalMode = function(options) {
    return new L.Control.MinimalMode(options);
  };
  