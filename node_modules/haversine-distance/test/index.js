/* global describe, it */

var assert = require('assert')
var haversine = require('../')
var fixtures = require('./fixtures')

describe('haversine', function () {
  fixtures.forEach(function (f) {
    it('returns ' + f.expected + ' for ' + JSON.stringify(f.arguments), function () {
      var actual = haversine.apply(null, f.arguments)

      assert(Math.abs(actual - f.expected) < 0.0001)
    })
  })
})
