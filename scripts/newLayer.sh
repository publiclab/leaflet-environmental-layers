#!/bin/bash

root=$(git rev-parse --show-toplevel)

layerName=$(cat input.json | jq -r .name)
url=$(cat input.json | jq -r .url)

temp=$'
L.layerGroup.'$layerName' = function (options) { 
  return new L.SpreadsheetLayer({
    url: "'$url'", // String url of data sheet
    lat: "Latitude", // name of latitude column
    lon: "Longitude", // name of longitude column
    generatePopup: function () {
      // function used to create content of popups
    },
    imageOptions: {
      icon: L.icon.mapKnitterIcon(),
    }, // optional, defaults to blank
    // sheetNum: // optional, defaults to 0 (first sheet)
  });
};
'

# do it
echo "$temp" >$root/src/$layerName.js
echo "require('./$layerName.js');" >>$root/src/leafletEnvironmentalLayers.js

sed -i "0,/\(.*'\)/s//\1, '$layerName'/" $root/src/AllLayers.js
sed -i "0,/\(.*'\)/s//\1, '$layerName'/" $root/example/oneLinerCodeExample.html

grunt build
