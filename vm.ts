import {createScript, Script, runInNewContext, Context} from 'vm';
import {Transform} from 'stream';

const __null = {
  toJSON: () => null,
  valueOf: () => null,
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
export class VM<T> extends Transform {
  protected script: Script;
  constructor(code: string, public context: any = {}, public filename: string = 'streaming.vm') {
    super({objectMode: true});
    // should the createScript call be inside a try-catch?
    this.script = createScript(code, filename);
  }
  /**
  each chunk should be a discrete object
  encoding should be null
  */
  _transform(chunk: any, encoding: string, callback: TransformCallback) {
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
  }
  /** Run a bit of code once using the streaming.VM's global context.

      code: string
  */
  run(code: string) {
    return runInNewContext(code, this.context, this.filename);
  }
}
