import {Transform} from 'stream';

export class Filter<T> extends Transform {
  constructor(protected testFn: (chunk: T) => boolean) {
    super({objectMode: true});
  }
  _transform(chunk: T, encoding: string, callback: TransformCallback) {
    var success = this.testFn(chunk);
    if (success) {
      this.push(chunk, encoding);
    }
    callback();
  }
}
