# nunjucks-loader
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
templates function, that accepts context. It also includes Nunjunks (slim)
runtime for browser. Add loader to your `webpack` config as follows:

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
for more options.

## How it works
Nunjunks bundle all precompiled templates to `window.nunjucksPrecompiled`, then
loads them via custom loader from here.

Loader precompiles all templates in closure, and pass it to custom loader, that
gets templates from here.

Also Nunjucks didn't have dependency tree for precompiled templates, it cause
precompilation on-demand. Loader doing some regexp-fu to avoid that behaviour
and trying to guess what templates should be precompiled.

After that it precompile all found templates, adds this files as loader
dependencies to enable `webpack` to watch them, and bundle Nunjucks (slim)
browser runtime.

## Options
Loader supports limited number of [Nunjuncks options](https://mozilla.github.io/nunjucks/api.html#configure).
It's doesn't support `watch` (it's not relate to `webpack` files watch),
`noCache`, `web` settings and `express`.

All other options get passed to Nunjunks `Environment` during files loading.
