import {Transform, TransformOptions} from 'stream';

/**
Timeout is mostly a PassThrough (identity) stream, but will throw an error if
a period of `timeoutMilliseconds` elapses without seeing any new data.
*/
export class Timeout extends Transform {
  /** The timestamp epoch in milliseconds when the most recent chunk was received. */
  public lastChunkReceived: number;
  /** How often to check. */
  public timeoutMilliseconds: number;
  constructor(timeoutSeconds: number, options?: TransformOptions) {
    super(options);
    // if (timeoutSeconds === undefined) {
    //   throw new Error('new Timeout(timeoutSeconds): timeoutSeconds is a required parameter.');
    // }
    this.timeoutMilliseconds = timeoutSeconds * 1000;
    setInterval(() => this._check(), this.timeoutMilliseconds);
  }

  _check(): void {
    // millisecondsSinceLast: milliseconds since we last saw some incoming data
    const millisecondsSinceLast = (new Date()).getTime() - this.lastChunkReceived;
    if (millisecondsSinceLast > this.timeoutMilliseconds) {
      this.emit('error', new Error(`Timed out: ${millisecondsSinceLast}ms`));
    }
  }

  _transform(chunk: any,
             encoding: string,
             callback: (error?: Error, outputChunk?: any) => void): void {
    this.lastChunkReceived = (new Date()).getTime();
    this.push(chunk);
    callback();
  }

  _flush(callback: (error?: Error) => void): void {
    // don't clear the interval
    callback();
  }
}
