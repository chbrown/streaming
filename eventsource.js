var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var stream_1 = require('stream');
/**
EventSource is a subclass of stream.Transform for converting a stream of objects
into `text/event-stream` style output.

You should call `res.setHeader('Content-Type', 'text/event-stream');` on your
HTTP response `res` before piping this EventSource stream into the response.

And for this use-case, you'll want to listen for onerror on the client-side,
and close() the EventSource object on the first error, otherwise it will try
to reconnect immediately when the response stream closes. As far as I know,
there is no special event you can send to trigger a complete stop.

Documentation: http://www.w3.org/TR/eventsource/

MDN is usually great, but their article on EventSource sucks:
  https://developer.mozilla.org/en-US/docs/Web/API/EventSource
*/
var EventSource = (function (_super) {
    __extends(EventSource, _super);
    function EventSource(options) {
        _super.call(this, options);
    }
    EventSource.prototype._transform = function (chunk, encoding, callback) {
        // encoding may be something weird like "buffer" if chunk is just a string
        callback(null, "data: " + chunk.toString() + "\n\n");
    };
    return EventSource;
})(stream_1.Transform);
exports.EventSource = EventSource;
