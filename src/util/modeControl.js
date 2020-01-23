L.Control.MinimalMode = L.Control.extend({

    options: {
      position: 'topleft',
      minimalMode: false
    },
  
    initialize: function(layersControl, options) {
      L.Util.setOptions(this, options);
      this._layersControl = layersControl;
    },
  
    onAdd: function(map) {
      this._map = map;
      this._map._minimalMode = this.options.minimalMode;
      this._modeBtnContainer = L.DomUtil.create('div', 'leaflet-control-mode leaflet-bar leaflet-control');
      this._defaultMode = this._createButton('Default mode', 'fas fa-map-marker-alt', this.loadDefaultMode);
      this._minimalMode = this._createButton('Minimal mode', 'far fa-dot-circle', this.loadMinimalMode);
      this._updateDisabled();
      return this._modeBtnContainer;
    },

    _createButton: function(title, icon, fn) {
      var link = L.DomUtil.create('a', 'leaflet-control-mode-link', this._modeBtnContainer);
      link.href = '#';
      link.title = title;
      link.setAttribute('role', 'button');
      link.setAttribute('aria-labelledby', title);
      L.DomUtil.create('i', icon, link);
      L.DomEvent.disableClickPropagation(link);
      L.DomEvent.on(link, 'click', L.DomEvent.stop);
      L.DomEvent.on(link, 'click', fn, this);
      return link;
    },

    loadMinimalMode: function() {
      if (L.DomUtil.hasClass(this._minimalMode, 'leaflet-disabled')) {
        return;
      }
      this.options.minimalMode = true;
      this._map._minimalMode = this.options.minimalMode;
      this._reloadLayers();
      this._updateDisabled();
    },

    loadDefaultMode: function() {
      if (L.DomUtil.hasClass(this._defaultMode, 'leaflet-disabled')) {
        return;
      }
      this.options.minimalMode = false;
      this._map._minimalMode = this.options.minimalMode;
      this._reloadLayers();
      this._updateDisabled();
    },

    _updateDisabled: function() {
      var className = 'leaflet-disabled';
      if(this._map._minimalMode) {
        L.DomUtil.removeClass(this._defaultMode, className);
        L.DomUtil.addClass(this._minimalMode, className);
      } else {
        L.DomUtil.addClass(this._defaultMode, className);
        L.DomUtil.removeClass(this._minimalMode, className);
      }
    },

    _reloadLayers: function() {
      var self = this;
      this._layersControl._layers.forEach(function(layerObj) {
        if (layerObj.overlay && self._layersControl._map.hasLayer(layerObj.layer)) {
          self._layersControl._map.removeLayer(layerObj.layer)
          self._layersControl._map.addLayer(layerObj.layer)
        }
      });
    },
  
    onRemove: function(map) {},
  
  });
  
  L.control.minimalMode = function(options) {
    return new L.Control.MinimalMode(options);
  };
  