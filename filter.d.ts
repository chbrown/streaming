import { Transform } from 'stream';
export declare class Filter<T> extends Transform {
    protected testFn: (chunk: T) => boolean;
    constructor(testFn: (chunk: T) => boolean);
    _transform(chunk: T, encoding: string, callback: (error?: Error, outputChunk?: T) => void): void;
}
