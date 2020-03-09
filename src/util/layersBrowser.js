L.Control.LayersBrowser = L.Control.Layers.extend({
  options: {
    collapsed: true,
    position: 'topright',
    autoZIndex: true,
    hideSingleBase: true,
    overlays: {},
    existingLayers: {},
    newLayers: []
  },

  initialize: function(baseLayers, overlays, options) {
    this.options.overlays = overlays;
    L.Util.setOptions(this, options);

    this._layerControlInputs = [];
    this._layers = [];
    this._lastZIndex = 0;
    this._handlingClick = false;

    // List of layers/layergroups to be highlighted
    // Layers names listed are values of 'obj.group' for groups and 'obj.name' for the rest
    this._newLayerContainers = [];

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

  setLayersBrowserSize: function(map) {
    var mapobj = map._container;
    var width = mapobj.offsetWidth;

    var mapSizeArray = [
      ['xs', 0, 380],
      ['sm', 380, 590],
      ['md', 590, 880],
      ['lg', 880, 10000]
    ];

    mapSizeArray.forEach((sizeMinMax) => {
      if(width >= sizeMinMax[1] && width < sizeMinMax[2]) {
        mapobj.classList.add(sizeMinMax[0]);
      } else {
        mapobj.classList.remove(sizeMinMax[0]);
      }
    });
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
    this.options.newLayers = []; // Reset new layers list when the control is accessed
    this._alertBadge.innerHTML = '';
    this._alertBadge.style.display = 'none';
    this._layersLink.style.marginLeft = '0';
    return this;
  },

  collapse: function () {
    L.DomUtil.removeClass(this._container, 'leaflet-control-layers-expanded');
    this._highlightLayers('none');
    this._newLayerContainers = [];
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

    var section = this._section = L.DomUtil.create('section', className + '-list' +
    ' ' + className + '-menu');

    var img = L.DomUtil.create('img', 'mx-auto d-block', section);
    img.src = 'https://static.thenounproject.com/png/257237-200.png';
    img.alt = 'industrial building icon by Parkjisun';
    img.style.maxHeight = '75px';
    img.style.maxWidth = '75px';

    var heading = L.DomUtil.create('h3', 'text-center', section);
    heading.innerHTML = 'Environmental data near here';

    var lead = L.DomUtil.create('p', 'text-center', section);
    lead.innerHTML = 'A range of groups publish environmental data near here. ';

    var readMoreLink = L.DomUtil.create('a', '', lead);
    readMoreLink.innerHTML = 'Read more';
    readMoreLink.href = '#';

    var or = L.DomUtil.create('span', '', lead);
    or.innerHTML = ' or ';

    var shareLink = L.DomUtil.create('a', '', lead);
    shareLink.innerHTML = 'share your own map data.';
    shareLink.href = '#';

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
    link.style.marginLeft = '0';

    var alert = this._alertBadge = L.DomUtil.create('section', 'rounded-circle bg-danger text-white text-center'); // Badge to alert new layers within bounds
    alert.style.display = 'none';
    alert.style.position = 'relative';
    alert.style.right = '55%';
    alert.style.top = '25%';
    alert.style.fontWeight = 'bold';
    alert.style.width = '23px';
    alert.style.height = '23px';
    alert.style.justifyContent = 'center';
    alert.style.alignItems = 'center';
    alert.innerHTML = '';
    link.appendChild(alert);

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
    this._overlaysList.style.maxHeight = '35vh';
    this._overlaysList.style.overflowY = 'scroll';
    this._overlaysList.style.overflowX = 'hidden';

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

    var map = this._map;
    var group;
    
    for (i = 0; i < this._layers.length; i++) {
      var groupHolder;
      obj = this._layers[i];
      if(obj.group && group !== obj.group) {
        this._createGroup(obj);
        groupHolder = this._createGroupHolder(obj);
      };

      if(groupHolder && obj.group) {
        groupHolder.appendChild(this._addItem(obj));
      } else {
        this._addItem(obj);
      }
      
      group = obj.group;
      overlaysPresent = overlaysPresent || obj.overlay;
      baseLayersPresent = baseLayersPresent || !obj.overlay;
      baseLayersCount += !obj.overlay ? 1 : 0;
    }

    map.on('overlayremove', function(e) {
      const mapId = this._map && this._map._container.id;
      var layerInfo = this._getLayerData(e);
      var selector = '#' + mapId + '-menu-' + e.name + ' .layer-name';
      var listLayerSelector = '#' + mapId + '-' + e.name + ' .layer-list-name';
      var layerTitle = e.group ? document.querySelector(listLayerSelector) : document.querySelector(selector);
      if (layerTitle && (layerTitle.innerHTML !== (' ' + layerInfo.name) || layerTitle.innerHTML !== (' ' + e.name))) {
        layerTitle.innerHTML = e.group ? ' ' + e.name : ' ' + layerInfo.name;
      }
    }, this)

    this._showGroupTitle(); // Show group title when atleast one of its layers is active
    
    map.on('moveend', function() {
      if(this.options.newLayers.length > 0) {
        this._layersLink.style.marginLeft = '2.9em';
        this._alertBadge.style.display = 'flex';
        this._alertBadge.innerHTML = this.options.newLayers.length;
        this._highlightLayers('#ffffc6');
      } else {
        this._layersLink.style.marginLeft = '0';
        this._alertBadge.style.display = 'none';
        this._alertBadge.innerHTML = '';
      }
      
      this._showGroupTitle(); // Show group title when atleast one of its layers is active
    }, this);

    // Hide base layers section if there's only one layer.
    if (this.options.hideSingleBase) {
      baseLayersPresent = baseLayersPresent && baseLayersCount > 1;
      this._baseLayersList.style.display = baseLayersPresent ? '' : 'none';
    }

    this._separator.style.display = overlaysPresent && baseLayersPresent ? '' : 'none';

    return this;
  },

  _createSeparator: function() {
    var separator = document.createElement('div');
    separator.className = 'leaflet-control-layers-separator';
    separator.style.margin = '0';

    return separator;
  },

  _createLayerInfoElements: function(obj) {
    var data = this._getLayerData(obj);
   
    var icon = document.createElement('div');
    icon.className = 'rounded-circle layer-icon';
    icon.style.width = '10px';
    icon.style.height = '10px';
    icon.style.backgroundColor = data && data.icon || 'black';
    icon.style.display = 'inline-block';
    icon.style.margin = '0 1em';

    var reportBtn = document.createElement('a');
    reportBtn.setAttribute('role', 'button');
    reportBtn.setAttribute('href', '#');
    reportBtn.setAttribute('target', '_blank');
    reportBtn.innerHTML = 'Add a report';
    reportBtn.className = 'btn btn-default btn-outline-secondary btn-sm report-btn invisible';
    reportBtn.style.margin = '0 1em';
    reportBtn.style.lineHeight = '10px';
    reportBtn.style.color = '#717171';
    reportBtn.style.minWidth = '95px';

    if(data && data.report_url) {
      reportBtn.setAttribute('href', data.report_url);
      reportBtn.classList.remove('invisible');
    } else if(data && data.contribute_url) {
      reportBtn.setAttribute('href', data.contribute_url);
      reportBtn.innerHTML = 'Contribute';
      reportBtn.classList.remove('invisible');
    }

    reportBtn.addEventListener('mouseover', function() {
      reportBtn.style.color = 'white';
    });

    reportBtn.addEventListener('mouseout', function() {
      reportBtn.style.color = '#717171';
    });

    var layerDesc = document.createElement('span');
    layerDesc.innerHTML = data && data.layer_desc;
    layerDesc.className = 'layer-description';
    layerDesc.style.fontSize = '1.2em';

    var dataInfo = document.createElement('div');
    dataInfo.style.display = 'inline-block';
    dataInfo.className = 'float-sm-right layer-data-info';

    dataInfo.style.transform = 'translateY(6px)';

    var dataType = document.createElement('span');
    dataType.innerHTML = 'NRT/RT';
    dataType.style.color = '#717171';

    if(data && data.data.type !== 'NRT' && data.data.type !== 'RT') {
      dataType.classList.add('invisible');
    }

    var dataInfoBtn = document.createElement('button');
    dataInfoBtn.style.backgroundColor = 'transparent';
    dataInfoBtn.style.borderColor = 'transparent';
    var infoIcon = document.createElement('i');
    infoIcon.className = 'fas fa-info-circle';
    infoIcon.style.fontSize = '1.2em';
    infoIcon.style.color = '#717171';

    var infoModal;
    dataInfoBtn.addEventListener('click', function() {
      // Add only one instance of the modal for the map layer
      if(!infoModal || !infoModal.options.mapHasControl) {
        infoModal = new L.control.info({ 
          text: data && data.data.disclaimer,
          classname: 'info-modal'
        });

        infoModal.addTo(map);
      }
    });

    dataInfo.appendChild(dataType);
    dataInfo.appendChild(dataInfoBtn);
    dataInfoBtn.appendChild(infoIcon);

    return {
      name: data && data.name,
      icon: icon,
      reportBtn: reportBtn,
      layerDesc: layerDesc,
      dataInfo: dataInfo,
      dataType: dataType,
      dataInfoBtn: dataInfoBtn,
      infoIcon: infoIcon
    }
  },

  _createGroup: function(obj) {
    if(obj.group) {
      var layerGroup = document.createElement('a');
      layerGroup.href = '#' + this._map._container.id + '-' + obj.group.replace(/\s/g, '');
      layerGroup.setAttribute('data-toggle', 'collapse');
      layerGroup.setAttribute('role', 'button');
      layerGroup.setAttribute('aria-expanded', 'false');
      layerGroup.setAttribute('aria-controls', obj.group)

      var groupName = document.createElement('span');
      groupName.className = 'layer-group-name';
      groupName.style.margin = '0 1em';
      groupName.style.fontSize = '1.2em';
      groupName.style.fontWeight = 'bold';
      groupName.style.display = 'inline-block';
      groupName.style.width = '12em';

      var chevron = document.createElement('i');
      chevron.className = 'fa fa-chevron-down';
      chevron.setAttribute('aria-hidden', 'true');
      chevron.style.margin = '1em';
      
      layerGroup.addEventListener('click', function() {
        if(chevron.className === 'fa fa-chevron-down') {
          chevron.className = 'fa fa-chevron-up';
        } else {
          chevron.className = 'fa fa-chevron-down';
        }
      });

      var elements = this._createLayerInfoElements(obj);
      groupName.innerHTML = elements.name;

      var titleHolder = document.createElement('div');
      titleHolder.id = this._map._container.id +'-menu-' + obj.group; 
      titleHolder.className = 'clearfix layer-info-container';
      titleHolder.setAttribute('data-cy', 'layer'); // Cypress selector
      titleHolder.appendChild(layerGroup);
      layerGroup.appendChild(chevron);
      layerGroup.appendChild(elements.icon);
      titleHolder.appendChild(elements.reportBtn);
      titleHolder.appendChild(groupName);
      titleHolder.appendChild(elements.layerDesc);
      titleHolder.appendChild(elements.dataInfo);
      titleHolder.style.padding = '0.4em 0';

      var separator = this._createSeparator();

      if(this._grpTitleVisible && !this._grpTitleVisible[obj.group]) { // Hide group title only if none of its layers are active
        this._hideOutOfBounds(obj, [titleHolder, separator]);
      }
      
      var container = obj.overlay ? this._overlaysList : this._baseLayersList;
      container.appendChild(titleHolder);
      container.appendChild(separator);
      return titleHolder;
    }
  },

  _createGroupHolder: function(obj) {
    var groupName;
    if(obj.group) {
      groupName = this._map._container.id + '-' + obj.group.replace(/\s/g, '');
    }
    var groupHolder = document.createElement('div');
    groupHolder.className = 'layers-sub-list collapse';
    groupHolder.setAttribute('id', groupName);

    var container = obj.overlay ? this._overlaysList : this._baseLayersList;
    container.appendChild(groupHolder);
    
    return groupHolder;
  },

  _addItem: function(obj) {
    var labelContainer = document.createElement('div');
    var label = document.createElement('label');
    label.style.display = 'inline-block';
    var checked = this._map.hasLayer(obj.layer);
    var input;
    if (obj.overlay) {
      input = document.createElement('input');
      input.type = 'checkbox';
      input.className = 'leaflet-control-layers-selector';
      input.defaultChecked = checked;
      input.style.margin = '0.5em 0.9em';
    } else {
      input = this._createRadioElement('leaflet-base-layers_' + L.Util.stamp(this), checked);
    }

    this._layerControlInputs.push(input);
    input.layerId = L.Util.stamp(obj.layer);

    L.DomEvent.on(input, 'click', this._onInputClick, this);

    var name = document.createElement('span');
    name.style.fontWeight = 'bold';
    name.style.display = 'inline-block';
    
    name.style.fontSize = '1.2em';

    var elements = this._createLayerInfoElements(obj);
    var separator = this._createSeparator();
    if(obj.group) {
      name.innerHTML = ' ' + obj.name;
    } else {
      name.innerHTML = ' ' + elements.name;
    }
    
    var layerContainer = document.createElement('div');
    // Helps from preventing layer control flicker when checkboxes are disabled
    // https://github.com/Leaflet/Leaflet/issues/2771
    var holder = document.createElement('div');
    layerContainer.appendChild(labelContainer);
    labelContainer.appendChild(label);
    label.appendChild(holder);
    holder.appendChild(input);
    if(obj.overlay && !obj.group) {
      holder.appendChild(elements.icon);
      holder.appendChild(elements.reportBtn);
      name.style.margin = '0 1em';
      name.style.width = '12em';
      name.className = 'layer-name';
      label.className = 'label';
    }
    holder.appendChild(name);
    if(obj.overlay && obj.group) {
      labelContainer.id = this._map._container.id + '-' + obj.name;
      label.style.width = '100%';
      label.style.marginBottom = '3px';
      input.style.marginLeft = '3.8em';
      name.style.marginLeft = '9.6em';
      name.style.color = '#717171';
      name.className = 'layer-list-name';
      layerContainer.appendChild(separator);
    }
    if(obj.overlay && !obj.group) {
      labelContainer.appendChild(elements.layerDesc);
      labelContainer.className = 'clearfix layer-info-container';
      labelContainer.id = this._map._container.id + '-menu-' + obj.name.replace(/ /g,"_");
      layerContainer.setAttribute('data-cy', 'layer');  // Cypress selector
      labelContainer.appendChild(elements.dataInfo);
      layerContainer.appendChild(separator);
    }
    labelContainer.style.padding = '0.4em 0';
    this._hideOutOfBounds(obj, [layerContainer, separator]);
    
    var container = obj.overlay ? this._overlaysList : this._baseLayersList;
    container.appendChild(layerContainer);
    this._checkDisabledLayers();
    return layerContainer;
  },

  _hideOutOfBounds: function(obj, elements) {
    var self = this;
    var map = this._map;
    var data = this._getLayerData(obj);
    var layerName;
    if(obj.name && !obj.group) {
      layerName = this.options.overlays && this.options.overlays[obj.name];
    } else {
      layerName = this.options.overlays && this.options.overlays[obj.group].layers[obj.name];
    }
    this._hideElements(obj, data, layerName, elements); // Filter layer list on initialization
    map.on('moveend', function() { // Update layer list on map movement
        self._hideElements(obj, data, layerName, elements, true);
    });
  },

  /**
   * 
   * @param {Object} obj - layer object
   * @param {Object} data - layer information from info.json
   * @param {string} layerName 
   * @param {Object[]} elements - Reference to DOM elements
   * @param {boolean} isNotGlobal - true if the layer passed in is not a globally available layer
   */
  _hideElements: function(obj, data, layerName, elements, isNotGlobal) {
    var map = this._map;
    var currentBounds = map.getBounds();
    var currentZoom = map.getZoom();
    var bounds;
    var zoom;
    if(data) {
      bounds = data.extents && data.extents.bounds && L.latLngBounds(data.extents.bounds);
      zoom =  data.extents && data.extents.minZoom && data.extents.minZoom;
      for(var i in elements) {
        if((bounds && !bounds.intersects(currentBounds) && !map.hasLayer(layerName)) ||
          ( zoom && (currentZoom < zoom) && !map.hasLayer(layerName))) {
          elements[i].style.display = 'none';
          this._existingLayers(obj, false, isNotGlobal);
        } else if(obj.group) {
          this._grpTitleVisible = this._grpTitleVisible || {};
          this._grpTitleVisible[obj.group] = true;  // Keep track of group titles to be visible when its layers are active
          elements[i].style.display = 'block';
          this._existingLayers(obj, true, isNotGlobal);
        } else {
          elements[i].style.display = 'block';
          this._existingLayers(obj, true, isNotGlobal);
        }
      };
    };
  },

  _showGroupTitle: function() {
    for(var i in this._grpTitleVisible) {
      if(this._grpTitleVisible[i]) {
        var groupName = this._map._container.id + '-menu-' + i;
        var grpHolder = document.getElementById(groupName);
        var grpSelector = grpHolder && grpHolder.nextElementSibling;
        if(grpHolder) {
          grpHolder.style.display = 'block';
          grpSelector.style.display = 'block';
        }
      }
    }
    this._grpTitleVisible = {}; // Reset list of group titles that need to be visible
  },

  _existingLayers: function(obj, doesExist, isNotGlobal) { 
    if(doesExist && isNotGlobal && !this.options.existingLayers[obj.name]) { // Check if there is a new layer in current bounds
      this.options.newLayers = [...this.options.newLayers, obj.name];
      this._newLayerContainers = obj.group ? [...this._newLayerContainers, obj.group] : [...this._newLayerContainers, obj.name]
      this.options.existingLayers[obj.name] = true;
    } else if(doesExist) {
      this.options.existingLayers[obj.name] = true; // layer exists upon inititalization
    } else if(isNotGlobal && this.options.existingLayers[obj.name]) { // Remove from new layers if the layer no longer exists within current bounds
      this.options.newLayers = this.options.newLayers.filter(layer => layer !== obj.name);
      this.options.existingLayers[obj.name] = false;
    } else {
      this.options.existingLayers[obj.name] = false; // layer does not exist upon inititalization
    }
  },

  _highlightLayers: function(backgroundProp) {
    this._newLayerContainers.map(layerName => {
      const mapId = this._map._container.id;
      let selector = '#' + mapId + '-menu-' + layerName + ' .layer-info-container';
      let elem = document.querySelector(selector);
      if(elem){
        elem.style.background = backgroundProp
      } else {  // Group names
        selector = '#' + mapId + '-menu-' + layerName + '.layer-info-container';
        elem = document.querySelector(selector);
        elem.style.background = backgroundProp;
      }
    })
  },

  _getLayerData: function(obj) {
    var layerData = require('../info.json');
    var data;
    for (let j in layerData) {
      if((obj.group && obj.group.replace(/\s/g, '').toLowerCase() === j.toLowerCase()) ||
        (obj.name.replace(/\s/g, '').toLowerCase() === j.toLowerCase())) {
          data = layerData[j];
      };
    };
    return data;
  }
});

L.control.layersBrowser = function(baseLayers, overlays, options) {
  return new L.Control.LayersBrowser(baseLayers, overlays, options);
};
