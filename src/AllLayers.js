L.LayerGroup.environmentalLayers = L.LayerGroup.extend(

  {
    options: {
      simpleLayerControl: false,
      hash: false,
      embed: false, // activates layers on map by default if true.
      currentHash: location.hash,
      addLayersToMap: false,
      defaultBaseLayer: L.tileLayer('https://a.tiles.mapbox.com/v3/jywarren.map-lmrwb2em/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }),
      // Source of Truth of Layers name .
      // please put name of Layers carefully in the the appropriate layer group.
      layers0: ['purpleLayer', 'toxicReleaseLayer', 'pfasLayer', 'aqicnLayer', 'osmLandfillMineQuarryLayer', 'Unearthing'],
      layers1: ['purpleairmarker', 'skytruth', 'fractracker', 'odorreport', 'mapknitter', 'openaq', 'luftdaten', 'opensense'],
      layers2: ['Power', 'Petroleum', 'Telecom', 'Water'],
      layers3: ['wisconsin'],
      layers4: ['income', 'americanIndian', 'asian', 'black', 'multi', 'hispanic', 'nonWhite', 'white', 'plurality'],
      layers5: ['clouds', 'cloudsClassic', 'precipitation', 'precipitationClassic', 'rain', 'rainClassic', 'snow', 'pressure', 'pressureContour', 'temperature', 'wind', 'city'],
      layers6: ['eonetFiresLayer', 'fracTrackerMobile'],

      OpenInfraMap_Power: L.tileLayer('https://tiles-{s}.openinframap.org/power/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://www.openinframap.org/about.html">About OpenInfraMap</a>',
      }),
      OpenInfraMap_Petroleum: L.tileLayer('https://tiles-{s}.openinframap.org/petroleum/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://www.openinframap.org/about.html">About OpenInfraMap</a>',
      }),
      OpenInfraMap_Telecom: L.tileLayer('https://tiles-{s}.openinframap.org/telecoms/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://www.openinframap.org/about.html">About OpenInfraMap</a>',
      }),
      OpenInfraMap_Water: L.tileLayer('https://tiles-{s}.openinframap.org/water/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://www.openinframap.org/about.html">About OpenInfraMap</a>',
      }),
    },

    initialize: function(param) {
      param = param || {};
      if (!!param.hash) {
        this.options.hash = param.hash;
      }
      if (!!param.baseLayers) {
        this.options.baseLayers = param.baseLayers;
      }
      if (!!param.include) {
        this.options.addLayersToMap = param.addLayersToMap === false ? false : true;
      }
      param.all = [...this.options.layers0, ...this.options.layers1, ...this.options.layers2, ...this.options.layers3, ...this.options.layers4, ...this.options.layers5, ...this.options.layers6];
      if (!param.include || !param.include.length) {
        param.include = param.all;
      }
      if (!!param.exclude && param.exclude.length > 0) {
        param.include =param.include.filter(function(a) {
          return param.exclude.indexOf(a) == -1;
        });
      }

      this.options.layers = param;

      if (!!param.embed) {
        this.options.embed = param.embed;
      }
      if (!!param.hostname) {
        this.options.hostname = param.hostname;
      }
      if (!!param.simpleLayerControl) {
        this.options.simpleLayerControl = param.simpleLayerControl;
      }
    },

    onAdd: function(map) {
      this._map = map;
      this.overlayMaps = {};
      this.groupedOverlayMaps = {}; // For grouping layers in the new menu
      var baseMaps = this.options.baseLayers ? this.options.baseLayers : { "Grey-scale": this.options.defaultBaseLayer.addTo(map) };

      for (let layer of this.options.layers.include) {
        if (this.options.layers0.includes(layer)) {
          this.overlayMaps[layer] = window['L']['layerGroup'][layer]();
          switch(layer) {
            case 'purpleLayer':
              if (!this.groupedOverlayMaps.PurpleAir) {
                this.groupedOverlayMaps.PurpleAir = { category: 'group', layers: {} };
                this.groupedOverlayMaps.PurpleAir.layers[layer] = this.overlayMaps[layer];
              } else {
                this.groupedOverlayMaps.PurpleAir.layers[layer] = this.overlayMaps[layer];
              };
              break;
            case 'toxicReleaseLayer':
              this.groupedOverlayMaps['Toxic Release'] = this.overlayMaps[layer];
              break;
            case 'aqicnLayer':
              this.groupedOverlayMaps['Air Quality Index'] = this.overlayMaps[layer];
              break;
            case 'osmLandfillMineQuarryLayer':
              this.groupedOverlayMaps['OSM landfills, quarries'] = this.overlayMaps[layer];
              break;
            default:
              this.groupedOverlayMaps[layer] = this.overlayMaps[layer];  
            this.groupedOverlayMaps[layer] = this.overlayMaps[layer];
              this.groupedOverlayMaps[layer] = this.overlayMaps[layer];  
          }
        }
        else if (this.options.layers1.includes(layer)) {
          this.overlayMaps[layer] = window['L']['layerGroup']['layerCode'](layer);
          switch(layer) {
            case 'purpleairmarker':
              if (!this.groupedOverlayMaps.PurpleAir) {
                this.groupedOverlayMaps.PurpleAir = { category: 'group', layers: {} };
                this.groupedOverlayMaps.PurpleAir.layers[layer] = this.overlayMaps[layer];
              } else {
                this.groupedOverlayMaps.PurpleAir.layers[layer] = this.overlayMaps[layer];
              }
              break;
            default:
              this.groupedOverlayMaps[layer] = this.overlayMaps[layer];
          }
        }
        else if (this.options.layers2.includes(layer)) {
          if(!this.groupedOverlayMaps.OpenInfraMap) {
            this.groupedOverlayMaps.OpenInfraMap = { category: 'group', layers: {} };
          }
          
          switch (layer) {
          case 'Power':
            this.overlayMaps[layer] = this.options.OpenInfraMap_Power;
            this.groupedOverlayMaps.OpenInfraMap.layers[layer] = this.overlayMaps[layer];
            break;
          case 'Petroleum':
            this.overlayMaps[layer] = this.options.OpenInfraMap_Petroleum;
            this.groupedOverlayMaps.OpenInfraMap.layers[layer] = this.overlayMaps[layer];
            break;
          case 'Telecom':
            this.overlayMaps[layer] = this.options.OpenInfraMap_Telecom;
            this.groupedOverlayMaps.OpenInfraMap.layers[layer] = this.overlayMaps[layer];
            break;
          case 'Water':
            this.overlayMaps[layer] = this.options.OpenInfraMap_Water;
            this.groupedOverlayMaps.OpenInfraMap.layers[layer] = this.overlayMaps[layer];
            break;
          }
        }
        else if (this.options.layers3.includes(layer)) {
          this.overlayMaps[layer] = window[layer + 'Layer'](map);
          switch(layer) {
            case 'wisconsin':
              this.groupedOverlayMaps['Wisconsin Non-metal'] = this.overlayMaps[layer];
              break;
            default:
              this.groupedOverlayMaps[layer] = this.overlayMaps[layer];
          }
        }
        else if (this.options.layers4.includes(layer)) {
          if(!this.groupedOverlayMaps.Justicemap) {
            this.groupedOverlayMaps.Justicemap = { category: 'group', layers: {} };
          }
          this.overlayMaps[layer] = window['L']['tileLayer']['provider']('JusticeMap.'+layer);
          this.groupedOverlayMaps.Justicemap.layers[layer] = this.overlayMaps[layer];
        }
        else if (this.options.layers5.includes(layer)) {
          if(!this.groupedOverlayMaps['Open Weather Map']) {
            this.groupedOverlayMaps['Open Weather Map'] = { category: 'group', layers: {} };
          }
          let obj = {};
          if (layer === 'clouds') {
            obj = {showLegend: true, opacity: 0.5};
          }
          if (layer === 'city') {
            layer = 'current';
            obj = {intervall: 15, minZoom: 3};
          }
          this.overlayMaps[layer] = window['L']['OWM'][layer](obj);
          this.groupedOverlayMaps['Open Weather Map'].layers[layer] = this.overlayMaps[layer];
        }
        else if (this.options.layers6.includes(layer)) {
          this.overlayMaps[layer] = window['L']['geoJSON'][layer]();
          switch(layer) {
            case 'eonetFiresLayer':
              this.groupedOverlayMaps['EONET Fires'] = this.overlayMaps[layer];
              break;
            default:
              this.groupedOverlayMaps[layer] = this.overlayMaps[layer];
          }
        }
        else {
          console.log('Incorrect Layer Name');
        }
      }

      if (this.options.embed) {
        this.options.hostname ? (
          L.control.embed({
            hostname: this.options.hostname,
          }).addTo(map)
        ) : L.control.embed().addTo(map);
      }

      this.options.simpleLayerControl ? 
      L.control.layers(baseMaps, this.overlayMaps).addTo(map) :
      L.control.layersBrowser(baseMaps, this.groupedOverlayMaps).addTo(map);

      var allMaps = Object.assign(baseMaps, this.overlayMaps);
      if (this.options.hash) {
        var hash = new L.FullHash(map, allMaps);
        // Update map state from hash
        hash.update(this.options.currentHash);
      }
        
      for (let layer of this.options.layers.include) {
        if (!this.options.addLayersToMap) {
          return;
        }
        map.addLayer(this.overlayMaps[layer]);
      }
      
    },

    onRemove: function(map) {},
  },
);


L.LayerGroup.EnvironmentalLayers = function(options) {
  return new L.LayerGroup.environmentalLayers(options);
};
