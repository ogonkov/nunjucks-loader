const path = require('path');
const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    devtool: false,
    module: {
        rules: [
            {
                test: /\.njk$/,
                use: [
                    {
                        loader: 'simple-nunjucks-loader',
                        options: {
                            extensions: {
                                markdown: path.resolve('./src/nunjuck_extensions/markdown.js')
                            }
                        }
                    }
                ]
            },

            {
                test: /\.md$/,
                oneOf: [
                    {
                        issuer: /\.njk$/,
                        use: 'raw-loader'
                    }
                ]
            }
        ]
    },

    plugins: [
        new webpack.NormalModuleReplacementPlugin(
            /browser\/nunjucks\.js$/,
            (resource) => {
                // We have to replace `browser/nunjucks.js` to `browser/nunjucks-slim.js`
                // because different modules cause false escaping of markdown output.
                // Nunjucks check node via `instanceof`, but node in `nunjucks-markdown`
                // comes from
                const markdownModule = path.dirname(require.resolve('nunjucks-markdown/package.json'));

                if (resource.context.startsWith(markdownModule)) {
                    const nunjucksSlim = require.resolve('nunjucks/browser/nunjucks-slim.js');

                    resource.request = nunjucksSlim;
                }
            }
        ),
        new HTMLWebpackPlugin({
            template: 'src/templates/index.njk'
        })
    ]
};
