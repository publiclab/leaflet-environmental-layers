leaflet-blurred-location
====

[![Build Status](https://travis-ci.org/publiclab/leaflet-blurred-location.svg)](https://travis-ci.org/publiclab/leaflet-blurred-location)
[![Code Climate](https://codeclimate.com/github/publiclab/leaflet-blurred-location/badges/gpa.svg)](https://codeclimate.com/github/publiclab/leaflet-blurred-location)

A Leaflet-based HTML interface for selecting a "blurred" or low-resolution location, to preserve privacy.

Try the demo here: https://publiclab.github.io/leaflet-blurred-location/examples/

![screenshot](https://publiclab.org/system/images/photos/000/029/443/original/Screenshot_2019-02-18_at_6.52.33_PM.png)

## How it works

When "blurring" is enabled (as by default), `leaflet-blurred-location` will truncate the latitude and longitude of the input location to the given `precision` -- which is set based on the zoom level of the displayed map.

By comparison: "Did you know? Google Analytics rounds latitude and longitude to 4 digits, thus, providing a maximum precision of 11.1m." (miles) -- [radical-analytics.com](https://radical-analytics.com/case-study-accuracy-precision-of-google-analytics-geolocation-4264510612c0) `leaflet-blurred-location` provides a flexible means of truncating coordinates to different lengths through a visual interface. 

Note that a change in longitude precision (say, from 0.12 to 0.1) will translate to different real-world distances depending on the latitude north or south -- because the longitude grid is more compact near the Earth's poles, where it converges. One degree of longitude at the latitude of New York City is roughly 80km, while it's 111km at the equator. See this chart for longitude lengths at different latitudes:

| latitude | longitude |
|----------|-----------|
| 0°       | 111.320 km |
| 15°      | 107.551 km |
| 30°      | 96.486 km |
| 45°      | 78.847 km |
| 60°      | 55.800 km |
| 75°      | 28.902 km |
| 90°      | 0.000 km  |


### Precision and zoom

The precision of locations is displayed as a map with a grid overlay, where each grid cell is based on the latitude/longitude degree grid, but subdivided to `precision` number of decimal places.

So for a `precision` of 2, the grid has `0.01` degree spacing. For `precision` of 5, it has `0.00001` degree spacing.

Precision `1` would look like this:

```
__________________________________________
|72.0,44.3           |72.0,44.4           |
|                    |                    |
|                    |                    |
|                    |                    |
-------------------------------------------
|72.1,44.3           |72.1,44.4           |
|                    |                    |
|                    |                    |
|                    |                    |
-------------------------------------------
```

Zooming into the upper left square would then break that up into 10 subdivisions from `72.00` to `72.09` and `44.30` to `44.39`, and increase the precision by 1.

We've tried to get the actual map zoom level to correlate reasonably to the value of `precision`, on [these lines of code](https://github.com/publiclab/leaflet-blurred-location/blob/master/src/core/gridSystem.js#L12-L17) to best display grids on varying screen sizes and zoom levels.

We're open to variations on this if you have suggestions; please [open an issue](https://github.com/publiclab/leaflet-blurred-location/issues/new)!.

****

## Human-readable blurring

Leaflet.BlurredLocation also tries to return a human readable string description of location at a specificity which corresponds to the displayed precision of the location selected.It also specifies the scale in a human readable format for the grid on the map using the button 'Show scale in km'. 

More coming soon on this, see https://github.com/publiclab/leaflet-blurred-location/issues/98

Our (draft) table to correlate zoom level, precision, and human-readable scale (from "country" to "building") is as follows:

Zoom level | Lat/lon coordinate precision | Human-readable placename
--|----|---
0 | `x0.0` | planet
5 | `x0.0` | state, province, country
6 | `x.0` | state, province, region
10 | `0.x` | city, postal code
13 | `0.0x` | neighborhood
16 | `0.00x` | block

****

## Setting up leaflet-blurred-location

To set up the library first clone this repo to your local environment; then run 'npm install' to install all the necessary packages required. Open `examples/index.html` to look at the preview of the library.

Compulsory add these for spinner to work : 

```
<script src="http://cdn.jsdelivr.net/gh/makinacorpus/Leaflet.Spin/example/spin/dist/spin.min.js"></script>

<script src="https://cdn.jsdelivr.net/gh/makinacorpus/Leaflet.Spin/leaflet.spin.min.js"></script>
```

There is a simpler version as well which is a simple location entry namely `examples/simple.html`, you can view an online demo at https://mridulnagpal.github.io/leaflet-blurred-location/examples/simple.html

To use slider for map zoom you need to include these CDNs to your html.

```
<script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-slider/10.2.0/bootstrap-slider.js" integrity="sha256-0w/fZPAdu72g2CGIv9Ha8Lp9qXAjls4R2QmMJ5B2Qb4=" crossorigin="anonymous"></script>

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-slider/10.2.0/css/bootstrap-slider.min.css" />
``` 

## Creating a map object

To create a new object just call the constructor 'BlurredLocation' as shown in the following example:
(There must a div with id="map" in your html to hold the object)

```js
// this "constructs" an instance of the library:
var blurredLocation = new BlurredLocation({
  lat: 41.01,
  lon: -85.66
});

blurredLocation.getLat(); // should return 41.01
blurredLocation.getLon(); // should return -85.66
```

****

## Contributing

We welcome contributions, and are especially interested in welcoming [first time contributors](#first-time). Read more about [how to contribute](#developers) below! We especially welcome contributions from people from groups under-represented in free and open source software!

****

## Options

### Basic

| Option         | Use                                   | Default                  |
|----------------|---------------------------------------|--------------------------|
| blurredLocation| the initial co-ordinates of the map   | `{ lat: 1.0, lon: 1.0 }` |
| zoom           | the initial zoom of the map           | 6                        |
| mapID          | the ID of the map container           | `'map'`                  |
| pixels         | the pixel size to calculate precision | `400`                    |

### Interface options

| Option         | Use                         | Default |
|----------------|-----------------------------|---------|
| latId          | the input to set latitude   | `'lat'` |
| lngId          | the input to set longitude  | `'lng'` |
| geocodeButtonId          | the division to wrapping "Get my location" for inserting spinner icons  | `'ldi-geocode-button'` |
| scaleDisplay          | Element to display scale in km  | `'scale'` |

## API

| Methods                      | Use                | Usage (Example)   |
|------------------------------|--------------------|-------------------|
| `blurredLocation.getLat()`          | get the current latitude of map center | returns a decimal |
| `blurredLocation.getLon()`          | get the current latitude of map center | returns a decimal |
| `blurredLocation.goTo(lat, lon, zoom)`  | three parameters: latitude, longitude and zoom, set the map center | `location.goTo(44.51, -89.99, 13)` sets center of map to `44.51, -89.99` with `zoom` set as `13` |
| `blurredLocation.isBlurred()`           | returns `true` if blurring is on; that is, if the location is being partially obscured | returns a boolean `true` / `false` |
| `blurredLocation.setBlurred(boolean)`   | Enables "location blurring" to obscure the location: the location will be obscured to the smallest latitude/longitude grid square which the map center falls in |
| `blurredLocation.getFullLat()`   | Returns non-truncated latitude of map center, regardless of precision | `location.getFullLat()` returns decimal |
| `blurredLocation.getFullLon()` | Returns non-truncated longitude of map center, regardless of precision | `location.getFullLon()` returns decimal |
| `blurredLocation.getPrecision()` | Returns precision of degrees -- represented by width or height of one grid cell. Returns an integer which represents the number of decimal places occupied by one cell. For instance, a precision of 1 will mean 0.1 degrees per cell, 2 will mean 0.01 degrees, and so on | `location.getPrecision()` This would return the precision of the map at the current zoom level. |
| `blurredLocation.getPlacenameFromCoordinates()` | Returns human-readable location name of a specific latitude and longitude. This would take in 3 arguments namely latitude, longitude and a callback function which is called on success and would return address of the location pinpointed by those co-ordinates| `blurredLocation.getPlacenameFromCoordinates(43, 43, function(result) { console.log(result) }` This would return the output to the console |
| `blurredLocation.map` | Used to access the Leaflet object | |
| `blurredLocation.setZoomByPrecision()` | Zooms map to the given precision. | `blurredLocation.setZoomByPrecision(2)` This would zoom the map so that the precision of map becomes 2, and each grid square is `0.01` degrees wide and tall. |

## Features

| Feature         | Use                                                        |
|-----------------|------------------------------------------------------------|
| **'Blurred' location input** | Your exact location won't be posted, only the grid square it falls within will be shown. Zoom out to make it harder to tell exactly where your location is. Drag the map to change your location and the amount of blurring. |
| **'Blurred' human-readable location** | Current location of the map will be reverse geocoded and the name of the location will be displayed. The extent of address depends on the precision level you currently are on. For instance for precision 0 only the country name will be provided as you zoom in precision will increase and so will the address details, such as state, city, etc. |
| **Truncated co-ordinates** | You may enter co-ordinates in the input boxes, string search or pan the map to a certain location and the co-ordinate input boxes will be truncated with the current location of the map with appropriate precision as well. |
| **Browser-based geolocation** | Uses the browser geolocation API to request location and pan the map there. |

## Testing

Automated tests are an essential way to ensure that new changes don't break existing functionality, and can help you be confident that your code is ready to be merged in. We use Jasmine for testing: https://jasmine.github.io/2.4/introduction.html

To run tests, open /test.html in a browser. If you have phantomjs installed, you can run `grunt jasmine` to run tests on the commandline.

You can find the installation instructions for phantomjs in its official [build documentation](http://phantomjs.org/build.html). For Ubuntu/debian based system you can follow [these instructions](https://gist.github.com/julionc/7476620) or use the script mentioned there.

To add new tests, edit the `*_spec.js` files in `/spec/javascripts/`.

## Developers

Help improve Public Lab software!

* Join the 'plots-dev@googlegroups.com' discussion list to get involved
* Look for open issues at https://github.com/publiclab/leaflet-blurred-location/issues
* We're specifically asking for help with issues labelled with [help-wanted](https://github.com/publiclab/leaflet-blurred-location/labels/help-wanted) tag
* Find lots of info on contributing at http://publiclab.org/wiki/developers
* Review specific contributor guidelines at http://publiclab.org/wiki/contributing-to-public-lab-software
* Some devs hang out in http://publiclab.org/chat (irc webchat)
* Join our gitter chat at https://gitter.im/publiclab/publiclab

## First Time?

New to open source/free software? Here is a selection of issues we've made especially for first-timers. We're here to help, so just ask if one looks interesting : https://github.com/publiclab/leaflet-blurred-location/labels/first-timers-only
