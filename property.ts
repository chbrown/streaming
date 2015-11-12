import {Transform} from 'stream';

export class Picker extends Transform {
  constructor(public fields: string[]) {
    // objects in, objects out
    super({objectMode: true});
  }
  _transform(chunk: any,
             encoding: string,
             callback: (error?: Error, outputChunk?: any) => void) {
    var filtered = {};
    for (var i = 0; i < this.fields.length; i++) {
      filtered[this.fields[i]] = chunk[this.fields[i]];
    }
    this.push(filtered, encoding);
    callback();
  }
}

export class Omitter extends Transform {
  public fieldsMap: {[index: string]: number} = {};
  constructor(fields: string[]) {
    // objects in, objects out
    super({objectMode: true});
    for (var i = 0, l = fields.length; i < l; i++) {
      this.fieldsMap[fields[i]] = 1;
    }
  }
  _transform(chunk: any,
             encoding: string,
             callback: (error?: Error, outputChunk?: any) => void) {
    for (var field in this.fieldsMap) {
      delete chunk[field];
    }
    this.push(chunk, encoding);
    callback();
  }
}
