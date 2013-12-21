var assert = require('assert'),
    htmlls = require('../index.js'),
    fs = require('fs')

var step = 0,
    stream = htmlls(process.cwd() + '/test-htmlls',
      { hideDot: true, showUp: true })
stream.on('data', function (data) {
  data = data.toString()
  switch (step) {
    case 0:
      assert.equal(data, '<ul>\n')
      break
    case 1:
      assert.ok(/\.\./.test(data))
      break
    case 2:
      assert.ok(/dir\//.test(data) || /file\.txt/.test(data))
      break
    case 3:
      assert.ok(/dir\//.test(data) || /file\.txt/.test(data))
      break
    case 4:
      assert.equal(data, '</ul>\n')
      break
  }
  step++
})

stream.on('end', check)
function check() {
  assert.equal(step, 5)
}
