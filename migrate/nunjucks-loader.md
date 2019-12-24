layout: page
title: Migrating from `nunjucks-loader` to `simple-nunjucks-loader`
permalink: /migrate/nunjucks-loader

# Migrating from `nunjucks-loader` to `simple-nunjucks-loader`

Unsupported features:
* Relative paths to templates (could be released in feature versions, after v1.0.0)

## Module export

Most notable difference from `nunjucks-loader` is using default export instead
of `render` method.

In large codebase it could be difficult to remove `render` method everywhere,
so the one could use `exports-loader`, to make transition more smooth.

```js
module.exports = {
    module: {
        rules: [
            {
                test: /\.njk$/,
                use: [
                    {
                        loader: 'exports-loader',
                        options: {
                            'render': 'exports'
                        }
                    },
                    {
                        loader: 'simple-nunjucks-loader'
                    }
                ]
            }
        ]
    }
};
```

