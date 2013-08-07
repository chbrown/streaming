'use strict'; /*jslint es5: true, node: true, indent: 2 */
var util = require('util');

var Mapper = require('./mapper');

var Queue = module.exports = function(concurrency, worker) {
  /** `new Queue(concurrency, worker)`

  Queue applies the `worker` function to each piece of data in a
  stream.Readable({objectMode: true}). Only `concurrency` tasks will be
  processed at a time.

  * `concurrency` Number Maximum number of data to process at one time.
  * `worker` Function _Asynchronous_ task processor with signature:
    - `function(task_data, callback) { ... }`

    where `callback` has the signature:
    - `function(err, result)`

    If the provided `worker` is not _always_
    [async](http://nodejs.org/api/process.html#process_process_nexttick_callback),
    your queue might cut short and stop reading before it has reached the end
    of the source stream.

  For example:

      new Queue(10, function(task_obj, callback) {
        setTimeout(function() {
          var task_json = JSON.stringify(task_obj);
          callback(null, 'Task json is ' + json.length + 'characters.\n');
        }, Math.random() * 500);
      });

  Queue inherits `streaming.Mapper`, which entails a fully
  `{objectMode: true}` stream experience:

  * `_writableState.objectMode`: true
  * `_readableState.objectMode`: true

  */
  Mapper.call(this);
  // concurrency is an integer
  this._concurrency = concurrency;
  // worker signature: function(task, callback)
  // callback signature: function(err, ...)
  this._worker = worker;
  // queue implementation
  this._in_progress = 0;
  this._pendingCallback = null;
  this._flushCallback = null;
};
util.inherits(Queue, Mapper);
Queue.prototype.setConcurrency = function(concurrency) {
  this._concurrency = concurrency;
};
Queue.prototype._transform = function(chunk, encoding, callback) {
  var self = this;
  this._in_progress++;
  // this._worker MUST be async. We could enforce this with setImmediate but
  // look, if you don't follow the rules, you might get some weird behavior.
  this._worker(chunk, function(err, result) {
    self._in_progress--;
    // order is not guaranteed
    self.push(result);
    self._tick(err);
  });

  if (this._in_progress < this._concurrency) {
    callback();
  }
  else {
    // this is the last task we can fit in given current concurrency
    this._pendingCallback = callback;
  }
};
Queue.prototype._tick = function(err) {
  if (this._pendingCallback && this._in_progress < this._concurrency) {
    var callback = this._pendingCallback;
    // the callback provided by _transform calls _write immediately,
    // so make space for the next callback first.
    this._pendingCallback = null;
    callback(err);
  }
  else if (this._flushCallback && this._in_progress === 0) {
    this._flushCallback(err);
  }
  else if (err) {
    this.emit('error', err);
  }
};
Queue.prototype._flush = function(callback) {
  this._flushCallback = callback;
};
