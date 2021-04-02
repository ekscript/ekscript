# tree-sitter-ekscript

A [Tree-sitter](https://tree-sitter.github.io) grammar for [EkScript](ekscript.com)

[EkScript website](https://ekscript.com)

# Get Started

## Installation

```sh
git clone https://github.com/ekscript/tree-sitter-ekscript
cd tree-sitter-ekscript
npm i
```

## To generatate C parser files:

```sh
npm run gen # pnpm build
```

## Development

In the root directory, simply:

```bash
npm run dev
```

## Tests

To create tests, create a `*.txt` file in test/corpus folder. Refer to
[tree-sitter test](https://tree-sitter.github.io/tree-sitter/creating-parsers#command-test)
to know how to write tests

To test if the node-bindings are generated properly

```sh
npm run build
node test/corpus/test_index.js
```
should give you an AST

### Highlighting tests


## ROADMAP

- [ ] [nvim-tree-sitter] support

## Contribution

The grammar is easy to understand. Have a look at [creating-parsers](https://tree-sitter.github.io/tree-sitter/creating-parsers)
for more information.

Contribute on the master branch itself if you think this grammar doesn't support anything specific.

## License

[MIT](./LICENSE)

