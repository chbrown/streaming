import { Transform, TransformOptions } from 'stream';
/**
Timeout is mostly a PassThrough (identity) stream, but will throw an error if
a period of `timeoutMilliseconds` elapses without seeing any new data.
*/
export declare class Timeout extends Transform {
    /** The timestamp epoch in milliseconds when the most recent chunk was received. */
    lastChunkReceived: number;
    /** How often to check. */
    timeoutMilliseconds: number;
    constructor(timeoutSeconds: number, options?: TransformOptions);
    _check(): void;
    _transform(chunk: any, encoding: string, callback: (error?: Error, outputChunk?: any) => void): void;
    _flush(callback: any): void;
}
