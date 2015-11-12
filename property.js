var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var stream_1 = require('stream');
var Picker = (function (_super) {
    __extends(Picker, _super);
    function Picker(fields) {
        // objects in, objects out
        _super.call(this, { objectMode: true });
        this.fields = fields;
    }
    Picker.prototype._transform = function (chunk, encoding, callback) {
        var filtered = {};
        for (var i = 0; i < this.fields.length; i++) {
            filtered[this.fields[i]] = chunk[this.fields[i]];
        }
        this.push(filtered, encoding);
        callback();
    };
    return Picker;
})(stream_1.Transform);
exports.Picker = Picker;
var Omitter = (function (_super) {
    __extends(Omitter, _super);
    function Omitter(fields) {
        // objects in, objects out
        _super.call(this, { objectMode: true });
        this.fieldsMap = {};
        for (var i = 0, l = fields.length; i < l; i++) {
            this.fieldsMap[fields[i]] = 1;
        }
    }
    Omitter.prototype._transform = function (chunk, encoding, callback) {
        for (var field in this.fieldsMap) {
            delete chunk[field];
        }
        this.push(chunk, encoding);
        callback();
    };
    return Omitter;
})(stream_1.Transform);
exports.Omitter = Omitter;
