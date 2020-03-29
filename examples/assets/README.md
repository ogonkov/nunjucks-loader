---
title: Assets loading
---

# Assets loading

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
/>
```

The code above will replace `{{ static('./image.png') }}` with hash, that
`file-loader` returns.

## Dynamic assets

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
