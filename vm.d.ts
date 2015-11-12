import { Script } from 'vm';
import { Transform } from 'stream';
/**
    code: string
      Two important facts about this code:
      1. It should process a global variable, `$in`, which represents the
         current object in the stream.
      2. It should set the global variable `$out`, which represents the
         object that will be returned and sent downstream.
    context?: any = {}
      Results and side effects are tracked in this global context object.
    filename?: string = 'streaming.vm'
      Used in stack traces.
*/
export declare class VM<T> extends Transform {
    context: any;
    filename: string;
    protected script: Script;
    constructor(code: string, context?: any, filename?: string);
    /**
    each chunk should be a discrete object
    encoding should be null
    */
    _transform(chunk: any, encoding: string, callback: (error?: Error, outputChunk?: any) => void): void;
    /** Run a bit of code once using the streaming.VM's global context.
  
        code: string
    */
    run(code: string): void;
}
