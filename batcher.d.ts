import { Transform } from 'stream';
/**
Batcher transforms a stream of <T> into a stream of Array<T>, where each array
has at most `size` elements (the last chunk may have fewer, but more than 0).
*/
export declare class Batcher<T> extends Transform {
    protected batchSize: number;
    protected batchBuffer: any[];
    constructor(batchSize: number);
    /**
    checkFlush is called by both _transform and _flush, with different `end` values.
    */
    protected checkFlush(end: boolean, callback: (error?: Error) => void): void;
    _transform(chunk: T, encoding: string, callback: (error?: Error, outputChunk?: T[]) => void): void;
    _flush(callback: (error?: Error) => void): void;
}
