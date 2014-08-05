var fork = require('child_process').fork,
    test = require('tape');

var marked = require('../third_party/marked'),
    markedMod = require('../');

function runProcess(relativePath, cb) {
  var path = __dirname + '/' + relativePath;
  var child = fork(path, { silent: true });
  child.on('exit', function(code) {
    var out, err;
    child.stdout.on('data', function(chunk) { out += chunk; });
    child.stderr.on('data', function(chunk) { err += chunk; });
    cb(code, out, err);
  });
}

test('original marked test suite', function(t) {
  // Compare the results of the original marked tests with the modified tests.
  runProcess('../third_party/marked/test/', function(code, expectedOut /*, err */) {
    t.equal(code, 0);
    runProcess('/chjj-marked/test/', function(code, out /*, err */) {
      t.equal(code, 0);
      t.equal(out, expectedOut);
      t.end();
    });
  });
});

test('rewrite to string', function (t) {
  var text = '_This is **Markdown**_, he said.';

  var ast = markedMod.parse(text);
  t.equal(markedMod.render(ast), marked(text));

  t.end();
});
