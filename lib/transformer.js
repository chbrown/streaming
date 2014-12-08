/*jslint node: true */
var stream = require('stream');
var util = require('util');

var Transformer = module.exports = function(transform, options) {
  /** Like Mapper, but more bare-bones. The predicate function has to call a
  given callback, which means the processing code can be async.

      transform: (chunk: any,
                  encoding: string,
                  callback: (error: Error, outputChunk: any) => void)
      options: any

  `this` is bound to the stream object inside the transform function, so you
  can use `this.push(...)` to output multiple data per input datum.

  Example:

      new streaming.Transformer(function(chunk, encoding, callback) {
        var self = this;
        setTimeout(function() {
          self.emit('...');
          self.emit(chunk);
          callback();
        }, 1000);
      }, {objectMode: true});

  */
  stream.Transform.call(this, options);
  this._transform = transform.bind(this);
};
util.inherits(Transformer, stream.Transform);
