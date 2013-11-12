'use strict'; /*jslint node: true, es5: true, indent: 2 */
var fs = require('fs');
var path = require('path');
var tap = require('tap');

var streaming = require('..');

tap.test('import', function(t) {
  t.ok(streaming !== undefined, 'streaming should load from the current directory');
  t.end();
});

tap.test('json.Parser', function(t) {
  var parser = new streaming.json.Parser();
  parser.write('{"a": 100}\n{"a": 101, "b": 201}\n');
  parser.write('{"a": 102, "b": 202, "c": 302}\n');
  parser.write('{"a": 103, "b": 203, "c": 303');
  parser.write(', "d": 403}');
  parser.end();

  streaming.readToEnd(parser, function(err, chunks) {
    if (err) throw err;

    t.equal(chunks.length, 4, 'There should be four results');
    t.equivalent(chunks[2], {a: 102, b: 202, c: 302}, 'The third row should match the literal object.');
    t.end();
  });
});

tap.test('json.Stringifier', function(t) {
  var stringifier = new streaming.json.Stringifier();
  stringifier.write({a: 102, b: 202, c: 302});
  stringifier.end();

  streaming.readToEnd(stringifier, function(err, chunks) {
    if (err) throw err;

    var json_string = chunks.join('');

    t.equal(json_string, '{"a":102,"b":202,"c":302}\n', 'The stringifier output should match the literal string.');
    t.end();
  });
});

tap.test('Walk', function(t) {
  var lib_path = path.join(__dirname, '..', 'lib');
  fs.realpath(lib_path, function(err, package_root) {
    var walk = new streaming.Walk(package_root);

    streaming.readToEnd(walk, function(err, paths) {
      if (err) throw err;

      var walk_js_present = paths.some(function(node) {
        return node.path.match(/walk.js$/);
      });

      t.equal(paths.length, 11, 'There should be 11 children in lib/');
      t.ok(walk_js_present, 'One of the paths should end with "walk.js".');
      t.end();
    });
  });
});
