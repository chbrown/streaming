import {Script, runInNewContext, Context} from 'vm';
import {Transform} from 'stream';

const __null = {
  toJSON(): null {
    return null;
  },
  valueOf(): null {
    return null;
  },
};

export interface VMContext {
  $in?: any;
  $out?: any;
}

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
export class VM<S, T> extends Transform {
  protected script: Script;

  constructor(code: string,
              public context: VMContext = {},
              public filename: string = 'streaming.vm') {
    super({objectMode: true});
    // should new Script(...) be called inside a try-catch?
    this.script = new Script(code, {filename});
  }

  /**
  each chunk should be a discrete object
  encoding should be null
  */
  _transform(chunk: S,
             encoding: string,
             callback: (error?: Error, outputChunk?: T) => void) {
    this.context.$in = chunk;
    this.context.$out = undefined;

    try {
      // I'm not sure why this is not called script.runInContext()
      this.script.runInNewContext(this.context);
    }
    catch (error) {
      this.emit('error', error);
    }

    const result = this.context.$out;
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

  /**
  Run a bit of code once using the streaming.VM's global context.
  */
  run(code: string) {
    const filename = this.filename;
    return runInNewContext(code, this.context, {filename});
  }
}
