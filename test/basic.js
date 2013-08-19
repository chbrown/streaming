'use strict'; /*jslint node: true, es5: true, indent: 2 */
var fs = require('fs');
var test = require('tap').test;

var streaming = require('..');

test('import', function (t) {
  t.ok(streaming !== undefined, 'streaming should load from the current directory');
  t.end();
});

test('json.Parser', function (t) {
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

test('json.Stringifier', function (t) {
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
