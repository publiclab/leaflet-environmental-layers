L.Control.Layers.include({
  getActiveOverlayNames: () => {
    
    let layers = [];
    let control = this;
    this._layers.forEach(layerObj => {
      if(layerObj.overlay) {
        
        layerName = layerObj.name;
        if(control._map.hasLayer(layerObj.layer)) layers.push(layerObj.name);
      }
    });
    
    return layers;
  }
});