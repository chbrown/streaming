import { Transform } from 'stream';
/**
Mapper transforms a stream of <T> into a stream of <R>, using a synchronous
transform function.

Use Transformer() instead if you need an asynchronous callback function.
*/
export declare class Mapper<T, R> extends Transform {
    protected transformFn: (chunk: T) => R;
    constructor(transformFn: (chunk: T) => R);
    _transform(chunk: T, encoding: string, callback: (error?: Error, outputChunk?: R) => void): void;
}
