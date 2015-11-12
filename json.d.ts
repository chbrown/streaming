import { Transform } from 'stream';
/** streaming.json.ArrayStringifier stringifies all written objects into a
single proper JSON array, surrounded by [ and ] delimiters, and separated by commas.

* `replacer` Function If a function, transforms values and properties
  encountered while stringifying; if an array, specifies the set of
  properties included in objects in the final string. Details on
  [MDN](https://developer.mozilla.org/En/Using_native_JSON#The_replacer_parameter).
* `space` Number | String Causes the resulting string to be pretty-printed
  (by some number of spaces or literal space).
*/
export declare class ArrayStringifier extends Transform {
    protected replacer: any;
    protected space: string | number;
    protected _seen_first_item: boolean;
    constructor(replacer?: any, space?: string | number);
    _transform(chunk: any, encoding: string, callback: (error?: Error, outputChunk?: any) => void): void;
    _flush(callback: any): void;
}
/** streaming.json.Stringifer expects objects and outputs strings / buffers

    _writableState.objectMode = true
    _readableState.objectMode = false

* `replacer` Function If a function, transforms values and properties
  encountered while stringifying; if an array, specifies the set of
  properties included in objects in the final string. Details on
  [MDN](https://developer.mozilla.org/En/Using_native_JSON#The_replacer_parameter).
* `space` Number | String Causes the resulting string to be pretty-printed
  (by some number of spaces or literal space).
*/
export declare class Stringifier extends Transform {
    protected replacer: any;
    protected space: string | number;
    constructor(replacer?: any, space?: string | number);
    _transform(chunk: any, encoding: string, callback: (error?: Error, outputChunk?: any) => void): void;
}
/** streaming.json.Parser expects Buffer input with universal newlines
dividing JSON objects.
*/
export declare class Parser extends Transform {
    protected replacer: any;
    protected space: string | number;
    protected _buffer: Buffer;
    constructor(replacer?: any, space?: string | number);
    _line(buffer: any): void;
    _process_buffer(eof: any): void;
    _transform(chunk: any, encoding: string, callback: (error?: Error, outputChunk?: any) => void): void;
    _flush(callback: (error?: Error) => void): void;
}
