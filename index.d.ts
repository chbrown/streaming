/** Read a stream to the end, storing all chunks in an array.

For example, to read all STDIN:

    streaming.readToEnd(process.stdin, function(err, chunks) {
      if (err) throw err;
      var input = chunks.join('');
      console.log('Got input of length: ' + input.length);
    });

*/
export declare function readToEnd(stream: NodeJS.ReadableStream, callback: (error: Error, chunks?: any[]) => void): NodeJS.EventEmitter;
