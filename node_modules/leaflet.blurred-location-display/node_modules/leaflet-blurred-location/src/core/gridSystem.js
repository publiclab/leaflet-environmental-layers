module.exports = function gridSystem(options) {

  var map = options.map || document.getElementById("map") || L.map('map');
  options.cellSize = options.cellSize || { rows:100, cols:100 };

  require('leaflet-graticule');
  // require('../Leaflet.Graticule.js');

  options.graticuleOptions = options.graticuleOptions || {
                 showLabel: true,
                 zoomInterval: [
                   {start: 2, end: 2, interval: 100},
                   {start: 2, end: 5, interval: 10},
                   {start: 5, end: 9, interval: 1},
                   {start: 9, end: 12, interval: 0.1},
                   {start: 12, end: 15, interval: 0.01},
                   {start: 15, end: 20, interval: 0.001},
                 ],
                 opacity: 1,
                 color: '#ff0000',
                 latFormatTickLabel: function(lat) {
                            var decimalPlacesAfterZero = 0;
                            lat = lat.toString();
                            decimalPlacesAfterZero = this.getDecimalPlacesAfterZero();
                            return this.getLabeledCoordinate(lat, "lat", decimalPlacesAfterZero);
                          },

                lngFormatTickLabel: function(lng) {
                           var decimalPlacesAfterZero = 0;
                           lng = lng.toString();
                           decimalPlacesAfterZero = this.getDecimalPlacesAfterZero(); 
                           return this.getLabeledCoordinate(lng, "lng", decimalPlacesAfterZero);
                         },

                getDecimalPlacesAfterZero: function() {
                  var decimalPlacesAfterZero = 0;

                  for(i in this.zoomInterval) {
                    if(map.getZoom() >= this.zoomInterval[i].start && map.getZoom() <= this.zoomInterval[i].end && this.zoomInterval[i].interval < 1)
                      decimalPlacesAfterZero = (this.zoomInterval[i].interval + '').split('.')[1].length;
                  }

                  return decimalPlacesAfterZero;
                },

                getLabeledCoordinate: function(coordinate, coordinate_type, decimalPlacesAfterZero) {
                    var dir = "";
                    if (coordinate_type == "lat") {
                      if (coordinate < 0) {
                          coordinate = coordinate * -1;
                          dir = "S";                          
                      }
                      else if (coordinate > 0) {
                          dir = "N";                        
                      }
                    }
                    else {
                       if (coordinate > 180) {
                           coordinate = 360 - coordinate;
                           dir = "W";
                       }
                       else if (coordinate > 0 && coordinate < 180) {
                           dir = "E"
                       }
                       else if (coordinate < 0 && coordinate > -180) {
                           coordinate = coordinate * -1;
                           dir = "W";
                       }
                       else if (coordinate == -180) {
                           coordinate = coordinate*-1;
                       }
                       else if (coordinate < -180) {
                           coordinate  = 360 + coordinate;
                           dir = "W";
                       }
                    }
                  coordinate = coordinate.toString();
                  if(coordinate.indexOf(".") != -1) coordinate = coordinate.split('.')[0] + '.' + coordinate.split('.')[1].slice(0,decimalPlacesAfterZero);
                  return '' + coordinate + dir;
                }
             }


  var layer = L.latlngGraticule(options.graticuleOptions).addTo(map);

  function addGrid() {
     layer = L.latlngGraticule(options.graticuleOptions).addTo(map);
  }

  function removeGrid() {
  layer.remove();
  }

  return {
    removeGrid: removeGrid,
    addGrid: addGrid,
  }
}
