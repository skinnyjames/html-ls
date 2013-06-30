var ls = require('ls-stream'),
    path = require('path'),
    through = require('through');

function lsHtml(dir, hideDot) {
  var stream = through();

  process.nextTick(go);
  return stream;

  function go() {
  stream.queue('<ul>\n');
  ls(dir)
    .on('data', function (data) {
      // if we receive a null or if we have recursed into a new dir, just terminate the stream
      if (data == null || path.dirname(data.path) !== dir) {
        done();
        return;
      }
      var objectName = path.basename(data.path) + (data.stat.isDirectory() ? '/' : ''),
          objectString = '<li><a href="' + objectName + '">' + objectName + '</a></li>\n';
      if (hideDot && objectName.match(/^\./)) return;
      stream.queue(objectString);
    })
    .on('end', done);
  }
  function done() {
    stream.queue('</ul>\n');
    stream.queue(null);
  }
}

module.exports = lsHtml;
