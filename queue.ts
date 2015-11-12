import {Duplex, DuplexOptions} from 'stream';

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
export class Queue extends Duplex {
  protected _in_progress: number = 0;
  constructor(protected concurrency: number,
              protected transformFn: TransformCall<any>,
              options?: DuplexOptions) {
    super(options);
  }

  /** _read is called when the user wants data from this stream.

  From the [stream docs](http://nodejs.org/api/stream.html#stream_readable_read_size_1):

  > When data is available, put it into the read queue by calling
  > readable.push(chunk). If push returns false, then you should stop reading.
  > When _read is called again, you should start pushing more data.

  Since are mostly pulling, rather than pushing, this is a no-op.
  We might conceivably use it to determine if are free to stop processing
  incoming tasks; i.e., if no one wants them, we don't need to read them.
  */
  _read(size) {
    // console.error('Queue._read called: %j', size);
  }
  _write(chunk, encoding, callback) {
    // console.error('Queue._write called: %d', this._in_progress);
    this._in_progress++;

    var finalized = false;

    var self = this;
    this.transformFn(chunk, encoding, (err, outputChunk) => {
      self._in_progress--;

      if (err) {
        self.emit('error', err);
      }
      else {
        self.push(outputChunk);
      }

      if (!finalized) {
        callback();
        finalized = true; // necessary?
      }

      // if (this._in_progress === 0 && this._writableState.ended === true) {
      //   this.push(null);
      // }
    });

    // if we have not yet hit the concurrency limit, we say that we have handled it immediately
    if (this._in_progress < this.concurrency) {
      // check for finalized here, in case this.transform is not truly async
      if (!finalized) {
        callback();
        finalized = true;
      }
    }
  }
}
