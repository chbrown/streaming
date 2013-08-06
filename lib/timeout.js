'use strict'; /*jslint node: true, es5: true, indent: 2 */
var util = require('util');
var stream = require('stream');

var Timeout = module.exports = function(seconds, opts) {
  if (seconds === undefined) {
    throw new Error('new Timeout(seconds): seconds is a required parameter.');
  }
  stream.Transform.call(this, opts);
  this._timeout_ms = seconds * 1000;
  var self = this;
  setInterval(function() {
    self._check();
  }, this._timeout_ms);
};
util.inherits(Timeout, stream.Transform);
Timeout.prototype._transform = function(chunk, encoding, callback) {
  this._last = (new Date()).getTime();
  this.push(chunk);
  callback();
};
Timeout.prototype._flush = function(callback) {
  // don't clear the interval
  callback();
};
Timeout.prototype._check = function() {
  var ms_since_last = Date.now() - this._last;
  // ms_since_last: milliseconds since we last saw some incoming data
  if (ms_since_last > this._timeout_ms) {
    this.emit('error', new Error('Timed out: ' + ms_since_last + 'ms'));
  }
};
