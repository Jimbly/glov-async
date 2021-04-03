const { asyncEach, asyncEachLimit, asyncParallel, asyncParallelLimit, asyncLimiter } = require('..');
// Also valid:
//  const async = require('glovjs-async');
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
