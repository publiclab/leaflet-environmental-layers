Contributing to Leaflet Environmental Layers
==========================

We welcome community contributions to Leaflet Environmental Layers! For local installation, follow the instructions in the [README.md file](./README.md).

We especially welcome contributions from people from groups underrepresented in free and open source software!

Our community aspires to be a respectful place. Please read and abide by our [Code of Conduct](https://publiclab.org/conduct).

## First Timers Welcome!

New to open source/free software? See our WELCOME PAGE, including a selection of issues we've made especially for first-timers. We're here to help, so just ask if one looks interesting:

* https://code.publiclab.org/#r=all
* https://github.com/publiclab/leaflet-environmental-layers/issues?q=is%3Aopen+is%3Aissue+label%3Afirst-timer-only

Thank you so much!

Learn more about contributing to Public Lab code projects on these pages:

* https://publiclab.org/developers
* https://publiclab.org/contributing-to-public-lab-software
* https://publiclab.org/soc
* https://publiclab.org/wiki/developers
* https://publiclab.org/wiki/gsoc-ideas

## Adding a new layer

The library consists of multiple layers. It needs to add several other layers. There are issues pertaining to [new layers](https://github.com/publiclab/leaflet-environmental-layers/issues?q=is%3Aopen+is%3Aissue+label%3Anew-layer). 

### Steps to add a new layer :
1. Find an issue labelled <i>new layer</i>.
2. Go through the documentaion provided to understand how the API works.
3. Here's a codepen example that consists of a base layer and [Luftdaten Layer](https://github.com/publiclab/leaflet-environmental-layers/issues/88) as an overlay. You can check its full implementation [here](https://github.com/publiclab/leaflet-environmental-layers/pull/137).

### Steps to test a new layer :
1. Make a fixture file in html for the layer.
2. Load the fixture and test for markers and polygons using jasmine testing framework.
3. Run `grunt jasmine` to run tests and ensure they pass before making a commit.
4. [Here](https://github.com/publiclab/leaflet-environmental-layers/pull/206/files) is an example PR for writing tests. 

### Some sample PRs to be referred for adding new layers:
* OSM landfill mine quarry : [#94](https://github.com/publiclab/leaflet-environmental-layers/pull/94)
* Indigenous Lands Treaties Layer : [#78](https://github.com/publiclab/leaflet-environmental-layers/pull/78)


## Bug reports


## ES6-refactoring
j-bitmaker


If you want to submit a bug/issue , please go to https://github.com/publiclab/leaflet-environmental-layers/issues/new
