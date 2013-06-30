var assert = require('assert'),
    htmlls = require('../index.js'),
    fs = require('fs');

fs.mkdirSync('test-htmlls');
fs.mkdirSync('test-htmlls/dir');
fs.writeFileSync('test-htmlls/dir/file.exe', 'blah');
fs.writeFileSync('test-htmlls/.test', 'haha');
fs.writeFileSync('test-htmlls/file.txt', 'wee');

var step = 0,
    stream = htmlls(process.cwd() + '/test-htmlls', true);
stream.on('data', function (data) {
  if (data != null && typeof data != 'string') { data = data.toString(); }
  switch (step) {
    case 0:
      assert.equal(data, '<ul>\n');
      break;
    case 1:
      assert.ok(data.match(/dir\//) || data.match(/file\.txt/));
      break;
    case 2:
      assert.ok(data.match(/dir\//) || data.match(/file\.txt/));
      break;
    case 3:
      assert.equal(data, '</ul>\n');
      break;
  }
  step++;
});
stream.on('end', tearDown);
function tearDown() {
  assert.equal(step, 4);
  fs.unlinkSync('test-htmlls/.test');
  fs.unlinkSync('test-htmlls/file.txt');
  fs.unlinkSync('test-htmlls/dir/file.exe');
  fs.rmdirSync('test-htmlls/dir');
  fs.rmdirSync('test-htmlls');
}
