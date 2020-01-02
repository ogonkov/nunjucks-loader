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
                            ]
                        }
                    }
                ]
            },

            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            onlyLocals: true,
                            modules: true
                        }
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
