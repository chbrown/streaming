import { Transform, TransformOptions } from 'stream';
/** Like Mapper, but more bare-bones. The predicate function has to call a
given callback, which means the processing code can be async.

`this` is bound to the stream object inside the transform function, so you
can use `this.push(...)` to output multiple chunks per single input chunk.

Example:

    new streaming.Transformer(function(chunk, encoding, callback) {
      var self = this;
      setTimeout(function() {
        self.push('...');
        self.push(chunk);
        callback();
      }, 1000);
    }, {objectMode: true});

*/
export declare class Transformer<T, R> extends Transform {
    constructor(transformFn: (chunk: T, encoding: string, callback: (error?: Error, outputChunk?: R) => void) => void, options?: TransformOptions);
}
