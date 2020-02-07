---
layout: default
title: Using `nunjucks-markdown`
description: |
    Example of integration of nunjucks-markdown and simple-nunjucks-loader
---

# Using `nunjucks-markdown`

> A nunjuck extension that adds a markdown tag. This plugin allows you to
> choose your own markdown renderer.

[`nunjucks-markdown`](https://github.com/zephraph/nunjucks-markdown)
is a simple Nunjucks tag to inline Markdown markup in templates.

## Environment instance

The first downside, when you try to integrate `simple-nunjucks-loader` and this 
extension is requirement to pass `Environment` instance to package `register()`
method.

But unlike other Nunjucks loaders, `simple-nunjucks-loader` didn't provide
methods to have environment access.

The truth is that you don't really need environment to use this extension as
a block (`{% raw %}{% markdown %}...{% endmarkdown %}{% endraw %}`).

You can just call extension itself, and [register it](https://github.com/ogonkov/nunjucks-loader#extensions)
within loader like any other extension. See
[`markdown.js`](https://github.com/ogonkov/nunjucks-loader/tree/gh-pages/examples/markdown/src/nunjuck_extensions/markdown.js)
file for example of integration.

## Markup escaping

The second issue is that rendering of markdown will be escaped inf final
template or HTML file (in case of `html-webpack-plugin` usage).

The problem is related to usage of `browser/nunjucks-slim.js` in loader, while
extension is using `browser/nunjucks.js`. That caused different constructors of
`nunjucks.runtime.SafeString`, that used in Nunjucks extensions to avoid output
escaping.

Because of this the problem when extension output is get escaped could affect
other extensions aswell.

Solution is to replace `browser/nunjucks.js` with
`webpack.NormalModuleReplacementPlugin`. See an example in
[`webpack.config.js`](https://github.com/ogonkov/nunjucks-loader/tree/gh-pages/examples/markdown/webpack.config.js#L36).

## Run demo

```bash
git clone -b gh-pages git@github.com:ogonkov/nunjucks-loader.git
cd examples/markdown
npm install
npm run build
```
