"use strict";

const PublicGoogleSheetsParser = require("../node_modules/public-google-sheets-parser/dist/index.js");
const parser = new PublicGoogleSheetsParser();

L.Icon.PfasLayerIcon = L.Icon.extend({
  options: {
    iconUrl:
      "https://openclipart.org/image/300px/svg_to_png/117253/1297044906.png",
    iconSize: [10, 10],
    popupAnchor: [1, -2],
  },
});

L.icon.pfasLayerIcon = function () {
  return new L.Icon.PfasLayerIcon();
};

L.LayerGroup.PfasLayer = L.LayerGroup.extend({
  options: {
    url: "https://spreadsheets.google.com/feeds/list/1cjQ3H_DX-0dhVL5kMEesFEKaoJKLfC2wWAhokMnJxV4/1/public/values?alt=json",
  },

  initialize: function (options) {
    options = options || {};
    L.Util.setOptions(this, options);
    this._layers = {};
  },

  onAdd: function (map) {
    this._map = map;
    this.requestData();
  },

  onRemove: function (map) {
    this.clearLayers();
    if (typeof map.spin === "function") {
      map.spin(false);
    }
    map.closePopup();
    // oms.clearMarkers();
    this._layers = {};
  },

  requestData: function () {
    var self = this;
    (function () {
      var PFAS_ID = "1h1DnptLQSejQ8nx_wCykGytSqSABXC238RUfuhuweAc";
      if (typeof self._map.spin === "function") {
        self._map.spin(true);
      }
      parser.id = PFAS_ID;
      parser
        .parse()
        .then((data) => {
          self.parseData(data);
          if (typeof self._map.spin === "function") {
            self._map.spin(false);
          }
        })
        .catch(function (error) {
          console.log(error);
          self.onError("pfasLayer");
        });
    })();
  },

  getMarker: function (data) {
    var redDotIcon = new L.icon.pfasLayerIcon();
    var item = data;

    var defaultMarker = L.marker([item["Latitude "], item["Longitude "]], {
      icon: redDotIcon,
    });
    var minimalMarker = L.circleMarker(
      L.latLng([item["Latitude "], item["Longitude "]]),
      {
        radius: 5,
        weight: 1,
        fillOpacity: 1,
        color: "#7c7c7c",
        fillColor: "#b52822",
      }
    );
    var content = this.generatePopup(item);
    var pfasTracker;
    pfasTracker =
      this._map && this._map._minimalMode
        ? minimalMarker.bindPopup(content)
        : defaultMarker.bindPopup(content);

    // oms.addMarker(pfasTracker);

    return pfasTracker;
  },

  generatePopup: function (item) {
    var content =
      "<strong><center>" +
      item[
        "Contamination Site Geographic location of contamination/ DOD site name / entity sampled"
      ] +
      "</strong></center><hr /><br />";

    var regResponse = item["Reg / Gov Response "];
    var regResponseTruncate = regResponse.split(" ").splice(0, 30).join(" ");
    var litigation = item["Litigation details "];
    var litigationTruncate = litigation.split(" ").splice(0, 30).join(" ");

    if (item["Date_of_discovery "])
      content +=
        "<strong> Date of Discovery:</strong> " +
        item["Date_of_discovery "] +
        "</span>" +
        "<br>";

    if (
      item[
        "PFOA_PFOS Affected water body/source (groundwater/drinking water/surface water):\n-PFOA: detection level in ppt (date sampled/reported)\n-PFOS: detection level in ppt (date sampled/reported)"
      ]
    )
      content +=
        "<strong>Contamination type: </strong>" +
        item[
          "PFOA_PFOS Affected water body/source (groundwater/drinking water/surface water):\n-PFOA: detection level in ppt (date sampled/reported)\n-PFOS: detection level in ppt (date sampled/reported)"
        ] +
        "<br>";

    if (item["Other_PFAS "])
      content +=
        "<strong>Other contaminant: </strong>" + item["Other_PFAS "] + "<br>";

    if (item["Suspected contamination source "]) {
      content +=
        "<strong>Suspected source:</strong> " +
        "<a href=" +
        item["Suspected source URL"] +
        ">" +
        item["Suspected contamination source "] +
        "</a>" +
        "<br>";
    }

    if (item["Nature of source(s) "])
      content +=
        "<strong>Nature of Sources:</strong> " +
        item["Nature of source(s) "] +
        "<br>";

    if (item["Reg / Gov Response "])
      content +=
        "<strong>Regulatory Response:</strong> " +
        "<a href='https://pfasproject.com/pfas-contamination-site-tracker/'> " +
        regResponseTruncate +
        " [...]</a><br>";

    if (item["Litigation details "] == "No data") {
      content +=
        "<strong>Litigation:</strong> " + litigationTruncate + "<br><hr>";
    } else if (item["Litigation details "] == "No Data") {
      content +=
        "<strong>Litigation:</strong> " + litigationTruncate + "<br><hr>";
    } else {
      content +=
        "<strong>Litigation:</strong> " +
        litigationTruncate +
        " <a href='https://pfasproject.com/pfas-contamination-site-tracker/'>[...]</a><br><hr>";
    }

    var generics = ["Location"];

    for (var i = 0; i < generics.length; i++) {
      var key = generics[i];
      if (!!item[generics[i]]) {
        var itemContent = item[generics[i]];
        key = key.charAt(0).toUpperCase() + key.slice(1);
        content += key + ": " + itemContent + "<br>";
      }
    }

    content +=
      "<hr><i>Data provided by <a href='https://pfasproject.com/pfas-contamination-site-tracker/'>Source: Northeastern University - Social Science Environmental Health Research Institute</a></i>";
    return content;
  },

  addMarker: function (data) {
    // changed this to the value from my dataset
    // var key = data.gsx$name.$t;
    var key =
      data[
        "Contamination Site Geographic location of contamination/ DOD site name / entity sampled"
      ];
    if (!this._layers[key]) {
      var marker = this.getMarker(data);
      this._layers[key] = marker;
      this.addLayer(marker);
    }
  },

  parseData: function (data) {
    var i;
    for (i = 0; i < data.length; i++) {
      this.addMarker(data[i]);
    }
  },
});

L.layerGroup.pfasLayer = function (options) {
  return new L.LayerGroup.PfasLayer(options);
};
