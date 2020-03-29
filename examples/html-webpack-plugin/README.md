---
title: Using with `html-webpack-plugin`
---

# Using with `html-webpack-plugin`

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

[html-webpack-plugin-options]:https://github.com/jantimon/html-webpack-plugin/#options

## Multiple HTML files generation

To render multiple files from project, you should add multiple instances of
`html-webpack-plugin`. Next example use `glob` package to traverse all `.njk`
files (except the one that starts from `_`), and create plugin instance for it.
You can use any other way to traverse directories.

**webpack.config.js**

```js
const glob = require('glob');
const HTMLWebpackPlugin = require('html-webpack-plugin');

function getTemplates() {
  return new Promise(function(resolve, reject) {
    glob('**/!(_*).njk', function(error, files) {
      if (error) {
        return reject(error);
      }

      resolve(files);
    });
  });
}

function toPlugin(fileName) {
  return new HTMLWebpackPlugin({
    template: fileName,
    filename: fileName.replace(/\.njk$/, '.html')
  });
}

module.exports = function() {
  const templates = getTemplates().then((files) => files.map(toPlugin));

  return templates.then(function(templates) {
    return {
      // ... all other config with loaders and etc
      plugins: [
        ...templates
      ]
    }
  });
};
```
