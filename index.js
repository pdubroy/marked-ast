'use strict';

var marked = require('./gen/marked-mod');

// Alias marked's default renderer as HtmlRenderer.
var HtmlRenderer = marked.Renderer;

// Monkey-patch the HTML renderer with the `newSequence` function, which
// is required by our modified version of marked.
HtmlRenderer.prototype.newSequence = function() {
  return '';
};

// The AstBuilder is a renderer that produces an abstract syntax tree
// representing the structure of the Markdown source.
function AstBuilder() {
}

AstBuilder.prototype.newSequence = function() {
  return [];
};

var handlerArgs = {
  code: ['code', 'lang', 'escaped', 'fenced'],
  blockquote: ['quote'],
  html: ['html'],
  heading: ['text', 'level', 'raw'],
  hr: [],
  list: ['body', 'ordered'],
  listitem: ['text'],
  paragraph: ['text'],
  table: ['header', 'body'],
  tablerow: ['content'],
  tablecell: ['content', 'flags'],
  strong: ['text'],
  em: ['text'],
  codespan: ['text'],
  br: [],
  del: ['text'],
  link: ['href', 'title', 'text'],
  image: ['href', 'title', 'text']
};

function isObject(obj) {
  var type = typeof obj;
  return type === 'function' || type === 'object' && !!obj;
}

function isArray(obj) {
  return Object.prototype.toString.call(obj) === '[object Array]';
}

function map(arr, fn) {
  var result = [];
  for (var i = 0; i < arr.length; ++i) {
    result.push(fn(arr[i], i));
  }
  return result;
}

// Returns a handler function which just returns an object which captures the
// values of all the arguments to the handler function.
function makeHandler(type, args) {
  return function() {
    var result = { type: type };
    for (var i = 0; i < args.length; ++i) {
      result[args[i]] = arguments[i];
    }
    return result;
  };
}

for (var k in handlerArgs) {
  AstBuilder.prototype[k] = makeHandler(k, handlerArgs[k]);
}

function parse(text) {
  return marked(text, {
    renderer: new AstBuilder()
  });
}

function render(node, renderer) {
  if (!isObject(node))
    return node;

  // Render all of the children.
  var results = isArray(node) ? [] : {};
  for (var key in node) {
    if (node.hasOwnProperty(key))
      results[key] = render(node[key], renderer);
  }

  if (isArray(node))
    return results.join('');

  // Splat the results object onto the appropriate handler in the renderer.
  var handlerFn = renderer[node.type];
  if (!handlerFn) throw new Error("Missing handler for '" + node.type + "'");

  var args = map(handlerArgs[node.type], function(argName) {
    return results[argName];
  });
  return handlerFn.apply(renderer, args);
}

module.exports = {
  _marked: marked,
  parse: parse,
  render: function(tree) {
    return render(tree, new HtmlRenderer());
  },
  AstBuilder: AstBuilder
};
