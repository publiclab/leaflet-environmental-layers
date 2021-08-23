# tiny-binary-search

[![npm][npm-image]][npm-url]
[![travis][travis-image]][travis-url]
[![standard][standard-image]][standard-url]

[npm-image]: https://img.shields.io/npm/v/tiny-binary-search.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/tiny-binary-search
[travis-image]: https://img.shields.io/travis/patrickarlt/tiny-binary-search.svg?style=flat-square
[travis-url]: https://travis-ci.org/patrickarlt/tiny-binary-search
[standard-image]: https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg?style=flat-square
[standard-url]: http://npm.im/semistandard

A very small binary search index.

## Install

```
npm install tiny-binary-search
```

## Usage

```js
var index = new BinarySearchIndex([
  { value: 0, id: "A" },
  { value: 1, id: "B" },
  { value: 2, id: "C" },
  { value: 3, id: "D" },
  { value: 4, id: "E" },
  { value: 5, id: "F" },
  { value: 6, id: "G" },
  { value: 7, id: "H" },
  { value: 8, id: "I" },
  { value: 9, id: "J" }
]);

index.query(5); // get the item with a value of 5

index.between(1, 3); // get all items with values between 1 and 3 (inclusive)

index.getIndex(0.5); // get the index of an item with a particular value in the array

index.insert({value: 0.5, id: "AA"}); // insert a single item into the index

index.bulkAdd([
  { value: 1.5, id: "BB" },
  { value: 2.5, id: "CC" },
]); // add an array of items to the index
```

This module is distributed as a [UMD]() module and can also be used in AMD based systems or as a global under the `BinarySearchIndex` namespace.

## Issues

Find a bug or want to request a new feature?  Please let us know by submitting an issue.