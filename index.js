var path = require('path')
  , util = require('util')

var through = require('through')
  , ls = require('ls-stream')

module.exports = lsHtml

function lsHtml(dir, _options) {
  var stream = through()
    , dotfile = /^\./

  var options = _options || {}

  options.parentTag = options.parentTag || 'ul'
  options.childTag = options.childTag || 'li'

  process.nextTick(go)

  return stream

  function go() {
    var files = []
      , dirs = []
      , upDir

    stream.queue(util.format('<%s>\n', options.parentTag))

    if(options.showUp) {
      upDir = path.dirname(dir) + '/'
      stream.queue(util.format(
          '<%s><a href="%s">..</a></%s>\n'
        , options.childTag
        , upDir
        , options.childTag
      ))
    }

    ls(dir).pipe(through(onDir, done))

    function onDir(data) {
      if(!data || path.dirname(data.path) !== dir) return done()
      if(options.hideDot && dotfile.test(path.basename(data.path))) return

      var objectName = path.basename(data.path)

      if(data.stat.isDirectory()) {
        return dirs.push(objectName + '/')
      }

      files.push(objectName)
    }

    function done() {
      var entities

      if(options.dirsFirst) {
        entities = dirs.sort().concat(files.sort())
      } else {
        entities = (dirs.concat(files)).sort()
      }

      for(var i = 0, l = entities.length; i < l; ++i) {
        streamItem(entities[i])
      }

      stream.queue(util.format('</%s>\n', options.parentTag))
      stream.queue(null)

      function streamItem(objectName) {
        var objectString = util.format(
            '<%s><a href="%s">%s</a></%s>\n'
          , options.childTag
          , objectName
          , objectName
          , options.childTag
        )

        stream.queue(objectString)
      }
    }
  }
}
