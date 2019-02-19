fracTrackerMobileLayer = function(map) {
  var FracTracker_mobile  = L.esri.featureLayer({
    url: 'https://services.arcgis.com/jDGuO8tYggdCCnUJ/arcgis/rest/services/FracTrackerMobileAppNPCAMesaVerdeNationalPark_051416/FeatureServer/0/',
    simplifyFactor: 1
  }) ;

  FracTracker_mobile.bindPopup(function (layer) {
    return L.Util.template('<p><strong>Id : </strong>{OBJECTID}<br><strong>FT_MV_ID : </strong>{FT_MV_ID}<br><strong>Long : </strong>{Long}<br><strong>Lat :</strong> {Lat} <br> <strong>Caption : </strong>{caption} <br> <strong>issue :</strong> {issue} <br> <strong>facility :</strong> {facility} <br><strong> Location :</strong> {location} <br> <strong>URL :</strong> <a href={URL2}>{URL2}</a> <br> <img src={URL2} height="280" width="290"></p>', layer.feature.properties);
  });

  FracTracker_mobile.on('loading', function(e){
    if(typeof map.spin === 'function'){
      map.spin(true) ;
    }
  });
  FracTracker_mobile.on('load', function(e){
    if(typeof map.spin === 'function'){
      map.spin(false) ;
    }
  });

  return FracTracker_mobile ;
}
