/*jslint node: true */
var events = require('events');
var glob = require('glob');
var stream = require('stream');
var util = require('util');

var Glob = module.exports = function(pattern, options) {
  /** Glob is an event emitter but it's not a proper stream. This class is
  just a wrapper to make it pipe-able.
  */
  stream.Readable.call(this, {objectMode: true});

  this._glob = new glob.Glob(pattern, options);

  var self = this;
  this._glob.on('error', function(err) {
    self.emit('error', err);
  });
  this._glob.on('end', function() {
    self.push(null);
  });
};
util.inherits(Glob, stream.Readable);
Glob.prototype._read = function(size) {
  if (events.EventEmitter.listenerCount(this._glob, 'match') === 0) {
    var self = this;
    var onmatch = function(match) {
      if (self.push(match) === false) {
        // console.error('Removing listener on glob.Glob "match" events');
        self._glob.removeListener('match', onmatch);
      }
    };
    this._glob.addListener('match', onmatch);
  }
};
