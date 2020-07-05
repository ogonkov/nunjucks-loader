import path from 'path';
import webpack from 'webpack';
import uuidv4 from 'uuid/v4';

export default (fixture, options = {}) => {
    const bundleName = uuidv4();

    const compiler = webpack({
        mode: 'development',
        devtool: false,
        target: 'node',
        context: __dirname,
        entry: `./${fixture}`,
        output: {
            libraryTarget: 'commonjs2',
            path: path.join(__dirname, 'bundles'),
            filename: `${bundleName}.js`,
        },
        module: {
            rules: [{
                test: /\.njk$/,
                use: {
                    loader: path.resolve(__dirname, '../src/loader.js'),
                    options: options
                }
            }, {
                test: /\.(css|txt|md)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        outputPath: 'bundles',
                        name: '[path][name].[ext]'
                    }
                }
            }]
        }
    });

    return new Promise((resolve, reject) => {
        compiler.run((err, stats) => {
            if (err) {
                return reject(err);
            }

            if (stats.hasErrors()) {
                reject(new Error(stats.toJson().errors));
            }

            import(`./bundles/${bundleName}.js`).then(function(module) {
                resolve(module.default || module);
            });
        });
    });
}
