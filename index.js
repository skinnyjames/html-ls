var path = require('path')
  , util = require('util')

var through = require('through2')
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

    stream.push(util.format('<%s>\n', options.parentTag))

    if(options.showUp) {
      upDir = path.dirname(dir) + '/'
      stream.push(util.format(
          '<%s><a href="%s">..</a></%s>\n'
        , options.childTag
        , upDir
        , options.childTag
      ))
    }

    ls(dir).pipe(through.obj(onDir, done))

    function onDir(data, _, next) {
      if(!data || path.dirname(data.path) !== dir) {
        return done()
      }

      if(options.hideDot && dotfile.test(path.basename(data.path))) {
        return next()
      }

      var objectName = path.basename(data.path)

      if(data.stat.isDirectory()) {
        dirs.push(objectName + '/')

        return next()
      }

      files.push(objectName)

      next()
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

      stream.push(util.format('</%s>\n', options.parentTag))
      stream.push(null)

      function streamItem(objectName) {
        var objectString = util.format(
            '<%s><a href="%s">%s</a></%s>\n'
          , options.childTag
          , objectName
          , objectName
          , options.childTag
        )

        stream.push(objectString)
      }
    }
  }
}
