var ls = require('ls-stream'),
    path = require('path'),
    through = require('through');

function lsHtml() {
  return function (dir) {
    var stream = through();

    process.nextTick(go);
    return stream;

    function go() {
    stream.queue('<ul>\n');
    ls(dir)
      .on('data', function (data) {
        if (data == null) {
          done();
          return;
        }
        var objectName = path.basename(data.path),
            objectString = '<li><a href="' + objectName + '">' + objectName + (data.isDirectory() ? '/' : '') + '</a></li>\n';
        stream.queue(objectString);
      });
    }
    function done() {
      stream.queue('</ul>');
      stream.queue(null);
    }
  }
}

module.exports = lsHtml;
