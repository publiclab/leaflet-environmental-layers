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

// var PLpeople = L.layerGroup.pLpeopleLayer() ;
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
});
var OpenInfraMap_Petroleum = L.tileLayer('https://tiles-{s}.openinframap.org/petroleum/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://www.openinframap.org/about.html">About OpenInfraMap</a>',
});
var OpenInfraMap_Telecom = L.tileLayer('https://tiles-{s}.openinframap.org/telecoms/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://www.openinframap.org/about.html">About OpenInfraMap</a>',
});
var OpenInfraMap_Water = L.tileLayer('https://tiles-{s}.openinframap.org/water/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://www.openinframap.org/about.html">About OpenInfraMap</a>',
});

var Justicemap_income = L.tileLayer.provider('JusticeMap.income');
var JusticeMap_americanIndian = L.tileLayer.provider('JusticeMap.americanIndian');
var JusticeMap_asian = L.tileLayer.provider('JusticeMap.asian');
var JusticeMap_black = L.tileLayer.provider('JusticeMap.black');
var JusticeMap_multi = L.tileLayer.provider('JusticeMap.multi');
var JusticeMap_hispanic = L.tileLayer.provider('JusticeMap.hispanic');
var JusticeMap_nonWhite = L.tileLayer.provider('JusticeMap.nonWhite');
var JusticeMap_white = L.tileLayer.provider('JusticeMap.white');
var JusticeMap_plurality = L.tileLayer.provider('JusticeMap.plurality');

var clouds = L.OWM.clouds({showLegend: true, opacity: 0.5});
var cloudscls = L.OWM.cloudsClassic({});
var precipitation = L.OWM.precipitation({});
var precipitationcls = L.OWM.precipitationClassic({});
var rain = L.OWM.rain({});
var raincls = L.OWM.rainClassic({});
var snow = L.OWM.snow({});
var pressure = L.OWM.pressure({});
var pressurecntr = L.OWM.pressureContour({});
var temp = L.OWM.temperature({});
var wind = L.OWM.wind({});


var city = L.OWM.current({intervall: 15, minZoom: 3});
var windrose = L.OWM.current({
  intervall: 15,
  minZoom: 3,
  markerFunction: myWindroseMarker,
  popup: false,
  clusterSize: 50,
  imageLoadingBgUrl: 'https://openweathermap.org/img/w0/iwind.png',
});
windrose.on('owmlayeradd', windroseAdded, windrose);

var IndigenousLandsTerritories = L.layerGroup.indigenousLayers('Territories');
var IndigenousLandsLanguages = L.layerGroup.indigenousLayers('Languages');
var IndigenousLandsTreaties = L.layerGroup.indigenousLayers('Treaties');

var Wisconsin_NM = wisconsinLayer(map);
var FracTracker_mobile = fracTrackerMobileLayer(map);

var EonetFiresLayer = L.geoJSON.eonetFiresLayer();

var baseMaps = {
  'Standard': baselayer1,
  // 'Grey-scale': baselayer2,
  // 'Streets': baselayer3,
  // 'Dark': baselayer4,
};

var overlayMaps = {
  // "PLpeople" : PLpeople,
  'Wisconsin Non-Metal': Wisconsin_NM,
  'Fractracker': Fractracker,
  'FracTracker mobile': FracTracker_mobile,
  'PurpleAir': {
    category: 'group',
    layers: {
      'PurpleAirLayer-HeatMap': PurpleLayer,
      'PurpleAirMarkerLayer': PurpleAirMarkerLayer,
    }
  },
  'SkyTruth': SkyTruth,
  'ToxicRelease': ToxicRelease,
  'OdorReport': OdorReport,
  'MapKnitter': MapKnitter,
  'OpenInfraMap': {
    category: 'group',
    layers: {
      'Power': OpenInfraMap_Power,
      'Telecom': OpenInfraMap_Telecom,
      'Petroleum': OpenInfraMap_Petroleum,
      'Water': OpenInfraMap_Water,
    }
  },
  'Indigenous Lands': {
    category: 'group',
    layers: {
      'Territories': IndigenousLandsTerritories,
      'Languages': IndigenousLandsLanguages,
      'Treaties': IndigenousLandsTreaties,
    },
  },
  'Justicemap': {
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
  'Open Weather Map': {
    category: 'group',
    layers: {
      'Clouds': clouds,
      'clouds (classic)': cloudscls,
      'precipitation': precipitation,
      'precipitation (classic)': precipitationcls,
      'rain': rain,
      'rain (classic)': raincls,
      'snow': snow,
      'pressure': pressure,
      'pressure contour (zoom in)': pressurecntr,
      'temp': temp,
      'wind': wind,
      'Cities (zoom in)': city,
      'windrose (zoom in)': windrose,
    },
  },
  'PFAsLayer': PFASTracker,
  
  'Air Quality Index': AQICNLayer,
  'Open AQ ': OpenAqLayer,
  'Luftdaten': LuftdatenLayer,
  'OpenSense ': OpenSenseLayer,
  'OSM Landfills, Quarries': OSMLandfillMineQuarryLayer,
  'EONET Fires': EonetFiresLayer,
};

var allMapLayers = {
  'Standard': baselayer1,
  'Grey-scale': baselayer2,
  'Streets': baselayer3,
  'Dark': baselayer4,

  // "PLpeople" : PLpeople,
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
};

// var oms = omsUtil(map, {
//   keepSpiderfied: true,
//   circleSpiralSwitchover: 0
// });

var hash = new L.FullHash(map, allMapLayers);
// var leafletControl = new L.control.layers(baseMaps, overlayMaps);
var leafletControl = new L.control.layersBrowser(baseMaps, overlayMaps);
leafletControl.addTo(map);

var embedControl = new L.control.embed({
  // hostname: 'your domain name goes here'
});
embedControl.addTo(map);
