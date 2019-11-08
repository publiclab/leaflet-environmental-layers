/**
 * Exports a `PolygonLookup` constructor, which constructs a data-structure for
 * quickly finding the polygon that a point intersects in a (potentially very
 * large) set.
 */

'use strict';

var Rbush = require( 'rbush' );
var pointInPolygon = require( 'point-in-polygon' );
var polygonUtils = require( './lib/polygon_utils' );
var _ = require('lodash');

/**
 * @property {rbush} rtree A spatial index for `this.polygons`.
 * @property {object} polgons A GeoJSON feature collection.
 *
 * @param {object} [featureCollection] An optional GeoJSON feature collection
 *    to pass to `loadFeatureCollection()`.
 */
function PolygonLookup( featureCollection ){
  if( featureCollection !== undefined ){
    this.loadFeatureCollection( featureCollection );
  }
}

// Calculate point in polygon intersection, accounting for any holes
function pointInPolygonWithHoles(point, polygons) {
  var mainPolygon = polygons.geometry.coordinates[0];
  if( pointInPolygon( point, mainPolygon ) ){
    for( var subPolyInd = 1; subPolyInd < polygons.geometry.coordinates.length; subPolyInd++ ){
      if( pointInPolygon( point, polygons.geometry.coordinates[ subPolyInd ] ) ){
        return false;
      }
    }
    return true;
  }
  return false;
}


/*
 * Internal helper method to return a single matching polygon
 */
PolygonLookup.prototype.searchForOnePolygon = function searchForOnePolygon( x, y ) {
  // find which bboxes contain the search point. their polygons _may_ intersect that point
  var bboxes = this.rtree.search( { minX: x, minY: y, maxX: x, maxY: y } );

  var point = [ x, y ];

  // get the polygon for each possibly matching polygon based on the searched bboxes
  var polygons = bboxes.map(function(bbox, index) {
    return this.polygons[ bboxes[index].polyId ];
  // find the first polygon that actually intersects and return it
  }, this);

  return _.find(polygons, function(polyObj) {
    return pointInPolygonWithHoles(point, polyObj);
  });
};

/*
 * Internal helper method to return multiple matching polygons, up to a given limit.
 * A limit of -1 means unlimited
 */
PolygonLookup.prototype.searchForMultiplePolygons = function searchForMultiplePolygons( x, y, limit ) {
  if (limit === -1) {
    limit = Number.MAX_SAFE_INTEGER;
  }

  var point = [ x, y ];
  var bboxes = this.rtree.search( { minX: x, minY: y, maxX: x, maxY: y } );

  // get the polygon for each possibly matching polygon based on the searched bboxes
  var polygons = bboxes.map(function(bbox, index) {
    return this.polygons[ bboxes[index].polyId ];
  }, this);

  // keep track of matches to avoid extra expensive calculations if limit reached
  var matchesFound = 0;

  // filter matching polygons, up to the limit
  polygons = polygons.filter(function(polygon) {
    // short circuit if limit reached
    if (matchesFound >= limit) {
      return false;
    }

    var intersects = pointInPolygonWithHoles(point, polygon);
    if (intersects) {
      matchesFound++;
      return true;
    }
    return false;
  });

  // return all matching polygons as a GeoJSON FeatureCollection
  return {
    type : 'FeatureCollection',
    features : polygons,
  };
};

/**
 * Find polygon(s) that a point intersects. Execute a bounding-box search to
 * narrow down the candidate polygons to a small subset, and then perform
 * additional point-in-polygon intersections to resolve any ambiguities.
 *
 * @param {number} x The x-coordinate of the point.
 * @param {number} y The y-coordinate of the point.
 * @param {number} [limit] Number of results to return (-1 to return all the results).
 * @return {undefined|object} If one or more bounding box intersections are
 *    found and limit is undefined, return the first polygon that intersects (`x`, `y`); otherwise,
 *    `undefined`. If a limit is passed in, return intercecting polygons as a GeoJSON FeatureCollection.
 */
PolygonLookup.prototype.search = function search( x, y, limit ){
  if (limit === undefined) {
    return this.searchForOnePolygon( x, y );
  } else {
    return this.searchForMultiplePolygons( x, y, limit );
  }
};

/**
 * Build a spatial index for a set of polygons, and store both the polygons and
 * the index in this `PolygonLookup`.
 *
 * @param {object} collection A GeoJSON-formatted FeatureCollection.
 */
PolygonLookup.prototype.loadFeatureCollection = function loadFeatureCollection( collection ){
  var bboxes = [];
  var polygons = [];
  var polyId = 0;

  function indexPolygon( poly ){
    polygons.push(poly);
    var bbox = polygonUtils.getBoundingBox( poly.geometry.coordinates[ 0 ] );
    bbox.polyId = polyId++;
    bboxes.push(bbox);
  }

  function indexFeature( poly ){
    if( poly.geometry &&
        poly.geometry.coordinates[ 0 ] !== undefined &&
        poly.geometry.coordinates[ 0 ].length > 0){
      switch( poly.geometry.type ){
        case 'Polygon':
          indexPolygon( poly );
          break;

        case 'MultiPolygon':
          var childPolys = poly.geometry.coordinates;
          for( var ind = 0; ind < childPolys.length; ind++ ){
            var childPoly = {
              type: 'Feature',
              properties: poly.properties,
              geometry: {
                type: 'Polygon',
                coordinates: childPolys[ ind ]
              }
            };
            indexPolygon( childPoly );
          }
          break;
      }
    }
  }

  collection.features.forEach( indexFeature );
  this.rtree = new Rbush().load( bboxes );
  this.polygons = polygons;
};

module.exports = PolygonLookup;
