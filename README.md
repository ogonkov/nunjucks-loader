[![npm package][npm-image]][npm-url] 
[![node][node]][node-url] 
[![Build Status][travis-image]][travis-url] 
[![Dependencies Status][david-image]][david-url]

# Nunjucks templates loader for Webpack
This Webpack loader compiles [Nunjucks](https://github.com/mozilla/nunjucks) templates.
[`html-webpack-plugin`](https://github.com/jantimon/html-webpack-plugin) compatible. 

## Install
```bash
npm install --save-dev simple-nunjucks-loader
```

## Note on global variables

Nunjucks precompile templates to global `window.nunjucksPrecompiled`.
Loader **didn't expose `window.nunjucksPrecompiled`**. If your code relied on
this object, it will definitely break. Use imports of required template
or adopt [`expose-loader`](https://github.com/webpack-contrib/expose-loader/)
to your build pipeline.

## Usage

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
                        loader: 'simple-nunjucks-loader',
                        options: {}
                    }
                ]
            }
        ]
    }
};
```

**template-example.njk**
```
<p>Hello, {{ username }}!</p>
```

**app.js**
```
import template from './template-example.njk'

document.body.innerHTML = template({
  username: 'Mike'
})
```

Bundling of `app.js` above will render paragraph with text "Hello, Mike!" to
the page.

### With `html-webpack-plugin`

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
                        loader: 'simple-nunjucks-loader',
                        options: {}
                    }
                ]
            }
        ]
    },
    
    plugins: [
        new HTMLWebpackPlugin({
            template: 'src/page.njk',
            templateParameters: {
                username: 'Joe'
            }
        })
    ]
};
```

**src/page.njk**
```
<p>Hello, {{ username }}!</p>
```

Refer to [`html-webpack-plugin` page](https://github.com/jantimon/html-webpack-plugin/#options)
for all available options.

## How it works
By default Nunjunks bundle all precompiled templates to
`window.nunjucksPrecompiled`, then loads them via custom loader from this
global object. If precompiled template reference some other template file,
it is loaded from disk (in NodeJS environment), or fetched via `XMLHttpRequest`
from internet.

Both are not webpack-way for projects bundling.

This loader workaround this behaviour by precompiling templates *and* dependant
templates as separate bundle chunks. It also use custom wrapper for precompiled
code to avoid creating `window.nunjucksPrecompiled`.

It also adds each found template as dependency for template that need it,
so bundle get rebuild in watch mode only when required.

## Options
Loader supports limited number of [Nunjuncks options](https://mozilla.github.io/nunjucks/api.html#configure).
It's doesn't support `watch` (we use `webpack` own dependencies watch),
`noCache`, `web` settings and `express`.

All other options get passed to Nunjunks `Environment` during files loading.

|Name|Type|Default|Description|
|:--:|:--:|:-----:|:----------|
|**[`jinjaCompat`](#jinjacompat)**|`{Boolean}`|`false`|Install Jinja syntax support in bundle|
|**[`searchPaths`](#searchpaths)**|`{String}` or `{Array.<string>}`|`.`|One or more paths to resolve templates paths|
|**[`globals`](#globals)**|`Object.<string, string>`|`{}`|Map global function to corresponding module|
|**[`extensions`](#extensions)**|`Object.<string, string>`|`{}`|Map extension to corresponding module|
|<!-- Add custom options above -->**`autoescape`**|`{Boolean}`|`true`|See [Nunjuncks options](https://mozilla.github.io/nunjucks/api.html#configure) for description of options below|
|**`throwOnUndefined`**|`{Boolean}`|`false`||
|**`trimBlocks`**|`{Boolean}`|`false`||
|**`lstripBlocks`**|`{Boolean}`|`false`||
|**`tags`**|`{Object.<string, string>}`|```{blockStart: '{%', blockEnd: '%}', variableStart: '{{', variableEnd: '}}', commentStart: '{#', commentEnd: '#}'}```|Override tags syntax|

### jinjaCompat

Installs Jinja syntax. This option install it for whole bundle.

### searchPaths

Loader is searching for full template relative to given string(s) from
`searchPath` option (or project root, if no paths given).

Path to file couldn't be outside of folders above.

**webpack.config.js**
```js
module.exports = {
    module: {
        rules: [
            {
                test: /\.njk$/,
                use: [{
                    loader: 'simple-nunjucks-loader',
                    options: {
                        searchPaths: [
                            'django_app_a/templates',
                            'django_app_b/templates'
                        ]
                    }
                }]
            }
        ]
    }
};
```

### globals

Set global function and import path, that should return function to use.
It the same function that
[`env.addGlobal`](https://mozilla.github.io/nunjucks/api.html#addglobal) using.

**webpack.config.js**
```js
module.exports = {
    module: {
        rules: [
            {
                test: /\.njk$/,
                use: [{
                    loader: 'simple-nunjucks-loader',
                    options: {
                        globals: {
                            _: 'lodash',
                            globalEnv: path.join(__dirname, 'app/global-env.js')
                        }
                    }
                }]
            }
        ]
    }
};
```

**app/global-env.js**
```js
module.exports = function(foo, bar) {
    return `Do anything with ${foo} and ${bar}`;
};
```

### extensions

Set map of extensions that would be imported before each template render.
Extension should return instance, that would be added via
[`env.addExtension`](https://mozilla.github.io/nunjucks/api.html#addextension).

**webpack.config.js**
```js
module.exports = {
    module: {
        rules: [
            {
                test: /\.njk$/,
                use: [{
                    loader: 'simple-nunjucks-loader',
                    options: {
                        extensions: {
                            CustomExtension: path.join(__dirname, 'lib/extensions/custom-extension.js')
                        }
                    }
                }]
            }
        ]
    }
};
```

**lib/extensions/custom-extension.js**
```js
// You should use slim bundle to make it work in browser
const nunjucks = require('nunjucks/browser/nunjucks-slim');

// See example in docs
// https://mozilla.github.io/nunjucks/api.html#custom-tags
class CustomExtension {}

module.exports = new CustomExtension();
```

Loader trying to guess which extensions are really used, and keep only required
imports.

[npm-image]:https://img.shields.io/npm/v/simple-nunjucks-loader.svg
[npm-url]:http://npmjs.org/package/simple-nunjucks-loader
[node]: https://img.shields.io/node/v/simple-nunjucks-loader.svg
[node-url]: https://nodejs.org
[travis-image]:https://travis-ci.org/ogonkov/nunjucks-loader.svg?branch=master
[travis-url]:https://travis-ci.org/ogonkov/nunjucks-loader
[david-image]:https://david-dm.org/ogonkov/nunjucks-loader/status.svg
[david-url]:https://david-dm.org/ogonkov/nunjucks-loader
