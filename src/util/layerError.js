L.Layer.include({
  onError: function(layer, group) {
    console.log( "Failed to fetch data!" );
    var selector = '#menu-' + layer + ' .layer-name';
    var listLayerSelector = '#' + layer + ' .layer-list-name';
    var layerTitle, icon, warning;
    if (group) {
      layerTitle = document.querySelector(listLayerSelector);
      icon = '#' + layer + ' .layer-list-name .fa-exclamation-triangle';
      warning =  document.querySelector(icon);
    } else {
      layerTitle = document.querySelector(selector);
      icon =  '#menu-' + layer + ' .layer-name .fa-exclamation-triangle';
      warning =  document.querySelector(icon);
    }
    
    if (this._map && typeof this._map.spin === 'function') {
      this._map.spin(false);
    }
    
    if(!layerTitle.contains(warning)) { // Add icon only once
      layerTitle.innerHTML += '<i style="color: #d47d12;" class="fas fa-exclamation-triangle .text-warning"></i>';
    }
    
  },
});