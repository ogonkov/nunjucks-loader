const path = require('path');

const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    module: {
        rules: [
            {
                test: /\.njk$/,
                use: [
                    {
                        loader: 'simple-nunjucks-loader',
                        options: {
                            jinjaCompat: true,
                            searchPaths: [
                                'src',
                                'django_project/example_app_a/templates'
                            ],
                            filters: {
                                values: path.resolve('src/nunjucks_filters/values.js')
                            }
                        }
                    }
                ]
            },

            {
                test: /\.css$/,
                oneOf: [
                    // We have to split CSS rule because of the bug in
                    // `mini-css-extract-plugin`, see
                    // https://github.com/webpack-contrib/mini-css-extract-plugin/issues/489
                    {
                        issuer: /\.njk$/,
                        use: [
                            {
                                loader: 'css-loader',
                                options: {
                                    onlyLocals: true,
                                    modules: true
                                }
                            }
                        ]
                    },
                    {
                        issuer: /\.js$/,
                        use: [
                            {
                                loader: MiniCssExtractPlugin.loader
                            },
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
        ]
    },

    plugins: [
        new HTMLWebpackPlugin({
            template: 'django_project/example_app_a/templates/app.njk',
            templateParameters: {
                APP_NAME: 'Isomorphic example app'
            }
        }),
        new MiniCssExtractPlugin(),
    ]
};
