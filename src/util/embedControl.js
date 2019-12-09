L.Control.Embed = L.Control.extend({

    options: {
        position: 'bottomleft',
    },

    initialize: function(options) {
        L.Util.setOptions(this, options);
        this._embedElement = L.DomUtil.create('button');
        this._embedIconElement = L.DomUtil.create('i', 'fa fa-code')
        this._embedElement.appendChild(this._embedIconElement);
        this.onClick();
    },

    onAdd: function(map) {
        return this._embedElement;
    },

    onClick: function() {
        var self = this;
        L.DomEvent.on(this._embedElement, 'click', function(ev) {
            prompt('Use this HTML code to embed this map on another site.', self.generateCode())
        })
    },

    getUrlHashParameters: function() {
        var hash = window.location.hash;
        var getValues = hash.substr(1).split('/');
        var params = {
            lat: getValues[1],
            lng: getValues[2],
            zoom: getValues[0],
            layers: getValues[3]
        }
        return params;
    },

    generateCode: function() {
        var params = this.getUrlHashParameters();
        var code = '<iframe style="border:none;" width="100%" height="900px" src="//publiclab.github.io/leaflet-environmental-layers/example/#' + params.zoom + '/' + params.lat + '/' + params.lng + '/' + params.layers +'"></iframe>';
        return code;
    },

    onRemove: function(map) {}

})

L.control.embed = function(options) {
    return new L.Control.Embed(options);
}
