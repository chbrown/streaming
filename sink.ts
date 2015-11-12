import {Transform, TransformOptions} from 'stream';

/**
Similar to piping to /dev/null at the command line.

This stream can be piped into, but it will never output anything. However, it
will end when the source stream ends.
*/
export class Sink<T> extends Transform {
  constructor(options?: TransformOptions) {
    super(options);
  }
  _transform(chunk: T, encoding: string, callback: TransformCallback) {
    callback();
  }
}
