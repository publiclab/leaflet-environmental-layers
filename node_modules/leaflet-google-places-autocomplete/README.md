# Leaflet Google Places Autocomplete

Simple extension to add Google Places autocomplete into map.


## Installation

### Bower

    bower install --save leaflet-google-places-autocomplete

### NPM

    npm install --save leaflet-google-places-autocomplete

## Usage

Make sure you have Google Places library **with valid API key** loaded on page.

```html
    <script src="https://maps.googleapis.com/maps/api/js?key=<key>&libraries=places"></script>
```

```javascript

new L.Control.GPlaceAutocomplete().addTo(map);

```

```javascript

new L.Control.GPlaceAutocomplete({
	callback: function(place){
		var loc = place.geometry.location;
		map.setView( [loc.lat(), loc.lng()], 18);
	}
}).addTo(map);

```

## API

#### <a name="autocompleteOptions"></a> Options

These options can be set up when creating the control with `autocompleteOptions`.

Option                | Default       | Version | Description
----------------------|---------------|---------|--------------------------------------------------
`position`            | `topright`    | v0.0.5  | any valid LeafLet [position](http://leafletjs.com/reference.html#control-positions)
`prepend`             | `true`:bool   | v0.0.5  | If true, control will prepended to other existing controls, if false, control will be appended
`callback`            | -             | v0.0.5  | any valid function as callback. By default internal callback is set and just pan the map to found position
`autocomplete_options`| {}            | v0.0.5  | default options for google autocomplete
`collapsed_mode`      | `false`:bool  | v0.0.6  | if set to true, then just click-able icon will be displayed
`placeholder`         | `null`:string | v0.0.9  | custom placeholder for input text
