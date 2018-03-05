import {Transform} from 'stream';
import {EOL} from 'os';

/**
A SyntaxError thrown by JSON.parse() might look like the following:

    name: 'SyntaxError'
    message: 'Unexpected token w'
    arguments: 'w'
    stack: <a stack trace>
    type: 'unexpected_token'
*/
class ParseError extends Error {
  public name: string = 'ParseError';

  constructor(public syntaxError: Error, input: string) {
    super(`${syntaxError.message} when parsing "${input}"`);
    // Error.captureStackTrace(this, this.constructor); // or (this, arguments.callee);
  }
}

/**
Stringify all written objects into a single proper JSON array,
surrounded by [ and ] delimiters, and separated by commas.

* `replacer` - If a function, transforms values and properties
  encountered while stringifying; if an array, specifies the set of
  properties included in objects in the final string. Details on
  [MDN](https://developer.mozilla.org/En/Using_native_JSON#The_replacer_parameter).
* `space` - Causes the resulting string to be pretty-printed
  (by some number of spaces or literal space).
*/
export class ArrayStringifier extends Transform {
  protected _seenFirstItem = false;

  constructor(protected replacer?: any, protected space?: string | number) {
    super();
    this['_writableState'].objectMode = true;
    this.push('[');
  }

  _transform(chunk: any,
             encoding: string,
             callback: (error?: Error, outputChunk?: any) => void): void {
    if (this._seenFirstItem) {
      this.push(',' + JSON.stringify(chunk, this.replacer, this.space));
    }
    else {
      this.push(JSON.stringify(chunk, this.replacer, this.space));
      this._seenFirstItem = true;
    }
    callback();
  }

  _flush(callback: (error?: Error) => void): void {
    this.push(']');
    callback();
  }
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
export class Stringifier extends Transform {
  constructor(protected replacer?: any, protected space?: string | number) {
    super();
    this['_writableState'].objectMode = true;
  }

  _transform(chunk: any,
             encoding: string,
             callback: (error?: Error, outputChunk?: any) => void): void {
    this.push(JSON.stringify(chunk, this.replacer, this.space) + EOL); // , 'utf8'
    callback();
  }
}

/** streaming.json.Parser expects Buffer input with universal newlines
dividing JSON objects. You shouldn't put a Splitter() in front of it.
*/
export class Parser extends Transform {
  protected _buffer: Buffer = new Buffer(0);

  constructor(protected replacer?: any, protected space?: string | number) {
    super();
    this['_writableState'].objectMode = false; // buffer input
    this['_readableState'].objectMode = true; // object output
  }

  _line(lineBuffer: Buffer) {
    const lineString = lineBuffer.toString('utf8');
    let obj;
    try {
      obj = JSON.parse(lineString);
    } catch (syntax_error) {
      const error = new ParseError(syntax_error, lineString);
      this.emit('error', error);
    }

    if (obj !== undefined) {
      // only push the parsed object along if it was parsed without error
      this.push(obj);
    }
  }

  /** Find the split points */
  _processBuffer(eof: boolean): void {
    let offset = 0;
    let cursor = offset;
    const length = this._buffer.length;
    while (cursor < length) {
      const prev = this._buffer[cursor - 1];
      const curr = this._buffer[cursor];
      const next = this._buffer[cursor + 1];
      const eol = (curr === 10) || // '\n'
                  (prev === 13 && curr === 10) || // '\r\n'
                  (curr === 13 && next !== 10 && next !== undefined) || // '\r[^\n]'
                  (eof && (cursor + 1) === length); // flush final line if eof is true
      cursor++;
      if (eol) {
        // include the full EOL marker in the line chunk
        this._line(this._buffer.slice(offset, cursor));
        offset = cursor;
      }
    }

    this._buffer = this._buffer.slice(offset);
  }

  /**
  chunk will be a Buffer, and either one is fine by JSON.parse, but to
  appease TypeScript, type assert that it's <any>
  */
  _transform(chunk: any,
             encoding: string,
             callback: (error?: Error, outputChunk?: any) => void): void {
    this._buffer = Buffer.concat([this._buffer, chunk]);
    this._processBuffer(false);
    callback();
  }

  _flush(callback: (error?: Error) => void): void {
    this._processBuffer(true);
    callback();
  }
}
