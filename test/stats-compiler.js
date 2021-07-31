import path from 'path';

import {v4 as uuidv4} from 'uuid';
import webpack from 'webpack';


export function statsCompiler(fixture, options = {}) {
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
                    loader: path.resolve(__dirname, '../src/index.js'),
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

    return new Promise(function(resolve, reject) {
        compiler.run(function(error, stats) {
            if (error) {
                return reject(error);
            }

            resolve({
                bundleName,
                stats
            });
        });
    });
}
