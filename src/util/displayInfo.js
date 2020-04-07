L.Control.Info = L.Control.extend({
  options: {
    mapHasControl: false
  },

  initialize: function(options) {
    L.Util.setOptions(this, options);
    if (this.options.classname) {
      var infoModal = "<div  class='modal fade leaflet-bar leaflet-control-info"+ this.options.classname +"' role='dialog' tapindex='3' aria-hidden='true' >";
    }
    else {
      var infoModal = "<div  class='modal fade leaflet-bar leaflet-control-info' role='dialog' tapindex='3' aria-hidden='true' >";
    }
    infoModal += "<div class='modal-dialog'>";
    infoModal += "<div class='modal-content'>";
    infoModal += "<div class='modal-body'>";
    infoModal += "<div class='leaflet-control-info-text'>";
    infoModal += this.options.text;
    infoModal += "</ div>";
    infoModal += "</ div>";
    infoModal += "<div class='modal-footer'>";
    infoModal += "<button class='leaflet-control-info-button' data-dismiss='modal'>close</button>";
    infoModal += "</ div>";
    infoModal += "</ div>";
    infoModal += "</ div>";
    infoModal += "</ div>";
    this._infoModal = infoModal;
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
