const path = require("path");
const fs = require("fs");
const { generateSpreadsheetLayer } = require("./genSpreadsheetLayer");

(async () => {
  let layerData = await JSON.parse(fs.readFileSync("input.json", "utf8"));
  await generateSpreadsheetLayer(layerData, true);
})();
