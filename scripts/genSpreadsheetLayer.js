const { writeFile, readFile } = require("fs").promises;
const path = require("path");

async function generateSpreadsheetLayer(layerData, confirm) {
  let newSpreadsheetLayers, newLayerInfo;
  try {
    const data = await readFile(
      path.resolve(__dirname, "../src/spreadsheetLayers/layers.json"),
      "utf8"
    );
    let spreadsheetLayers = JSON.parse(data);
    spreadsheetLayers.push({
      name: layerData.name,
      url: layerData.url,
    });
    newSpreadsheetLayers = spreadsheetLayers;
    if (confirm) {
      await writeFile(
        path.resolve(__dirname, "../src/spreadsheetLayers/layers.json"),
        JSON.stringify(spreadsheetLayers, null, 2),
        "utf8"
      );
    }
    console.log("Successful");
  } catch (error) {
    console.error(e);
  }

  try {
    const data = await readFile(
      path.resolve(__dirname, "../src/info.json"),
      "utf8"
    );
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
      layer_group: 0,
      icon: "#cc12cc",
    };
    newLayerInfo = layerInfo;
    if (confirm) {
      await writeFile(
        path.resolve(__dirname, "../src/info.json"),
        JSON.stringify(layerInfo, null, 2),
        "utf8"
      );
    }
    console.log("Successful");
  } catch (error) {
    console.error(e);
  }
  return { newSpreadsheetLayers, newLayerInfo };
}

exports.generateSpreadsheetLayer = (...data) =>
  generateSpreadsheetLayer(...data);
