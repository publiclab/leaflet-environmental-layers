const fs = require("fs");
const path = require("path");

function generateSpreadsheetLayer(layerData) {
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
        let newSpreadsheetLayers = JSON.stringify(spreadsheetLayers, null, 2);
        fs.writeFile(
          "../src/spreadsheetLayers/layers.json",
          newSpreadsheetLayers,
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
  );

  fs.readFile(
    path.resolve(__dirname, "../src/info.json"),
    "utf8",
    (err, data) => {
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
        let newLayerInfo = JSON.stringify(layerInfo, null, 2);
        fs.writeFile("../src/info.json", newLayerInfo, "utf8", (err) => {
          if (err) {
            console.log(`Error writing file: ${err}`);
          } else {
            console.log(`File is written successfully!`);
          }
        });
      }
    }
  );
}

let layerData = JSON.parse(fs.readFileSync("input.json", "utf8"));
generateSpreadsheetLayer(layerData);
