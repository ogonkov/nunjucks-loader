const HTMLWebpackPlugin = require('html-webpack-plugin');

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
            }
        ]
    },

    plugins: [
        new HTMLWebpackPlugin({
            template: 'django_project/example_app_a/templates/app.njk',
            templateParameters: {
                APP_NAME: 'Isomorphic example app'
            }
        })
    ]
};
