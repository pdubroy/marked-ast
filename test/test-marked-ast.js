var test = require('tape');

var marked = require('marked'),
    markedMod = require('../gen/marked-mod.js');

var stringRenderer = new marked.Renderer;
stringRenderer.newSequence = function() {
  return '';
};

test('rewrite to string', function (t) {
  var text = '_This is **Markdown**_, he said.';
  t.equal(markedMod(text, { renderer: stringRenderer }), marked(text));
  t.end();
});
