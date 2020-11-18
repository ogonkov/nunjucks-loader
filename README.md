[![npm package][npm-image]][npm-url] 
[![Coverage Status][coverage-image]][coverage-url] 
[![node][node]][node-url] 
[![Build Status][build-image]][build-url] 
![Dependencies Status][dependencies-image]

# Nunjucks templates loader for Webpack

This Webpack loader compiles [Nunjucks][nunjucks-github] templates.
[`html-webpack-plugin`][html-webpack-plugin-github] compatible. 

> For Webpack 4 support use loader 2.x version

## Install
```bash
npm install --save-dev simple-nunjucks-loader
```

If you don't use [dynamic assets](#dynamic-assets) in your code, then you could
save a bit on optional `glob` dependency:

```bash
npm install --no-optional --save-dev simple-nunjucks-loader
```

## Usage

This loader will [precompile][nunjucks-docs-precompiling]
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

**template.njk**
```nunjucks
<p>Hello, {{ username }}!</p>
```

**index.js**
```js
import template from './template.njk'

document.body.innerHTML = template({
  username: 'Mike'
})
```

Bundling of `index.js` above will render paragraph with text "Hello, Mike!" to
the page.

[More examples](https://ogonkov.github.io/nunjucks-loader/#examples) on loader
site.

## How it works
By default Nunjunks bundle all precompiled templates to
`window.nunjucksPrecompiled`, then loads them via custom loader from this
global object. If precompiled template reference some other template file,
it is loaded from disk (in NodeJS environment), or fetched via `XMLHttpRequest`
from internet and precompile downloaded template in runtime.

Both are not webpack-way for projects bundling.

This loader got template source, parse it with Nunjucks parser, to get AST of
template. This AST is iterated to get info on imported templates, used filters
and extensions.

Next step is precompile template, to make it faster. Loader injects own wrapper
to avoid default behaviour with creating global `window.nunjucksPrecompiled`.

One final step is gather all parts together. Loader is inserts imports of
templates, filters and extensions that somehow noted in template, this will make
Webpack to rebuild template only when one of essential part is changed.

Then loader expose module that will create separate environment with only
required filters and extensions. This module is what you invoke to get your
template rendered.

### Assets support

Loader add own `{% static %}` tag, for loading assets, and track their change.

Signature is same to `static` tag from Django.

**template.njk**

```nunjucks
<img alt="" src="{% static 'image.jpg' %}" />
```

See [more examples](https://ogonkov.github.io/nunjucks-loader/examples/assets/)
of setup and using assets in loader.

### Asynchronous support

When loader found async tags or async filters or extensions in the template,
it calls `render` with callback under the hood, and returns `Promise`,
instead of render result.

Because of asynchronous nature of Webpack assets loading, all assets, that
loaded via `{% static %}` tag, make template to return `Promise` too.

## Options
Loader supports limited number of [Nunjuncks options][nunjucks-docs-configure].
It's doesn't support `watch` (we use `webpack` own dependencies watch),
`noCache`, `web` settings and `express`.

All other options get passed to Nunjunks `Environment` during files loading.

|Name|Type|Default|Description|
|:--:|:--:|:-----:|:----------|
|**[`jinjaCompat`](#jinjacompat)**|`{Boolean}`|`false`|Install Jinja syntax support in bundle|
|**[`searchPaths`](#searchpaths)**|`{String}` or `{Array.<string>}`|`.`|One or more paths to resolve templates paths|
|**[`assetsPaths`](#assetspaths)**|`{String}` or `{Array.<string>}`|`.`|Paths to resolve static assets. Works like [`STATICFILES_DIRS`][django-settings-staticfiles-dirs].|
|**[`globals`](#globals)**|`Object.<string, string>`|`{}`|Map global function to corresponding module|
|**[`extensions`](#extensions)**|`Object.<string, string>`|`{}`|Map extension to corresponding module|
|**[`filters`](#filters)**|`Object.<string, string>`|`{}`|Map filters to corresponding module|
|<!-- Add custom options above -->**`autoescape`**|`{Boolean}`|`true`|See [Nunjuncks options][nunjucks-docs-configure] for description of options below|
|**`throwOnUndefined`**|`{Boolean}`|`false`||
|**`trimBlocks`**|`{Boolean}`|`false`||
|**`lstripBlocks`**|`{Boolean}`|`false`||
|**`tags`**|`{Object.<string, string>}`|Default Jinja tags config|Override tags syntax|
|**`dev`**|`{Boolean}`|`true` for development and `false` for production mode|Undocumented Nunjucks option, that will make stacktraces more useful|

`tags` default to:
```
{
    blockStart: '{%',
    blockEnd: '%}',
    variableStart: '{{',
    variableEnd: '}}',
    commentStart: '{#',
    commentEnd: '#}'
}
```

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

### assetsPaths

List of paths where loader should search for assets.

```js
module.exports = {
    module: {
        rules: [
            {
                test: /\.njk$/,
                use: [{
                    loader: 'simple-nunjucks-loader',
                    options: {
                        assetsPaths: [
                            'django_app_a/static',
                            'django_app_b/static'
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
It the same function that [`env.addGlobal`][nunjucks-docs-addglobal] using.

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
                            globalFn: path.join(__dirname, 'global-fn.js')
                        }
                    }
                }]
            }
        ]
    }
};
```

**global-fn.js**
```js
module.exports = function globalFn(foo, bar) {
    return `Do anything with ${foo} and ${bar}`;
};
```

### extensions

Set map of extensions that would be imported before each template render.
Extension should return instance, that would be added via
[`env.addExtension`][nunjucks-docs-addextension].

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
                            CustomExtension: path.join(__dirname, 'extension.js')
                        }
                    }
                }]
            }
        ]
    }
};
```

> :boom: Using ES modules syntax for extensions
> [is not yet possible](https://github.com/ogonkov/nunjucks-loader/issues/81)

**extension.js**
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

### filters

Map of filters, that would be imported before each template render.
Filter should return instance, that would be added via
[`env.addFilter`][nunjucks-docs-addfilter].

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
                        filters: {
                            filter: path.join(__dirname, 'filter.js')
                        }
                    }
                }]
            }
        ]
    }
};
```

> :boom: Using ES modules syntax for filters
> [is not yet possible](https://github.com/ogonkov/nunjucks-loader/issues/81)

**filter.js**

```js
module.exports = function filter(val, param) {
    return `${val + param}`;
};
```

**template.njk**

```nunjucks
{{ foo_var | filter(3) }}
```

Nunjucks is not aware that filter is asynchronous when parse template to AST. 
Because of that, you should mark filter as async. To do that, filter module
should export `async` flag:

**async-filter.js**

```js
function asyncFilter(val, param, callback) {
    setTimeout(function() {
        callback(null, val + param);
    }, 1000);
}

asyncFilter.async = true;

module.exports = asyncFilter;
```

[nunjucks-github]:https://github.com/mozilla/nunjucks
[html-webpack-plugin-github]:https://github.com/jantimon/html-webpack-plugin
[html-webpack-plugin-options]:https://github.com/jantimon/html-webpack-plugin/#options
[expose-loader-github]:https://github.com/webpack-contrib/expose-loader
[nunjucks-docs-precompiling]:https://mozilla.github.io/nunjucks/api.html#precompiling
[nunjucks-docs-configure]:https://mozilla.github.io/nunjucks/api.html#configure
[nunjucks-docs-addglobal]:https://mozilla.github.io/nunjucks/api.html#addglobal
[nunjucks-docs-addextension]:https://mozilla.github.io/nunjucks/api.html#addextension
[nunjucks-docs-addfilter]:https://mozilla.github.io/nunjucks/api.html#addfilter
[django-settings-staticfiles-dirs]: https://docs.djangoproject.com/en/1.11/ref/settings/#std:setting-STATICFILES_DIRS

[npm-image]:https://img.shields.io/npm/v/simple-nunjucks-loader.svg
[npm-url]:http://npmjs.org/package/simple-nunjucks-loader
[coverage-image]:https://coveralls.io/repos/github/ogonkov/nunjucks-loader/badge.svg?branch=master
[coverage-url]:https://coveralls.io/github/ogonkov/nunjucks-loader?branch=master
[node]: https://img.shields.io/node/v/simple-nunjucks-loader.svg
[node-url]: https://nodejs.org
[build-image]:https://github.com/ogonkov/nunjucks-loader/workflows/Tests/badge.svg?branch=master
[build-url]:https://github.com/ogonkov/nunjucks-loader/actions?query=branch%3Amaster+workflow%3ATests
[dependencies-image]:https://api.dependabot.com/badges/status?host=github&repo=ogonkov/nunjucks-loader
