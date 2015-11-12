interface TransformCallback {
  (error?: Error, outputChunk?: any): void;
}
interface FlushCallback {
  (error?: Error): void;
}
interface TransformCall<T> {
  (chunk: T, encoding: string, callback: TransformCallback): void;
}
