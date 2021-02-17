(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('leaflet')) :
  typeof define === 'function' && define.amd ? define(['leaflet'], factory) :
  global.VirtualGrid = factory(global.leaflet);
}(this, function (leaflet) { 'use strict';

  var VirtualGrid = leaflet.Layer.extend({

    options: {
      cellSize: 512,
      updateInterval: 150
    },

    initialize: function (options) {
      options = leaflet.setOptions(this, options);
      this._zooming = false;
    },

    onAdd: function (map) {
      this._map = map;
      this._update = leaflet.Util.throttle(this._update, this.options.updateInterval, this);
      this._reset();
      this._update();
    },

    onRemove: function () {
      this._map.removeEventListener(this.getEvents(), this);
      this._removeCells();
    },

    getEvents: function () {
      var events = {
        moveend: this._update,
        zoomstart: this._zoomstart,
        zoomend: this._reset
      };

      return events;
    },

    addTo: function (map) {
      map.addLayer(this);
      return this;
    },

    removeFrom: function (map) {
      map.removeLayer(this);
      return this;
    },

    _zoomstart: function () {
      this._zooming = true;
    },

    _reset: function () {
      this._removeCells();

      this._cells = {};
      this._activeCells = {};
      this._cellsToLoad = 0;
      this._cellsTotal = 0;
      this._cellNumBounds = this._getCellNumBounds();

      this._resetWrap();
      this._zooming = false;
    },

    _resetWrap: function () {
      var map = this._map;
      var crs = map.options.crs;

      if (crs.infinite) { return; }

      var cellSize = this._getCellSize();

      if (crs.wrapLng) {
        this._wrapLng = [
          Math.floor(map.project([0, crs.wrapLng[0]]).x / cellSize),
          Math.ceil(map.project([0, crs.wrapLng[1]]).x / cellSize)
        ];
      }

      if (crs.wrapLat) {
        this._wrapLat = [
          Math.floor(map.project([crs.wrapLat[0], 0]).y / cellSize),
          Math.ceil(map.project([crs.wrapLat[1], 0]).y / cellSize)
        ];
      }
    },

    _getCellSize: function () {
      return this.options.cellSize;
    },

    _update: function () {
      if (!this._map) {
        return;
      }

      var mapBounds = this._map.getPixelBounds();
      var cellSize = this._getCellSize();

      // cell coordinates range for the current view
      var cellBounds = leaflet.bounds(
        mapBounds.min.divideBy(cellSize).floor(),
        mapBounds.max.divideBy(cellSize).floor());

      this._removeOtherCells(cellBounds);
      this._addCells(cellBounds);

      this.fire('cellsupdated');
    },

    _addCells: function (cellBounds) {
      var queue = [];
      var center = cellBounds.getCenter();
      var zoom = this._map.getZoom();

      var j, i, coords;
      // create a queue of coordinates to load cells from
      for (j = cellBounds.min.y; j <= cellBounds.max.y; j++) {
        for (i = cellBounds.min.x; i <= cellBounds.max.x; i++) {
          coords = leaflet.point(i, j);
          coords.z = zoom;

          if (this._isValidCell(coords)) {
            queue.push(coords);
          }
        }
      }

      var cellsToLoad = queue.length;

      if (cellsToLoad === 0) { return; }

      this._cellsToLoad += cellsToLoad;
      this._cellsTotal += cellsToLoad;

      // sort cell queue to load cells in order of their distance to center
      queue.sort(function (a, b) {
        return a.distanceTo(center) - b.distanceTo(center);
      });

      for (i = 0; i < cellsToLoad; i++) {
        this._addCell(queue[i]);
      }
    },

    _isValidCell: function (coords) {
      var crs = this._map.options.crs;

      if (!crs.infinite) {
        // don't load cell if it's out of bounds and not wrapped
        var cellNumBounds = this._cellNumBounds;

        if (!cellNumBounds) return false;
        if (
          (!crs.wrapLng && (coords.x < cellNumBounds.min.x || coords.x > cellNumBounds.max.x)) ||
          (!crs.wrapLat && (coords.y < cellNumBounds.min.y || coords.y > cellNumBounds.max.y))
        ) {
          return false;
        }
      }

      if (!this.options.bounds) {
        return true;
      }

      // don't load cell if it doesn't intersect the bounds in options
      var cellBounds = this._cellCoordsToBounds(coords);
      return leaflet.latLngBounds(this.options.bounds).intersects(cellBounds);
    },

    // converts cell coordinates to its geographical bounds
    _cellCoordsToBounds: function (coords) {
      var map = this._map;
      var cellSize = this.options.cellSize;
      var nwPoint = coords.multiplyBy(cellSize);
      var sePoint = nwPoint.add([cellSize, cellSize]);
      var nw = map.wrapLatLng(map.unproject(nwPoint, coords.z));
      var se = map.wrapLatLng(map.unproject(sePoint, coords.z));

      return leaflet.latLngBounds(nw, se);
    },

    // converts cell coordinates to key for the cell cache
    _cellCoordsToKey: function (coords) {
      return coords.x + ':' + coords.y;
    },

    // converts cell cache key to coordiantes
    _keyToCellCoords: function (key) {
      var kArr = key.split(':');
      var x = parseInt(kArr[0], 10);
      var y = parseInt(kArr[1], 10);

      return leaflet.point(x, y);
    },

    // remove any present cells that are off the specified bounds
    _removeOtherCells: function (bounds) {
      for (var key in this._cells) {
        if (!bounds.contains(this._keyToCellCoords(key))) {
          this._removeCell(key);
        }
      }
    },

    _removeCell: function (key) {
      var cell = this._activeCells[key];

      if (cell) {
        delete this._activeCells[key];

        if (this.cellLeave) {
          this.cellLeave(cell.bounds, cell.coords);
        }

        this.fire('cellleave', {
          bounds: cell.bounds,
          coords: cell.coords
        });
      }
    },

    _removeCells: function () {
      for (var key in this._cells) {
        var cellBounds = this._cells[key].bounds;
        var coords = this._cells[key].coords;

        if (this.cellLeave) {
          this.cellLeave(cellBounds, coords);
        }

        this.fire('cellleave', {
          bounds: cellBounds,
          coords: coords
        });
      }
    },

    _addCell: function (coords) {
      // wrap cell coords if necessary (depending on CRS)
      this._wrapCoords(coords);

      // generate the cell key
      var key = this._cellCoordsToKey(coords);

      // get the cell from the cache
      var cell = this._cells[key];
      // if this cell should be shown as isnt active yet (enter)

      if (cell && !this._activeCells[key]) {
        if (this.cellEnter) {
          this.cellEnter(cell.bounds, coords);
        }

        this.fire('cellenter', {
          bounds: cell.bounds,
          coords: coords
        });

        this._activeCells[key] = cell;
      }

      // if we dont have this cell in the cache yet (create)
      if (!cell) {
        cell = {
          coords: coords,
          bounds: this._cellCoordsToBounds(coords)
        };

        this._cells[key] = cell;
        this._activeCells[key] = cell;

        if (this.createCell) {
          this.createCell(cell.bounds, coords);
        }

        this.fire('cellcreate', {
          bounds: cell.bounds,
          coords: coords
        });
      }
    },

    _wrapCoords: function (coords) {
      coords.x = this._wrapLng ? leaflet.Util.wrapNum(coords.x, this._wrapLng) : coords.x;
      coords.y = this._wrapLat ? leaflet.Util.wrapNum(coords.y, this._wrapLat) : coords.y;
    },

    // get the global cell coordinates range for the current zoom
    _getCellNumBounds: function () {
      var worldBounds = this._map.getPixelWorldBounds();
      var size = this._getCellSize();

      return worldBounds ? leaflet.bounds(
        worldBounds.min.divideBy(size).floor(),
        worldBounds.max.divideBy(size).ceil().subtract([1, 1])) : null;
    }
  });

  return VirtualGrid;

}));
//# sourceMappingURL=virtual-grid.js.map