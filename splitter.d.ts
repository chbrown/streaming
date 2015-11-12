import { Transform, TransformOptions } from 'stream';
export interface SplitterOptions extends TransformOptions {
    split?: string;
}
/**
A splitter stream rechunks a stream at every `split` byte, if `split` is defined.
If `split` is not defined, it will split at the universal newline (\r, \r\n, or \n).

_writableState.decodeStrings = true
_writableState.objectMode = false
_readableState.objectMode = true

Node.js 'stream' API calls _transform and _flush:
  _transform calls _advance:
    _advance calls _chunk (maybe multiple times)
      _chunk calls push()
  _flush calls _chunk, either once or not at all
    _chunk calls push()

*/
export declare class Splitter extends Transform {
    protected _buffer: Buffer;
    protected _encoding: any;
    constructor(options?: SplitterOptions);
    /** calling this will call toString on all emitted chunks, instead of
    returning buffers. */
    setEncoding(encoding: any): this;
    /** _chunk handles what we do to each split part */
    _chunk(buffer: any): void;
    /** _advance handles how we decide where the split points are */
    _advance(buffer: any): any;
    /**
    `encoding` describes the type of `chunk` -- if the decodeStrings option is
    true, this will be useful; otherwise, `chunk` will be just a buffer, or if
    objectMode is true, it'll be an arbirary object, and `encoding` will just be
    'buffer'.
    */
    _transform(chunk: any, encoding: string, callback: (error?: Error, outputChunk?: any) => void): void;
    _flush(callback: any): void;
}
