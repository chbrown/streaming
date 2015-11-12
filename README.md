# streaming

A few stream helpers, built for Node.js 0.10+ streams ("Streams2").

    npm install streaming


### `streaming.Filter`

`new Filter(predicate)` inherits `stream.Readable`

* _readableState.objectMode: true


### `streaming.json.Stringifier`

`new Stringifier(replacer, space)` inherits `streaming.Splitter`

* objectMode: false
  * _writableState.objectMode: false
  * _readableState.objectMode: true


### `streaming.json.Parser`

`new Parser()` inherits `streaming.Splitter`

* objectMode: true


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
.pipe(new streaming.Splitter())
.pipe(new streaming.Mapper(JSON.parse))
.pipe(new streaming.Queue(5, lazy_worker))
.pipe(process.stdout);
```


### `streaming.Splitter`

What used to be `streaming.Line` and `Rechunker` have been folder into this more generic, more flexible class.

`new Splitter(split, opts)` inherits `stream.Transform`


### `streaming.Timeout`

`new Timeout(seconds, opts)` inherits `stream.Transform`

### `streaming.Walk`

`new Walk(root)` inherits `stream.Readable`

A `streaming.Walk` will emit data that are `streaming.Walk.Node` objects. A `Node` has two fields, `.path`, which is relative to the given `root`, and `.stats`, which is a [`fs.Stats`](http://nodejs.org/api/fs.html#fs_class_fs_stats) object. `node.toString()` will return `node.path`.

It recurses the filesystem structure depth-first. If the given `root` is not a directory, it will only ever emit that file. Otherwise, if `root` is a directory, it will be emitted as a data point (just like all other directories under `root` as it comes to them). The directory entry itself will always immediately precede its children. The order of children is taken exactly as they produced by `fs.readdir`, which seems to be undefined or maybe by creation date (newest first).

`fs.Stats` has helper functions `.isFile()` and `.isDirectory()`, so we can print the paths only files (ignoring directories) like this:

```javascript
var streaming = require('streaming');

var walk = new streaming.Walk('/usr/local');
walk.on('error', function(err) {
  console.error('error', err);
  if (err.code == 'EACCES') {
    // if the error is just "access denied", ignore both the error and the file.
    // call resume() to carry on as if nothing had happened
    walk.resume();
  }
  else {
    console.error('Critical error; not resuming.');
  }
});
walk.on('data', function(node) {
  // just skip over directories:
  if (node.stats.isFile()) {
    console.log(node.toString());
  }
});
```


## `stream.Transform(opts)` results:

<!-- the space after each period is to allow a line break -->
| opts. decodeStrings | opts. objectMode | _writableState. decodeStrings | _writableState. objectMode | _readableState. objectMode |
|:----|:----|:----|:----|:----|
| **true** | **true** | **true** | **true** | **true** |
| false | **true** | false | **true** | **true** |
| undefined | **true** | **true** | **true** | **true** |
| **true** | false | **true** | false | false |
| false | false | false | false | false |
| undefined | false | **true** | false | false |
| **true** | undefined | **true** | false | false |
| false | undefined | false | false | false |
| undefined | undefined | **true** | false | false |

(Only `_writableState` has a `decodeStrings` field.)

<!--
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

Copyright 2013-2015 Christopher Brown. [MIT Licensed](http://chbrown.github.io/licenses/MIT/#2013-2015).
