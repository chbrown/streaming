# streaming

A few stream helpers, abiding by the new-style Node.js stream standards.

    npm install streaming


### `streaming.Glob`

`new Glob(pattern, options)` inherits `stream.Readable`

* _readableState.objectMode: true


### `streaming.json.Stringifier`

`new Stringifier(replacer, space)` inherits `streaming.Splitter`

* objectMode: false


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


## License

Copyright © 2013 Christopher Brown. [MIT Licensed](LICENSE).
