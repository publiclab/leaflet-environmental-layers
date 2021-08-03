const layers = require("./layers.json");

for (const layer of layers) {
  //Evaluate based on dynamic data
  let newLayer = function (options) {
    return new L.SpreadsheetLayer({
      url: layer.url,
      lat: "Latitude",
      lon: "Longitude",
      generatePopup: function () {},
      imageOptions: {
        icon: L.icon.mapKnitterIcon(),
      },
    });
  };
  eval("L.layerGroup." + layer.name + "=newLayer");
}
