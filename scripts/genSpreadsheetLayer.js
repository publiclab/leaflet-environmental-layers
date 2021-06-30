const fs = require("fs");
const path = require("path");

function generateSpreadsheetLayer(layerData, confirm) {
  let newSpreadsheetLayers, newLayerInfo;
  fs.readFile(
    path.resolve(__dirname, "../src/spreadsheetLayers/layers.json"),
    "utf8",
    (err, data) => {
      if (err) {
        console.log(`Error reading file from disk: ${err}`);
      } else {
        // parse JSON string to JSON object
        let spreadsheetLayers = JSON.parse(data);
        spreadsheetLayers.push({
          name: layerData.name,
          url: layerData.url,
        });
        newSpreadsheetLayers = spreadsheetLayers;
        if (confirm) {
          fs.writeFile(
            path.resolve(__dirname, "../src/spreadsheetLayers/layers.json"),
            JSON.stringify(spreadsheetLayers, null, 2),
            "utf8",
            (err) => {
              if (err) {
                console.log(`Error writing file: ${err}`);
              } else {
                console.log(`File is written successfully!`);
              }
            }
          );
        }
      }
    }
  );

  fs.readFile("../src/info.json", "utf8", (err, data) => {
    if (err) {
      console.log(`Error reading file from disk: ${err}`);
    } else {
      // parse JSON string to JSON object
      let layerInfo = JSON.parse(data);
      layerInfo[layerData.name] = {
        name: layerData.name,
        url: "",
        data: {
          type: "",
          disclaimer: "",
        },
        description: "",
        layer_desc: layerData.description,
        icon: "#cc12cc",
      };
      newLayerInfo = layerInfo;
      if (confirm) {
        fs.writeFile(
          "../src/info.json",
          JSON.stringify(layerInfo, null, 2),
          "utf8",
          (err) => {
            if (err) {
              console.log(`Error writing file: ${err}`);
            } else {
              console.log(`File is written successfully!`);
            }
          }
        );
      }
    }
  });
  return { newSpreadsheetLayers, newLayerInfo };
}

exports.generateSpreadsheetLayer = (...data) =>
  generateSpreadsheetLayer(...data);
