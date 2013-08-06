'use strict'; /*jslint es5: true, node: true, indent: 2 */ /* globals setImmediate */
var util = require('util');

var Mapper = require('./mapper');

var Queue = module.exports = function(concurrency, worker) {
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
  // this._worker must be async. Enforce with setImmediate
  setImmediate(function() {
    self._worker(chunk, function(err, result) {
      self._in_progress--;
      // order is not guaranteed
      self.push(result);
      self._tick(err);
    });
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
