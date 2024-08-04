import {Transform, TransformOptions} from 'stream';

function byteAdvancer(splitByte: number): (buffer: Buffer) => Buffer {
  // just a closure around a generic byte read-loop
  return function(buffer: Buffer) {
    let cursor = 0;
    for (let i = 0, l = buffer.length; i < l; i++) {
      if (buffer[i] === splitByte) {
        this.flushBuffer(buffer.subarray(cursor, i));
        cursor = i + 1;
      }
    }
    return buffer.subarray(cursor);
  };
}

export interface SplitterOptions extends TransformOptions {
  split?: string;
}

/**
Splitter is a stream.Transform that rechunks a stream into sub-buffers.
The output (readable) part is set to objectMode true, and emits Buffer objects.
The input (writable) part should be plain buffers (have no encoding).

By default, it splits on the universal newline (\r, \r\n, or \n).
The split byte can be specified in the options.

_writableState.decodeStrings defaults to true, so we should get Buffers
regardless of what's pushed in. If `opts.decodeStrings` is set to `false`,
the behavior is undefined. (TODO: force decodeStrings: true maybe?)

In other words, the Splitter should have the following values:

    {
      _writableState: {
        decodeStrings: true,
        objectMode: false
      },
      _readableState: {
        objectMode: true
      }
    }

*/

/**
A splitter stream rechunks a stream at every `split` byte, if `split` is defined.
If `split` is not defined, it will split at the universal newline (\r, \r\n, or \n).

_writableState.decodeStrings = true
_writableState.objectMode = false
_readableState.objectMode = true

Node.js 'stream' API calls _transform and _flush:
  _transform calls _advance:
    _advance calls flushBuffer (maybe multiple times)
      flushBuffer calls push()
  _flush calls flushBuffer, either once or not at all
    flushBuffer calls push()

*/
export class Splitter extends Transform {
  protected _buffer = Buffer.alloc(0);
  protected _encoding: BufferEncoding = null;

  constructor(options?: SplitterOptions) {
    super(options);
    // we set the readable side to objectMode, in any case, so that the
    // individual buffers we emit will not be fused to each other
    this['_readableState'].objectMode = true;
    if (options && options.split) {
      // if we are given a split string, use the byte code of the first character to split
      this._advance = byteAdvancer(options.split.charCodeAt(0));
    }
  }

  /** calling this will call toString on all emitted chunks, instead of
  returning buffers. */
  setEncoding(encoding: BufferEncoding): this {
    this._encoding = encoding;
    return this;
  }

  /** Handle each split part */
  protected flushBuffer(buffer: Buffer): void {
    if (this._encoding !== null) {
      this.push(buffer.toString(this._encoding));
    }
    else {
      this.push(buffer);
    }
  }

  /** Decide where the split points are */
  _advance(buffer: Buffer): Buffer {
    let cursor = 0;
    for (let i = 0, l = buffer.length; i < l; i++) {
      // smart handling of \r and \n
      if (buffer[i] === 13 || buffer[i] === 10) {
        this.flushBuffer(buffer.subarray(cursor, i));
        if (buffer[i] === 13 && buffer[i + 1] === 10) { // '\r\n'
          i++;
        }
        cursor = i + 1;
      }
    }
    return buffer.subarray(cursor);
  }

  /**
  `encoding` describes the type of `chunk` -- if the _writableState.decodeStrings option is
  true, this will be useful; otherwise, `chunk` will be just a buffer, or if
  objectMode is true, it'll be an arbitrary object, and `encoding` will just be
  'buffer'.
  */
  _transform(chunk: Buffer,
             encoding: BufferEncoding,
             callback: (error?: Error, outputChunk?: any) => void): void {
    // assert encoding == 'buffer'
    const buffer = Buffer.concat([this._buffer, chunk]);
    this._buffer = this._advance(buffer);
    callback();
  }

  _flush(callback: (error?: Error) => void): void {
    this._advance(this._buffer);
    if (this._buffer && this._buffer.length > 0) {
      this.flushBuffer(this._buffer);
    }
    callback();
  }
}
