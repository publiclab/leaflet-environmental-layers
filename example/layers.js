const bounds = new L.LatLngBounds(
        new L.LatLng(84.67351257, -172.96875),
        new L.LatLng(-54.36775852, 178.59375)
      );
      const map = L.map("map", {
        maxBounds: bounds,
        maxBoundsViscosity: 0.75
      }).setView([43, -83], 3);
      map.options.minZoom = 3;
      const baselayer1 = L.tileLayer(
        "https://api.tiles.mapbox.com/v4/mapbox.emerald/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoic2FnYXJwcmVldDk3IiwiYSI6ImNqaXhlZjgwaDJtb3EzcW1zdDdwMzJkODcifQ.MA2YIv6VpGLLAo-QYUudTA",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }
      ).addTo(map);
      const baselayer3 = L.tileLayer(
        "https://api.tiles.mapbox.com/v4/mapbox.streets-basic/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoic2FnYXJwcmVldDk3IiwiYSI6ImNqaXhlZjgwaDJtb3EzcW1zdDdwMzJkODcifQ.MA2YIv6VpGLLAo-QYUudTA",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }
      );
      const baselayer2 = L.tileLayer(
        "https://a.tiles.mapbox.com/v3/jywarren.map-lmrwb2em/{z}/{x}/{y}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }
      );
      const baselayer4 = L.tileLayer(
        "https://api.tiles.mapbox.com/v4/mapbox.dark/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoic2FnYXJwcmVldDk3IiwiYSI6ImNqaXhlZjgwaDJtb3EzcW1zdDdwMzJkODcifQ.MA2YIv6VpGLLAo-QYUudTA",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }
      );
  
    const PLpeople = L.layerGroup.pLpeopleLayer() ;
    const PurpleLayer = L.layerGroup.purpleLayer() ;
    const PurpleAirMarkerLayer = L.layerGroup.layerCode("purpleairmarker") ;
    
    const Fractracker = L.layerGroup.layerCode("fractracker") ;
    const SkyTruth = L.layerGroup.layerCode("skytruth") ;
    const OdorReport = L.layerGroup.layerCode("odorreport") ;
    const MapKnitter = L.layerGroup.layerCode("mapknitter") ;
    
    const ToxicRelease = L.layerGroup.toxicReleaseLayer() ;
    
    const PFASTracker = L.layerGroup.pfasLayer() ;


    const OpenInfraMap_Power = L.tileLayer('https://tiles-{s}.openinframap.org/power/{z}/{x}/{y}.png',{
        maxZoom: 18,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://www.openinframap.org/about.html">About OpenInfraMap</a>'
    });
    const OpenInfraMap_Petroleum = L.tileLayer('https://tiles-{s}.openinframap.org/petroleum/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://www.openinframap.org/about.html">About OpenInfraMap</a>'
    });
    const OpenInfraMap_Telecom = L.tileLayer('https://tiles-{s}.openinframap.org/telecoms/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://www.openinframap.org/about.html">About OpenInfraMap</a>'
    });
    const OpenInfraMap_Water = L.tileLayer('https://tiles-{s}.openinframap.org/water/{z}/{x}/{y}.png',{
      maxZoom: 18,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://www.openinframap.org/about.html">About OpenInfraMap</a>'
    });

    const Justicemap_income = L.tileLayer.provider('JusticeMap.income') ;
    const JusticeMap_americanIndian = L.tileLayer.provider('JusticeMap.americanIndian') ;
    const JusticeMap_asian = L.tileLayer.provider('JusticeMap.asian') ;
    const JusticeMap_black = L.tileLayer.provider('JusticeMap.black') ;
    const JusticeMap_multi = L.tileLayer.provider('JusticeMap.multi') ;
    const JusticeMap_hispanic = L.tileLayer.provider('JusticeMap.hispanic') ;
    const JusticeMap_nonWhite = L.tileLayer.provider('JusticeMap.nonWhite') ;
    const JusticeMap_white = L.tileLayer.provider('JusticeMap.white') ;
    const JusticeMap_plurality = L.tileLayer.provider('JusticeMap.plurality') ;
    
    const clouds = L.OWM.clouds({showLegend: true, opacity: 0.5});
    const cloudscls = L.OWM.cloudsClassic({});
    const precipitation = L.OWM.precipitation({});
    const precipitationcls = L.OWM.precipitationClassic({});
    const rain = L.OWM.rain({});
    const raincls = L.OWM.rainClassic({});
    const snow = L.OWM.snow({});
    const pressure = L.OWM.pressure({});
    const pressurecntr = L.OWM.pressureContour({});
    const temp = L.OWM.temperature({});
    const wind = L.OWM.wind({});
    
    const AQICNLayer = L.layerGroup.aqicnLayer();
    const OpenAqLayer = L.layerGroup.layerCode("openaq");
    const LuftdatenLayer = L.layerGroup.layerCode("luftdaten");
    const OpenSenseLayer = L.layerGroup.layerCode("opensense");
    const city = L.OWM.current({ intervall: 15, minZoom: 3 });
    const windrose = L.OWM.current({
        intervall: 15,
        minZoom: 3,
        markerFunction: myWindroseMarker,
        popup: false,
        clusterSize: 50,
        imageLoadingBgUrl: "https://openweathermap.org/img/w0/iwind.png"
      });
      windrose.on("owmlayeradd", windroseAdded, windrose);
    
    const IndigenousLandsTerritories = L.layerGroup.indigenousLayers("Territories");
    const IndigenousLandsLanguages = L.layerGroup.indigenousLayers("Languages");
    const IndigenousLandsTreaties = L.layerGroup.indigenousLayers("Treaties");

    const OSMLandfillMineQuarryLayer = L.layerGroup.osmLandfillMineQuarryLayer();
    const Wisconsin_NM = wisconsinLayer(map);
    const FracTracker_mobile = fracTrackerMobileLayer(map);
    
    const baseMaps = {
      "Standard": baselayer1 ,
      "Grey-scale": baselayer2 ,
      "Streets": baselayer3 ,
      "Dark": baselayer4
    };

    const overlayMaps = {
    	 "PLpeople" : PLpeople,
         "Wisconsin Non-Metal" : Wisconsin_NM ,
         "FracTracker_mobile" : FracTracker_mobile ,
         "<span style='color: darkred'><strong>PurpleAirLayer-HeatMap</strong></span>": PurpleLayer ,
         "<img src='https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Location_dot_purple.svg/768px-Location_dot_purple.svg.png' height='10px' width='10px'>PurpleAirMarkerLayer": PurpleAirMarkerLayer,
         "<img src='https://www.clker.com/cliparts/T/G/b/7/r/A/red-dot.svg' height='15px' width='10px'>SkyTruth": SkyTruth,
         "<img src='http://www.clker.com/cliparts/2/3/f/a/11970909781608045989gramzon_Barrel.svg.med.png' height='10px' width='10px'> Fractracker": Fractracker,
         "<span style='color: green''> PFASTracker": PFASTracker,
         "<img src='https://www.clker.com/cliparts/r/M/L/o/R/i/green-dot.svg' height='10px' width='10px'> ToxicRelease": ToxicRelease,
         "<img src='https://www.clker.com/cliparts/T/3/6/T/S/8/ink-splash-md.png' height='10px' width='10px'> OdorReport": OdorReport,
         "<img src='https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png' height='10px' width='10px'> MapKnitter": MapKnitter,
         "<span style='color: pink'><strong>OpenInfraMap_Power</strong></span>": OpenInfraMap_Power ,
         "<span style='color: blue'><strong>OpenInfraMap_Telecom</strong></span>": OpenInfraMap_Telecom ,
         "<span style='color: brown'><strong>OpenInfraMap_Petroleum</strong></span>": OpenInfraMap_Petroleum ,
         "<span style='color: #4B0082'><strong>OpenInfraMap_Water</strong></span>": OpenInfraMap_Water ,
         "<span style='color: darkgreen'><strong>Justicemap_income</strong></span>": Justicemap_income,
         "<span style='color: maroon'><strong>JusticeMap_americanIndian</strong></span>": JusticeMap_americanIndian ,
         "<span style='color: orange'><strong>JusticeMap_asian</strong></span>": JusticeMap_asian ,
         "<span style='color: #FFD700'><strong>JusticeMap_black</strong></span>": JusticeMap_black,
         "<span style='color: pink'><strong>JusticeMap_multi</strong></span>": JusticeMap_multi ,
         "<span style='color:  #DCDCDC'><strong>JusticeMap_hispanic</strong></span>": JusticeMap_hispanic ,
         "<span style='color:  #808080'><strong>JusticeMap_nonWhite</strong></span>": JusticeMap_nonWhite,
         "<span style='color: darkbrown'><strong>JusticeMap_white</strong></span>": JusticeMap_white ,
         "<span style='color: #800000'><strong>JusticeMap_plurality</strong></span>": JusticeMap_plurality ,
         "<span style='color: #80dfff'><strong>Clouds</strong></span>": clouds ,
         "<span style='color: #b3f0ff'><strong>clouds (classic)</strong></span>": cloudscls ,
         "<span style='color: #00ff55'><strong>precipitation</strong></span>": precipitation ,
         "<span style='color: darkblue'><strong>precipitation (classic)</strong></span>": precipitationcls ,
         "<span style='color: #8080ff'><strong>rain</strong></span>": rain ,
         "<span style='color: #1a1aff'><strong>rain (classic)</strong></span>": raincls ,
         "<span style='color: #80ffe5'><strong>snow</strong></span>": snow ,
         "<span style='color: #e62e00'><strong>pressure</strong></span>": pressure ,
         "<span style='color: #ff3300'><strong>pressure contour (zoom in)</strong></span>": pressurecntr ,
         "<span style='color: #ff3300'><strong>temp</strong></span>": temp ,
         "<span style='color: darkblue'><strong>wind</strong></span>": wind ,
         "<span style='color: #b3ffff'><strong>Cities (zoom in)</strong></span>": city  ,
         "<span style='color: green'><strong>windrose (zoom in)</strong></span>": windrose ,
         "<span style='color: black'><strong>Indigenous Lands Territories</strong></span>": IndigenousLandsTerritories,
         "<span style='color: black'><strong>Indigenous Lands Languages</strong></span>": IndigenousLandsLanguages,
         "<span style='color: black'><strong>Indigenous Lands Treaties</strong></span>": IndigenousLandsTreaties,
         "<span style='color: black'><strong>Air Quality Index</strong></span>": AQICNLayer,
         "<span style='color: black'><strong>Open AQ </strong></span>": OpenAqLayer,
         "<span style='color: black'><strong>Luftdaten Layer </strong></span>": LuftdatenLayer,
         "<img src='https://banner2.kisspng.com/20180409/qcw/kisspng-computer-icons-font-awesome-computer-software-user-cubes-5acb63cb589078.9265215315232787953628.jpg' height='10px' width='10px'><span style='color: black'><strong> OpenSense </strong></span>": OpenSenseLayer,
         "<strong>OSM <span style='color: red'>Landfills</span>, <span style='color: blue'>Mines</span>, <span style='color: green'>Quarries</span></strong>": OSMLandfillMineQuarryLayer
    };

    const allMapLayers = {
      "BL1": baselayer1,
      "BL2": baselayer2,
      "BL3": baselayer3,
      "BL4": baselayer4,
      
      "PLpeople" : PLpeople,
      "Wisconsin_NM": Wisconsin_NM,
      "FT_mobile": FracTracker_mobile,
      "PurpleHeat": PurpleLayer ,
      "Purple": PurpleAirMarkerLayer,
      "STruth": SkyTruth,
      "FracTL": Fractracker,
      "PFAS": PFASTracker,
      "ToxicR": ToxicRelease,
      "OdorR": OdorReport,
      "MapK": MapKnitter,
      "OIMPower": OpenInfraMap_Power ,
      "OIMapTelecom": OpenInfraMap_Telecom ,
      "OIMPetroleum": OpenInfraMap_Petroleum ,
      "OIMWater": OpenInfraMap_Water ,
      "JMincome": Justicemap_income,
      "JMamericanIndian": JusticeMap_americanIndian ,
      "JMasian": JusticeMap_asian ,
      "JMblack": JusticeMap_black,
      "JMmulti": JusticeMap_multi ,
      "JMhispanic": JusticeMap_hispanic ,
      "JMnonWhite": JusticeMap_nonWhite,
      "JMwhite": JusticeMap_white ,
      "JMplurality": JusticeMap_plurality ,
      "Clouds": clouds ,
      "cloudsclassic": cloudscls ,
      "precipitation": precipitation ,
      "precipcls": precipitationcls ,
      "rain": rain ,
      "raincls": raincls ,
      "snow": snow ,
      "pressure": pressure ,
      "pressurecontour": pressurecntr ,
      "temp": temp ,
      "wind": wind ,
      "Cities": city  ,
      "windrose": windrose ,
      "Territories": IndigenousLandsTerritories,
      "Languages": IndigenousLandsLanguages,
      "Treaties": IndigenousLandsTreaties,
      "AQI": AQICNLayer,
      "OpenAq":OpenAqLayer,
      "Luftaden" : LuftdatenLayer,
      "Opensense" : OpenSenseLayer,
      "LSM": OSMLandfillMineQuarryLayer
    };
    
    const hash = new L.Hash(map, allMapLayers);
    const leafletControl = new L.control.layers(baseMaps,overlayMaps);
    leafletControl.addTo(map);
    

    
