L.Control.Info = L.Control.extend({
  options: {
    mapHasControl: false
  },

  initialize: function(options) {
    L.Util.setOptions(this, options);
    // this._infoDisplay = L.DomUtil.create('div');
    // this._infoDisplay.classList.add(,  );
    // this._infoDisplay.style.backgroundColor = '#fff';
    this._infoModal = L.DomUtil.create('div');
    this._infoModal.classList.add('modal', 'fade', 'leaflet-bar', 'leaflet-control-info');
    $(this._infoModal).attr('role', 'dialog');
    $(this._infoModal).attr('tapindex', '3');
    this._infoModal.style.backgroundColor = 'transparent';
    if (this.options.classname) {
      this._infoModal.classList.add(this.options.classname);
    }
    // this._infoDisplay.appendChild(this._infoModal);
    this._infoDialog = L.DomUtil.create('div');
    this._infoDialog.classList.add('modal-dialog');
    this._infoModal.appendChild(this._infoDialog);

    this._infoContent = L.DomUtil.create('div');
    this._infoContent.classList.add('modal-content');
    this._infoDialog.appendChild(this._infoContent);

    this._infoBody = L.DomUtil.create('div');
    this._infoBody.classList.add('model-body');
    this._infoContent.appendChild(this._infoBody);

    this._textElement = L.DomUtil.create('div');
    this._textElement.innerHTML = this.options.text;
    this._textElement.classList.add('leaflet-control-info-text' );
    this._infoBody.appendChild(this._textElement);

    this._infoFooter = L.DomUtil.create('div');
    this._infoFooter.classList.add('model-footer');
    this._infoContent.appendChild(this._infoFooter);

    this._closeButton = L.DomUtil.create('button');
    this._closeButton.classList.add('leaflet-control-info-button');
    $(this._closeButton).attr('data-dismiss', 'modal');
    this._closeButton.innerText = 'close';
    this._infoFooter.appendChild(this._closeButton);
    $(this._infoModal).modal('show');
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
