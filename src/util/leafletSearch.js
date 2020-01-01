L.Control.Search = L.Control.extend({
	options: {
		position: 'topleft',
		title: 'Nominatim Search',
		email: ''
	},

	onAdd: function( map ) {
		this._map = map;
		var container = L.DomUtil.create('div', 'leaflet-bar');
		var link = L.DomUtil.create('a', '', container);
		link.href = '#';
        link.title = this.options.title;
        this._icon = L.DomUtil.create('i', 'fas fa-search', link);

		var stop = L.DomEvent.stopPropagation;
		L.DomEvent
			.on(link, 'click', stop)
			.on(link, 'mousedown', stop)
			.on(link, 'dblclick', stop)
			.on(link, 'click', L.DomEvent.preventDefault)
			.on(link, 'click', this._toggle, this);


		var form = this._form = document.createElement('form');
		form.style.display = 'none';
		form.style.position = 'absolute';
		form.style.left = '27px';
		form.style.top = '0px';
		form.style.zIndex = -10;
		var input = this._input = document.createElement('input');
		input.style.height = '30px';
		input.style.border = '1px solid grey';
		input.style.padding = '0 0 0 10px';
		form.appendChild(input);
		L.DomEvent.on(form, 'submit', function() { this._doSearch(input.value); return false; }, this).on(form, 'submit', L.DomEvent.preventDefault);
		container.appendChild(form);

		return container;
	},

	_toggle: function() {
		if( this._form.style.display != 'block' ) {
			this._form.style.display = 'block';
			this._input.focus();
		} else {
			this._collapse();
		}
	},

	_collapse: function() {
		this._form.style.display = 'none';
		this._input.value = '';
	},

	_nominatimCallback: function( results ) {
		if( results && results.length > 0 ) {
			var bbox = results[0].boundingbox;
			this._map.fitBounds(L.latLngBounds([[bbox[0], bbox[2]], [bbox[1], bbox[3]]]));
		}
		this._collapse();
	},

	_callbackId: 0,

	_doSearch: function( query ) {
		var callback = '_l_osmgeocoder_' + this._callbackId++;
		window[callback] = L.Util.bind(this._nominatimCallback, this);
		var queryParams = {
			q: query,
			format: 'json',
			limit: 1,
			'json_callback': callback
		};
		if( this.options.email )
			queryParams.email = this.options.email;
		if( this._map.getBounds() )
			queryParams.viewbox = this._map.getBounds().toBBoxString();
		var url = 'http://nominatim.openstreetmap.org/search' + L.Util.getParamString(queryParams);
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = url;
		document.getElementsByTagName('head')[0].appendChild(script);
	},

});

L.control.search = function( options ) {
	return new L.Control.Search(options);
};