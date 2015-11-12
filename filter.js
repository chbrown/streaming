var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var stream_1 = require('stream');
var Filter = (function (_super) {
    __extends(Filter, _super);
    function Filter(testFn) {
        _super.call(this, { objectMode: true });
        this.testFn = testFn;
    }
    Filter.prototype._transform = function (chunk, encoding, callback) {
        var success = this.testFn(chunk);
        if (success) {
            this.push(chunk, encoding);
        }
        callback();
    };
    return Filter;
})(stream_1.Transform);
exports.Filter = Filter;
