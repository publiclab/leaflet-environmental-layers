L.Layer.include({
  onError: function(layerName, group) {
    this._tiles ? console.log('There was an error in fetching some tiles') : console.log( "Failed to fetch data!" );
    var selector = '#menu-' + layerName + ' .layer-name';
    var listLayerSelector = '#' + layerName + ' .layer-list-name';
    var layerTitle, icon, warning;
    if (group) {
      layerTitle = document.querySelector(listLayerSelector);
      icon = '#' + layerName + ' .layer-list-name .fa-exclamation-triangle';
      warning =  document.querySelector(icon);
    } else {
      layerTitle = document.querySelector(selector);
      icon =  '#menu-' + layerName + ' .layer-name .fa-exclamation-triangle';
      warning =  document.querySelector(icon);
    }
    
    // Workaround for layers 'city' and 'windrose' from Open Weather Map
    if((layerName === 'city' || layerName === 'current' || layerName === 'Cities-zoomIn' || layerName === 'windrose-zoomIn') && !this._requests.city) {
      if(layerTitle && layerTitle.contains(warning)) { // Add icon only once
        layerTitle.innerHTML = ' ' + layerName;
      }
      return;
    }
    
    if (this._map && typeof this._map.spin === 'function') {
      this._map.spin(false);
    }
    
    if(layerTitle && !layerTitle.contains(warning)) { // Add icon only once
      layerTitle.innerHTML += '<i style="color: #d47d12;" class="fas fa-exclamation-triangle .text-warning"></i>';
    }
    
  },
});