# Nunjucks templates loader for Webpack
This Webpack loader compiles [Nunjucks](https://github.com/mozilla/nunjucks) templates.
[`html-webpack-plugin`](https://github.com/jantimon/html-webpack-plugin) compatible. 

## Install
```bash
npm install --save-dev simple-nunjucks-loader
```

## Note on `window.nunjucksPrecompiled`

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
            template: 'src/page.njk'
        })
    ]
};
```

Refer to [`html-webpack-plugin` page](https://github.com/jantimon/html-webpack-plugin/#options)
for all available options.

### Via `import`/`require`

To use it from your modules just import it as any other dependency and pass
context for render:

```js
import template from './template.njk';

const page = template({
    foo: 'bar'
});
```

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
|**[`searchPaths`](#searchpaths)**|`{String}` or `{Array.<string>}`|`.`|One or more paths to resolve templates paths|
|**[`globals`](#globals)**|`Object.<string, string>`|`{}`|Map global function to corresponding module|
|**[`extensions`](#extensions)**|`Object.<string, string>`|Map extension to corresponding module|
|<!-- Add custom options above -->**`autoescape`**|`{Boolean}`|`true`|See [Nunjuncks options](https://mozilla.github.io/nunjucks/api.html#configure) for description of options below|
|**`throwOnUndefined`**|`{Boolean}`|`false`||
|**`trimBlocks`**|`{Boolean}`|`false`||
|**`lstripBlocks`**|`{Boolean}`|`false`||
|**`tags`**|`{Object.<string, string>}`|```{blockStart: '{%', blockEnd: '%}', variableStart: '{{', variableEnd: '}}', commentStart: '{#', commentEnd: '#}'}```|Override tags syntax|

### searchPaths

Loader is searching for full template relative to given string(s) from
`searchPath` option (or project root, if no paths given).

Path to file couldn't be outside of folders above.

### globals

Set global function and import, that should return function to use.

```js
{
  globals: {
    _: 'lodash',
    globalEnv: path.join(__dirname, 'app/global-env.js')
  }
}
```

### extensions

Set extensions to import, that required for templates to render.

```js
{
  extensions: {
    CustomExtension: path.join(__dirname, 'lib/extensions/custom-extension.js')
  }
}
```

Module here (`lib/extensions/custom-extension.js`) should return extension
instance.
