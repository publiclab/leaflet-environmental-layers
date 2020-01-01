L.Control.Info = L.Control.extend({
  options: {
    mapHasControl: false
  },

  initialize: function(options) {
    L.Util.setOptions(this, options);
    this._infoDisplay = L.DomUtil.create('div');
    this._infoDisplay.classList.add('leaflet-control-info', 'leaflet-bar', 'leaflet-control');
    this._infoDisplay.style.backgroundColor = '#fff';
    if(this.options.classname) {
      this._infoDisplay.classList.add(this.options.classname);
    }
    this._textElement = L.DomUtil.create('span');
    this._textElement.innerHTML = this.options.text;
    this._textElement.classList.add('leaflet-control-info-text');
    this._infoDisplay.appendChild(this._textElement);
    this._closeButton = L.DomUtil.create('button');
    this._closeButton.classList.add('leaflet-control-info-button');
    this._closeButton.innerText = 'close';
    this._infoDisplay.appendChild(this._closeButton);
    this.onClose(map);
  },

  onAdd: function(map) {
    this.options.mapHasControl = true;
    return this._infoDisplay;
  },

  onClose: function(map) {
    var self = this;
    this._closeButton.addEventListener('click', function() {
      self.options.mapHasControl = false;
      map.removeControl(self);
    });
  },

  onRemove: function(map) {},
});

L.control.info = function(options) {
  return new L.Control.Info(options);
};
