const haversine = require('../')
const fixtures = require('./fixtures')
const tape = require('tape')

fixtures.forEach(function (f) {
  tape('returns ' + f.expected + ' for ' + JSON.stringify(f.arguments), function (t) {
    const actual = haversine.apply(null, f.arguments)

    t.plan(1)
    t.ok(Math.abs(actual - f.expected) < 0.0001, `${actual} ~= ${f.expected}`)
  })
})
