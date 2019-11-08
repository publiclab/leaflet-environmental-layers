unearthing = function(map) {
  var unearthingLayer;

  $.get('socioeco.json')
   .done(function(data) {

    // standardize lat/lon instead of lon/lat
    // and add non-nested coords for feature[0], feature[1]
    data.features.forEach(function(f) {
      f[1] = f.geometry.coordinates[0];
      f[0] = f.geometry.coordinates[1];
      f.geometry.coordinates[0] = f[0];
      f.geometry.coordinates[1] = f[1];
    });
    
    unearthingLayer = L.glify.points({
      map: map,
      data: data,
      //size: 8,
      color: function(index, point) {
        // console.log(point); // point is currently just []
        return { r: 0.1, g: 0.1, b: 1 };
      },
      sensitivity: 5,
      click: function (e, point, xy) {
        //set up a standalone popup (use a popup as a layer)
        var content = "<b>" + point.properties.name + ", " + point.properties.city + "</b></br />";
        content += point.properties.open + " until " + point.properties.close + "</br />";
        content += point.properties.sic_name + "</br />";
        content += point.properties.street + "</br />";
        content += point.properties.employees + " employees</br />";
        content += "<p><a class='btn btn-primary' href='https://publiclab.org/post?tags=unearthing-pvd-stories,lat:" + point[0] + ",lon:" + point[1] + "'>Add your story</a></p>";
        L.popup()
          .setLatLng([point[0], point[1]])
          .setContent(content)
          .openOn(map);
      },
    });
 
  });

  return FracTracker_mobile ;
};
