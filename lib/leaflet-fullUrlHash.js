(function(window) {
	var HAS_HASHCHANGE = (function() {
		var doc_mode = window.documentMode;
		return ('onhashchange' in window) &&
			(doc_mode === undefined || doc_mode > 7);
	})();

	L.FullHash = function(map, options) {
		this.onHashChange = L.Util.bind(this.onHashChange, this);

		if (map) {
			this.init(map, options);
		}
	};

	L.FullHash.parseHash = function(locationHash) {
		// Modified from urlHash library -> https://github.com/jywarren/urlhash
		// -----------------------------------
		var hash = locationHash || location.hash;
		if (hash) hash = hash.split('#')[1];
		var pairs = hash.split('&');
		var object = {};
		pairs.forEach(function(pair, i) {
		    pair = pair.split('=');
		    if (pair[0] != '') object[pair[0]] = pair[1];
		});


		if(isNaN(object.lat) || isNaN(object.lon) || isNaN(object.zoom)) {
		    return false;
		} else {
		    return {
			    center: new L.LatLng(object.lat, object.lon),
			    zoom: object.zoom,
			    layers: object.layers.split(',')
			};
		}
		// -----------------------------------
	};

	L.FullHash.formatHash = function(map) {
		var center = map.getCenter(),
		    zoom = map.getZoom(),
		    precision = Math.max(0, Math.ceil(Math.log(zoom) / Math.LN2)),
		    layers = [];

		var options = this.options;
		//Check active layers
		for(var key in options) {
			if (options.hasOwnProperty(key)) {
				if (map.hasLayer(options[key])) {
					layers.push(key);
				};
			};
		};

		return "#lat=" + 
        center.lat.toFixed(precision) + "&lon=" + 
        center.lng.toFixed(precision) + "&zoom=" + 
        zoom + "&layers=" + layers.join(",")
	},

	L.FullHash.prototype = {
		map: null,
		lastHash: null,

		parseHash: L.FullHash.parseHash,
		formatHash: L.FullHash.formatHash,

		init: function(map, options) {
			this.map = map;
			L.Util.setOptions(this, options);

			// reset the hash
			this.lastHash = null;
			this.onHashChange();

			if (!this.isListening) {
				this.startListening();
			}
		},

		removeFrom: function(map) {
			if (this.changeTimeout) {
				clearTimeout(this.changeTimeout);
			}

			if (this.isListening) {
				this.stopListening();
			}

			this.map = null;
		},

		onMapMove: function() {
			// bail if we're moving the map (updating from a hash),
			// or if the map is not yet loaded

			if (this.movingMap || !this.map._loaded) {
				return false;
			}

			var hash = this.formatHash(this.map);
			if (this.lastHash != hash) {
				location.replace(hash);
				this.lastHash = hash;
			}
		},

		movingMap: false,
		update: function(locationHash) {
			var hash = locationHash || location.hash;
			if (hash === this.lastHash) {
				return;
			}
			var parsed = this.parseHash(hash);
			if (parsed) {
				this.movingMap = true;

				this.map.setView(parsed.center, parsed.zoom);
				var layers = parsed.layers,
					options = this.options,
					that = this;
				//Add/remove layers
				this.map.eachLayer(function(layer) {
					that.map.removeLayer(layer);
				});

				layers.forEach(function(element, index, array) {
					that.map.addLayer(options[element]);
				});			

				this.movingMap = false;
			} else {
				this.onMapMove(this.map);
			}
		},

		// defer hash change updates every 100ms
		changeDefer: 100,
		changeTimeout: null,
		onHashChange: function() {
			// throttle calls to update() so that they only happen every
			// `changeDefer` ms
			if (!this.changeTimeout) {
				var that = this;
				this.changeTimeout = setTimeout(function() {
					that.update();
					that.changeTimeout = null;
				}, this.changeDefer);
			}
		},

		isListening: false,
		hashChangeInterval: null,
		startListening: function() {
			this.map.on("moveend layeradd layerremove", this.onMapMove, this);

			if (HAS_HASHCHANGE) {
				L.DomEvent.addListener(window, "hashchange", this.onHashChange);
			} else {
				clearInterval(this.hashChangeInterval);
				this.hashChangeInterval = setInterval(this.onHashChange, 50);
			}
			this.isListening = true;
		},

		stopListening: function() {
			this.map.off("moveend layeradd layerremove", this.onMapMove, this);

			if (HAS_HASHCHANGE) {
				L.DomEvent.removeListener(window, "hashchange", this.onHashChange);
			} else {
				clearInterval(this.hashChangeInterval);
			}
			this.isListening = false;
		},

		_keyByValue: function(obj, value) {
			for(var key in obj) {
				if (obj.hasOwnProperty(key)) {
					if (obj[key] === value) {
						return key;
					} else { return null; };
				};
			};
		}
	};
	L.fullHash = function(map, options) {
		return new L.FullHash(map, options);
	};
	L.Map.prototype.addHash = function() {
		this._fullhash = L.fullHash(this, this.options);
	};
	L.Map.prototype.removeHash = function() {
		this._fullhash.removeFrom();
	};
})(window);
