/*jslint node: true */

var typeName = exports.typeName = function(x) {
  /** typeName(x) returns more nuance than typeof(x)

  | input                   | `typeof(...)` | `typeName(...)` |
  |:------------------------|:--------------|:----------------|
  | ``                      | undefined     | undefined       |
  | `undefined`             | undefined     | undefined       |
  | `null`                  | object        | null            |
  | `false`                 | boolean       | boolean         |
  | `true`                  | boolean       | boolean         |
  | `9`                     | number        | number          |
  | `"hello"`               | string        | string          |
  | `{}`                    | undefined     | undefined       |
  | `new stream.Readable()` | object        | object          |
  | `process`               | object        | process         |
  | `(function() {})`       | function      | function        |

  This table can be regenerated with:

      var literals = ['', 'undefined', 'null', 'false', 'true', '9', '"hello"', '{}', 'new stream.Readable()', 'process', '(function() {})'];
      for (var i = 0; i < literals.length; i++) {
        console.log('| `' + literals[i] + '` | ' + typeof(eval(literals[i])) + ' | ' + typeName(eval(literals[i])) + ' |');
      }

  */
  // Object.prototype.toString always returns something like
  // '[object Undefined]' or '[object Number]', so we slice off everything but the
  //   so we slice off everything but the name
  return Object.prototype.toString.call(x).slice(8, -1).toLowerCase();
};
