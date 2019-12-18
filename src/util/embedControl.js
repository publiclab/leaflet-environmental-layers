L.Control.Embed = L.Control.extend({

  options: {
    position: 'topleft',
    hostname: 'publiclab.github.io',
  },

  initialize: function(options) {
    L.Util.setOptions(this, options);
    this._embedElement = L.DomUtil.create('div');
    this._embedElement.classList.add('leaflet-control-embed', 'leaflet-bar', 'leaflet-control');
    this._embedAnchorElement = L.DomUtil.create('a');
    this._embedAnchorElement.classList.add('leaflet-control-embed-link');
    this._embedAnchorElement.setAttribute('href', '#');
    this._embedAnchorElement.setAttribute('onclick', 'return false'); // To prevent the removal of url hash
    this._embedAnchorElement.setAttribute('title', 'embed');
    this._embedAnchorElement.setAttribute('role', 'button');
    this._embedAnchorElement.setAttribute('aria-labelledby', 'embed');
    this._embedElement.appendChild(this._embedAnchorElement);
    this._embedIconElement = L.DomUtil.create('i', 'fas fa-code');
    this._embedAnchorElement.appendChild(this._embedIconElement);
    this.onClick();
  },

  onAdd: function(map) {
    return this._embedElement;
  },

  onClick: function() {
    var self = this;
    L.DomEvent.on(this._embedElement, 'click', function(ev) {
      prompt('Use this HTML code to embed this map on another site.', self.generateCode());
    });
  },

  generateCode: function() {
    var currentHash = window.location.hash;
    var path = window.location.pathname === '/example/embed.html' ? '/example/index.html' : window.location.pathname;
    var hostname = this.options.hostname;
    var code = '<iframe style="border:none;" width="100%" height="900px" src="//' + hostname + '/leaflet-environmental-layers' + path + currentHash +'"></iframe>';
    return code;
  },

  onRemove: function(map) {},

});

L.control.embed = function(options) {
  return new L.Control.Embed(options);
};
