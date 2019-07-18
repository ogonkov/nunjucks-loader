# Nunjucks templates loader for Webpack
This Webpack loader compiles [Nunjucks](https://github.com/mozilla/nunjucks) templates.
[`html-webpack-plugin`](https://github.com/jantimon/html-webpack-plugin) compatible. 

## Install
```bash
npm install --save-dev simple-nunjucks-loader
```

## Usage
Loader **didn't expose `window.nunjucksPrecompiled`** that could break some
installations, that use it directly.

This loader will [precompile](https://mozilla.github.io/nunjucks/api.html#precompiling)
Nunjucks templates. It also includes Nunjunks (slim) runtime for browser.

Add loader to your `webpack` config as follows:

**webpack.config.js**
```js
module.exports = {
    module: {
        rules: [
            {
                test: /\.njk$/,
                use: [
                    {
                        loader: 'simple-nunjucks-loader'
                    }
                ]
            }
        ]
    }
};
```

For using with `html-webpack-plugin` just add it to `plugins` array, all options
from it would be available as `htmlWebpackPlugin.options` in Nunjucks template.


**webpack.config.js**
```js
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    module: {
        rules: [
            {
                test: /\.njk$/,
                use: [
                    {
                        loader: 'simple-nunjucks-loader'
                    }
                ]
            }
        ]
    },
    
    plugins: [
        new HTMLWebpackPlugin({
            template: 'src/page.njk'
        })
    ]
};
```

Refer to [`html-webpack-plugin` page](https://github.com/jantimon/html-webpack-plugin/#options)
for all available options.

## How it works
Nunjunks bundle all precompiled templates to `window.nunjucksPrecompiled`, then
loads them via custom loader from this global object.

Loader precompiles all templates in module closure, and pass it down to custom
[Nunjucks loader](https://mozilla.github.io/nunjucks/api.html#loader), that
retrieve templates from closure.

Also Nunjucks didn't have dependency tree for precompiled templates, it cause
precompilation on-demand and will break bundle. To workaround this issue,
`simple-nunjucks-loader` doing some regexp-fu and precompile all required
templates.

## Options
Loader supports limited number of [Nunjuncks options](https://mozilla.github.io/nunjucks/api.html#configure).
It's doesn't support `watch` (it's not relate to `webpack` files watch),
`noCache`, `web` settings and `express`.

All other options get passed to Nunjunks `Environment` during files loading.
