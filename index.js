var ls = require('ls-stream'),
    path = require('path'),
    through = require('through')

module.exports = lsHtml

function lsHtml(dir, options) {
  var dotfile = /^\./,
      stream = through()

  options = options || {}

  process.nextTick(go)
  
  return stream

  function go() {
    var up_dir

    stream.queue('<ul>\n')

    if (options.showUp) {
      up_dir = path.dirname(dir) + '/'
      stream.queue('<li>' + '..'.link(up_dir) + '</li>\n')
    }

    ls(dir)
      .on('data', on_dir)
      .on('end', done)

    function on_dir(data) {
      if (!data || path.dirname(data.path) !== dir) return done()
      if (options.hideDot && dotfile.test(path.basename(data.path))) return

      var object_name = path.basename(data.path),
          object_string

      if (data.stat.isDirectory()) object_name += '/'

      object_string = '<li>' + object_name.link(object_name) + '</li>\n'

      stream.queue(object_string)
    }
  }

  function done() {
    stream.queue('</ul>\n')
    stream.queue(null)
  }
}
