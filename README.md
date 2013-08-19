# streaming

A few stream helpers, abiding by the new-style Node.js stream standards ("Streams2").

    npm install streaming


### `streaming.Glob`

`new Glob(pattern, options)` inherits `stream.Readable`

* _readableState.objectMode: true


### `streaming.json.Stringifier`

`new Stringifier(replacer, space)` inherits `streaming.Splitter`

* objectMode: false
  * _writableState.objectMode: false
  * _readableState.objectMode: true


### `streaming.json.Parser`

`new Parser()` inherits `streaming.Splitter`

* objectMode: true


### `streaming.Line`

`new Line()` inherits `stream.Transform`

* _writableState.objectMode: false
* _readableState.objectMode: true


### `streaming.Mapper`

`new Mapper(fn)` inherits `stream.Transform`

* _writableState.objectMode: true
* _readableState.objectMode: true


### `streaming.Queue`

`new Queue(concurrency, worker)` inherits `streaming.Mapper`

* _writableState.objectMode: true
* _readableState.objectMode: true

Example:

```javascript
var streaming = require('streaming');

var lazy_worker = function(task, callback) {
  setTimeout(function() {
    var json = JSON.stringify(task);
    callback(null, json.length + ' after 1s\n');
  }, 1000);
};

process.stdin
.pipe(new streaming.Line())
.pipe(new streaming.Mapper(JSON.parse))
.pipe(new streaming.Queue(5, lazy_worker))
.pipe(process.stdout);
```


### `streaming.Splitter`

Very similar to `streaming.Line`, but more configurable.

`new Splitter(split, opts)` inherits `stream.Transform`


### `streaming.Timeout`

`new Timeout(seconds, opts)` inherits `stream.Transform`


### `stream.Transform(opts)` results:

| opts. decodeStrings | opts. objectMode | _writableState. decodeStrings | _writableState. objectMode | _readableState. objectMode |
|:----|:----|:----|:----|:----|
| true | true | true | true | true |
| false | true | false | true | true |
| undefined | true | true | true | true |
| true | false | true | false | false |
| false | false | false | false | false |
| undefined | false | true | false | false |
| true | undefined | true | false | false |
| false | undefined | false | false | false |
| undefined | undefined | true | false | false |

<!--
// only _writableState has a decodeStrings field
var booleans = [true, false, undefined];
function log_row(values) { console.log('| ' + values.join(' | ') + ' |'); };
(function() {
  log_row(['decodeStrings', 'objectMode',
    '_writableState.decodeStrings', '_writableState.objectMode', '_readableState.objectMode']);
  booleans.forEach(function(objectMode) {
    booleans.forEach(function(decodeStrings) {
      var t = new stream.Transform({objectMode: objectMode, decodeStrings: decodeStrings});
      log_row([decodeStrings, objectMode,
        t._writableState.decodeStrings, t._writableState.objectMode, t._readableState.objectMode]);
    });
  })
})();
-->

## License

Copyright © 2013 Christopher Brown. [MIT Licensed](LICENSE).
