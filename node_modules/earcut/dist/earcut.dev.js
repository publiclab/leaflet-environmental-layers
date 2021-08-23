(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.earcut = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

module.exports = earcut;
module.exports.default = earcut;

function earcut(data, holeIndices, dim) {

    dim = dim || 2;

    var hasHoles = holeIndices && holeIndices.length,
        outerLen = hasHoles ? holeIndices[0] * dim : data.length,
        outerNode = linkedList(data, 0, outerLen, dim, true),
        triangles = [];

    if (!outerNode || outerNode.next === outerNode.prev) return triangles;

    var minX, minY, maxX, maxY, x, y, invSize;

    if (hasHoles) outerNode = eliminateHoles(data, holeIndices, outerNode, dim);

    // if the shape is not too simple, we'll use z-order curve hash later; calculate polygon bbox
    if (data.length > 80 * dim) {
        minX = maxX = data[0];
        minY = maxY = data[1];

        for (var i = dim; i < outerLen; i += dim) {
            x = data[i];
            y = data[i + 1];
            if (x < minX) minX = x;
            if (y < minY) minY = y;
            if (x > maxX) maxX = x;
            if (y > maxY) maxY = y;
        }

        // minX, minY and invSize are later used to transform coords into integers for z-order calculation
        invSize = Math.max(maxX - minX, maxY - minY);
        invSize = invSize !== 0 ? 1 / invSize : 0;
    }

    earcutLinked(outerNode, triangles, dim, minX, minY, invSize);

    return triangles;
}

// create a circular doubly linked list from polygon points in the specified winding order
function linkedList(data, start, end, dim, clockwise) {
    var i, last;

    if (clockwise === (signedArea(data, start, end, dim) > 0)) {
        for (i = start; i < end; i += dim) last = insertNode(i, data[i], data[i + 1], last);
    } else {
        for (i = end - dim; i >= start; i -= dim) last = insertNode(i, data[i], data[i + 1], last);
    }

    if (last && equals(last, last.next)) {
        removeNode(last);
        last = last.next;
    }

    return last;
}

// eliminate colinear or duplicate points
function filterPoints(start, end) {
    if (!start) return start;
    if (!end) end = start;

    var p = start,
        again;
    do {
        again = false;

        if (!p.steiner && (equals(p, p.next) || area(p.prev, p, p.next) === 0)) {
            removeNode(p);
            p = end = p.prev;
            if (p === p.next) break;
            again = true;

        } else {
            p = p.next;
        }
    } while (again || p !== end);

    return end;
}

// main ear slicing loop which triangulates a polygon (given as a linked list)
function earcutLinked(ear, triangles, dim, minX, minY, invSize, pass) {
    if (!ear) return;

    // interlink polygon nodes in z-order
    if (!pass && invSize) indexCurve(ear, minX, minY, invSize);

    var stop = ear,
        prev, next;

    // iterate through ears, slicing them one by one
    while (ear.prev !== ear.next) {
        prev = ear.prev;
        next = ear.next;

        if (invSize ? isEarHashed(ear, minX, minY, invSize) : isEar(ear)) {
            // cut off the triangle
            triangles.push(prev.i / dim);
            triangles.push(ear.i / dim);
            triangles.push(next.i / dim);

            removeNode(ear);

            // skipping the next vertex leads to less sliver triangles
            ear = next.next;
            stop = next.next;

            continue;
        }

        ear = next;

        // if we looped through the whole remaining polygon and can't find any more ears
        if (ear === stop) {
            // try filtering points and slicing again
            if (!pass) {
                earcutLinked(filterPoints(ear), triangles, dim, minX, minY, invSize, 1);

            // if this didn't work, try curing all small self-intersections locally
            } else if (pass === 1) {
                ear = cureLocalIntersections(filterPoints(ear), triangles, dim);
                earcutLinked(ear, triangles, dim, minX, minY, invSize, 2);

            // as a last resort, try splitting the remaining polygon into two
            } else if (pass === 2) {
                splitEarcut(ear, triangles, dim, minX, minY, invSize);
            }

            break;
        }
    }
}

// check whether a polygon node forms a valid ear with adjacent nodes
function isEar(ear) {
    var a = ear.prev,
        b = ear,
        c = ear.next;

    if (area(a, b, c) >= 0) return false; // reflex, can't be an ear

    // now make sure we don't have other points inside the potential ear
    var p = ear.next.next;

    while (p !== ear.prev) {
        if (pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
            area(p.prev, p, p.next) >= 0) return false;
        p = p.next;
    }

    return true;
}

function isEarHashed(ear, minX, minY, invSize) {
    var a = ear.prev,
        b = ear,
        c = ear.next;

    if (area(a, b, c) >= 0) return false; // reflex, can't be an ear

    // triangle bbox; min & max are calculated like this for speed
    var minTX = a.x < b.x ? (a.x < c.x ? a.x : c.x) : (b.x < c.x ? b.x : c.x),
        minTY = a.y < b.y ? (a.y < c.y ? a.y : c.y) : (b.y < c.y ? b.y : c.y),
        maxTX = a.x > b.x ? (a.x > c.x ? a.x : c.x) : (b.x > c.x ? b.x : c.x),
        maxTY = a.y > b.y ? (a.y > c.y ? a.y : c.y) : (b.y > c.y ? b.y : c.y);

    // z-order range for the current triangle bbox;
    var minZ = zOrder(minTX, minTY, minX, minY, invSize),
        maxZ = zOrder(maxTX, maxTY, minX, minY, invSize);

    var p = ear.prevZ,
        n = ear.nextZ;

    // look for points inside the triangle in both directions
    while (p && p.z >= minZ && n && n.z <= maxZ) {
        if (p !== ear.prev && p !== ear.next &&
            pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
            area(p.prev, p, p.next) >= 0) return false;
        p = p.prevZ;

        if (n !== ear.prev && n !== ear.next &&
            pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, n.x, n.y) &&
            area(n.prev, n, n.next) >= 0) return false;
        n = n.nextZ;
    }

    // look for remaining points in decreasing z-order
    while (p && p.z >= minZ) {
        if (p !== ear.prev && p !== ear.next &&
            pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
            area(p.prev, p, p.next) >= 0) return false;
        p = p.prevZ;
    }

    // look for remaining points in increasing z-order
    while (n && n.z <= maxZ) {
        if (n !== ear.prev && n !== ear.next &&
            pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, n.x, n.y) &&
            area(n.prev, n, n.next) >= 0) return false;
        n = n.nextZ;
    }

    return true;
}

// go through all polygon nodes and cure small local self-intersections
function cureLocalIntersections(start, triangles, dim) {
    var p = start;
    do {
        var a = p.prev,
            b = p.next.next;

        if (!equals(a, b) && intersects(a, p, p.next, b) && locallyInside(a, b) && locallyInside(b, a)) {

            triangles.push(a.i / dim);
            triangles.push(p.i / dim);
            triangles.push(b.i / dim);

            // remove two nodes involved
            removeNode(p);
            removeNode(p.next);

            p = start = b;
        }
        p = p.next;
    } while (p !== start);

    return filterPoints(p);
}

// try splitting polygon into two and triangulate them independently
function splitEarcut(start, triangles, dim, minX, minY, invSize) {
    // look for a valid diagonal that divides the polygon into two
    var a = start;
    do {
        var b = a.next.next;
        while (b !== a.prev) {
            if (a.i !== b.i && isValidDiagonal(a, b)) {
                // split the polygon in two by the diagonal
                var c = splitPolygon(a, b);

                // filter colinear points around the cuts
                a = filterPoints(a, a.next);
                c = filterPoints(c, c.next);

                // run earcut on each half
                earcutLinked(a, triangles, dim, minX, minY, invSize);
                earcutLinked(c, triangles, dim, minX, minY, invSize);
                return;
            }
            b = b.next;
        }
        a = a.next;
    } while (a !== start);
}

// link every hole into the outer loop, producing a single-ring polygon without holes
function eliminateHoles(data, holeIndices, outerNode, dim) {
    var queue = [],
        i, len, start, end, list;

    for (i = 0, len = holeIndices.length; i < len; i++) {
        start = holeIndices[i] * dim;
        end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
        list = linkedList(data, start, end, dim, false);
        if (list === list.next) list.steiner = true;
        queue.push(getLeftmost(list));
    }

    queue.sort(compareX);

    // process holes from left to right
    for (i = 0; i < queue.length; i++) {
        eliminateHole(queue[i], outerNode);
        outerNode = filterPoints(outerNode, outerNode.next);
    }

    return outerNode;
}

function compareX(a, b) {
    return a.x - b.x;
}

// find a bridge between vertices that connects hole with an outer ring and and link it
function eliminateHole(hole, outerNode) {
    outerNode = findHoleBridge(hole, outerNode);
    if (outerNode) {
        var b = splitPolygon(outerNode, hole);

        // filter collinear points around the cuts
        filterPoints(outerNode, outerNode.next);
        filterPoints(b, b.next);
    }
}

// David Eberly's algorithm for finding a bridge between hole and outer polygon
function findHoleBridge(hole, outerNode) {
    var p = outerNode,
        hx = hole.x,
        hy = hole.y,
        qx = -Infinity,
        m;

    // find a segment intersected by a ray from the hole's leftmost point to the left;
    // segment's endpoint with lesser x will be potential connection point
    do {
        if (hy <= p.y && hy >= p.next.y && p.next.y !== p.y) {
            var x = p.x + (hy - p.y) * (p.next.x - p.x) / (p.next.y - p.y);
            if (x <= hx && x > qx) {
                qx = x;
                if (x === hx) {
                    if (hy === p.y) return p;
                    if (hy === p.next.y) return p.next;
                }
                m = p.x < p.next.x ? p : p.next;
            }
        }
        p = p.next;
    } while (p !== outerNode);

    if (!m) return null;

    if (hx === qx) return m; // hole touches outer segment; pick leftmost endpoint

    // look for points inside the triangle of hole point, segment intersection and endpoint;
    // if there are no points found, we have a valid connection;
    // otherwise choose the point of the minimum angle with the ray as connection point

    var stop = m,
        mx = m.x,
        my = m.y,
        tanMin = Infinity,
        tan;

    p = m;

    do {
        if (hx >= p.x && p.x >= mx && hx !== p.x &&
                pointInTriangle(hy < my ? hx : qx, hy, mx, my, hy < my ? qx : hx, hy, p.x, p.y)) {

            tan = Math.abs(hy - p.y) / (hx - p.x); // tangential

            if (locallyInside(p, hole) &&
                (tan < tanMin || (tan === tanMin && (p.x > m.x || (p.x === m.x && sectorContainsSector(m, p)))))) {
                m = p;
                tanMin = tan;
            }
        }

        p = p.next;
    } while (p !== stop);

    return m;
}

// whether sector in vertex m contains sector in vertex p in the same coordinates
function sectorContainsSector(m, p) {
    return area(m.prev, m, p.prev) < 0 && area(p.next, m, m.next) < 0;
}

// interlink polygon nodes in z-order
function indexCurve(start, minX, minY, invSize) {
    var p = start;
    do {
        if (p.z === null) p.z = zOrder(p.x, p.y, minX, minY, invSize);
        p.prevZ = p.prev;
        p.nextZ = p.next;
        p = p.next;
    } while (p !== start);

    p.prevZ.nextZ = null;
    p.prevZ = null;

    sortLinked(p);
}

// Simon Tatham's linked list merge sort algorithm
// http://www.chiark.greenend.org.uk/~sgtatham/algorithms/listsort.html
function sortLinked(list) {
    var i, p, q, e, tail, numMerges, pSize, qSize,
        inSize = 1;

    do {
        p = list;
        list = null;
        tail = null;
        numMerges = 0;

        while (p) {
            numMerges++;
            q = p;
            pSize = 0;
            for (i = 0; i < inSize; i++) {
                pSize++;
                q = q.nextZ;
                if (!q) break;
            }
            qSize = inSize;

            while (pSize > 0 || (qSize > 0 && q)) {

                if (pSize !== 0 && (qSize === 0 || !q || p.z <= q.z)) {
                    e = p;
                    p = p.nextZ;
                    pSize--;
                } else {
                    e = q;
                    q = q.nextZ;
                    qSize--;
                }

                if (tail) tail.nextZ = e;
                else list = e;

                e.prevZ = tail;
                tail = e;
            }

            p = q;
        }

        tail.nextZ = null;
        inSize *= 2;

    } while (numMerges > 1);

    return list;
}

// z-order of a point given coords and inverse of the longer side of data bbox
function zOrder(x, y, minX, minY, invSize) {
    // coords are transformed into non-negative 15-bit integer range
    x = 32767 * (x - minX) * invSize;
    y = 32767 * (y - minY) * invSize;

    x = (x | (x << 8)) & 0x00FF00FF;
    x = (x | (x << 4)) & 0x0F0F0F0F;
    x = (x | (x << 2)) & 0x33333333;
    x = (x | (x << 1)) & 0x55555555;

    y = (y | (y << 8)) & 0x00FF00FF;
    y = (y | (y << 4)) & 0x0F0F0F0F;
    y = (y | (y << 2)) & 0x33333333;
    y = (y | (y << 1)) & 0x55555555;

    return x | (y << 1);
}

// find the leftmost node of a polygon ring
function getLeftmost(start) {
    var p = start,
        leftmost = start;
    do {
        if (p.x < leftmost.x || (p.x === leftmost.x && p.y < leftmost.y)) leftmost = p;
        p = p.next;
    } while (p !== start);

    return leftmost;
}

// check if a point lies within a convex triangle
function pointInTriangle(ax, ay, bx, by, cx, cy, px, py) {
    return (cx - px) * (ay - py) - (ax - px) * (cy - py) >= 0 &&
           (ax - px) * (by - py) - (bx - px) * (ay - py) >= 0 &&
           (bx - px) * (cy - py) - (cx - px) * (by - py) >= 0;
}

// check if a diagonal between two polygon nodes is valid (lies in polygon interior)
function isValidDiagonal(a, b) {
    return a.next.i !== b.i && a.prev.i !== b.i && !intersectsPolygon(a, b) && // dones't intersect other edges
           (locallyInside(a, b) && locallyInside(b, a) && middleInside(a, b) && // locally visible
            (area(a.prev, a, b.prev) || area(a, b.prev, b)) || // does not create opposite-facing sectors
            equals(a, b) && area(a.prev, a, a.next) > 0 && area(b.prev, b, b.next) > 0); // special zero-length case
}

// signed area of a triangle
function area(p, q, r) {
    return (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
}

// check if two points are equal
function equals(p1, p2) {
    return p1.x === p2.x && p1.y === p2.y;
}

// check if two segments intersect
function intersects(p1, q1, p2, q2) {
    var o1 = sign(area(p1, q1, p2));
    var o2 = sign(area(p1, q1, q2));
    var o3 = sign(area(p2, q2, p1));
    var o4 = sign(area(p2, q2, q1));

    if (o1 !== o2 && o3 !== o4) return true; // general case

    if (o1 === 0 && onSegment(p1, p2, q1)) return true; // p1, q1 and p2 are collinear and p2 lies on p1q1
    if (o2 === 0 && onSegment(p1, q2, q1)) return true; // p1, q1 and q2 are collinear and q2 lies on p1q1
    if (o3 === 0 && onSegment(p2, p1, q2)) return true; // p2, q2 and p1 are collinear and p1 lies on p2q2
    if (o4 === 0 && onSegment(p2, q1, q2)) return true; // p2, q2 and q1 are collinear and q1 lies on p2q2

    return false;
}

// for collinear points p, q, r, check if point q lies on segment pr
function onSegment(p, q, r) {
    return q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) && q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y);
}

function sign(num) {
    return num > 0 ? 1 : num < 0 ? -1 : 0;
}

// check if a polygon diagonal intersects any polygon segments
function intersectsPolygon(a, b) {
    var p = a;
    do {
        if (p.i !== a.i && p.next.i !== a.i && p.i !== b.i && p.next.i !== b.i &&
                intersects(p, p.next, a, b)) return true;
        p = p.next;
    } while (p !== a);

    return false;
}

// check if a polygon diagonal is locally inside the polygon
function locallyInside(a, b) {
    return area(a.prev, a, a.next) < 0 ?
        area(a, b, a.next) >= 0 && area(a, a.prev, b) >= 0 :
        area(a, b, a.prev) < 0 || area(a, a.next, b) < 0;
}

// check if the middle point of a polygon diagonal is inside the polygon
function middleInside(a, b) {
    var p = a,
        inside = false,
        px = (a.x + b.x) / 2,
        py = (a.y + b.y) / 2;
    do {
        if (((p.y > py) !== (p.next.y > py)) && p.next.y !== p.y &&
                (px < (p.next.x - p.x) * (py - p.y) / (p.next.y - p.y) + p.x))
            inside = !inside;
        p = p.next;
    } while (p !== a);

    return inside;
}

// link two polygon vertices with a bridge; if the vertices belong to the same ring, it splits polygon into two;
// if one belongs to the outer ring and another to a hole, it merges it into a single ring
function splitPolygon(a, b) {
    var a2 = new Node(a.i, a.x, a.y),
        b2 = new Node(b.i, b.x, b.y),
        an = a.next,
        bp = b.prev;

    a.next = b;
    b.prev = a;

    a2.next = an;
    an.prev = a2;

    b2.next = a2;
    a2.prev = b2;

    bp.next = b2;
    b2.prev = bp;

    return b2;
}

// create a node and optionally link it with previous one (in a circular doubly linked list)
function insertNode(i, x, y, last) {
    var p = new Node(i, x, y);

    if (!last) {
        p.prev = p;
        p.next = p;

    } else {
        p.next = last.next;
        p.prev = last;
        last.next.prev = p;
        last.next = p;
    }
    return p;
}

function removeNode(p) {
    p.next.prev = p.prev;
    p.prev.next = p.next;

    if (p.prevZ) p.prevZ.nextZ = p.nextZ;
    if (p.nextZ) p.nextZ.prevZ = p.prevZ;
}

function Node(i, x, y) {
    // vertex index in coordinates array
    this.i = i;

    // vertex coordinates
    this.x = x;
    this.y = y;

    // previous and next vertex nodes in a polygon ring
    this.prev = null;
    this.next = null;

    // z-order curve value
    this.z = null;

    // previous and next nodes in z-order
    this.prevZ = null;
    this.nextZ = null;

    // indicates whether this is a steiner point
    this.steiner = false;
}

// return a percentage difference between the polygon area and its triangulation area;
// used to verify correctness of triangulation
earcut.deviation = function (data, holeIndices, dim, triangles) {
    var hasHoles = holeIndices && holeIndices.length;
    var outerLen = hasHoles ? holeIndices[0] * dim : data.length;

    var polygonArea = Math.abs(signedArea(data, 0, outerLen, dim));
    if (hasHoles) {
        for (var i = 0, len = holeIndices.length; i < len; i++) {
            var start = holeIndices[i] * dim;
            var end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
            polygonArea -= Math.abs(signedArea(data, start, end, dim));
        }
    }

    var trianglesArea = 0;
    for (i = 0; i < triangles.length; i += 3) {
        var a = triangles[i] * dim;
        var b = triangles[i + 1] * dim;
        var c = triangles[i + 2] * dim;
        trianglesArea += Math.abs(
            (data[a] - data[c]) * (data[b + 1] - data[a + 1]) -
            (data[a] - data[b]) * (data[c + 1] - data[a + 1]));
    }

    return polygonArea === 0 && trianglesArea === 0 ? 0 :
        Math.abs((trianglesArea - polygonArea) / polygonArea);
};

function signedArea(data, start, end, dim) {
    var sum = 0;
    for (var i = start, j = end - dim; i < end; i += dim) {
        sum += (data[j] - data[i]) * (data[i + 1] + data[j + 1]);
        j = i;
    }
    return sum;
}

// turn a polygon in a multi-dimensional array form (e.g. as in GeoJSON) into a form Earcut accepts
earcut.flatten = function (data) {
    var dim = data[0][0].length,
        result = {vertices: [], holes: [], dimensions: dim},
        holeIndex = 0;

    for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data[i].length; j++) {
            for (var d = 0; d < dim; d++) result.vertices.push(data[i][j][d]);
        }
        if (i > 0) {
            holeIndex += data[i - 1].length;
            result.holes.push(holeIndex);
        }
    }
    return result;
};

},{}]},{},[1])(1)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvZWFyY3V0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBlYXJjdXQ7XG5tb2R1bGUuZXhwb3J0cy5kZWZhdWx0ID0gZWFyY3V0O1xuXG5mdW5jdGlvbiBlYXJjdXQoZGF0YSwgaG9sZUluZGljZXMsIGRpbSkge1xuXG4gICAgZGltID0gZGltIHx8IDI7XG5cbiAgICB2YXIgaGFzSG9sZXMgPSBob2xlSW5kaWNlcyAmJiBob2xlSW5kaWNlcy5sZW5ndGgsXG4gICAgICAgIG91dGVyTGVuID0gaGFzSG9sZXMgPyBob2xlSW5kaWNlc1swXSAqIGRpbSA6IGRhdGEubGVuZ3RoLFxuICAgICAgICBvdXRlck5vZGUgPSBsaW5rZWRMaXN0KGRhdGEsIDAsIG91dGVyTGVuLCBkaW0sIHRydWUpLFxuICAgICAgICB0cmlhbmdsZXMgPSBbXTtcblxuICAgIGlmICghb3V0ZXJOb2RlIHx8IG91dGVyTm9kZS5uZXh0ID09PSBvdXRlck5vZGUucHJldikgcmV0dXJuIHRyaWFuZ2xlcztcblxuICAgIHZhciBtaW5YLCBtaW5ZLCBtYXhYLCBtYXhZLCB4LCB5LCBpbnZTaXplO1xuXG4gICAgaWYgKGhhc0hvbGVzKSBvdXRlck5vZGUgPSBlbGltaW5hdGVIb2xlcyhkYXRhLCBob2xlSW5kaWNlcywgb3V0ZXJOb2RlLCBkaW0pO1xuXG4gICAgLy8gaWYgdGhlIHNoYXBlIGlzIG5vdCB0b28gc2ltcGxlLCB3ZSdsbCB1c2Ugei1vcmRlciBjdXJ2ZSBoYXNoIGxhdGVyOyBjYWxjdWxhdGUgcG9seWdvbiBiYm94XG4gICAgaWYgKGRhdGEubGVuZ3RoID4gODAgKiBkaW0pIHtcbiAgICAgICAgbWluWCA9IG1heFggPSBkYXRhWzBdO1xuICAgICAgICBtaW5ZID0gbWF4WSA9IGRhdGFbMV07XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IGRpbTsgaSA8IG91dGVyTGVuOyBpICs9IGRpbSkge1xuICAgICAgICAgICAgeCA9IGRhdGFbaV07XG4gICAgICAgICAgICB5ID0gZGF0YVtpICsgMV07XG4gICAgICAgICAgICBpZiAoeCA8IG1pblgpIG1pblggPSB4O1xuICAgICAgICAgICAgaWYgKHkgPCBtaW5ZKSBtaW5ZID0geTtcbiAgICAgICAgICAgIGlmICh4ID4gbWF4WCkgbWF4WCA9IHg7XG4gICAgICAgICAgICBpZiAoeSA+IG1heFkpIG1heFkgPSB5O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gbWluWCwgbWluWSBhbmQgaW52U2l6ZSBhcmUgbGF0ZXIgdXNlZCB0byB0cmFuc2Zvcm0gY29vcmRzIGludG8gaW50ZWdlcnMgZm9yIHotb3JkZXIgY2FsY3VsYXRpb25cbiAgICAgICAgaW52U2l6ZSA9IE1hdGgubWF4KG1heFggLSBtaW5YLCBtYXhZIC0gbWluWSk7XG4gICAgICAgIGludlNpemUgPSBpbnZTaXplICE9PSAwID8gMSAvIGludlNpemUgOiAwO1xuICAgIH1cblxuICAgIGVhcmN1dExpbmtlZChvdXRlck5vZGUsIHRyaWFuZ2xlcywgZGltLCBtaW5YLCBtaW5ZLCBpbnZTaXplKTtcblxuICAgIHJldHVybiB0cmlhbmdsZXM7XG59XG5cbi8vIGNyZWF0ZSBhIGNpcmN1bGFyIGRvdWJseSBsaW5rZWQgbGlzdCBmcm9tIHBvbHlnb24gcG9pbnRzIGluIHRoZSBzcGVjaWZpZWQgd2luZGluZyBvcmRlclxuZnVuY3Rpb24gbGlua2VkTGlzdChkYXRhLCBzdGFydCwgZW5kLCBkaW0sIGNsb2Nrd2lzZSkge1xuICAgIHZhciBpLCBsYXN0O1xuXG4gICAgaWYgKGNsb2Nrd2lzZSA9PT0gKHNpZ25lZEFyZWEoZGF0YSwgc3RhcnQsIGVuZCwgZGltKSA+IDApKSB7XG4gICAgICAgIGZvciAoaSA9IHN0YXJ0OyBpIDwgZW5kOyBpICs9IGRpbSkgbGFzdCA9IGluc2VydE5vZGUoaSwgZGF0YVtpXSwgZGF0YVtpICsgMV0sIGxhc3QpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGZvciAoaSA9IGVuZCAtIGRpbTsgaSA+PSBzdGFydDsgaSAtPSBkaW0pIGxhc3QgPSBpbnNlcnROb2RlKGksIGRhdGFbaV0sIGRhdGFbaSArIDFdLCBsYXN0KTtcbiAgICB9XG5cbiAgICBpZiAobGFzdCAmJiBlcXVhbHMobGFzdCwgbGFzdC5uZXh0KSkge1xuICAgICAgICByZW1vdmVOb2RlKGxhc3QpO1xuICAgICAgICBsYXN0ID0gbGFzdC5uZXh0O1xuICAgIH1cblxuICAgIHJldHVybiBsYXN0O1xufVxuXG4vLyBlbGltaW5hdGUgY29saW5lYXIgb3IgZHVwbGljYXRlIHBvaW50c1xuZnVuY3Rpb24gZmlsdGVyUG9pbnRzKHN0YXJ0LCBlbmQpIHtcbiAgICBpZiAoIXN0YXJ0KSByZXR1cm4gc3RhcnQ7XG4gICAgaWYgKCFlbmQpIGVuZCA9IHN0YXJ0O1xuXG4gICAgdmFyIHAgPSBzdGFydCxcbiAgICAgICAgYWdhaW47XG4gICAgZG8ge1xuICAgICAgICBhZ2FpbiA9IGZhbHNlO1xuXG4gICAgICAgIGlmICghcC5zdGVpbmVyICYmIChlcXVhbHMocCwgcC5uZXh0KSB8fCBhcmVhKHAucHJldiwgcCwgcC5uZXh0KSA9PT0gMCkpIHtcbiAgICAgICAgICAgIHJlbW92ZU5vZGUocCk7XG4gICAgICAgICAgICBwID0gZW5kID0gcC5wcmV2O1xuICAgICAgICAgICAgaWYgKHAgPT09IHAubmV4dCkgYnJlYWs7XG4gICAgICAgICAgICBhZ2FpbiA9IHRydWU7XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHAgPSBwLm5leHQ7XG4gICAgICAgIH1cbiAgICB9IHdoaWxlIChhZ2FpbiB8fCBwICE9PSBlbmQpO1xuXG4gICAgcmV0dXJuIGVuZDtcbn1cblxuLy8gbWFpbiBlYXIgc2xpY2luZyBsb29wIHdoaWNoIHRyaWFuZ3VsYXRlcyBhIHBvbHlnb24gKGdpdmVuIGFzIGEgbGlua2VkIGxpc3QpXG5mdW5jdGlvbiBlYXJjdXRMaW5rZWQoZWFyLCB0cmlhbmdsZXMsIGRpbSwgbWluWCwgbWluWSwgaW52U2l6ZSwgcGFzcykge1xuICAgIGlmICghZWFyKSByZXR1cm47XG5cbiAgICAvLyBpbnRlcmxpbmsgcG9seWdvbiBub2RlcyBpbiB6LW9yZGVyXG4gICAgaWYgKCFwYXNzICYmIGludlNpemUpIGluZGV4Q3VydmUoZWFyLCBtaW5YLCBtaW5ZLCBpbnZTaXplKTtcblxuICAgIHZhciBzdG9wID0gZWFyLFxuICAgICAgICBwcmV2LCBuZXh0O1xuXG4gICAgLy8gaXRlcmF0ZSB0aHJvdWdoIGVhcnMsIHNsaWNpbmcgdGhlbSBvbmUgYnkgb25lXG4gICAgd2hpbGUgKGVhci5wcmV2ICE9PSBlYXIubmV4dCkge1xuICAgICAgICBwcmV2ID0gZWFyLnByZXY7XG4gICAgICAgIG5leHQgPSBlYXIubmV4dDtcblxuICAgICAgICBpZiAoaW52U2l6ZSA/IGlzRWFySGFzaGVkKGVhciwgbWluWCwgbWluWSwgaW52U2l6ZSkgOiBpc0VhcihlYXIpKSB7XG4gICAgICAgICAgICAvLyBjdXQgb2ZmIHRoZSB0cmlhbmdsZVxuICAgICAgICAgICAgdHJpYW5nbGVzLnB1c2gocHJldi5pIC8gZGltKTtcbiAgICAgICAgICAgIHRyaWFuZ2xlcy5wdXNoKGVhci5pIC8gZGltKTtcbiAgICAgICAgICAgIHRyaWFuZ2xlcy5wdXNoKG5leHQuaSAvIGRpbSk7XG5cbiAgICAgICAgICAgIHJlbW92ZU5vZGUoZWFyKTtcblxuICAgICAgICAgICAgLy8gc2tpcHBpbmcgdGhlIG5leHQgdmVydGV4IGxlYWRzIHRvIGxlc3Mgc2xpdmVyIHRyaWFuZ2xlc1xuICAgICAgICAgICAgZWFyID0gbmV4dC5uZXh0O1xuICAgICAgICAgICAgc3RvcCA9IG5leHQubmV4dDtcblxuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBlYXIgPSBuZXh0O1xuXG4gICAgICAgIC8vIGlmIHdlIGxvb3BlZCB0aHJvdWdoIHRoZSB3aG9sZSByZW1haW5pbmcgcG9seWdvbiBhbmQgY2FuJ3QgZmluZCBhbnkgbW9yZSBlYXJzXG4gICAgICAgIGlmIChlYXIgPT09IHN0b3ApIHtcbiAgICAgICAgICAgIC8vIHRyeSBmaWx0ZXJpbmcgcG9pbnRzIGFuZCBzbGljaW5nIGFnYWluXG4gICAgICAgICAgICBpZiAoIXBhc3MpIHtcbiAgICAgICAgICAgICAgICBlYXJjdXRMaW5rZWQoZmlsdGVyUG9pbnRzKGVhciksIHRyaWFuZ2xlcywgZGltLCBtaW5YLCBtaW5ZLCBpbnZTaXplLCAxKTtcblxuICAgICAgICAgICAgLy8gaWYgdGhpcyBkaWRuJ3Qgd29yaywgdHJ5IGN1cmluZyBhbGwgc21hbGwgc2VsZi1pbnRlcnNlY3Rpb25zIGxvY2FsbHlcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocGFzcyA9PT0gMSkge1xuICAgICAgICAgICAgICAgIGVhciA9IGN1cmVMb2NhbEludGVyc2VjdGlvbnMoZmlsdGVyUG9pbnRzKGVhciksIHRyaWFuZ2xlcywgZGltKTtcbiAgICAgICAgICAgICAgICBlYXJjdXRMaW5rZWQoZWFyLCB0cmlhbmdsZXMsIGRpbSwgbWluWCwgbWluWSwgaW52U2l6ZSwgMik7XG5cbiAgICAgICAgICAgIC8vIGFzIGEgbGFzdCByZXNvcnQsIHRyeSBzcGxpdHRpbmcgdGhlIHJlbWFpbmluZyBwb2x5Z29uIGludG8gdHdvXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHBhc3MgPT09IDIpIHtcbiAgICAgICAgICAgICAgICBzcGxpdEVhcmN1dChlYXIsIHRyaWFuZ2xlcywgZGltLCBtaW5YLCBtaW5ZLCBpbnZTaXplKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8vIGNoZWNrIHdoZXRoZXIgYSBwb2x5Z29uIG5vZGUgZm9ybXMgYSB2YWxpZCBlYXIgd2l0aCBhZGphY2VudCBub2Rlc1xuZnVuY3Rpb24gaXNFYXIoZWFyKSB7XG4gICAgdmFyIGEgPSBlYXIucHJldixcbiAgICAgICAgYiA9IGVhcixcbiAgICAgICAgYyA9IGVhci5uZXh0O1xuXG4gICAgaWYgKGFyZWEoYSwgYiwgYykgPj0gMCkgcmV0dXJuIGZhbHNlOyAvLyByZWZsZXgsIGNhbid0IGJlIGFuIGVhclxuXG4gICAgLy8gbm93IG1ha2Ugc3VyZSB3ZSBkb24ndCBoYXZlIG90aGVyIHBvaW50cyBpbnNpZGUgdGhlIHBvdGVudGlhbCBlYXJcbiAgICB2YXIgcCA9IGVhci5uZXh0Lm5leHQ7XG5cbiAgICB3aGlsZSAocCAhPT0gZWFyLnByZXYpIHtcbiAgICAgICAgaWYgKHBvaW50SW5UcmlhbmdsZShhLngsIGEueSwgYi54LCBiLnksIGMueCwgYy55LCBwLngsIHAueSkgJiZcbiAgICAgICAgICAgIGFyZWEocC5wcmV2LCBwLCBwLm5leHQpID49IDApIHJldHVybiBmYWxzZTtcbiAgICAgICAgcCA9IHAubmV4dDtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gaXNFYXJIYXNoZWQoZWFyLCBtaW5YLCBtaW5ZLCBpbnZTaXplKSB7XG4gICAgdmFyIGEgPSBlYXIucHJldixcbiAgICAgICAgYiA9IGVhcixcbiAgICAgICAgYyA9IGVhci5uZXh0O1xuXG4gICAgaWYgKGFyZWEoYSwgYiwgYykgPj0gMCkgcmV0dXJuIGZhbHNlOyAvLyByZWZsZXgsIGNhbid0IGJlIGFuIGVhclxuXG4gICAgLy8gdHJpYW5nbGUgYmJveDsgbWluICYgbWF4IGFyZSBjYWxjdWxhdGVkIGxpa2UgdGhpcyBmb3Igc3BlZWRcbiAgICB2YXIgbWluVFggPSBhLnggPCBiLnggPyAoYS54IDwgYy54ID8gYS54IDogYy54KSA6IChiLnggPCBjLnggPyBiLnggOiBjLngpLFxuICAgICAgICBtaW5UWSA9IGEueSA8IGIueSA/IChhLnkgPCBjLnkgPyBhLnkgOiBjLnkpIDogKGIueSA8IGMueSA/IGIueSA6IGMueSksXG4gICAgICAgIG1heFRYID0gYS54ID4gYi54ID8gKGEueCA+IGMueCA/IGEueCA6IGMueCkgOiAoYi54ID4gYy54ID8gYi54IDogYy54KSxcbiAgICAgICAgbWF4VFkgPSBhLnkgPiBiLnkgPyAoYS55ID4gYy55ID8gYS55IDogYy55KSA6IChiLnkgPiBjLnkgPyBiLnkgOiBjLnkpO1xuXG4gICAgLy8gei1vcmRlciByYW5nZSBmb3IgdGhlIGN1cnJlbnQgdHJpYW5nbGUgYmJveDtcbiAgICB2YXIgbWluWiA9IHpPcmRlcihtaW5UWCwgbWluVFksIG1pblgsIG1pblksIGludlNpemUpLFxuICAgICAgICBtYXhaID0gek9yZGVyKG1heFRYLCBtYXhUWSwgbWluWCwgbWluWSwgaW52U2l6ZSk7XG5cbiAgICB2YXIgcCA9IGVhci5wcmV2WixcbiAgICAgICAgbiA9IGVhci5uZXh0WjtcblxuICAgIC8vIGxvb2sgZm9yIHBvaW50cyBpbnNpZGUgdGhlIHRyaWFuZ2xlIGluIGJvdGggZGlyZWN0aW9uc1xuICAgIHdoaWxlIChwICYmIHAueiA+PSBtaW5aICYmIG4gJiYgbi56IDw9IG1heFopIHtcbiAgICAgICAgaWYgKHAgIT09IGVhci5wcmV2ICYmIHAgIT09IGVhci5uZXh0ICYmXG4gICAgICAgICAgICBwb2ludEluVHJpYW5nbGUoYS54LCBhLnksIGIueCwgYi55LCBjLngsIGMueSwgcC54LCBwLnkpICYmXG4gICAgICAgICAgICBhcmVhKHAucHJldiwgcCwgcC5uZXh0KSA+PSAwKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIHAgPSBwLnByZXZaO1xuXG4gICAgICAgIGlmIChuICE9PSBlYXIucHJldiAmJiBuICE9PSBlYXIubmV4dCAmJlxuICAgICAgICAgICAgcG9pbnRJblRyaWFuZ2xlKGEueCwgYS55LCBiLngsIGIueSwgYy54LCBjLnksIG4ueCwgbi55KSAmJlxuICAgICAgICAgICAgYXJlYShuLnByZXYsIG4sIG4ubmV4dCkgPj0gMCkgcmV0dXJuIGZhbHNlO1xuICAgICAgICBuID0gbi5uZXh0WjtcbiAgICB9XG5cbiAgICAvLyBsb29rIGZvciByZW1haW5pbmcgcG9pbnRzIGluIGRlY3JlYXNpbmcgei1vcmRlclxuICAgIHdoaWxlIChwICYmIHAueiA+PSBtaW5aKSB7XG4gICAgICAgIGlmIChwICE9PSBlYXIucHJldiAmJiBwICE9PSBlYXIubmV4dCAmJlxuICAgICAgICAgICAgcG9pbnRJblRyaWFuZ2xlKGEueCwgYS55LCBiLngsIGIueSwgYy54LCBjLnksIHAueCwgcC55KSAmJlxuICAgICAgICAgICAgYXJlYShwLnByZXYsIHAsIHAubmV4dCkgPj0gMCkgcmV0dXJuIGZhbHNlO1xuICAgICAgICBwID0gcC5wcmV2WjtcbiAgICB9XG5cbiAgICAvLyBsb29rIGZvciByZW1haW5pbmcgcG9pbnRzIGluIGluY3JlYXNpbmcgei1vcmRlclxuICAgIHdoaWxlIChuICYmIG4ueiA8PSBtYXhaKSB7XG4gICAgICAgIGlmIChuICE9PSBlYXIucHJldiAmJiBuICE9PSBlYXIubmV4dCAmJlxuICAgICAgICAgICAgcG9pbnRJblRyaWFuZ2xlKGEueCwgYS55LCBiLngsIGIueSwgYy54LCBjLnksIG4ueCwgbi55KSAmJlxuICAgICAgICAgICAgYXJlYShuLnByZXYsIG4sIG4ubmV4dCkgPj0gMCkgcmV0dXJuIGZhbHNlO1xuICAgICAgICBuID0gbi5uZXh0WjtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbn1cblxuLy8gZ28gdGhyb3VnaCBhbGwgcG9seWdvbiBub2RlcyBhbmQgY3VyZSBzbWFsbCBsb2NhbCBzZWxmLWludGVyc2VjdGlvbnNcbmZ1bmN0aW9uIGN1cmVMb2NhbEludGVyc2VjdGlvbnMoc3RhcnQsIHRyaWFuZ2xlcywgZGltKSB7XG4gICAgdmFyIHAgPSBzdGFydDtcbiAgICBkbyB7XG4gICAgICAgIHZhciBhID0gcC5wcmV2LFxuICAgICAgICAgICAgYiA9IHAubmV4dC5uZXh0O1xuXG4gICAgICAgIGlmICghZXF1YWxzKGEsIGIpICYmIGludGVyc2VjdHMoYSwgcCwgcC5uZXh0LCBiKSAmJiBsb2NhbGx5SW5zaWRlKGEsIGIpICYmIGxvY2FsbHlJbnNpZGUoYiwgYSkpIHtcblxuICAgICAgICAgICAgdHJpYW5nbGVzLnB1c2goYS5pIC8gZGltKTtcbiAgICAgICAgICAgIHRyaWFuZ2xlcy5wdXNoKHAuaSAvIGRpbSk7XG4gICAgICAgICAgICB0cmlhbmdsZXMucHVzaChiLmkgLyBkaW0pO1xuXG4gICAgICAgICAgICAvLyByZW1vdmUgdHdvIG5vZGVzIGludm9sdmVkXG4gICAgICAgICAgICByZW1vdmVOb2RlKHApO1xuICAgICAgICAgICAgcmVtb3ZlTm9kZShwLm5leHQpO1xuXG4gICAgICAgICAgICBwID0gc3RhcnQgPSBiO1xuICAgICAgICB9XG4gICAgICAgIHAgPSBwLm5leHQ7XG4gICAgfSB3aGlsZSAocCAhPT0gc3RhcnQpO1xuXG4gICAgcmV0dXJuIGZpbHRlclBvaW50cyhwKTtcbn1cblxuLy8gdHJ5IHNwbGl0dGluZyBwb2x5Z29uIGludG8gdHdvIGFuZCB0cmlhbmd1bGF0ZSB0aGVtIGluZGVwZW5kZW50bHlcbmZ1bmN0aW9uIHNwbGl0RWFyY3V0KHN0YXJ0LCB0cmlhbmdsZXMsIGRpbSwgbWluWCwgbWluWSwgaW52U2l6ZSkge1xuICAgIC8vIGxvb2sgZm9yIGEgdmFsaWQgZGlhZ29uYWwgdGhhdCBkaXZpZGVzIHRoZSBwb2x5Z29uIGludG8gdHdvXG4gICAgdmFyIGEgPSBzdGFydDtcbiAgICBkbyB7XG4gICAgICAgIHZhciBiID0gYS5uZXh0Lm5leHQ7XG4gICAgICAgIHdoaWxlIChiICE9PSBhLnByZXYpIHtcbiAgICAgICAgICAgIGlmIChhLmkgIT09IGIuaSAmJiBpc1ZhbGlkRGlhZ29uYWwoYSwgYikpIHtcbiAgICAgICAgICAgICAgICAvLyBzcGxpdCB0aGUgcG9seWdvbiBpbiB0d28gYnkgdGhlIGRpYWdvbmFsXG4gICAgICAgICAgICAgICAgdmFyIGMgPSBzcGxpdFBvbHlnb24oYSwgYik7XG5cbiAgICAgICAgICAgICAgICAvLyBmaWx0ZXIgY29saW5lYXIgcG9pbnRzIGFyb3VuZCB0aGUgY3V0c1xuICAgICAgICAgICAgICAgIGEgPSBmaWx0ZXJQb2ludHMoYSwgYS5uZXh0KTtcbiAgICAgICAgICAgICAgICBjID0gZmlsdGVyUG9pbnRzKGMsIGMubmV4dCk7XG5cbiAgICAgICAgICAgICAgICAvLyBydW4gZWFyY3V0IG9uIGVhY2ggaGFsZlxuICAgICAgICAgICAgICAgIGVhcmN1dExpbmtlZChhLCB0cmlhbmdsZXMsIGRpbSwgbWluWCwgbWluWSwgaW52U2l6ZSk7XG4gICAgICAgICAgICAgICAgZWFyY3V0TGlua2VkKGMsIHRyaWFuZ2xlcywgZGltLCBtaW5YLCBtaW5ZLCBpbnZTaXplKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBiID0gYi5uZXh0O1xuICAgICAgICB9XG4gICAgICAgIGEgPSBhLm5leHQ7XG4gICAgfSB3aGlsZSAoYSAhPT0gc3RhcnQpO1xufVxuXG4vLyBsaW5rIGV2ZXJ5IGhvbGUgaW50byB0aGUgb3V0ZXIgbG9vcCwgcHJvZHVjaW5nIGEgc2luZ2xlLXJpbmcgcG9seWdvbiB3aXRob3V0IGhvbGVzXG5mdW5jdGlvbiBlbGltaW5hdGVIb2xlcyhkYXRhLCBob2xlSW5kaWNlcywgb3V0ZXJOb2RlLCBkaW0pIHtcbiAgICB2YXIgcXVldWUgPSBbXSxcbiAgICAgICAgaSwgbGVuLCBzdGFydCwgZW5kLCBsaXN0O1xuXG4gICAgZm9yIChpID0gMCwgbGVuID0gaG9sZUluZGljZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgc3RhcnQgPSBob2xlSW5kaWNlc1tpXSAqIGRpbTtcbiAgICAgICAgZW5kID0gaSA8IGxlbiAtIDEgPyBob2xlSW5kaWNlc1tpICsgMV0gKiBkaW0gOiBkYXRhLmxlbmd0aDtcbiAgICAgICAgbGlzdCA9IGxpbmtlZExpc3QoZGF0YSwgc3RhcnQsIGVuZCwgZGltLCBmYWxzZSk7XG4gICAgICAgIGlmIChsaXN0ID09PSBsaXN0Lm5leHQpIGxpc3Quc3RlaW5lciA9IHRydWU7XG4gICAgICAgIHF1ZXVlLnB1c2goZ2V0TGVmdG1vc3QobGlzdCkpO1xuICAgIH1cblxuICAgIHF1ZXVlLnNvcnQoY29tcGFyZVgpO1xuXG4gICAgLy8gcHJvY2VzcyBob2xlcyBmcm9tIGxlZnQgdG8gcmlnaHRcbiAgICBmb3IgKGkgPSAwOyBpIDwgcXVldWUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZWxpbWluYXRlSG9sZShxdWV1ZVtpXSwgb3V0ZXJOb2RlKTtcbiAgICAgICAgb3V0ZXJOb2RlID0gZmlsdGVyUG9pbnRzKG91dGVyTm9kZSwgb3V0ZXJOb2RlLm5leHQpO1xuICAgIH1cblxuICAgIHJldHVybiBvdXRlck5vZGU7XG59XG5cbmZ1bmN0aW9uIGNvbXBhcmVYKGEsIGIpIHtcbiAgICByZXR1cm4gYS54IC0gYi54O1xufVxuXG4vLyBmaW5kIGEgYnJpZGdlIGJldHdlZW4gdmVydGljZXMgdGhhdCBjb25uZWN0cyBob2xlIHdpdGggYW4gb3V0ZXIgcmluZyBhbmQgYW5kIGxpbmsgaXRcbmZ1bmN0aW9uIGVsaW1pbmF0ZUhvbGUoaG9sZSwgb3V0ZXJOb2RlKSB7XG4gICAgb3V0ZXJOb2RlID0gZmluZEhvbGVCcmlkZ2UoaG9sZSwgb3V0ZXJOb2RlKTtcbiAgICBpZiAob3V0ZXJOb2RlKSB7XG4gICAgICAgIHZhciBiID0gc3BsaXRQb2x5Z29uKG91dGVyTm9kZSwgaG9sZSk7XG5cbiAgICAgICAgLy8gZmlsdGVyIGNvbGxpbmVhciBwb2ludHMgYXJvdW5kIHRoZSBjdXRzXG4gICAgICAgIGZpbHRlclBvaW50cyhvdXRlck5vZGUsIG91dGVyTm9kZS5uZXh0KTtcbiAgICAgICAgZmlsdGVyUG9pbnRzKGIsIGIubmV4dCk7XG4gICAgfVxufVxuXG4vLyBEYXZpZCBFYmVybHkncyBhbGdvcml0aG0gZm9yIGZpbmRpbmcgYSBicmlkZ2UgYmV0d2VlbiBob2xlIGFuZCBvdXRlciBwb2x5Z29uXG5mdW5jdGlvbiBmaW5kSG9sZUJyaWRnZShob2xlLCBvdXRlck5vZGUpIHtcbiAgICB2YXIgcCA9IG91dGVyTm9kZSxcbiAgICAgICAgaHggPSBob2xlLngsXG4gICAgICAgIGh5ID0gaG9sZS55LFxuICAgICAgICBxeCA9IC1JbmZpbml0eSxcbiAgICAgICAgbTtcblxuICAgIC8vIGZpbmQgYSBzZWdtZW50IGludGVyc2VjdGVkIGJ5IGEgcmF5IGZyb20gdGhlIGhvbGUncyBsZWZ0bW9zdCBwb2ludCB0byB0aGUgbGVmdDtcbiAgICAvLyBzZWdtZW50J3MgZW5kcG9pbnQgd2l0aCBsZXNzZXIgeCB3aWxsIGJlIHBvdGVudGlhbCBjb25uZWN0aW9uIHBvaW50XG4gICAgZG8ge1xuICAgICAgICBpZiAoaHkgPD0gcC55ICYmIGh5ID49IHAubmV4dC55ICYmIHAubmV4dC55ICE9PSBwLnkpIHtcbiAgICAgICAgICAgIHZhciB4ID0gcC54ICsgKGh5IC0gcC55KSAqIChwLm5leHQueCAtIHAueCkgLyAocC5uZXh0LnkgLSBwLnkpO1xuICAgICAgICAgICAgaWYgKHggPD0gaHggJiYgeCA+IHF4KSB7XG4gICAgICAgICAgICAgICAgcXggPSB4O1xuICAgICAgICAgICAgICAgIGlmICh4ID09PSBoeCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaHkgPT09IHAueSkgcmV0dXJuIHA7XG4gICAgICAgICAgICAgICAgICAgIGlmIChoeSA9PT0gcC5uZXh0LnkpIHJldHVybiBwLm5leHQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG0gPSBwLnggPCBwLm5leHQueCA/IHAgOiBwLm5leHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcCA9IHAubmV4dDtcbiAgICB9IHdoaWxlIChwICE9PSBvdXRlck5vZGUpO1xuXG4gICAgaWYgKCFtKSByZXR1cm4gbnVsbDtcblxuICAgIGlmIChoeCA9PT0gcXgpIHJldHVybiBtOyAvLyBob2xlIHRvdWNoZXMgb3V0ZXIgc2VnbWVudDsgcGljayBsZWZ0bW9zdCBlbmRwb2ludFxuXG4gICAgLy8gbG9vayBmb3IgcG9pbnRzIGluc2lkZSB0aGUgdHJpYW5nbGUgb2YgaG9sZSBwb2ludCwgc2VnbWVudCBpbnRlcnNlY3Rpb24gYW5kIGVuZHBvaW50O1xuICAgIC8vIGlmIHRoZXJlIGFyZSBubyBwb2ludHMgZm91bmQsIHdlIGhhdmUgYSB2YWxpZCBjb25uZWN0aW9uO1xuICAgIC8vIG90aGVyd2lzZSBjaG9vc2UgdGhlIHBvaW50IG9mIHRoZSBtaW5pbXVtIGFuZ2xlIHdpdGggdGhlIHJheSBhcyBjb25uZWN0aW9uIHBvaW50XG5cbiAgICB2YXIgc3RvcCA9IG0sXG4gICAgICAgIG14ID0gbS54LFxuICAgICAgICBteSA9IG0ueSxcbiAgICAgICAgdGFuTWluID0gSW5maW5pdHksXG4gICAgICAgIHRhbjtcblxuICAgIHAgPSBtO1xuXG4gICAgZG8ge1xuICAgICAgICBpZiAoaHggPj0gcC54ICYmIHAueCA+PSBteCAmJiBoeCAhPT0gcC54ICYmXG4gICAgICAgICAgICAgICAgcG9pbnRJblRyaWFuZ2xlKGh5IDwgbXkgPyBoeCA6IHF4LCBoeSwgbXgsIG15LCBoeSA8IG15ID8gcXggOiBoeCwgaHksIHAueCwgcC55KSkge1xuXG4gICAgICAgICAgICB0YW4gPSBNYXRoLmFicyhoeSAtIHAueSkgLyAoaHggLSBwLngpOyAvLyB0YW5nZW50aWFsXG5cbiAgICAgICAgICAgIGlmIChsb2NhbGx5SW5zaWRlKHAsIGhvbGUpICYmXG4gICAgICAgICAgICAgICAgKHRhbiA8IHRhbk1pbiB8fCAodGFuID09PSB0YW5NaW4gJiYgKHAueCA+IG0ueCB8fCAocC54ID09PSBtLnggJiYgc2VjdG9yQ29udGFpbnNTZWN0b3IobSwgcCkpKSkpKSB7XG4gICAgICAgICAgICAgICAgbSA9IHA7XG4gICAgICAgICAgICAgICAgdGFuTWluID0gdGFuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcCA9IHAubmV4dDtcbiAgICB9IHdoaWxlIChwICE9PSBzdG9wKTtcblxuICAgIHJldHVybiBtO1xufVxuXG4vLyB3aGV0aGVyIHNlY3RvciBpbiB2ZXJ0ZXggbSBjb250YWlucyBzZWN0b3IgaW4gdmVydGV4IHAgaW4gdGhlIHNhbWUgY29vcmRpbmF0ZXNcbmZ1bmN0aW9uIHNlY3RvckNvbnRhaW5zU2VjdG9yKG0sIHApIHtcbiAgICByZXR1cm4gYXJlYShtLnByZXYsIG0sIHAucHJldikgPCAwICYmIGFyZWEocC5uZXh0LCBtLCBtLm5leHQpIDwgMDtcbn1cblxuLy8gaW50ZXJsaW5rIHBvbHlnb24gbm9kZXMgaW4gei1vcmRlclxuZnVuY3Rpb24gaW5kZXhDdXJ2ZShzdGFydCwgbWluWCwgbWluWSwgaW52U2l6ZSkge1xuICAgIHZhciBwID0gc3RhcnQ7XG4gICAgZG8ge1xuICAgICAgICBpZiAocC56ID09PSBudWxsKSBwLnogPSB6T3JkZXIocC54LCBwLnksIG1pblgsIG1pblksIGludlNpemUpO1xuICAgICAgICBwLnByZXZaID0gcC5wcmV2O1xuICAgICAgICBwLm5leHRaID0gcC5uZXh0O1xuICAgICAgICBwID0gcC5uZXh0O1xuICAgIH0gd2hpbGUgKHAgIT09IHN0YXJ0KTtcblxuICAgIHAucHJldloubmV4dFogPSBudWxsO1xuICAgIHAucHJldlogPSBudWxsO1xuXG4gICAgc29ydExpbmtlZChwKTtcbn1cblxuLy8gU2ltb24gVGF0aGFtJ3MgbGlua2VkIGxpc3QgbWVyZ2Ugc29ydCBhbGdvcml0aG1cbi8vIGh0dHA6Ly93d3cuY2hpYXJrLmdyZWVuZW5kLm9yZy51ay9+c2d0YXRoYW0vYWxnb3JpdGhtcy9saXN0c29ydC5odG1sXG5mdW5jdGlvbiBzb3J0TGlua2VkKGxpc3QpIHtcbiAgICB2YXIgaSwgcCwgcSwgZSwgdGFpbCwgbnVtTWVyZ2VzLCBwU2l6ZSwgcVNpemUsXG4gICAgICAgIGluU2l6ZSA9IDE7XG5cbiAgICBkbyB7XG4gICAgICAgIHAgPSBsaXN0O1xuICAgICAgICBsaXN0ID0gbnVsbDtcbiAgICAgICAgdGFpbCA9IG51bGw7XG4gICAgICAgIG51bU1lcmdlcyA9IDA7XG5cbiAgICAgICAgd2hpbGUgKHApIHtcbiAgICAgICAgICAgIG51bU1lcmdlcysrO1xuICAgICAgICAgICAgcSA9IHA7XG4gICAgICAgICAgICBwU2l6ZSA9IDA7XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgaW5TaXplOyBpKyspIHtcbiAgICAgICAgICAgICAgICBwU2l6ZSsrO1xuICAgICAgICAgICAgICAgIHEgPSBxLm5leHRaO1xuICAgICAgICAgICAgICAgIGlmICghcSkgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBxU2l6ZSA9IGluU2l6ZTtcblxuICAgICAgICAgICAgd2hpbGUgKHBTaXplID4gMCB8fCAocVNpemUgPiAwICYmIHEpKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAocFNpemUgIT09IDAgJiYgKHFTaXplID09PSAwIHx8ICFxIHx8IHAueiA8PSBxLnopKSB7XG4gICAgICAgICAgICAgICAgICAgIGUgPSBwO1xuICAgICAgICAgICAgICAgICAgICBwID0gcC5uZXh0WjtcbiAgICAgICAgICAgICAgICAgICAgcFNpemUtLTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBlID0gcTtcbiAgICAgICAgICAgICAgICAgICAgcSA9IHEubmV4dFo7XG4gICAgICAgICAgICAgICAgICAgIHFTaXplLS07XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRhaWwpIHRhaWwubmV4dFogPSBlO1xuICAgICAgICAgICAgICAgIGVsc2UgbGlzdCA9IGU7XG5cbiAgICAgICAgICAgICAgICBlLnByZXZaID0gdGFpbDtcbiAgICAgICAgICAgICAgICB0YWlsID0gZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcCA9IHE7XG4gICAgICAgIH1cblxuICAgICAgICB0YWlsLm5leHRaID0gbnVsbDtcbiAgICAgICAgaW5TaXplICo9IDI7XG5cbiAgICB9IHdoaWxlIChudW1NZXJnZXMgPiAxKTtcblxuICAgIHJldHVybiBsaXN0O1xufVxuXG4vLyB6LW9yZGVyIG9mIGEgcG9pbnQgZ2l2ZW4gY29vcmRzIGFuZCBpbnZlcnNlIG9mIHRoZSBsb25nZXIgc2lkZSBvZiBkYXRhIGJib3hcbmZ1bmN0aW9uIHpPcmRlcih4LCB5LCBtaW5YLCBtaW5ZLCBpbnZTaXplKSB7XG4gICAgLy8gY29vcmRzIGFyZSB0cmFuc2Zvcm1lZCBpbnRvIG5vbi1uZWdhdGl2ZSAxNS1iaXQgaW50ZWdlciByYW5nZVxuICAgIHggPSAzMjc2NyAqICh4IC0gbWluWCkgKiBpbnZTaXplO1xuICAgIHkgPSAzMjc2NyAqICh5IC0gbWluWSkgKiBpbnZTaXplO1xuXG4gICAgeCA9ICh4IHwgKHggPDwgOCkpICYgMHgwMEZGMDBGRjtcbiAgICB4ID0gKHggfCAoeCA8PCA0KSkgJiAweDBGMEYwRjBGO1xuICAgIHggPSAoeCB8ICh4IDw8IDIpKSAmIDB4MzMzMzMzMzM7XG4gICAgeCA9ICh4IHwgKHggPDwgMSkpICYgMHg1NTU1NTU1NTtcblxuICAgIHkgPSAoeSB8ICh5IDw8IDgpKSAmIDB4MDBGRjAwRkY7XG4gICAgeSA9ICh5IHwgKHkgPDwgNCkpICYgMHgwRjBGMEYwRjtcbiAgICB5ID0gKHkgfCAoeSA8PCAyKSkgJiAweDMzMzMzMzMzO1xuICAgIHkgPSAoeSB8ICh5IDw8IDEpKSAmIDB4NTU1NTU1NTU7XG5cbiAgICByZXR1cm4geCB8ICh5IDw8IDEpO1xufVxuXG4vLyBmaW5kIHRoZSBsZWZ0bW9zdCBub2RlIG9mIGEgcG9seWdvbiByaW5nXG5mdW5jdGlvbiBnZXRMZWZ0bW9zdChzdGFydCkge1xuICAgIHZhciBwID0gc3RhcnQsXG4gICAgICAgIGxlZnRtb3N0ID0gc3RhcnQ7XG4gICAgZG8ge1xuICAgICAgICBpZiAocC54IDwgbGVmdG1vc3QueCB8fCAocC54ID09PSBsZWZ0bW9zdC54ICYmIHAueSA8IGxlZnRtb3N0LnkpKSBsZWZ0bW9zdCA9IHA7XG4gICAgICAgIHAgPSBwLm5leHQ7XG4gICAgfSB3aGlsZSAocCAhPT0gc3RhcnQpO1xuXG4gICAgcmV0dXJuIGxlZnRtb3N0O1xufVxuXG4vLyBjaGVjayBpZiBhIHBvaW50IGxpZXMgd2l0aGluIGEgY29udmV4IHRyaWFuZ2xlXG5mdW5jdGlvbiBwb2ludEluVHJpYW5nbGUoYXgsIGF5LCBieCwgYnksIGN4LCBjeSwgcHgsIHB5KSB7XG4gICAgcmV0dXJuIChjeCAtIHB4KSAqIChheSAtIHB5KSAtIChheCAtIHB4KSAqIChjeSAtIHB5KSA+PSAwICYmXG4gICAgICAgICAgIChheCAtIHB4KSAqIChieSAtIHB5KSAtIChieCAtIHB4KSAqIChheSAtIHB5KSA+PSAwICYmXG4gICAgICAgICAgIChieCAtIHB4KSAqIChjeSAtIHB5KSAtIChjeCAtIHB4KSAqIChieSAtIHB5KSA+PSAwO1xufVxuXG4vLyBjaGVjayBpZiBhIGRpYWdvbmFsIGJldHdlZW4gdHdvIHBvbHlnb24gbm9kZXMgaXMgdmFsaWQgKGxpZXMgaW4gcG9seWdvbiBpbnRlcmlvcilcbmZ1bmN0aW9uIGlzVmFsaWREaWFnb25hbChhLCBiKSB7XG4gICAgcmV0dXJuIGEubmV4dC5pICE9PSBiLmkgJiYgYS5wcmV2LmkgIT09IGIuaSAmJiAhaW50ZXJzZWN0c1BvbHlnb24oYSwgYikgJiYgLy8gZG9uZXMndCBpbnRlcnNlY3Qgb3RoZXIgZWRnZXNcbiAgICAgICAgICAgKGxvY2FsbHlJbnNpZGUoYSwgYikgJiYgbG9jYWxseUluc2lkZShiLCBhKSAmJiBtaWRkbGVJbnNpZGUoYSwgYikgJiYgLy8gbG9jYWxseSB2aXNpYmxlXG4gICAgICAgICAgICAoYXJlYShhLnByZXYsIGEsIGIucHJldikgfHwgYXJlYShhLCBiLnByZXYsIGIpKSB8fCAvLyBkb2VzIG5vdCBjcmVhdGUgb3Bwb3NpdGUtZmFjaW5nIHNlY3RvcnNcbiAgICAgICAgICAgIGVxdWFscyhhLCBiKSAmJiBhcmVhKGEucHJldiwgYSwgYS5uZXh0KSA+IDAgJiYgYXJlYShiLnByZXYsIGIsIGIubmV4dCkgPiAwKTsgLy8gc3BlY2lhbCB6ZXJvLWxlbmd0aCBjYXNlXG59XG5cbi8vIHNpZ25lZCBhcmVhIG9mIGEgdHJpYW5nbGVcbmZ1bmN0aW9uIGFyZWEocCwgcSwgcikge1xuICAgIHJldHVybiAocS55IC0gcC55KSAqIChyLnggLSBxLngpIC0gKHEueCAtIHAueCkgKiAoci55IC0gcS55KTtcbn1cblxuLy8gY2hlY2sgaWYgdHdvIHBvaW50cyBhcmUgZXF1YWxcbmZ1bmN0aW9uIGVxdWFscyhwMSwgcDIpIHtcbiAgICByZXR1cm4gcDEueCA9PT0gcDIueCAmJiBwMS55ID09PSBwMi55O1xufVxuXG4vLyBjaGVjayBpZiB0d28gc2VnbWVudHMgaW50ZXJzZWN0XG5mdW5jdGlvbiBpbnRlcnNlY3RzKHAxLCBxMSwgcDIsIHEyKSB7XG4gICAgdmFyIG8xID0gc2lnbihhcmVhKHAxLCBxMSwgcDIpKTtcbiAgICB2YXIgbzIgPSBzaWduKGFyZWEocDEsIHExLCBxMikpO1xuICAgIHZhciBvMyA9IHNpZ24oYXJlYShwMiwgcTIsIHAxKSk7XG4gICAgdmFyIG80ID0gc2lnbihhcmVhKHAyLCBxMiwgcTEpKTtcblxuICAgIGlmIChvMSAhPT0gbzIgJiYgbzMgIT09IG80KSByZXR1cm4gdHJ1ZTsgLy8gZ2VuZXJhbCBjYXNlXG5cbiAgICBpZiAobzEgPT09IDAgJiYgb25TZWdtZW50KHAxLCBwMiwgcTEpKSByZXR1cm4gdHJ1ZTsgLy8gcDEsIHExIGFuZCBwMiBhcmUgY29sbGluZWFyIGFuZCBwMiBsaWVzIG9uIHAxcTFcbiAgICBpZiAobzIgPT09IDAgJiYgb25TZWdtZW50KHAxLCBxMiwgcTEpKSByZXR1cm4gdHJ1ZTsgLy8gcDEsIHExIGFuZCBxMiBhcmUgY29sbGluZWFyIGFuZCBxMiBsaWVzIG9uIHAxcTFcbiAgICBpZiAobzMgPT09IDAgJiYgb25TZWdtZW50KHAyLCBwMSwgcTIpKSByZXR1cm4gdHJ1ZTsgLy8gcDIsIHEyIGFuZCBwMSBhcmUgY29sbGluZWFyIGFuZCBwMSBsaWVzIG9uIHAycTJcbiAgICBpZiAobzQgPT09IDAgJiYgb25TZWdtZW50KHAyLCBxMSwgcTIpKSByZXR1cm4gdHJ1ZTsgLy8gcDIsIHEyIGFuZCBxMSBhcmUgY29sbGluZWFyIGFuZCBxMSBsaWVzIG9uIHAycTJcblxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuLy8gZm9yIGNvbGxpbmVhciBwb2ludHMgcCwgcSwgciwgY2hlY2sgaWYgcG9pbnQgcSBsaWVzIG9uIHNlZ21lbnQgcHJcbmZ1bmN0aW9uIG9uU2VnbWVudChwLCBxLCByKSB7XG4gICAgcmV0dXJuIHEueCA8PSBNYXRoLm1heChwLngsIHIueCkgJiYgcS54ID49IE1hdGgubWluKHAueCwgci54KSAmJiBxLnkgPD0gTWF0aC5tYXgocC55LCByLnkpICYmIHEueSA+PSBNYXRoLm1pbihwLnksIHIueSk7XG59XG5cbmZ1bmN0aW9uIHNpZ24obnVtKSB7XG4gICAgcmV0dXJuIG51bSA+IDAgPyAxIDogbnVtIDwgMCA/IC0xIDogMDtcbn1cblxuLy8gY2hlY2sgaWYgYSBwb2x5Z29uIGRpYWdvbmFsIGludGVyc2VjdHMgYW55IHBvbHlnb24gc2VnbWVudHNcbmZ1bmN0aW9uIGludGVyc2VjdHNQb2x5Z29uKGEsIGIpIHtcbiAgICB2YXIgcCA9IGE7XG4gICAgZG8ge1xuICAgICAgICBpZiAocC5pICE9PSBhLmkgJiYgcC5uZXh0LmkgIT09IGEuaSAmJiBwLmkgIT09IGIuaSAmJiBwLm5leHQuaSAhPT0gYi5pICYmXG4gICAgICAgICAgICAgICAgaW50ZXJzZWN0cyhwLCBwLm5leHQsIGEsIGIpKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgcCA9IHAubmV4dDtcbiAgICB9IHdoaWxlIChwICE9PSBhKTtcblxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuLy8gY2hlY2sgaWYgYSBwb2x5Z29uIGRpYWdvbmFsIGlzIGxvY2FsbHkgaW5zaWRlIHRoZSBwb2x5Z29uXG5mdW5jdGlvbiBsb2NhbGx5SW5zaWRlKGEsIGIpIHtcbiAgICByZXR1cm4gYXJlYShhLnByZXYsIGEsIGEubmV4dCkgPCAwID9cbiAgICAgICAgYXJlYShhLCBiLCBhLm5leHQpID49IDAgJiYgYXJlYShhLCBhLnByZXYsIGIpID49IDAgOlxuICAgICAgICBhcmVhKGEsIGIsIGEucHJldikgPCAwIHx8IGFyZWEoYSwgYS5uZXh0LCBiKSA8IDA7XG59XG5cbi8vIGNoZWNrIGlmIHRoZSBtaWRkbGUgcG9pbnQgb2YgYSBwb2x5Z29uIGRpYWdvbmFsIGlzIGluc2lkZSB0aGUgcG9seWdvblxuZnVuY3Rpb24gbWlkZGxlSW5zaWRlKGEsIGIpIHtcbiAgICB2YXIgcCA9IGEsXG4gICAgICAgIGluc2lkZSA9IGZhbHNlLFxuICAgICAgICBweCA9IChhLnggKyBiLngpIC8gMixcbiAgICAgICAgcHkgPSAoYS55ICsgYi55KSAvIDI7XG4gICAgZG8ge1xuICAgICAgICBpZiAoKChwLnkgPiBweSkgIT09IChwLm5leHQueSA+IHB5KSkgJiYgcC5uZXh0LnkgIT09IHAueSAmJlxuICAgICAgICAgICAgICAgIChweCA8IChwLm5leHQueCAtIHAueCkgKiAocHkgLSBwLnkpIC8gKHAubmV4dC55IC0gcC55KSArIHAueCkpXG4gICAgICAgICAgICBpbnNpZGUgPSAhaW5zaWRlO1xuICAgICAgICBwID0gcC5uZXh0O1xuICAgIH0gd2hpbGUgKHAgIT09IGEpO1xuXG4gICAgcmV0dXJuIGluc2lkZTtcbn1cblxuLy8gbGluayB0d28gcG9seWdvbiB2ZXJ0aWNlcyB3aXRoIGEgYnJpZGdlOyBpZiB0aGUgdmVydGljZXMgYmVsb25nIHRvIHRoZSBzYW1lIHJpbmcsIGl0IHNwbGl0cyBwb2x5Z29uIGludG8gdHdvO1xuLy8gaWYgb25lIGJlbG9uZ3MgdG8gdGhlIG91dGVyIHJpbmcgYW5kIGFub3RoZXIgdG8gYSBob2xlLCBpdCBtZXJnZXMgaXQgaW50byBhIHNpbmdsZSByaW5nXG5mdW5jdGlvbiBzcGxpdFBvbHlnb24oYSwgYikge1xuICAgIHZhciBhMiA9IG5ldyBOb2RlKGEuaSwgYS54LCBhLnkpLFxuICAgICAgICBiMiA9IG5ldyBOb2RlKGIuaSwgYi54LCBiLnkpLFxuICAgICAgICBhbiA9IGEubmV4dCxcbiAgICAgICAgYnAgPSBiLnByZXY7XG5cbiAgICBhLm5leHQgPSBiO1xuICAgIGIucHJldiA9IGE7XG5cbiAgICBhMi5uZXh0ID0gYW47XG4gICAgYW4ucHJldiA9IGEyO1xuXG4gICAgYjIubmV4dCA9IGEyO1xuICAgIGEyLnByZXYgPSBiMjtcblxuICAgIGJwLm5leHQgPSBiMjtcbiAgICBiMi5wcmV2ID0gYnA7XG5cbiAgICByZXR1cm4gYjI7XG59XG5cbi8vIGNyZWF0ZSBhIG5vZGUgYW5kIG9wdGlvbmFsbHkgbGluayBpdCB3aXRoIHByZXZpb3VzIG9uZSAoaW4gYSBjaXJjdWxhciBkb3VibHkgbGlua2VkIGxpc3QpXG5mdW5jdGlvbiBpbnNlcnROb2RlKGksIHgsIHksIGxhc3QpIHtcbiAgICB2YXIgcCA9IG5ldyBOb2RlKGksIHgsIHkpO1xuXG4gICAgaWYgKCFsYXN0KSB7XG4gICAgICAgIHAucHJldiA9IHA7XG4gICAgICAgIHAubmV4dCA9IHA7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgICBwLm5leHQgPSBsYXN0Lm5leHQ7XG4gICAgICAgIHAucHJldiA9IGxhc3Q7XG4gICAgICAgIGxhc3QubmV4dC5wcmV2ID0gcDtcbiAgICAgICAgbGFzdC5uZXh0ID0gcDtcbiAgICB9XG4gICAgcmV0dXJuIHA7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZU5vZGUocCkge1xuICAgIHAubmV4dC5wcmV2ID0gcC5wcmV2O1xuICAgIHAucHJldi5uZXh0ID0gcC5uZXh0O1xuXG4gICAgaWYgKHAucHJldlopIHAucHJldloubmV4dFogPSBwLm5leHRaO1xuICAgIGlmIChwLm5leHRaKSBwLm5leHRaLnByZXZaID0gcC5wcmV2Wjtcbn1cblxuZnVuY3Rpb24gTm9kZShpLCB4LCB5KSB7XG4gICAgLy8gdmVydGV4IGluZGV4IGluIGNvb3JkaW5hdGVzIGFycmF5XG4gICAgdGhpcy5pID0gaTtcblxuICAgIC8vIHZlcnRleCBjb29yZGluYXRlc1xuICAgIHRoaXMueCA9IHg7XG4gICAgdGhpcy55ID0geTtcblxuICAgIC8vIHByZXZpb3VzIGFuZCBuZXh0IHZlcnRleCBub2RlcyBpbiBhIHBvbHlnb24gcmluZ1xuICAgIHRoaXMucHJldiA9IG51bGw7XG4gICAgdGhpcy5uZXh0ID0gbnVsbDtcblxuICAgIC8vIHotb3JkZXIgY3VydmUgdmFsdWVcbiAgICB0aGlzLnogPSBudWxsO1xuXG4gICAgLy8gcHJldmlvdXMgYW5kIG5leHQgbm9kZXMgaW4gei1vcmRlclxuICAgIHRoaXMucHJldlogPSBudWxsO1xuICAgIHRoaXMubmV4dFogPSBudWxsO1xuXG4gICAgLy8gaW5kaWNhdGVzIHdoZXRoZXIgdGhpcyBpcyBhIHN0ZWluZXIgcG9pbnRcbiAgICB0aGlzLnN0ZWluZXIgPSBmYWxzZTtcbn1cblxuLy8gcmV0dXJuIGEgcGVyY2VudGFnZSBkaWZmZXJlbmNlIGJldHdlZW4gdGhlIHBvbHlnb24gYXJlYSBhbmQgaXRzIHRyaWFuZ3VsYXRpb24gYXJlYTtcbi8vIHVzZWQgdG8gdmVyaWZ5IGNvcnJlY3RuZXNzIG9mIHRyaWFuZ3VsYXRpb25cbmVhcmN1dC5kZXZpYXRpb24gPSBmdW5jdGlvbiAoZGF0YSwgaG9sZUluZGljZXMsIGRpbSwgdHJpYW5nbGVzKSB7XG4gICAgdmFyIGhhc0hvbGVzID0gaG9sZUluZGljZXMgJiYgaG9sZUluZGljZXMubGVuZ3RoO1xuICAgIHZhciBvdXRlckxlbiA9IGhhc0hvbGVzID8gaG9sZUluZGljZXNbMF0gKiBkaW0gOiBkYXRhLmxlbmd0aDtcblxuICAgIHZhciBwb2x5Z29uQXJlYSA9IE1hdGguYWJzKHNpZ25lZEFyZWEoZGF0YSwgMCwgb3V0ZXJMZW4sIGRpbSkpO1xuICAgIGlmIChoYXNIb2xlcykge1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gaG9sZUluZGljZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBzdGFydCA9IGhvbGVJbmRpY2VzW2ldICogZGltO1xuICAgICAgICAgICAgdmFyIGVuZCA9IGkgPCBsZW4gLSAxID8gaG9sZUluZGljZXNbaSArIDFdICogZGltIDogZGF0YS5sZW5ndGg7XG4gICAgICAgICAgICBwb2x5Z29uQXJlYSAtPSBNYXRoLmFicyhzaWduZWRBcmVhKGRhdGEsIHN0YXJ0LCBlbmQsIGRpbSkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmFyIHRyaWFuZ2xlc0FyZWEgPSAwO1xuICAgIGZvciAoaSA9IDA7IGkgPCB0cmlhbmdsZXMubGVuZ3RoOyBpICs9IDMpIHtcbiAgICAgICAgdmFyIGEgPSB0cmlhbmdsZXNbaV0gKiBkaW07XG4gICAgICAgIHZhciBiID0gdHJpYW5nbGVzW2kgKyAxXSAqIGRpbTtcbiAgICAgICAgdmFyIGMgPSB0cmlhbmdsZXNbaSArIDJdICogZGltO1xuICAgICAgICB0cmlhbmdsZXNBcmVhICs9IE1hdGguYWJzKFxuICAgICAgICAgICAgKGRhdGFbYV0gLSBkYXRhW2NdKSAqIChkYXRhW2IgKyAxXSAtIGRhdGFbYSArIDFdKSAtXG4gICAgICAgICAgICAoZGF0YVthXSAtIGRhdGFbYl0pICogKGRhdGFbYyArIDFdIC0gZGF0YVthICsgMV0pKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcG9seWdvbkFyZWEgPT09IDAgJiYgdHJpYW5nbGVzQXJlYSA9PT0gMCA/IDAgOlxuICAgICAgICBNYXRoLmFicygodHJpYW5nbGVzQXJlYSAtIHBvbHlnb25BcmVhKSAvIHBvbHlnb25BcmVhKTtcbn07XG5cbmZ1bmN0aW9uIHNpZ25lZEFyZWEoZGF0YSwgc3RhcnQsIGVuZCwgZGltKSB7XG4gICAgdmFyIHN1bSA9IDA7XG4gICAgZm9yICh2YXIgaSA9IHN0YXJ0LCBqID0gZW5kIC0gZGltOyBpIDwgZW5kOyBpICs9IGRpbSkge1xuICAgICAgICBzdW0gKz0gKGRhdGFbal0gLSBkYXRhW2ldKSAqIChkYXRhW2kgKyAxXSArIGRhdGFbaiArIDFdKTtcbiAgICAgICAgaiA9IGk7XG4gICAgfVxuICAgIHJldHVybiBzdW07XG59XG5cbi8vIHR1cm4gYSBwb2x5Z29uIGluIGEgbXVsdGktZGltZW5zaW9uYWwgYXJyYXkgZm9ybSAoZS5nLiBhcyBpbiBHZW9KU09OKSBpbnRvIGEgZm9ybSBFYXJjdXQgYWNjZXB0c1xuZWFyY3V0LmZsYXR0ZW4gPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHZhciBkaW0gPSBkYXRhWzBdWzBdLmxlbmd0aCxcbiAgICAgICAgcmVzdWx0ID0ge3ZlcnRpY2VzOiBbXSwgaG9sZXM6IFtdLCBkaW1lbnNpb25zOiBkaW19LFxuICAgICAgICBob2xlSW5kZXggPSAwO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgZGF0YVtpXS5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgZm9yICh2YXIgZCA9IDA7IGQgPCBkaW07IGQrKykgcmVzdWx0LnZlcnRpY2VzLnB1c2goZGF0YVtpXVtqXVtkXSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGkgPiAwKSB7XG4gICAgICAgICAgICBob2xlSW5kZXggKz0gZGF0YVtpIC0gMV0ubGVuZ3RoO1xuICAgICAgICAgICAgcmVzdWx0LmhvbGVzLnB1c2goaG9sZUluZGV4KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufTtcbiJdfQ==
