import { Duplex, DuplexOptions } from 'stream';
/** new streaming.Queue(concurrency: number,
                        transform: TransformCallback,
                        options: any)

Queue is much like streaming.Transfomer(transform, options), but it applies the
`transform` function to each piece of data, at most `concurrency` at a time.

Except! the `transform` function does not have access to the stream as `this`,
and so it cannot `this.push(...)` to handle data; it must use the `callback`
function to return the result (or error if an error arose).

Order of the output is not guaranteed, but it shouldn't get mixed up more than
`concurrency` places different.

We use stream.Duplex rather than stream.Transform because output is not
precisely "causally connected" to the input -- there are side-effects (the
duration of the transform function) that complicate the mapping.

Example:

    new streaming.Queue(10, function(chunk, encoding, callback) {
      setTimeout(function() {
        callback(null, {result: 'chunk length is ' + chunk.length + '.'});
      }, Math.random() * 500);
    }, {objectMode: true});

*/
export declare class Queue extends Duplex {
    protected concurrency: number;
    protected transformFn: (chunk: any, encoding: string, callback: (error?: Error, outputChunk?: any) => void) => void;
    protected _in_progress: number;
    constructor(concurrency: number, transformFn: (chunk: any, encoding: string, callback: (error?: Error, outputChunk?: any) => void) => void, options?: DuplexOptions);
    /** _read is called when the user wants data from this stream.
  
    From the [stream docs](http://nodejs.org/api/stream.html#stream_readable_read_size_1):
  
    > When data is available, put it into the read queue by calling
    > readable.push(chunk). If push returns false, then you should stop reading.
    > When _read is called again, you should start pushing more data.
  
    Since are mostly pulling, rather than pushing, this is a no-op.
    We might conceivably use it to determine if are free to stop processing
    incoming tasks; i.e., if no one wants them, we don't need to read them.
    */
    _read(size: any): void;
    _write(chunk: any, encoding: any, callback: any): void;
}
