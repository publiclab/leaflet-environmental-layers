L.Control.Badge = L.Control.extend({

    initialize: function(content, options) {
        this.content = content;
        L.setOptions(this, options);
    },

	onAdd: function(map) {
        var badgeElement = L.DomUtil.create('div');
        
        badgeElement.classList.add('badge');
        badgeElement.innerHTML = this.content;

		return badgeElement;
	},

	onRemove: function(map) {
		// Nothing to do here
    }
    
});

L.control.badge = function(content, options) {
	return new L.Control.Badge(content, options);
}