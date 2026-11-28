const path = require('node:path');

module.exports = () => [false, true].map(esModule => ({
    name: esModule ? 'esm' : 'cjs',
    mode: 'development',
    devtool: false,
    target: 'node',
    context: process.cwd(),
    entry: {single: path.join(__dirname, '../fixtures/single.njk')},
    output: {
        path: path.join(process.cwd(), 'dist', esModule ? 'esm' : 'cjs'),
        filename: '[name].cjs',
        library: {type: 'commonjs2', export: esModule ? 'default' : undefined}
    },
    module: {
        rules: [{
            test: /\.njk$/,
            use: {
                loader: 'simple-nunjucks-loader',
                options: {esModule}
            }
        }]
    }
}));
