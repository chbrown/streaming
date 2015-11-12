import {Transform} from 'stream';

/**
Batcher transforms a stream of <T> into a stream of Array<T>, where each array
has at most `size` elements (the last chunk may have fewer, but more than 0).
*/
export class Batcher<T> extends Transform {
  protected batchBuffer: any[] = [];
  constructor(protected batchSize: number) {
    super({objectMode: true});
  }
  /**
  checkFlush is called by both _transform and _flush, with different `end` values.
  */
  protected checkFlush(end: boolean, callback: (error?: Error) => void) {
    if (this.batchBuffer.length >= this.batchSize || (this.batchBuffer.length > 0 && end)) {
      // splice(index, number_to_remove, number_to_insert) returns the removed items
      var batch = this.batchBuffer.splice(0, this.batchSize);
      this.push(batch);
    }
    callback();
  }
  _transform(chunk: T,
             encoding: string,
             callback: (error?: Error, outputChunk?: T[]) => void) {
    this.batchBuffer.push(chunk);
    this.checkFlush(false, callback);
  }
  _flush(callback: (error?: Error) => void) {
    this.checkFlush(true, callback);
  }
}
