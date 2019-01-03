wisconsinLayer = function (map) {
   var Wisconsin_NM  = L.esri.featureLayer({
     url: 'https://services.arcgis.com/jDGuO8tYggdCCnUJ/arcgis/rest/services/Nonmetallic_and_Potential_frac_sand_mine_proposals_in_West_Central_Wisconsin/FeatureServer/0/',
     simplifyFactor: 1
   }) ;

   Wisconsin_NM.bindPopup(function (layer) {
     return L.Util.template('<p><strong>Id : </strong>{FID}<br><strong>PLACENAME : </strong>{PLACENAME}<br><strong>STATE : </strong>{STATE}<br><strong>Lat :</strong> {LATITUDE} <br> <strong>Lon : </strong>{LONGITUDE} <br> <strong>Owner :</strong> {OWNERNME1} <br> <strong>POSTAL ADRESS :</strong> {PSTLADRESS} <br><strong> Assessed Acres :</strong> {ASSDACRES} <br> <strong>County Name :</strong> {CONAME} <br> </p>', layer.feature.properties);
   });

   Wisconsin_NM.on('loading', function(e){
    if(typeof map.spin === 'function'){
       map.spin(true) ;
     }
   });
   Wisconsin_NM.on('load', function(e){
    if(typeof map.spin === 'function'){
       map.spin(false) ;
     }
   });
   Wisconsin_NM.on('add', function(e){
     map.setView([43.9929 , -90.3883], 12);
   });

   return Wisconsin_NM ;
};
