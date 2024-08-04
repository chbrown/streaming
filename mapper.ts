import {Transform} from 'stream';

const __null = {
  toJSON(): null {
    return null;
  },
  valueOf(): null {
    return null;
  },
};

/**
Mapper transforms a stream of <T> into a stream of <R>, using a synchronous
transform function.

Use Transformer() instead if you need an asynchronous callback function.
*/
export class Mapper<T, R> extends Transform {
  constructor(protected transformFn: (chunk: T) => R) {
    super({objectMode: true});
    this.transformFn = transformFn.bind(this);
  }

  _transform(chunk: T, encoding: BufferEncoding, callback: (error?: Error, outputChunk?: R) => void) {
    const result = this.transformFn(chunk);
    if (result === null) {
      // We have to wrap pure JS nulls, because `push(null)` means EOF to streams.
      // It's kind of a hack, but it works nicely when we JSON.stringify downstream.
      this.push(__null);
    }
    else if (result !== undefined) {
      this.push(result);
    }
    // otherwise skip it; undefined denotes no output
    callback();
  }
}
