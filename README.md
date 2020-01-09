[![npm package][npm-image]][npm-url] 
[![Coverage Status][coverage-image]][coverage-url] 
[![node][node]][node-url] 
[![Build Status][travis-image]][travis-url] 
[![Dependencies Status][david-image]][david-url]

# Nunjucks templates loader for Webpack
This Webpack loader compiles [Nunjucks][nunjucks-github] templates.
[`html-webpack-plugin`][html-webpack-plugin-github] compatible. 

## Install
```bash
npm install --save-dev simple-nunjucks-loader
```

## Note on global variables

By default Nunjucks wrap templates to global `window.nunjucksPrecompiled`.
Loader **didn't expose `window.nunjucksPrecompiled`**. If your code relied on
this object, it will definitely break. Use imports of required template
or adopt [`expose-loader`][expose-loader-github] to your build pipeline.

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

**template-example.njk**
```nunjucks
<p>Hello, {{ username }}!</p>
```

**app.js**
```js
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
```nunjucks
<p>Hello, {{ username }}!</p>
```

Refer to [`html-webpack-plugin` page][html-webpack-plugin-options] for all
available options.

### With assets

To load static assets (like images, for example), this loader inserts own
`static` global function. It works like `static` from Django/Jinja2 integration,
but resolves paths via Webpack loaders. It just replace calls
`static('foo.jpeg')` with `static(importedViaWebpackSymbol)`. `static` itself
just returns loaded module or `default` export of it.

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
                        options: {
                            assetsPaths: [
                                'app_example_a/static',
                                'app_example_b/static',
                            ]
                        }
                    }
                ]
            },

            {
                test: /\.png$/,
                use: [{
                    loader: 'file-loader'
                }]
            },

            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true
                        }
                    }
                ]
            }
        ]
    }
};
```

**template.njk**

```nunjucks
<img
    src="{{ static('./image.png') }}"
    alt=""
    class="{{ static('./styles.css').fooClassName }}"
/>
```

The code above will replace `{{ static('./image.png') }}` with hash, that
`file-loader` returns, with class name `fooClassName` from `styles.css` from
`styles-loader` + `css-loader` output.

#### Dynamic assets

Loader has limited support for dynamic assets. It was tested with expressions
like:

```nunjucks
{{ static('foo/' + bar) }}
```

```nunjucks
{{ static('foo/' + bar + '.ext') }}
```

> :warning: I advocate against using dynamic assets, because:
>
> 1. I have to support hacky regular expressions :smile:
> 2. It's hard to find usages of asset, because there is no import of it
> 3. Final bundle could be bigger without proper maintaining
>
> From my experience it's better to have some kind of map, that will match some
> variable to import:
>
> ```nunjucks
> {% set examplesMap = {
>     'example-1': static('foo/bar/dynamic-example-1.md'),
>     'example-2': static('foo/bar/dynamic-example-2.md')
> } %}
>
> {% for item in [1, 2] %}
>     <p>{{ examplesMap['example-' + item] }}</p>
> {% endfor %}
> ```

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

### Asynchronous support

When loader found async filter in template dependencies, it returns `Promise`,
instead of render result.

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
                            foo: path.join(__dirname, 'foo.js')
                        }
                    }
                }]
            }
        ]
    }
};
```

**foo.js**

```js
module.exports = function(val, param) {
    return `${val + param}`;
};
```

**template.njk**

```nunjucks
{{ foo_var | foo(3) }}
```

To mark filter as async, filter module should export `async` flag:

**async-filter.js**

```js
module.exports = function(val, param, callback) {
    setTimeout(function() {
        callback(null, val + param);
    }, 1000);
};

module.exports.async = true;
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
[travis-image]:https://travis-ci.org/ogonkov/nunjucks-loader.svg?branch=master
[travis-url]:https://travis-ci.org/ogonkov/nunjucks-loader
[david-image]:https://david-dm.org/ogonkov/nunjucks-loader/status.svg
[david-url]:https://david-dm.org/ogonkov/nunjucks-loader
