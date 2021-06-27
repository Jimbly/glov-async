GLOV.js async utility library
=============================

Behavioral differences from other similar libraries:
* Never forces setTimeout/nextTick, so empty lists or synchronous tasks are optimally efficient, creating no inter-generational garbage.
* All parallel async functions (each, eachLimit, parallel, parallelLimit) process every entry and do not return to the final function until all processing is complete, even if some entry errors before then.  This avoids terrible edge-case bugs where the calling code things an asynchronous batch has finished executing (because one part of the batch terminated with error), yet some children are still running.

Example API usage (admittedly will all actually run synchronously):
```javascript
const { asyncEach, asyncEachLimit, asyncParallel, asyncParallelLimit, asyncLimiter } = require('glov-async');
// Also valid:
//  const async = require('glov-async');
//  async.each(...), etc

let collection = ['foo', 'bar'];

asyncEach(collection, function (thing, next) {
  console.log(thing);
  next();
}, function (err) {
  console.log('Done');
});

asyncEachLimit(collection, 1, function (thing, next) {
  console.log(thing);
  next();
}, function (err) {
  console.log('Done');
});

let tasks = [
  function (next) {
    console.log('thing 1');
    next();
  },
  function (next) {
    console.log('thing 2');
    next();
  },
];

asyncParallel(tasks, function (err) {
  console.log('Done');
});

asyncParallelLimit(tasks, 1, function (err) {
  console.log('Done');
});

let limiter = asyncLimiter(1);
limiter(tasks[0]);
limiter(tasks[1], function (err) {
  console.log('Task 1 finished');
});
console.log('Done');
```
