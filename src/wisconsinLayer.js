wisconsinLayer = function(map) {
  
  var info = require('./info.json');

  var Wisconsin_NM = L.esri.featureLayer({
    url: info.wisconsin.api_url,
    simplifyFactor: 1,
  });

  Wisconsin_NM.bindPopup(function(layer) {
    return L.Util.template('<p><strong>Id : </strong>{FID}<br><strong>PLACENAME : </strong>{PLACENAME}<br><strong>STATE : </strong>{STATE}<br><strong>Lat :</strong> {LATITUDE} <br> <strong>Lon : </strong>{LONGITUDE} <br> <strong>Owner :</strong> {OWNERNME1} <br> <strong>POSTAL ADRESS :</strong> {PSTLADRESS} <br><strong> Assessed Acres :</strong> {ASSDACRES} <br> <strong>County Name :</strong> {CONAME} <br> </p>', layer.feature.properties);
  });

  Wisconsin_NM.on('loading', function(e) {
    if (typeof map.spin === 'function') {
      map.spin(true);
    }
  });

  Wisconsin_NM.on('load', function(e) {
    if (typeof map.spin === 'function') {
      map.spin(false);
    }
  });

  Wisconsin_NM.on('add', function(e) {
     if(map.getZoom() < info.wisconsin.extents.minZoom){
       return;
     }
  });

  return Wisconsin_NM;
};
