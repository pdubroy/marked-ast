# marked-ast

A modified version of [marked](https://github.com/chjj/marked) that can produce an abstract syntax tree for Markdown.

## Usage

```js
var marked = require('marked-ast');
var ast = marked.parse('_This is **Markdown**_, he said.');
var html = marked.render(ast);
```

The package is just a wrapper for `marked`, so the produced HTML should be identical (if it isn't it's a bug). The AST produced in the example would look like this:

```json
[
  {
    "type": "paragraph",
    "text": [
      {
        "type": "em",
        "text": [
          "This is ",
          {
            "type": "strong",
            "text": [ "Markdown" ]
          }
        ]
      },
      ", he said."
    ]
  }
]
```

## Development

Basic setup:

```bash
git clone https://github.com/pdubroy/marked-ast.git
cd marked-ast
npm install
git submodule update --init
```

### Running Tests

Use `npm test` to run the tests. Before checking code in, run `npm run prepublish`.
