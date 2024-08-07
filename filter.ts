import {Transform} from 'stream';

export class Filter<T> extends Transform {
  constructor(protected testFn: (chunk: T) => boolean) {
    super({objectMode: true});
  }

  _transform(chunk: T,
             encoding: BufferEncoding,
             callback: (error?: Error, outputChunk?: T) => void) {
    const success = this.testFn(chunk);
    if (success) {
      this.push(chunk, encoding);
    }
    callback();
  }
}
