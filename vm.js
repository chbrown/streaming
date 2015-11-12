var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var vm_1 = require('vm');
var stream_1 = require('stream');
var __null = {
    toJSON: function () { return null; },
    valueOf: function () { return null; },
};
/**
    code: string
      Two important facts about this code:
      1. It should process a global variable, `$in`, which represents the
         current object in the stream.
      2. It should set the global variable `$out`, which represents the
         object that will be returned and sent downstream.
    context?: any = {}
      Results and side effects are tracked in this global context object.
    filename?: string = 'streaming.vm'
      Used in stack traces.
*/
var VM = (function (_super) {
    __extends(VM, _super);
    function VM(code, context, filename) {
        if (context === void 0) { context = {}; }
        if (filename === void 0) { filename = 'streaming.vm'; }
        _super.call(this, { objectMode: true });
        this.context = context;
        this.filename = filename;
        // should the createScript call be inside a try-catch?
        this.script = vm_1.createScript(code, filename);
    }
    /**
    each chunk should be a discrete object
    encoding should be null
    */
    VM.prototype._transform = function (chunk, encoding, callback) {
        this.context.$out = undefined;
        this.context.$in = chunk;
        try {
            // I'm not sure why this is not called script.runInContext()
            this.script.runInNewContext(this.context);
        }
        catch (error) {
            this.emit('error', error);
        }
        var result = this.context.$out;
        if (result === undefined) {
        }
        else if (result === null) {
            // We have to wrap a pure JSON null, because `push(null)` means EOF to streams.
            // It's kind of a hack, but it works nicely when we JSON.stringify downstream.
            this.push(__null);
        }
        else {
            this.push(result);
        }
        callback();
    };
    /** Run a bit of code once using the streaming.VM's global context.
  
        code: string
    */
    VM.prototype.run = function (code) {
        return vm_1.runInNewContext(code, this.context, this.filename);
    };
    return VM;
})(stream_1.Transform);
exports.VM = VM;
