var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var stream_1 = require('stream');
/** Like Mapper, but more bare-bones. The predicate function has to call a
given callback, which means the processing code can be async.

`this` is bound to the stream object inside the transform function, so you
can use `this.push(...)` to output multiple chunks per single input chunk.

Example:

    new streaming.Transformer(function(chunk, encoding, callback) {
      var self = this;
      setTimeout(function() {
        self.push('...');
        self.push(chunk);
        callback();
      }, 1000);
    }, {objectMode: true});

*/
var Transformer = (function (_super) {
    __extends(Transformer, _super);
    function Transformer(transformFn, options) {
        _super.call(this, options);
        this._transform = transformFn.bind(this);
    }
    return Transformer;
})(stream_1.Transform);
exports.Transformer = Transformer;
