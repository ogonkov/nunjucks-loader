---
layout: default
title: Migrating from `nunjucks-loader` to `simple-nunjucks-loader`
---

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

## Extensions, filters, globals

To set any custom addon for nunjucks you should move it to separate module,
instead of passing it in `config` callback. See readme for more options.

**before**

```js
// file: src/nunjucks.config.js
module.exports = function(env){
    
    env.addFilter('asyncFoo', , true);
    
    // env.addExtension(...) etc
};
 
// file: webpack.config.js
module.exports = {
 
    entry: './src/entry.js',
 
    output: {
        path: __dirname,
        filename: 'bundle.js'
    },
 
    module: {
        loaders: [
            {
                test: /\.(njk|nunjucks)$/,
                loader: 'nunjucks-loader',
                query: {
                    config: __dirname + '/src/nunjucks.config.js'
                }
            }
        ]
    }
};
``` 

**after**

```js
// async-foo.js
module.exports = function(input, done){
    setTimeout(function(){
        done('[asyncFoo] ' + input);
    }, 1000)
};
module.exports.async = true;

// webpack.config.js
module.exports = {
    module: {
        rules: [
            {
                test: /\.njk$/,
                use: [
                    {
                        loader: 'simple-nunjucks-loader',
                        options: {
                            filters: {
                                asyncFoo: path.join(__dirname, 'async-foo.js')
                            }
                        }
                    }
                ]
            }
        ]
    }
};
```

## Multiple template source folders

The easy one, just rename `root` to [`searchPaths`](https://www.npmjs.com/package/simple-nunjucks-loader#searchpaths).
