L.Control.LayersBrowser = L.Control.Layers.extend({
  options: {
    collapsed: true,
    position: 'topright',
    autoZIndex: true,
    hideSingleBase: false
  },

  initialize: function(baseLayers, overlays, options) {
    L.Util.setOptions(this, options);

    this._layerControlInputs = [];
    this._layers = [];
    this._lastZIndex = 0;
    this._handlingClick = false;

    for (var i in baseLayers) {
      this._addLayer(baseLayers[i], i);
    }

    for (i in overlays) {
      if (overlays[i].category === 'group') {
        for (var j in overlays[i].layers) {
          this._addLayer(overlays[i].layers[j], j, true, i);
        }
      } else {
        this._addLayer(overlays[i], i, true);
      }
    }
  },

  expand: function() {
    L.DomUtil.addClass(this._container, 'leaflet-control-layers-expanded');
    this._section.style.height = null;
    var acceptableHeight = this._map.getSize().y - (this._container.offsetTop + 50);
    if (acceptableHeight < this._section.clientHeight) {
      L.DomUtil.addClass(this._section, 'leaflet-control-layers-scrollbar');
      this._section.style.height = acceptableHeight + 'px';
    } else {
      L.DomUtil.removeClass(this._section, 'leaflet-control-layers-scrollbar');
    }
    this._checkDisabledLayers();
    return this;
  },

  _initLayout: function() {
    var className = 'leaflet-control-layers';
    var container = this._container = L.DomUtil.create('div', className);
    var collapsed = this.options.collapsed;

    // makes this work on IE touch devices by stopping it from firing a mouseout event when the touch is released
    container.setAttribute('aria-haspopup', true);

    L.DomEvent.disableClickPropagation(container);
    L.DomEvent.disableScrollPropagation(container);

    var section = this._section = L.DomUtil.create('section', className + '-list');

    if (collapsed) {
      this._map.on('click', this.collapse, this);

      if (!L.Browser.android) {
        L.DomEvent.on(container, {
          mouseenter: this.expand,
          mouseleave: this.collapse,
        }, this);
      }
    }

    var link = this._layersLink = L.DomUtil.create('a', className + '-toggle', container);
    link.href = '#';
    link.title = 'Layers';

    if (L.Browser.touch) {
      L.DomEvent.on(link, 'click', L.DomEvent.stop);
      L.DomEvent.on(link, 'click', this.expand, this);
    } else {
      L.DomEvent.on(link, 'focus', this.expand, this);
    }

    if (!collapsed) {
      this.expand();
    }

    this._baseLayersList = L.DomUtil.create('div', className + '-base', section);
    this._separator = L.DomUtil.create('div', className + '-separator', section);
    this._overlaysList = L.DomUtil.create('div', className + '-overlays', section);

    container.appendChild(section);
  },

  _addLayer: function(layer, name, overlay, group) {
    if (this._map) {
      layer.on('add remove', this._onLayerChange, this);
    }

    this._layers.push({
      layer: layer,
      name: name,
      overlay: overlay,
      group: group
    });

    if (this.options.sortLayers) {
      this._layers.sort(L.Util.bind(function(a, b) {
        return this.options.sortFunction(a.layer, b.layer, a.name, b.name);
      }, this));
    }

    if (this.options.autoZIndex && layer.setZIndex) {
      this._lastZIndex++;
      layer.setZIndex(this._lastZIndex);
    }

    this._expandIfNotCollapsed();
  },

  _update: function() {
    if (!this._container) { return this; }

    L.DomUtil.empty(this._baseLayersList);
    L.DomUtil.empty(this._overlaysList);

    this._layerControlInputs = [];
    var baseLayersPresent; var overlaysPresent; var i; var obj; var baseLayersCount = 0;

    var group;
    
    for (i = 0; i < this._layers.length; i++) {
      // var groupEl;
      var groupHolder;
      obj = this._layers[i];
      if(group !== obj.group) {
        this._createGroup(obj);
        groupHolder = this._createGroupHolder(obj);
      };

      if(obj.group) {
        groupHolder.appendChild(this._addItem(obj));
      } else {
        this._addItem(obj);
      }
      
      // console.log(obj)
      
      group = obj.group;
      overlaysPresent = overlaysPresent || obj.overlay;
      baseLayersPresent = baseLayersPresent || !obj.overlay;
      baseLayersCount += !obj.overlay ? 1 : 0;
    }

    // Hide base layers section if there's only one layer.
    if (this.options.hideSingleBase) {
      baseLayersPresent = baseLayersPresent && baseLayersCount > 1;
      this._baseLayersList.style.display = baseLayersPresent ? '' : 'none';
    }

    this._separator.style.display = overlaysPresent && baseLayersPresent ? '' : 'none';

    return this;
  },

  _createGroup: function(obj) {
    var layerGroup = document.createElement('a');
    layerGroup.href = '#' + obj.group;
    layerGroup.setAttribute('data-toggle', 'collapse');
    layerGroup.setAttribute('role', 'button');
    layerGroup.setAttribute('aria-expanded', 'false');
    layerGroup.setAttribute('aria-controls', obj.group)

    var groupName = document.createElement('span');
    groupName.innerHTML = obj.group;

    var chevron = document.createElement('i');
    chevron.className = 'fa fa-chevron-down';
    chevron.setAttribute('aria-hidden', 'true');

    layerGroup.addEventListener('click', function() {
      if(chevron.className === 'fa fa-chevron-down') {
        chevron.className = 'fa fa-chevron-up';
      } else {
        chevron.className = 'fa fa-chevron-down';
      }
    })

    var holder = document.createElement('div');
    holder.appendChild(layerGroup);
    layerGroup.appendChild(chevron);
    layerGroup.appendChild(groupName);

    var container = obj.overlay ? this._overlaysList : this._baseLayersList;
    container.appendChild(holder);
    
    return holder;
  },

  _createGroupHolder: function(obj) {
    var groupHolder = document.createElement('div');
    groupHolder.className = 'collapse';
    groupHolder.setAttribute('id', obj.group);

    var container = obj.overlay ? this._overlaysList : this._baseLayersList;
    container.appendChild(groupHolder);
    return groupHolder;
  },

  _addItem: function(obj) {
    var label = document.createElement('label');
    var checked = this._map.hasLayer(obj.layer);
    var input;

    if (obj.overlay) {
      input = document.createElement('input');
      input.type = 'checkbox';
      input.className = 'leaflet-control-layers-selector';
      input.defaultChecked = checked;
    } else {
      input = this._createRadioElement('leaflet-base-layers_' + L.Util.stamp(this), checked);
    }

    this._layerControlInputs.push(input);
    input.layerId = L.Util.stamp(obj.layer);

    L.DomEvent.on(input, 'click', this._onInputClick, this);

    var name = document.createElement('span');
    name.innerHTML = ' ' + obj.name;

    // Helps from preventing layer control flicker when checkboxes are disabled
    // https://github.com/Leaflet/Leaflet/issues/2771
    var holder = document.createElement('div');

    label.appendChild(holder);
    holder.appendChild(input);
    holder.appendChild(name);

    var container = obj.overlay ? this._overlaysList : this._baseLayersList;
    container.appendChild(label);

    this._checkDisabledLayers();
    return label;
  },

});

L.control.layersBrowser = function(baseLayers, overlays, options) {
  return new L.Control.LayersBrowser(baseLayers, overlays, options);
};
