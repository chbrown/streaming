'use strict'; /*jslint es5: true, node: true, indent: 2 */
var fs = require('fs');
var path = require('path');
var stream = require('stream');
var util = require('util');


var Node = function(path, stats) {
  this.path = path;
  this.stats = stats;
};
Node.prototype.toString = function() {
  return this.path;
};


var Walk = module.exports = function(root) {
  /** Walk: File System walk stream.

  The returned Readable stream is in objectMode; meaning read() returns strings, one at a time.

  Recurses depth-first. TODO: make breadth-first an option.
  */
  stream.Readable.call(this, {objectMode: true});
  this._paths = [root];
};
util.inherits(Walk, stream.Readable);

Walk.prototype._halt = function(err) {
  /**
  we want to break for the error, but not signal the end of the stream;
  self._readableState.reading is the value that state variable that represents whether we
  are expecting a value to be .push()'ed from _read() anytime soon. on an error, we are not.

  This is a function of my own devising, not part of the stream.Readable prototype or anything
  */
  this._readableState.reading = false;
  return this.emit('error', err);
};

Walk.prototype._read = function(/*size*/) {
  /**
  From http://nodejs.org/api/stream.html#stream_readable_read_size_1:
  > When data is available, put it into the read queue by calling readable.push(chunk).
  > If push returns false, then you should stop reading.
  > When _read is called again, you should start pushing more data.

  There's no protection against a circular file system hierarchy with symlinks,
  but if you're gonna do that you probably want an infinite stream, so, it suits you right.
  */
  var self = this;
  var ready = true;
  (function next() {
    // self.push might have set ready to false later on in this closure
    if (!ready) return;

    // if _paths is empty, we're done!
    var _path = self._paths.pop();
    if (_path === undefined) return self.push(null);

    // else stat the next path and queue up its children
    fs.stat(_path, function(err, stats) {
      if (err) return self._halt(err);

      var node = new Node(_path, stats);

      if (stats.isDirectory()) {
        fs.readdir(_path, function(err, children) {
          if (err) return self._halt(err);

          var paths = children.map(function(child) { return path.join(_path, child); });
          // everything is push/pop, so it's LIFO (last in-first out)
          Array.prototype.push.apply(self._paths, paths);

          // self.push has to go in here; otherwise next() is called
          // immediately before readdir calls back, leaving us with nothing
          // in the queue, and we quite.
          ready = self.push(node);
          // apparently _read() is called again immediately after we call self.push()
          // so we don't need to loop
          // next();
        });
      }
      else {
        ready = self.push(node);
        // next();
      }
    });
  })();
};

Walk.Node = Node;
