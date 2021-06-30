const path = require("path");
const fs = require("fs");
const { generateSpreadsheetLayer } = require("./genSpreadsheetLayer");

let layerData = JSON.parse(fs.readFileSync("input.json", "utf8"));
generateSpreadsheetLayer(layerData, true);
