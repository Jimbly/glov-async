/* eslint handle-callback-err:off */

import {
  AsyncFunction,
  Continuation,
  ContinuationWithResult,
  asyncEach,
  asyncEachLimit,
  asyncParallel,
  asyncParallelLimit,
  asyncLimiter,
  asyncSeries,
  LimitedRun,
} from '..';

let collection = ['foo', 'bar'];

asyncEach<string, number>(collection, function (thing: string, next: ContinuationWithResult<number>) {
  console.log(thing);
  next(null, 2);
}, function (err, results) {
  console.log('Done', results[0] + results[1]); // 4
});

asyncEachLimit<string>(collection, 1, function (thing: string, next: Continuation) {
  console.log(thing);
  next();
}, function (err) {
  console.log('Done');
});

let tasks : AsyncFunction[] = [
  function (next) {
    console.log('thing 1');
    next('err');
  },
  function (next) {
    console.log('thing 2');
    next();
  },
];

asyncSeries(tasks, function (err) {
  console.log('Done');
});

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

function returnsNumber(next: (err: null, result: number) => void) {
  next(null, 7);
}
function returnsString(next: (err: null, result: string) => void) {
  next(null, 'seven');
}
let limiter2 = asyncLimiter(1);
limiter2(returnsNumber);
limiter2(returnsNumber, function (err, result: number) : void {
  console.log('Task 1 finished', result);
});
limiter2(returnsString, function (err, result: string) : void {
  console.log('Task 2 finished', result);
});

// These are wrong, should throw TypeScript error
limiter2(returnsNumber, function (err, result: string) : void {
  console.log('Task 1 finished', result);
});
limiter2(returnsString, function (err, result: number) : void {
  console.log('Task 2 finished', result);
});

console.log('Done');
