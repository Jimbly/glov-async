const assert = require('assert');
const { asyncEach, asyncEachLimit, asyncEachSeries } = require('..');

let things = new Array(10000).join().split(',');

asyncEachSeries([
  ['asyncEach', asyncEach],
  ['asyncEachLimit(1)', (arr, proc, done) => asyncEachLimit(arr, 1, proc, done)],
  ['asyncEachLimit(7)', (arr, proc, done) => asyncEachLimit(arr, 7, proc, done)],
], (pair, next) => {
  let [name, func] = pair;
  console.log(`Testing "${name}"...`);
  let check = {};
  func(things, (thing, next, idx) => {
    assert(!check[idx]);
    check[idx] = true;
    next();
  }, (err) => {
    console.log(`Testing "${name}": Done`);
    next(err);
  });
}, (err) => {
  if (err) {
    throw err;
  }
  console.log('done');
});
