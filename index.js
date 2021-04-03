const assert = require('assert');

// Various async functions

// Do *not* nextTick upon empty request, this causes different behavior when empty!
// let nextTick = typeof process !== 'undefined' ?
//   process.nextTick :
//   window.setImmediate ? window.setImmediate : (fn) => setTimeout(fn, 1);

// Derived from https://github.com/hughsk/async-series - MIT Licensed
// Series executions stops upon the first error, no further entries in `arr[]` will run
function series(arr, done) {
  let length = arr.length;

  if (!length) {
    return void done(); // void nextTick(done);
  }

  function handleItem(idx) {
    arr[idx](function (err) {
      if (err) {
        return done(err);
      }
      if (idx < length - 1) {
        return handleItem(idx + 1);
      }
      return done();
    });
  }

  handleItem(0);
}
exports.series = series;

// Originally derived from https://github.com/feross/run-parallel-limit - MIT licensed
// All members of `arr[]` are passed to proc() and processing is finished
//   before done() is ever called.  Does *not* early-out to done() upon the first
//   error because that leaves running instances of `proc` in-flight while the calling
//   code already things things have finished!
// Can grab from https://github.com/Jimbly/glovjs/blob/6f75327d542c52c999d023e5dc08c18c592157c2/src/common/async.js if
//   the old, early-out behavior is required
function eachLimit(arr, limit, proc, done) {
  assert.equal(typeof limit, 'number');
  assert(Array.isArray(arr));
  assert.equal(typeof proc, 'function');
  assert.equal(typeof done, 'function');
  let len = arr.length;
  let pending = len;

  let next;
  let results = [];
  let any_err = null;
  function doNext(idx, err, result) {
    assert.equal(results[idx], undefined); // ensure not called twice
    results[idx] = result;
    if (err) {
      any_err = any_err || err;
    }
    if (--pending === 0) {
      done(any_err, results);
    } else if (next < len) {
      let key = next++;
      proc(arr[key], doNext.bind(null, key), idx);
    }
  }

  if (!pending) {
    // empty
    return void done(null, results); // void nextTick(done.bind(null, null, results));
  }
  next = limit;
  for (let ii = 0; ii < arr.length && ii < limit; ++ii) {
    proc(arr[ii], doNext.bind(null, ii), ii);
  }
}
exports.eachLimit = eachLimit;

function each(arr, proc, done) {
  eachLimit(arr, Infinity, proc, done);
}
exports.each = each;

function eachSeries(arr, proc, done) {
  eachLimit(arr, 1, proc, done);
}
exports.eachSeries = eachSeries;

function parallelLimit(tasks, limit, done) {
  eachLimit(tasks, limit, function (task, next) {
    task(next);
  }, done);
}
exports.parallelLimit = parallelLimit;

function parallel(tasks, done) {
  parallelLimit(tasks, Infinity, done);
}
exports.parallel = parallel;

function limiter(max_parallel) {
  let avail = max_parallel;
  let head = null;
  let tail = null;
  function onFinish() {
    if (!head) {
      ++avail;
      return;
    }
    let next = head;
    head = head.next;
    if (!head) {
      tail = null;
    }
    runit(next); // eslint-disable-line no-use-before-define
  }
  function runit(unit) {
    if (unit.cb) {
      unit.exec(function (...args) {
        unit.cb(...args);
        onFinish();
      });
    } else {
      unit.exec(onFinish);
    }
  }
  return function limiterRun(exec, cb) {
    let unit = {
      exec,
      cb,
    };
    if (!avail) {
      if (!head) {
        head = tail = unit;
      } else {
        tail.next = unit;
        tail = unit;
      }
      return;
    }
    --avail;
    runit(unit);
  };
}
exports.limiter = limiter;

Object.keys(exports).forEach((key) => {
  exports[`async${key[0].toUpperCase()}${key.slice(1)}`] = exports[key];
});
