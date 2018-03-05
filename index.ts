import {Readable} from 'stream';

/** Read a stream to the end, storing all chunks in an array.

For example, to read all STDIN:

    streaming.readToEnd(process.stdin, (err, chunks) => {
      if (err) throw err;
      const input = chunks.join('');
      console.log('Got input of length: ' + input.length);
    });

*/
export function readToEnd(stream: Readable,
                          callback: (error: Error, chunks?: any[]) => void) {
  const chunks: Array<Buffer | string> = [];
  return stream
  .on('error', callback)
  .on('data', chunk => chunks.push(chunk))
  .on('end', () => callback(null, chunks));
}
