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
