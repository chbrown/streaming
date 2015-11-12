import { Transform, TransformOptions } from 'stream';
/**
Similar to piping to /dev/null at the command line.

This stream can be piped into, but it will never output anything. However, it
will end when the source stream ends.
*/
export declare class Sink extends Transform {
    constructor(options?: TransformOptions);
    _transform(chunk: any, encoding: string, callback: (error?: Error, outputChunk?: any) => void): void;
}
