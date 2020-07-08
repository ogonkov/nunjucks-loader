---
title: Assets loading
---

# Assets loading

> Before v2 assets was loaded by replacing compiled template code.
> In v2 of the loader assets is passed to context, so if you importing assets
> in `macro` and then import it in template, you need to update imports to pass
> context to imported template:
>
>     {% from 'some/component-with-static-tag.htm' import component with context  %}

To load static assets (like images, for example), this loader inserts own
`static` tag. It works like `static` from Django, but resolves paths via
Webpack loaders.

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
    src="{% raw %}{% static './image.png' %}{% endraw %}"
    alt=""
/>
```

The code above will replace `{% raw %}{% static './image.png' %}{% endraw %}`
with hash, that `file-loader` returns.

## Dynamic assets

Loader has limited support for dynamic assets. It was tested with expressions
like:

```nunjucks
{% raw %}{% static 'foo/' + bar %}{% endraw %}
```

```nunjucks
{% raw %}{% static 'foo/' + bar + '.ext' %}{% endraw %}
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
> {% static 'foo/bar/dynamic-example-1.md' as example_1 %}
> {% static 'foo/bar/dynamic-example-2.md' as example_2 %}
> {% raw %}{% set examplesMap = {
>     'example-1': example_1,
>     'example-2': example_2
> } %}{% endraw %}
>
> {% raw %}{% for item in [1, 2] %}
>     <p>{{ examplesMap['example-' + item] }}</p>
> {% endfor %}{% endraw %}
> ```
