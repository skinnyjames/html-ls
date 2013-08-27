var ls = require('ls-stream'),
    path = require('path'),
    through = require('through');

function lsHtml(dir, options) {

  options = options || {};

  var hideDot = options.hideDot,
      showUp = options.showUp,
      stream = through();

  process.nextTick(go);
  
  return stream;

  function go() {
    stream.queue('<ul>\n');
    if (showUp) {
      var upDir = path.dirname(dir) + '/';
      stream.queue('<li><a href="' + upDir + '">..</a></li>\n');
    }
    ls(dir)
      .on('data', function (data) {
        // if we receive a null or if we have recursed into a new dir, just terminate the stream
        if (data == null || path.dirname(data.path) !== dir) return done();
        var objectName = path.basename(data.path) + (data.stat.isDirectory() ? '/' : ''),
            objectString = ['<li><a href="', objectName, '">', objectName, '</a></li>\n'].join('');
        if (hideDot && /^\./.test(objectName)) return;
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

