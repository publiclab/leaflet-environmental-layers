L.LayerGroup.unearthing = L.LayerGroup.extend(

  {
    options: {
      json_url: 'https://publiclab.github.io/unearthing-pvd/RI_mfgs.json',
    },

    initialize: function(param) {
      if (!!param && !!param.json_url) {
        this.options.json_url = param.json_url;
      }
    },

    onAdd: function(map) {
      this._map = map;
      this.requestData(map);
    },

    requestData: function(map) {
      this.pointsLayer = {};
      var points = this.pointsLayer;
      var setP = this.setPoints;
      $.get('https://publiclab.github.io/unearthing-pvd/RI_mfgs.json')
        .done(function(data) {
          // standardize lat/lon instead of lon/lat
          // and add non-nested coords for feature[0], feature[1]
          data.features.forEach(function(f) {
            f[1] = f.geometry.coordinates[0];
            f[0] = f.geometry.coordinates[1];
            f.geometry.coordinates[0] = f[0];
            f.geometry.coordinates[1] = f[1];
          });

          points = L.glify.points({
            map: map,
            data: data,
            // size: 8,
            color: function(index, point) {
              // console.log(point); // point is currently just []
              return {r: 0.1, g: 0.1, b: 1};
            },
            sensitivity: 5,
            click: function(e, point, xy) {
              var point_properties = ['street', 'employees', 'conames', 'years'];
              // set up a standalone popup (use a popup as a layer)
              var content = '<h4>' + (point.properties.sic_name || '') +'</h4>';
              content += '<table>';
              point_properties.forEach(function(property) {
                content += '<tr><td><b>' + property + '</b></td><td>' + (point.properties[property] || '') +'</td></tr>';
              });
              content += '</table>';
              content += '<p><a class=\'btn btn-outline-primary\' href=\'https://publiclab.org/post?tags=unearthing-pvd-stories,lat:' + point[0] + ',lon:' + point[1] + '\'>Add your story</a></p>';

              L.popup()
                .setLatLng([point[0], point[1]])
                .setContent(content)
                .openOn(map);
            },
          });
          setP(points.glLayer);
        });
    },

    setPoints: function(points) {
      this.pointsLayer = points;
    },

    onRemove: function(map) {
      this._map.removeLayer(this.pointsLayer);
    },
  },
);


L.layerGroup.Unearthing = function(options) {
  return new L.LayerGroup.unearthing(options);
};
