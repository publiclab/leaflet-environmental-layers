/**
 * Miscellaneous polygon utilities.
 */

'use strict';

/**
 * @param {2d array of number} poly An array of 2D point arrays.
 * @return {array of numbe} The bounding box of the polygon, in
 *    `minX, minY, maxX, maxY` format.
 */
function getBoundingBox( poly ){
  var firstPt = poly[0];
  var bbox = {
    minX: firstPt[0],
    minY: firstPt[1],
    maxX: firstPt[0],
    maxY: firstPt[1]
  };

  for( var ind = 1; ind < poly.length; ind++ ){
    var pt = poly[ind];

    var x = pt[0];
    if( x < bbox.minX ){
      bbox.minX = x;
    } else if( x > bbox.maxX ){
      bbox.maxX = x;
    }

    var y = pt[1];
    if( y < bbox.minY ){
      bbox.minY = y;
    } else if( y > bbox.maxY ){
      bbox.maxY = y;
    }
  }

  return bbox;
}

module.exports = {
  getBoundingBox: getBoundingBox
};
