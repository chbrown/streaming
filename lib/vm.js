/*jslint node: true */
var vm = require('vm');
var stream = require('stream');
var util = require('util');

var __null = { toJSON: function() { return null; } };

var VM = module.exports = function(code, context, filename) {
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
  stream.Transform.call(this, {objectMode: true});

  this.filename = (filename === undefined) ? 'streaming.vm' : filename;
  // should the createScript call be inside a try-catch?
  this.script = vm.createScript(code, this.filename);
  this.context = (context === undefined) ? {} : context;
};
util.inherits(VM, stream.Transform);
VM.prototype._transform = function(chunk, encoding, callback) {
  /**
  each chunk should be a discrete object
  encoding should be null
  */
  this.context.$out = undefined;
  this.context.$in = chunk;

  try {
    // I'm not sure why this is not called script.runInContext()
    this.script.runInNewContext(this.context);
  }
  catch (err) {
    this.emit('error', err);
  }

  var result = this.context.$out;
  if (result === undefined) {
    // skip it; undefined denotes no output
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
VM.prototype.run = function(code) {
  /** Run a bit of code once using the streaming.VM's global context.

      code: string
  */
  return vm.runInNewContext(code, this.context, this.filename);
};
