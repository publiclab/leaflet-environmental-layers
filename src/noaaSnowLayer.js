// Leaflet integration for NOAA Snow Depth Analysis

L.NOAA = L.NOAA || {};

L.NOAA.Snow = L.TileLayer.extend({
  options: {
    attribution: 'Snow analysis from <a href="https://www.nohrsc.noaa.gov/">NOAA NOHRSC</a>',
    baseUrl: 'https://opengeo.ncep.noaa.gov/geoserver/conus/conus_snwd/ows?service=WMS&version=1.3.0&request=GetMap&layers=conus_snwd&styles=&format=image/png&transparent=true&width=256&height=256&crs=EPSG:3857&bbox={bbox-epsg-3857}',
    minZoom: 4,
    maxZoom: 12,
    opacity: 0.6,
    detectRetina: false,
    tileSize: 256,
    showLegend: true,
    legendImagePath: 'https://www.nohrsc.noaa.gov/snow_model/images/legend_snowdepth.png', // placeholder legend
    legendPosition: 'bottomright',
  },

  initialize: function(options) {
    L.Util.setOptions(this, options);

    // Prepare the dynamic tile URL if needed
    var tileUrl = this.options.baseUrl;
    L.TileLayer.prototype.initialize.call(this, tileUrl, options);

    this._map = null;
    this._legendControl = null;
    this._legendId = null;
  },

  onAdd: function(map) {
    this._map = map;
    if (this.options.showLegend && this.options.legendImagePath) {
      this._legendControl = this._getLegendControl();
      this._legendId = this._legendControl.addLegend(this.options.legendImagePath);
    }
    L.TileLayer.prototype.onAdd.call(this, map);
  },

  onRemove: function(map) {
    if (this._legendControl) {
      this._legendControl.removeLegend(this._legendId);
      this._legendControl = null;
      this._legendId = null;
    }
    L.TileLayer.prototype.onRemove.call(this, map);
    this._map = null;
  },

  _getLegendControl: function() {
    if (!this._map._noaa_snow_legendcontrol) {
      this._map._noaa_snow_legendcontrol = new L.NOAA.LegendControl({position: this.options.legendPosition});
      this._map.addControl(this._map._noaa_snow_legendcontrol);
    }
    return this._map._noaa_snow_legendcontrol;
  }
});

// Factory method
L.NOAA.snowLayer = function(options) {
  return new L.NOAA.Snow(options);
};

// Simple LegendControl reused from OWM style
L.NOAA.LegendControl = L.Control.extend({
  options: {
    position: 'bottomright',
  },

  initialize: function(options) {
    L.Util.setOptions(this, options);
    this._container = L.DomUtil.create('div', 'noaa-snow-legend-container');
    this._container.style.display = 'none';
    this._legendCounter = 0;
    this._legendContainer = [];
  },

  onAdd: function(map) {
    return this._container;
  },

  addLegend: function(legendImagePath) {
    var legendId = this._legendCounter++;
    this._legendContainer[legendId] = legendImagePath;
    this._redrawLegend();
    this._container.style.display = 'block';
    return legendId;
  },

  removeLegend: function(legendId) {
    if (this._legendContainer[legendId]) {
      delete this._legendContainer[legendId];
    }
    if (Object.keys(this._legendContainer).length === 0) {
      this._legendCounter = 0;
      this._container.style.display = 'none';
    }
    this._redrawLegend();
  },

  _redrawLegend: function() {
    this._container.innerHTML = '';
    for (var idx in this._legendContainer) {
      var imgPath = this._legendContainer[idx];
      var img = L.DomUtil.create('img', 'noaa-snow-legend-item', this._container);
      img.src = imgPath;
      img.style.display = 'block';
      img.style.margin = '5px 0';
    }
  }
});

/**
 * Usage:
 * 
 * var snowLayer = L.NOAA.snowLayer({opacity: 0.7});
 * snowLayer.addTo(map);
 */
