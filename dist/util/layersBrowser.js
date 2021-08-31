(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports={
  "aqicnLayer": {
    "name": "Air Quality Index",
    "url": "http://aqicn.org/json-api/doc/",
    "data": {
      "type": "RT",
      "disclaimer": "Data consistency is verified, in real-time, with the neighbor stations, allowing to automatically detect defective monitoring stations, and remove them, if needed, from the map."
    },
    "description": "The World Air Quality Index project provides transparent and world-wide air quality information for more than 100 countries, covering more than 12,000 stations in 1000 major cities.",
    "layer_desc": "World-wide air quality information",
    "icon": "#096"
  },
  "eonetFiresLayer": {
    "name": "EONET Fires",
    "url": "https://eonet.sci.gsfc.nasa.gov/",
    "data": {
      "type": "NRT",
      "disclaimer": "Spatial and temporal extents of natural events represented in EONET are based on multiple sources, and often these representations are approximations at best."
    },
    "description": "EONET provides a curated source of continuously updated natural event metadata. EONET Events: Wildfires: Wildfires includes all nature of fire, including forest and plains fires, as well as urban and industrial fire events. Fires may be naturally caused or manmade.",
    "layer_desc": "All nature of fire events.",
    "icon": "#ff421d"
  },
  "fractracker": {
    "name": "FracTracker",
    "url": "https://www.fractracker.org/",
    "api_url": "https://spreadsheets.google.com/feeds/list/19j4AQmjWuELuzn1GIn0TFRcK42HjdHF_fsIa8jtM1yw/o4rmdye/public/values?alt=json" ,
    "data": {
      "type": "",
      "disclaimer": "Data from agency data sets to crowd-sourced data"
    },
    "description": "FracTracker Alliance studies, maps, and communicates the risks of oil and gas development to protect our planet and support the renewable energy transformation.",
    "layer_desc": "Oil and gas development",
    "icon": "#e8e800",
    "extents": {
      "minZoom": 5,
      "maxZoom": 15
    }
  },
  "fracTrackerMobile": {
    "name": "FracTracker Mobile",
    "url": "https://www.fractracker.org/",
    "data": {
      "type": "",
      "disclaimer": "Data from agency data sets to crowd-sourced data"
    },
    "description": "FracTracker Alliance studies, maps, and communicates the risks of oil and gas development to protect our planet and support the renewable energy transformation.",
    "layer_desc": "User reports",
    "icon": "#e4458b",
    "extents": {
      "minZoom": 5,
      "maxZoom": 15
    }
  },
  "indigenousLands": {
    "name": "Indigenous Lands",
    "layers": ["Territories", "Languages", "Treaties"],
    "url": "https://native-land.ca/",
    "data": {
      "type": "Historical data",
      "disclaimer": "This map does not represent or intend to represent official or legal boundaries of any Indigenous nations. To learn about definitive boundaries, contact the nations in question. Map sources: https://native-land.ca/resources/"
    },
    "description": "Native Land is a conglomeration of things: nations that still exist, nations that we only have records of for “first contact”, nations that have moved over time, and more.",
    "layer_desc": "Indigenous nations - Territories, Languages, Treaties",
    "icon": "#532200",
    "extents": {
      "minZoom": 6,
      "maxZoom": 15
    }
  },
  "justiceMap": {
    "name": "Justice Map",
    "layers": ["income", "americanIndian", "asian", "black", "multi", "hispanic", "nonWhite", "white", "plurality"],
    "url": "http://www.justicemap.org/index.php?giAdvanced=0#instruction_div",
    "data": {
      "type": "",
      "disclaimer": "Our information comes from the Census Bureau - the 2010 Census and the latest American Community Survey (five year summary)."
    },
    "description": "Visualize race and income data for your neighborhood, county, state, or the entire US",
    "layer_desc": "U.S race and income data",
    "icon": "#f3a482",
    "extents": {
      "bounds": [
                  [16.97274101999902, -172.880859375],
                  [71.27259471233448, -38.05664062500001]
                ],
      "minZoom": 5,
      "maxZoom": 15
    }
  },
  "luftdaten": {
    "name": "Luftdaten",
    "url": "https://maps.luftdaten.info",
    "data": {
      "type": "",
      "disclaimer": "At the moment we are developing a standard that will complement the official measurement results of LUBW. With our work we want to obtain a well-founded, empirically determined data set. It is primarily a picture of the overall situation. However, cooperation with various experts aims to achieve the greatest possible approximation of measurement results that are recorded using other measurement methods."
    },
    "description": "building particulate matter sensors and visualizing the data in an overall picture.",
    "layer_desc": "Fine dust measurement",
    "icon": "#4edd51"
  },
  "mapknitter": {
    "name": "MapKnitter",
    "url": "https://mapknitter.org/",
    "api_url": "https://mapknitter.org/map/region/Gulf-Coast.json",
    "data": {
      "type": "community submissions",
      "disclaimer": "Data from community submissions."
    },
    "description": "MapKnitter can make maps from any image source, but it was designed for making maps with aerial photos from balloons and kites. Balloon mapping is a low-cost way to take aerial photos using a camera, attached to a balloon, on a spool of string. People have done this from a few hundred feet up all the way to over 4,000 feet in the air.",
    "layer_desc": "Map data from aerial photos from balloons and kites",
    "icon": "#ca283b",
    "extents": {
      "minZoom": 10,
      "maxZoom": 15
    }
  },
  "odorreport": {
    "name": "Odor Reports",
    "url": "https://odorlog.ushahidi.io/views/map",
    "api_url": "https://odorlog.api.ushahidi.io/api/v3/posts/",
    "report_url": "http://www.odorcomplaint.com/",
    "data": {
      "type": "",
      "disclaimer": "Data based on the the <a href=\"http://www.odorcomplaint.com/\">Odor Complaint Form</a> plus a couple of logs found online"
    },
    "description": "Facilitates monitoring of bad odor events through the collection of data using a written odor log and an online map.",
    "layer_desc": "Bad odor events",
    "icon": "#ff00ff",
    "extents": {
      "minZoom": 8,
      "maxZoom": 15
    }
  },
  "openaq": {
    "name": "OpenAQ",
    "url": "https://openaq.org/",
    "data": {
      "type": "RT",
      "disclaimer": "OpenAQ-aggregate data are gathered in real-time from government agencies and no guarantees can be made for their accuracy. All quality control measures should be done by the user or by contacting the host source."
    },
    "description": "OpenAQ is a non-profit organization empowering communities around the globe to clean their air by harmonizing, sharing, and using open air quality data.",
    "layer_desc": "Air quality data",
    "icon": "#912d25"
  },
  "openInfraMap": {
    "name": "Open Infra Map",
    "layers": ["Power", "Petroleum", "Telecom", "Water"],
    "url": "https://openinframap.org/about.html",
    "contribute_url": "https://openinframap.org/about.html",
    "data": {
      "type": "",
      "disclaimer": "All the data currently displayed on OpenInfraMap is sourced directly from OpenStreetMap."
    },
    "description": "Open Infrastructure Map is a view of the world's hidden infrastructure mapped in the OpenStreetMap database.",
    "layer_desc": "World's hidden infrastructure",
    "icon": "#b59f10"
  },
  "opensense": {
    "name": "OpenSenseMap",
    "url": "https://opensensemap.org/",
    "report_url": "https://opensensemap.org/register",
    "data": {
      "type": "",
      "disclaimer": "Data collected from senseBoxes"
    },
    "description": "openSenseMap is a platform for open sensor data at which everyone can participate in.",
    "layer_desc": "Sensor data from senseboxes",
    "icon": ""
  },
  "openWeatherMap": {
    "name": "Open Weather Map",
    "layers": ["clouds", "cloudsClassic", "precipitation", "precipitationClassic", "rain", "rainClassic", "snow", "pressure", "pressureContour", "temperature", "wind", "city"],
    "url": "https://openweathermap.org/guide",
    "data": {
      "type": "RT",
      "disclaimer": "data from professional and private weather stations"
    },
    "description": "OpenWeatherMap provides many kinds of weather maps including Precipitation, Clouds, Pressure, Temperature, Wind.",
    "layer_desc": "Weather information",
    "icon": "#00a3fe"
  },
  "osmLandfillMineQuarryLayer": {
    "name": "Landfill, Mine, Quarry",
    "url": "https://wiki.openstreetmap.org/wiki/Map_Features",
    "api_url": "http://www.overpass-api.de/api/xapi",
    "data": {
      "type": "",
      "disclaimer": "OpenStreetMap emphasizes local knowledge. Contributors use aerial imagery, GPS devices, and low-tech field maps to verify that OSM is accurate and up to date. Our contributors include enthusiast mappers, GIS professionals, engineers running the OSM servers, humanitarians mapping disaster-affected areas, and many more."
    },
    "description": "A Landfill site (also known as a tip, dump, rubbish dump or dumping ground and historically as a midden) is a site for the disposal of waste materials by burial. A quarry is an area of land used for surface extraction (open-pit mining) of mineral or organic resources like rocks, gravel, sand, soil, clay, ore, coal or peat.",
    "layer_desc": "Land used for landfill and mine quarry",
    "icon": "#008000",
    "extents": {
      "minZoom": 11,
      "maxZoom": 15
    }
  },
  "pfaslayer": {
    "name": "PFAS",
    "url": "https://pfasproject.com/",
    "report_url": "mailto:pfasproject@gmail.com",
    "data": {
      "type": "",
      "disclaimer": "All locations represent the general area of a contamination site or public water detection. Locations were mapped using the best available data preserved in official records, including data provided by tests of public drinking water systems, the Safe Drinking Water Information System, the Department of Defense report “Addressing Perfluorooctane Sulfonate (PFOS) and Perfluorooctanoic Acid (PFOA),” and the Northeastern University Social Science Environmental Health Research Institute. Levels listed are for the range of the total of all PFAS detected at the time of the tests and do not reflect whether a water system is treating the water to reduce levels.Data on contaminated industrial and military sites was current as of October 2019."
    },
    "description": "Northeastern’s PFAS Contamination Site Tracker one of the most comprehensive resources available for tracking PFAS pollution in the U.S.",
    "layer_desc": "PFAS pollution in the U.S.",
    "icon": "#b52822",
    "extents": {
      "bounds": [
                  [16.97274101999902, -172.880859375],
                  [71.27259471233448, -38.05664062500001]
                ],
      "minZoom": 5,
      "maxZoom": 15
    }
  },
  "purpleair": {
    "name": "Purple Air",
    "url": "https://www.purpleair.com",
    "api_url": "https://www.purpleair.com/data.json",
    "report_url": "https://www.purpleair.com/register",
    "data": {
      "type": "RT",
      "disclaimer": "Every icon on the PurpleAir map represents a public PurpleAir sensor and the color indicates the real time PM2.5 reading on the US EPA Air Quality Index scale."
    },
    "description": "An air quality monitoring network built on a new generation of \"Internet of Things\" sensors",
    "layer_desc": "Air quality data from PurpleAir sensors",
    "icon": "#7c22b5",
    "layers": {
      "purpleLayer": {},
      "purpleairmarker": {
        "extents": {
           "minZoom": 8,
           "maxZoom": 15
         }
      }
    }
  },
  "skytruth": {
    "name": "SkyTruth Alerts",
    "url": "https://alerts.skytruth.org/",
    "api_url": "https://alerts1.skytruth.org/json",
    "data": {
      "type": "",
      "disclaimer": "SkyTruth’s Alerts application reads environmental incidents from multiple websites"
    },
    "description": "SkyTruth Alerts is a free service that provides daily updates of environmentally significant incidents by geographical area. ",
    "layer_desc": "Environmentally significant incidents",
    "icon": "#f00",
    "extents": {
      "minZoom": 10,
      "maxZoom": 15
    }
  },
  "toxicReleaseLayer": {
    "name": "TRI",
    "url": "https://www.epa.gov/enviro/tri-search",
    "api_url": "https://iaspub.epa.gov/enviro/efservice/tri_facility/pref_latitude/BEGINNING/",
    "data": {
      "type": "Historical data",
      "disclaimer": "The information submitted by facilities to the EPA and states is complied annually as the Toxics Release Inventory or TRI, and is stored in a publicly accessible database."
    },
    "description": "The Toxics Release Inventory (TRI) Search retrieves data from the TRI database in Envirofacts. The Toxics Release Inventory (TRI) tracks the management of over 650 toxic chemicals that pose a threat to human health and the environment.",
    "layer_desc": "Toxics Release Inventory",
    "icon": "#6ccc00",
    "extents": {
      "bounds": [
                  [60.54377524118842, -21.708984375000004],
                  [13.66733825965496, -148.27148437500003]
                ],
      "minZoom": 5,
      "maxZoom": 15
    }
  },
  "unearthing": {
    "name": "Unearthing Providence",
    "url": "https://publiclab.org/unearthing-pvd",
    "api_url": "",
    "data": {
      "type": "Historical data",
      "disclaimer": "Social scientists and computer scientists at Brown University have assembled a unique database that contains information on every manufacturing facility that operated in Rhode Island since the early 1950s. The database also contains information on other environmentally risky land uses such as gas stations, dry cleaners, and auto repair shops as far back as 1936. We have also collected information on “green” land uses such as urban parks, playgrounds, schools and community gardens dating back to 1915."
    },
    "description": "A platform for historical data-driven analyses of industrial land use, story-mapping, and community organizing.",
    "layer_desc": "Industrial land use, story-mapping, and community organizing",
    "icon": "#4f4fff",
    "extents": {
      "bounds": [
                  [42.2102, -72.0204],
                  [41.2272, -70.9618]
                ],
      "minZoom": 6,
      "maxZoom": 18
    }
  },
  "wisconsin": {
    "name": "Wisconsin Non-Metallic Mining",
    "url": "https://services.arcgis.com/jDGuO8tYggdCCnUJ/ArcGIS/rest/services/Nonmetallic_and_Potential_frac_sand_mine_proposals_in_West_Central_Wisconsin/FeatureServer/info/itemInfo?f=pjson",
    "api_url": "https://services.arcgis.com/jDGuO8tYggdCCnUJ/arcgis/rest/services/Nonmetallic_and_Potential_frac_sand_mine_proposals_in_West_Central_Wisconsin/FeatureServer/0/",
    "data": {
      "type": "",
      "disclaimer": "The information shown on this map was obtained from Wisconsin’s counties and cities in 2017 and thus may not be the most current, comprehensive data available. Source data for parcel polygons was collected between January–July of 2017. However, the tax roll year for most records is 2016, as the assessment cycle lags a year behind. To ensure the most current, comprehensive parcel data, consult the local government’s land information websites first, or contact the city or county land information office directly. The next release of the statewide parcel layer, V4, is tentatively scheduled for July 31, 2018."
    },
    "description": "These are all <a href='https://dnr.wi.gov/topic/Mines/Deposit.html' target='_blank'>non-metallic registered parcels</a> across West Central Wisconsin along with potential frac sand mine proposals based on ownership or overlap with existing sand mine operators or landowners.",
    "layer_desc": "Sand mine operators or landowners",
    "icon": "#739ccf",
    "extents": {
      "bounds": [
              [43.689721907017194, -93.12835693359376],
              [45.60250901510299, -89.54956054687501]
                ],
      "minZoom": 10,
      "maxZoom": 15
    }
  },
  "PLpeople": {
    "name": "PLpeople",
    "url": "http://publiclab.org",
    "data": {
      "type": "",
      "disclaimer": "disclaimer"
    },
    "description": "Long desc.",
    "layer_desc": "Users from publiclab.org",
    "icon": "#096",
    "extents": {
      "bounds": [
                  [-44.087585028245165, -148.88671875000003],
                  [76.63922560965888, 140.62500000000003]
                ],
      "minZoom": 3,
      "maxZoom": 18
    }
  }
}
},{}],2:[function(require,module,exports){
"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

L.Control.LayersBrowser = L.Control.Layers.extend({
  options: {
    collapsed: true,
    position: 'topright',
    autoZIndex: true,
    hideSingleBase: true,
    overlays: {},
    existingLayers: {},
    newLayers: []
  },
  initialize: function initialize(baseLayers, overlays, options) {
    this.options.overlays = overlays;
    L.Util.setOptions(this, options);
    this._layerControlInputs = [];
    this._layers = [];
    this._lastZIndex = 0;
    this._handlingClick = false; // List of layers/layergroups to be highlighted
    // Layers names listed are values of 'obj.group' for groups and 'obj.name' for the rest

    this._newLayerContainers = [];

    for (var i in baseLayers) {
      this._addLayer(baseLayers[i], i);
    }

    for (i in overlays) {
      if (overlays[i].category === 'group') {
        for (var j in overlays[i].layers) {
          this._addLayer(overlays[i].layers[j], j, true, i);
        }
      } else {
        this._addLayer(overlays[i], i, true);
      }
    }
  },
  setLayersBrowserSize: function setLayersBrowserSize(map) {
    var mapobj = map._container;
    var width = mapobj.offsetWidth;
    var mapSizeArray = [['xs', 0, 380], ['sm', 380, 590], ['md', 590, 880], ['lg', 880, 10000]];
    mapSizeArray.forEach(function (sizeMinMax) {
      if (width >= sizeMinMax[1] && width < sizeMinMax[2]) {
        mapobj.classList.add(sizeMinMax[0]);
      } else {
        mapobj.classList.remove(sizeMinMax[0]);
      }
    });
  },
  expand: function expand() {
    L.DomUtil.addClass(this._container, 'leaflet-control-layers-expanded');
    this._section.style.height = null;
    var acceptableHeight = this._map.getSize().y - (this._container.offsetTop + 50);

    if (acceptableHeight < this._section.clientHeight) {
      L.DomUtil.addClass(this._section, 'leaflet-control-layers-scrollbar');
      this._section.style.height = acceptableHeight + 'px';
    } else {
      L.DomUtil.removeClass(this._section, 'leaflet-control-layers-scrollbar');
    }

    this._checkDisabledLayers();

    this.options.newLayers = []; // Reset new layers list when the control is accessed

    this._alertBadge.innerHTML = '';
    this._alertBadge.style.display = 'none';
    this._layersLink.style.marginLeft = '0';
    return this;
  },
  collapse: function collapse() {
    L.DomUtil.removeClass(this._container, 'leaflet-control-layers-expanded');

    this._highlightLayers('none');

    this._newLayerContainers = [];
    return this;
  },
  _initLayout: function _initLayout() {
    var className = 'leaflet-control-layers';
    var container = this._container = L.DomUtil.create('div', className);
    var collapsed = this.options.collapsed; // makes this work on IE touch devices by stopping it from firing a mouseout event when the touch is released

    container.setAttribute('aria-haspopup', true);
    L.DomEvent.disableClickPropagation(container);
    L.DomEvent.disableScrollPropagation(container);
    var section = this._section = L.DomUtil.create('section', className + '-list' + ' ' + className + '-menu');
    var img = L.DomUtil.create('img', 'mx-auto d-block', section);
    img.src = 'https://static.thenounproject.com/png/257237-200.png';
    img.alt = 'industrial building icon by Parkjisun';
    img.style.maxHeight = '75px';
    img.style.maxWidth = '75px';
    var heading = L.DomUtil.create('h3', 'text-center', section);
    heading.innerHTML = 'Environmental data near here';
    var lead = L.DomUtil.create('p', 'text-center', section);
    lead.innerHTML = 'A range of groups publish environmental data near here. ';
    var readMoreLink = L.DomUtil.create('a', '', lead);
    readMoreLink.innerHTML = 'Read more';
    readMoreLink.href = '#';
    var or = L.DomUtil.create('span', '', lead);
    or.innerHTML = ' or ';
    var shareLink = L.DomUtil.create('a', '', lead);
    shareLink.innerHTML = 'share your own map data.';
    shareLink.href = '#';

    if (collapsed) {
      this._map.on('click', this.collapse, this);

      if (!L.Browser.android) {
        L.DomEvent.on(container, {
          mouseenter: this.expand,
          mouseleave: this.collapse
        }, this);
      }
    }

    var link = this._layersLink = L.DomUtil.create('a', className + '-toggle', container);
    link.href = '#';
    link.title = 'Layers';
    link.style.marginLeft = '0';
    var alert = this._alertBadge = L.DomUtil.create('section', 'rounded-circle bg-danger text-white text-center'); // Badge to alert new layers within bounds

    alert.style.display = 'none';
    alert.style.position = 'relative';
    alert.style.right = '55%';
    alert.style.top = '25%';
    alert.style.fontWeight = 'bold';
    alert.style.width = '23px';
    alert.style.height = '23px';
    alert.style.justifyContent = 'center';
    alert.style.alignItems = 'center';
    alert.innerHTML = '';
    link.appendChild(alert);

    if (L.Browser.touch) {
      L.DomEvent.on(link, 'click', L.DomEvent.stop);
      L.DomEvent.on(link, 'click', this.expand, this);
    } else {
      L.DomEvent.on(link, 'focus', this.expand, this);
    }

    if (!collapsed) {
      this.expand();
    }

    this._baseLayersList = L.DomUtil.create('div', className + '-base', section);
    this._separator = L.DomUtil.create('div', className + '-separator', section);
    this._overlaysList = L.DomUtil.create('div', className + '-overlays', section);
    this._overlaysList.style.maxHeight = '35vh';
    this._overlaysList.style.overflowY = 'scroll';
    this._overlaysList.style.overflowX = 'hidden';
    container.appendChild(section);
  },
  _addLayer: function _addLayer(layer, name, overlay, group) {
    if (this._map) {
      layer.on('add remove', this._onLayerChange, this);
    }

    this._layers.push({
      layer: layer,
      name: name,
      overlay: overlay,
      group: group
    });

    if (this.options.autoZIndex && layer.setZIndex) {
      this._lastZIndex++;
      layer.setZIndex(this._lastZIndex);
    }

    this._expandIfNotCollapsed();
  },
  _update: function _update() {
    if (!this._container) {
      return this;
    }

    L.DomUtil.empty(this._baseLayersList);
    L.DomUtil.empty(this._overlaysList);
    this._layerControlInputs = [];
    var baseLayersPresent;
    var overlaysPresent;
    var i;
    var obj;
    var baseLayersCount = 0;
    var map = this._map;
    var group;

    for (i = 0; i < this._layers.length; i++) {
      var groupHolder;
      obj = this._layers[i];

      if (obj.group && group !== obj.group) {
        this._createGroup(obj);

        groupHolder = this._createGroupHolder(obj);
      }

      ;

      if (groupHolder && obj.group) {
        groupHolder.appendChild(this._addItem(obj));
      } else {
        this._addItem(obj);
      }

      group = obj.group;
      overlaysPresent = overlaysPresent || obj.overlay;
      baseLayersPresent = baseLayersPresent || !obj.overlay;
      baseLayersCount += !obj.overlay ? 1 : 0;
    }

    map.on('overlayremove', function (e) {
      var mapId = this._map && this._map._container.id;

      var layerInfo = this._getLayerData(e);

      var selector = '#' + mapId + '-menu-' + e.name + ' .layer-name';
      var listLayerSelector = '#' + mapId + '-' + e.name + ' .layer-list-name';
      var layerTitle = e.group ? document.querySelector(listLayerSelector) : document.querySelector(selector);

      if (layerTitle && (layerTitle.innerHTML !== ' ' + layerInfo.name || layerTitle.innerHTML !== ' ' + e.name)) {
        layerTitle.innerHTML = e.group ? ' ' + e.name : ' ' + layerInfo.name;
      }
    }, this);

    this._showGroupTitle(); // Show group title when atleast one of its layers is active


    map.on('moveend', function () {
      if (this.options.newLayers.length > 0) {
        this._layersLink.style.marginLeft = '2.9em';
        this._alertBadge.style.display = 'flex';
        this._alertBadge.innerHTML = this.options.newLayers.length;

        this._highlightLayers('#ffffc6');
      } else {
        this._layersLink.style.marginLeft = '0';
        this._alertBadge.style.display = 'none';
        this._alertBadge.innerHTML = '';
      }

      this._showGroupTitle(); // Show group title when atleast one of its layers is active

    }, this); // Hide base layers section if there's only one layer.

    if (this.options.hideSingleBase) {
      baseLayersPresent = baseLayersPresent && baseLayersCount > 1;
      this._baseLayersList.style.display = baseLayersPresent ? '' : 'none';
    }

    this._separator.style.display = overlaysPresent && baseLayersPresent ? '' : 'none';
    return this;
  },
  _createSeparator: function _createSeparator() {
    var separator = document.createElement('div');
    separator.className = 'leaflet-control-layers-separator';
    separator.style.margin = '0';
    return separator;
  },
  _createLayerInfoElements: function _createLayerInfoElements(obj) {
    var data = this._getLayerData(obj);

    var icon = document.createElement('div');
    icon.className = 'rounded-circle layer-icon';
    icon.style.width = '10px';
    icon.style.height = '10px';
    icon.style.backgroundColor = data && data.icon || 'black';
    icon.style.display = 'inline-block';
    icon.style.margin = '0 1em';
    var reportBtn = document.createElement('a');
    reportBtn.setAttribute('role', 'button');
    reportBtn.setAttribute('href', '#');
    reportBtn.setAttribute('target', '_blank');
    reportBtn.innerHTML = 'Add a report';
    reportBtn.className = 'btn btn-default btn-outline-secondary btn-sm report-btn invisible';
    reportBtn.style.margin = '0 1em';
    reportBtn.style.lineHeight = '10px';
    reportBtn.style.color = '#717171';
    reportBtn.style.minWidth = '95px';

    if (data && data.report_url) {
      reportBtn.setAttribute('href', data.report_url);
      reportBtn.classList.remove('invisible');
    } else if (data && data.contribute_url) {
      reportBtn.setAttribute('href', data.contribute_url);
      reportBtn.innerHTML = 'Contribute';
      reportBtn.classList.remove('invisible');
    }

    reportBtn.addEventListener('mouseover', function () {
      reportBtn.style.color = 'white';
    });
    reportBtn.addEventListener('mouseout', function () {
      reportBtn.style.color = '#717171';
    });
    var layerDesc = document.createElement('span');
    layerDesc.innerHTML = data && data.layer_desc;
    layerDesc.className = 'layer-description';
    layerDesc.style.fontSize = '1.2em';
    var dataInfo = document.createElement('div');
    dataInfo.style.display = 'inline-block';
    dataInfo.className = 'float-sm-right layer-data-info';
    dataInfo.style.transform = 'translateY(6px)';
    var dataType = document.createElement('span');
    dataType.innerHTML = 'NRT/RT';
    dataType.style.color = '#717171';

    if (data && data.data.type !== 'NRT' && data.data.type !== 'RT') {
      dataType.classList.add('invisible');
    }

    var dataInfoBtn = document.createElement('button');
    dataInfoBtn.style.backgroundColor = 'transparent';
    dataInfoBtn.style.borderColor = 'transparent';
    var infoIcon = document.createElement('i');
    infoIcon.className = 'fas fa-info-circle';
    infoIcon.style.fontSize = '1.2em';
    infoIcon.style.color = '#717171';
    var infoModal;
    dataInfoBtn.addEventListener('click', function () {
      // Add only one instance of the modal for the map layer
      if (!infoModal || !infoModal.options.mapHasControl) {
        infoModal = new L.control.info({
          text: data && data.data.disclaimer,
          classname: 'info-modal'
        });
        infoModal.addTo(map);
      }
    });
    dataInfo.appendChild(dataType);
    dataInfo.appendChild(dataInfoBtn);
    dataInfoBtn.appendChild(infoIcon);
    return {
      name: data && data.name,
      icon: icon,
      reportBtn: reportBtn,
      layerDesc: layerDesc,
      dataInfo: dataInfo,
      dataType: dataType,
      dataInfoBtn: dataInfoBtn,
      infoIcon: infoIcon
    };
  },
  _createGroup: function _createGroup(obj) {
    if (obj.group) {
      var layerGroup = document.createElement('a');
      layerGroup.href = '#' + this._map._container.id + '-' + obj.group.replace(/\s/g, '');
      layerGroup.setAttribute('data-toggle', 'collapse');
      layerGroup.setAttribute('role', 'button');
      layerGroup.setAttribute('aria-expanded', 'false');
      layerGroup.setAttribute('aria-controls', obj.group);
      var groupName = document.createElement('span');
      groupName.className = 'layer-group-name';
      groupName.style.margin = '0 1em';
      groupName.style.fontSize = '1.2em';
      groupName.style.fontWeight = 'bold';
      groupName.style.display = 'inline-block';
      groupName.style.width = '12em';
      var chevron = document.createElement('i');
      chevron.className = 'fa fa-chevron-down';
      chevron.setAttribute('aria-hidden', 'true');
      chevron.style.margin = '1em';
      layerGroup.addEventListener('click', function () {
        if (chevron.className === 'fa fa-chevron-down') {
          chevron.className = 'fa fa-chevron-up';
        } else {
          chevron.className = 'fa fa-chevron-down';
        }
      });

      var elements = this._createLayerInfoElements(obj);

      groupName.innerHTML = elements.name;
      var titleHolder = document.createElement('div');
      titleHolder.id = this._map._container.id + '-menu-' + obj.group;
      titleHolder.className = 'clearfix layer-info-container';
      titleHolder.setAttribute('data-cy', 'layer'); // Cypress selector

      titleHolder.appendChild(layerGroup);
      layerGroup.appendChild(chevron);
      layerGroup.appendChild(elements.icon);
      titleHolder.appendChild(elements.reportBtn);
      titleHolder.appendChild(groupName);
      titleHolder.appendChild(elements.layerDesc);
      titleHolder.appendChild(elements.dataInfo);
      titleHolder.style.padding = '0.4em 0';

      var separator = this._createSeparator();

      if (this._grpTitleVisible && !this._grpTitleVisible[obj.group]) {
        // Hide group title only if none of its layers are active
        this._hideOutOfBounds(obj, [titleHolder, separator]);
      }

      var container = obj.overlay ? this._overlaysList : this._baseLayersList;
      container.appendChild(titleHolder);
      container.appendChild(separator);
      return titleHolder;
    }
  },
  _createGroupHolder: function _createGroupHolder(obj) {
    var groupName;

    if (obj.group) {
      groupName = this._map._container.id + '-' + obj.group.replace(/\s/g, '');
    }

    var groupHolder = document.createElement('div');
    groupHolder.className = 'layers-sub-list collapse';
    groupHolder.setAttribute('id', groupName);
    var container = obj.overlay ? this._overlaysList : this._baseLayersList;
    container.appendChild(groupHolder);
    return groupHolder;
  },
  _addItem: function _addItem(obj) {
    var labelContainer = document.createElement('div');
    var label = document.createElement('label');
    label.style.display = 'inline-block';

    var checked = this._map.hasLayer(obj.layer);

    var input;

    if (obj.overlay) {
      input = document.createElement('input');
      input.type = 'checkbox';
      input.className = 'leaflet-control-layers-selector';
      input.defaultChecked = checked;
      input.style.margin = '0.5em 0.9em';
    } else {
      input = this._createRadioElement('leaflet-base-layers_' + L.Util.stamp(this), checked);
    }

    this._layerControlInputs.push(input);

    input.layerId = L.Util.stamp(obj.layer);
    L.DomEvent.on(input, 'click', this._onInputClick, this);
    var name = document.createElement('span');
    name.style.fontWeight = 'bold';
    name.style.display = 'inline-block';
    name.style.fontSize = '1.2em';

    var elements = this._createLayerInfoElements(obj);

    var separator = this._createSeparator();

    if (obj.group) {
      name.innerHTML = ' ' + obj.name;
    } else {
      name.innerHTML = ' ' + elements.name;
    }

    var layerContainer = document.createElement('div'); // Helps from preventing layer control flicker when checkboxes are disabled
    // https://github.com/Leaflet/Leaflet/issues/2771

    var holder = document.createElement('div');
    layerContainer.appendChild(labelContainer);
    labelContainer.appendChild(label);
    label.appendChild(holder);
    holder.appendChild(input);

    if (obj.overlay && !obj.group) {
      holder.appendChild(elements.icon);
      holder.appendChild(elements.reportBtn);
      name.style.margin = '0 1em';
      name.style.width = '12em';
      name.className = 'layer-name';
      label.className = 'label';
    }

    holder.appendChild(name);

    if (obj.overlay && obj.group) {
      labelContainer.id = this._map._container.id + '-' + obj.name;
      label.style.width = '100%';
      label.style.marginBottom = '3px';
      input.style.marginLeft = '3.8em';
      name.style.marginLeft = '9.6em';
      name.style.color = '#717171';
      name.className = 'layer-list-name';
      layerContainer.appendChild(separator);
    }

    if (obj.overlay && !obj.group) {
      labelContainer.appendChild(elements.layerDesc);
      labelContainer.className = 'clearfix layer-info-container';
      labelContainer.id = this._map._container.id + '-menu-' + obj.name.replace(/ /g, "_");
      layerContainer.setAttribute('data-cy', 'layer'); // Cypress selector

      labelContainer.appendChild(elements.dataInfo);
      layerContainer.appendChild(separator);
    }

    labelContainer.style.padding = '0.4em 0';

    this._hideOutOfBounds(obj, [layerContainer, separator]);

    var container = obj.overlay ? this._overlaysList : this._baseLayersList;
    container.appendChild(layerContainer);

    this._checkDisabledLayers();

    return layerContainer;
  },
  _hideOutOfBounds: function _hideOutOfBounds(obj, elements) {
    var self = this;
    var map = this._map;

    var data = this._getLayerData(obj);

    var layerName;

    if (obj.name && !obj.group) {
      layerName = this.options.overlays && this.options.overlays[obj.name];
    } else {
      layerName = this.options.overlays && this.options.overlays[obj.group].layers[obj.name];
    }

    this._hideElements(obj, data, layerName, elements); // Filter layer list on initialization


    map.on('moveend', function () {
      // Update layer list on map movement
      self._hideElements(obj, data, layerName, elements, true);
    });
  },

  /**
   * 
   * @param {Object} obj - layer object
   * @param {Object} data - layer information from info.json
   * @param {string} layerName 
   * @param {Object[]} elements - Reference to DOM elements
   * @param {boolean} isNotGlobal - true if the layer passed in is not a globally available layer
   */
  _hideElements: function _hideElements(obj, data, layerName, elements, isNotGlobal) {
    var map = this._map;
    var currentBounds = map.getBounds();
    var currentZoom = map.getZoom();
    var bounds;
    var zoom;

    if (data) {
      bounds = data.extents && data.extents.bounds && L.latLngBounds(data.extents.bounds);
      zoom = data.extents && data.extents.minZoom && data.extents.minZoom;

      for (var i in elements) {
        if (bounds && !bounds.intersects(currentBounds) && !map.hasLayer(layerName) || zoom && currentZoom < zoom && !map.hasLayer(layerName)) {
          elements[i].style.display = 'none';

          this._existingLayers(obj, false, isNotGlobal);
        } else if (obj.group) {
          this._grpTitleVisible = this._grpTitleVisible || {};
          this._grpTitleVisible[obj.group] = true; // Keep track of group titles to be visible when its layers are active

          elements[i].style.display = 'block';

          this._existingLayers(obj, true, isNotGlobal);
        } else {
          elements[i].style.display = 'block';

          this._existingLayers(obj, true, isNotGlobal);
        }
      }

      ;
    }

    ;
  },
  _showGroupTitle: function _showGroupTitle() {
    for (var i in this._grpTitleVisible) {
      if (this._grpTitleVisible[i]) {
        var groupName = this._map._container.id + '-menu-' + i;
        var grpHolder = document.getElementById(groupName);
        var grpSelector = grpHolder && grpHolder.nextElementSibling;

        if (grpHolder) {
          grpHolder.style.display = 'block';
          grpSelector.style.display = 'block';
        }
      }
    }

    this._grpTitleVisible = {}; // Reset list of group titles that need to be visible
  },
  _existingLayers: function _existingLayers(obj, doesExist, isNotGlobal) {
    if (doesExist && isNotGlobal && !this.options.existingLayers[obj.name]) {
      // Check if there is a new layer in current bounds
      this.options.newLayers = [].concat(_toConsumableArray(this.options.newLayers), [obj.name]);
      this._newLayerContainers = obj.group ? [].concat(_toConsumableArray(this._newLayerContainers), [obj.group]) : [].concat(_toConsumableArray(this._newLayerContainers), [obj.name]);
      this.options.existingLayers[obj.name] = true;
    } else if (doesExist) {
      this.options.existingLayers[obj.name] = true; // layer exists upon inititalization
    } else if (isNotGlobal && this.options.existingLayers[obj.name]) {
      // Remove from new layers if the layer no longer exists within current bounds
      this.options.newLayers = this.options.newLayers.filter(function (layer) {
        return layer !== obj.name;
      });
      this.options.existingLayers[obj.name] = false;
    } else {
      this.options.existingLayers[obj.name] = false; // layer does not exist upon inititalization
    }
  },
  _highlightLayers: function _highlightLayers(backgroundProp) {
    var _this = this;

    this._newLayerContainers.map(function (layerName) {
      var mapId = _this._map._container.id;
      var selector = '#' + mapId + '-menu-' + layerName + ' .layer-info-container';
      var elem = document.querySelector(selector);

      if (elem) {
        elem.style.background = backgroundProp;
      } else {
        // Group names
        selector = '#' + mapId + '-menu-' + layerName + '.layer-info-container';
        elem = document.querySelector(selector);
        elem.style.background = backgroundProp;
      }
    });
  },
  _getLayerData: function _getLayerData(obj) {
    var layerData = require('../info.json');

    var data;

    for (var j in layerData) {
      if (obj.group && obj.group.replace(/\s/g, '').toLowerCase() === j.toLowerCase() || obj.name.replace(/\s/g, '').toLowerCase() === j.toLowerCase()) {
        data = layerData[j];
      }

      ;
    }

    ;
    return data;
  }
});

L.control.layersBrowser = function (baseLayers, overlays, options) {
  return new L.Control.LayersBrowser(baseLayers, overlays, options);
};


},{"../info.json":1}]},{},[2]);
