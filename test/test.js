var assert = require('assert'),
    htmlls = require('../index.js'),
    fs = require('fs');

fs.mkdirSync('test-htmlls');
fs.mkdirSync('test-htmlls/dir');
fs.writeFileSync('test-htmlls/dir/file.exe', 'blah');
fs.writeFileSync('test-htmlls/file.txt', 'wee');

var step = 0,
    stream = htmlls(process.cwd() + '/test-htmlls');

stream.on('data', function (data) {
  if (data != null && typeof data != 'string') { data = data.toString(); }
  switch (step) {
    case 0:
      assert.equal(data, '<ul>\n');
      break;
    case 1:
      assert.ok(data.match(/dir\//));
      break;
    case 2:
      assert.ok(data.match(/file.txt/));
      break;
    case 3:
      assert.equal(data, '</ul>\n');
      break;
    case 4:
      assert.equal(data, null);
      tearDown();
      break;
  }
  step++;
});
function tearDown() {
  fs.unlinkSync('test-htmlls/file.txt');
  fs.unlinkSync('test-htmlls/dir/file.exe');
  fs.rmdirSync('test-htmlls/dir');
  fs.rmdirSync('test-htmlls');
}
