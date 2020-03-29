This Webpack loader precompiles Nunjucks templates and set required dependencies
from used assets, custom filters and tags, and referenced templates (`extend`s,
`import`s and `include`s).

## Install

```bash
npm install --save-dev simple-nunjucks-loader
```

## Migration

I you happen to use `nunjucks-loader`, you could be interested in
[Migration guide](migrate/nunjucks-loader.md).

## Examples

* Using with [`html-webpack-plugin`](examples/html-webpack-plugin/README.md)
* Loading [assets](examples/assets/README.md) from template
* [`isomorphic`](examples/isomorphic/README.md) app example
* [`nunjucks-markdown`](examples/markdown/README.md) usage notes
