var bounds = new L.LatLngBounds(
  new L.LatLng(84.67351257, -172.96875),
  new L.LatLng(-54.36775852, 178.59375),
);
var map = L.map('map', {
  maxBounds: bounds,
  maxBoundsViscosity: 0.75,
}).setView([43, -83], 3);
map.options.minZoom = 3;
var baselayer1 = L.tileLayer(
  'https://api.tiles.mapbox.com/v4/mapbox.emerald/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoic2FnYXJwcmVldDk3IiwiYSI6ImNqaXhlZjgwaDJtb3EzcW1zdDdwMzJkODcifQ.MA2YIv6VpGLLAo-QYUudTA',
  {
    attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
).addTo(map);
var baselayer3 = L.tileLayer(
  'https://api.tiles.mapbox.com/v4/mapbox.streets-basic/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoic2FnYXJwcmVldDk3IiwiYSI6ImNqaXhlZjgwaDJtb3EzcW1zdDdwMzJkODcifQ.MA2YIv6VpGLLAo-QYUudTA',
  {
    attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
);
var baselayer2 = L.tileLayer(
  'https://a.tiles.mapbox.com/v3/jywarren.map-lmrwb2em/{z}/{x}/{y}.png',
  {
    attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
);
var baselayer4 = L.tileLayer(
  'https://api.tiles.mapbox.com/v4/mapbox.dark/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoic2FnYXJwcmVldDk3IiwiYSI6ImNqaXhlZjgwaDJtb3EzcW1zdDdwMzJkODcifQ.MA2YIv6VpGLLAo-QYUudTA',
  {
    attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
);

var PLpeople = L.layerGroup.PLpeople();
var PurpleLayer = L.layerGroup.purpleLayer();
var ToxicRelease = L.layerGroup.toxicReleaseLayer();
var PFASTracker = L.layerGroup.pfasLayer();
var AQICNLayer = L.layerGroup.aqicnLayer();
var OSMLandfillMineQuarryLayer = L.layerGroup.osmLandfillMineQuarryLayer();

var PurpleAirMarkerLayer = L.layerGroup.layerCode('purpleairmarker');
var Fractracker = L.layerGroup.layerCode('fractracker');
var SkyTruth = L.layerGroup.layerCode('skytruth');
var OdorReport = L.layerGroup.layerCode('odorreport');
var MapKnitter = L.layerGroup.layerCode('mapknitter');
var OpenAqLayer = L.layerGroup.layerCode('openaq');
var LuftdatenLayer = L.layerGroup.layerCode('luftdaten');
var OpenSenseLayer = L.layerGroup.layerCode('opensense');


var OpenInfraMap_Power = L.tileLayer('https://tiles-{s}.openinframap.org/power/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://www.openinframap.org/about.html">About OpenInfraMap</a>',
}).on('tileerror', function() {
  console.log('There was an error in fetching some tiles')
  this.onError('Power', true);
});
var OpenInfraMap_Petroleum = L.tileLayer('https://tiles-{s}.openinframap.org/petroleum/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://www.openinframap.org/about.html">About OpenInfraMap</a>',
}).on('tileerror', function() {
  this.onError('Petroleum', true);
});
var OpenInfraMap_Telecom = L.tileLayer('https://tiles-{s}.openinframap.org/telecoms/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://www.openinframap.org/about.html">About OpenInfraMap</a>',
}).on('tileerror', function() {
  this.onError('Telecom', true);
});
var OpenInfraMap_Water = L.tileLayer('https://tiles-{s}.openinframap.org/water/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://www.openinframap.org/about.html">About OpenInfraMap</a>',
}).on('tileerror', function() {
  this.onError('Water', true);
});

var Justicemap_income = L.tileLayer.provider('JusticeMap.income').on('tileerror', function() {
  this.onError('income', true);
});
var JusticeMap_americanIndian = L.tileLayer.provider('JusticeMap.americanIndian').on('tileerror', function() {
  this.onError('americanIndian', true);
});
var JusticeMap_asian = L.tileLayer.provider('JusticeMap.asian').on('tileerror', function() {
  this.onError('asian', true);
});
var JusticeMap_black = L.tileLayer.provider('JusticeMap.black').on('tileerror', function() {
  this.onError('black', true);
});
var JusticeMap_multi = L.tileLayer.provider('JusticeMap.multi').on('tileerror', function() {
  this.onError('multi', true);
});
var JusticeMap_hispanic = L.tileLayer.provider('JusticeMap.hispanic').on('tileerror', function() {
  this.onError('hispanic', true);
});
var JusticeMap_nonWhite = L.tileLayer.provider('JusticeMap.nonWhite').on('tileerror', function() {
  this.onError('nonWhite', true);
});
var JusticeMap_white = L.tileLayer.provider('JusticeMap.white').on('tileerror', function() {
  this.onError('white', true);
});
var JusticeMap_plurality = L.tileLayer.provider('JusticeMap.plurality').on('tileerror', function() {
  this.onError('plurality', true);
});

var clouds = L.OWM.clouds({showLegend: true, opacity: 0.5}).on('tileerror', function() {
  this.onError('Clouds', true);
});
var cloudscls = L.OWM.cloudsClassic({}).on('tileerror', function() {
  this.onError('cloudsClassic', true);
});
var precipitation = L.OWM.precipitation({}).on('tileerror', function() {
  this.onError('precipitation', true);
});
var precipitationcls = L.OWM.precipitationClassic({}).on('tileerror', function() {
  this.onError('precipitationClassic', true);
});
var rain = L.OWM.rain({}).on('tileerror', function() {
  this.onError('rain', true);
});
var raincls = L.OWM.rainClassic({}).on('tileerror', function() {
  this.onError('rainClassic', true);
});
var snow = L.OWM.snow({}).on('tileerror', function() {
  this.onError('snow', true);
});
var pressure = L.OWM.pressure({}).on('tileerror', function() {
  this.onError('pressure', true);
});
var pressurecntr = L.OWM.pressureContour({}).on('tileerror', function() {
  this.onError('pressureContour-zoomIn', true);
});
var temp = L.OWM.temperature({}).on('tileerror', function() {
  this.onError('temp', true);
});
var wind = L.OWM.wind({}).on('tileerror', function() {
  this.onError('wind', true);
});


var city = L.OWM.current({intervall: 15, minZoom: 3}).on('owmloadingend', function() {
  this.onError('Cities-zoomIn', true);
});
var windrose = L.OWM.current({
  intervall: 15,
  minZoom: 3,
  markerFunction: myWindroseMarker,
  popup: false,
  clusterSize: 50,
  imageLoadingBgUrl: 'https://openweathermap.org/img/w0/iwind.png',
});
windrose.on('owmlayeradd', windroseAdded, windrose);
windrose.on('owmloadingend', function() {
  this.onError('windrose-zoomIn', true);
});
var IndigenousLandsTerritories = L.layerGroup.indigenousLayers('Territories');
var IndigenousLandsLanguages = L.layerGroup.indigenousLayers('Languages');
var IndigenousLandsTreaties = L.layerGroup.indigenousLayers('Treaties');
var Unearthing = L.layerGroup.Unearthing();

var Wisconsin_NM = wisconsinLayer(map);
var FracTracker_mobile = L.geoJSON.fracTrackerMobile();

var EonetFiresLayer = L.geoJSON.eonetFiresLayer();

var baseMaps = {
  'Standard': baselayer1,
  // 'Grey-scale': baselayer2,
  // 'Streets': baselayer3,
  // 'Dark': baselayer4,
};

var overlayMaps = {
  "PLpeople" : PLpeople,
  'wisconsin': Wisconsin_NM,
  'fractracker': Fractracker,
  'fracTrackerMobile': FracTracker_mobile,
  'purpleair': {
    category: 'group',
    layers: {
      'purpleLayer': PurpleLayer,
      'purpleairmarker': PurpleAirMarkerLayer,
    }
  },
  'skytruth': SkyTruth,
  'toxicReleaseLayer': ToxicRelease,
  'odorreport': OdorReport,
  'mapknitter': MapKnitter,
  'openInfraMap': {
    category: 'group',
    layers: {
      'Power': OpenInfraMap_Power,
      'Telecom': OpenInfraMap_Telecom,
      'Petroleum': OpenInfraMap_Petroleum,
      'Water': OpenInfraMap_Water,
    }
  },
  'indigenousLands': {
    category: 'group',
    layers: {
      'Territories': IndigenousLandsTerritories,
      'Languages': IndigenousLandsLanguages,
      'Treaties': IndigenousLandsTreaties,
    },
  },
  'justiceMap': {
    category: 'group',
    layers: {
      'income': Justicemap_income,
      'americanIndian': JusticeMap_americanIndian,
      'asian': JusticeMap_asian,
      'black': JusticeMap_black,
      'multi': JusticeMap_multi,
      'hispanic': JusticeMap_hispanic,
      'nonWhite': JusticeMap_nonWhite,
      'white': JusticeMap_white,
      'plurality': JusticeMap_plurality,
    },
  },
  'openWeatherMap': {
    category: 'group',
    layers: {
      'Clouds': clouds,
      'cloudsClassic': cloudscls,
      'precipitation': precipitation,
      'precipitationClassic': precipitationcls,
      'rain': rain,
      'rainClassic': raincls,
      'snow': snow,
      'pressure': pressure,
      'pressureContour-zoomIn': pressurecntr,
      'temp': temp,
      'wind': wind,
      'Cities-zoomIn': city,
      'windrose-zoomIn': windrose,
    },
  },
  'pfasLayer': PFASTracker,
  
  'aqicnLayer': AQICNLayer,
  'openaq': OpenAqLayer,
  'luftdaten': LuftdatenLayer,
  'opensense': OpenSenseLayer,
  'osmLandfillMineQuarryLayer': OSMLandfillMineQuarryLayer,
  'eonetFiresLayer': EonetFiresLayer,
  'Unearthing': Unearthing
};

var allMapLayers = {
  'Standard': baselayer1,
  'Grey-scale': baselayer2,
  'Streets': baselayer3,
  'Dark': baselayer4,

  "PLpeople" : PLpeople,
  'wisconsin': Wisconsin_NM,
  'fracTrackerMobile': FracTracker_mobile,
  'purpleLayer': PurpleLayer,
  'purpleairmarker': PurpleAirMarkerLayer,
  'skytruth': SkyTruth,
  'fractracker': Fractracker,
  'pfasLayer': PFASTracker,
  'toxicReleaseLayer': ToxicRelease,
  'odorreport': OdorReport,
  'mapknitter': MapKnitter,
  'Power': OpenInfraMap_Power,
  'Telecom': OpenInfraMap_Telecom,
  'Petroleum': OpenInfraMap_Petroleum,
  'Water': OpenInfraMap_Water,
  'income': Justicemap_income,
  'americanIndian': JusticeMap_americanIndian,
  'asian': JusticeMap_asian,
  'black': JusticeMap_black,
  'multi': JusticeMap_multi,
  'hispanic': JusticeMap_hispanic,
  'nonWhite': JusticeMap_nonWhite,
  'white': JusticeMap_white,
  'plurality': JusticeMap_plurality,
  'clouds': clouds,
  'cloudsClassic': cloudscls,
  'precipitation': precipitation,
  'precipitationClassic': precipitationcls,
  'rain': rain,
  'rainClassic': raincls,
  'snow': snow,
  'pressure': pressure,
  'pressureContour': pressurecntr,
  'temperature': temp,
  'wind': wind,
  'city': city,
  'windrose': windrose,
  'Territories': IndigenousLandsTerritories,
  'Languages': IndigenousLandsLanguages,
  'Treaties': IndigenousLandsTreaties,
  'aqicnLayer': AQICNLayer,
  'openaq': OpenAqLayer,
  'luftdaten': LuftdatenLayer,
  'opensense': OpenSenseLayer,
  'osmLandfillMineQuarryLayer': OSMLandfillMineQuarryLayer,
  'eonetFiresLayer': EonetFiresLayer,
  'Unearthing': Unearthing
};

// var oms = omsUtil(map, {
//   keepSpiderfied: true,
//   circleSpiralSwitchover: 0
// });

var hash = new L.FullHash(map, allMapLayers);
// var leafletControl = new L.control.layers(baseMaps, overlayMaps);
var leafletControl = new L.control.layersBrowser(baseMaps, overlayMaps);
leafletControl.addTo(map);

var modeControl = new L.control.minimalMode(leafletControl);
modeControl.addTo(map);

var embedControl = new L.control.embed({
  // hostname: 'your domain name goes here'
});
embedControl.addTo(map);

// Collapsible search control
new L.Control.GPlaceAutocomplete({
  position: 'topleft',
  collapsed_mode: true,
	callback: function(place){
		var loc = place.geometry.location;
		map.setView( [loc.lat(), loc.lng()], 18);
	}
}).addTo(map);
