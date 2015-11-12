import { Transform } from 'stream';
export declare class Picker extends Transform {
    fields: string[];
    constructor(fields: string[]);
    _transform(chunk: any, encoding: string, callback: TransformCallback): void;
}
export declare class Omitter extends Transform {
    fieldsMap: {
        [index: string]: number;
    };
    constructor(fields: string[]);
    _transform(chunk: any, encoding: string, callback: TransformCallback): void;
}
