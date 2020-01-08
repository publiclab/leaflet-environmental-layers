L.Control.Layers.include({
  getActiveOverlayNames: function() {
    var layers = [];
    var control = this;
    this._layers.forEach(function(layerObj) {
      if (layerObj.overlay) {
        layerName = layerObj.name;
        if (control._map.hasLayer(layerObj.layer)) layers.push(layerObj.name);
      }
    });

    return layers;
  },
});
