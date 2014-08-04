var test = require('tape');

var marked = require('marked'),
    markedMod = require('../');

require('./chjj-marked/test/').runTests();

test('rewrite to string', function (t) {
  var text = '_This is **Markdown**_, he said.';
  t.equal(markedMod(text), marked(text));
  t.end();
});
