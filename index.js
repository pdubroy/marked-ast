var marked = require('./gen/marked-mod');

// Monkey-patch the default renderer with the `newSequence` function, which
// is required by our modified version of marked.
marked.Renderer.prototype.newSequence = function() {
  return '';
};
module.exports = marked;
