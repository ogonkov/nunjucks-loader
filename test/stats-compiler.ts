import {randomUUID} from 'crypto';
import path from 'path';

import webpack, {type Stats} from 'webpack';


export function statsCompiler(fixture: string, options: Record<string, unknown> = {}) {
    const bundleName = randomUUID();

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
            assetModuleFilename: 'bundles/[path][name][ext]'
        },
        module: {
            rules: [{
                test: /\.njk$/,
                use: {
                    loader: path.resolve(__dirname, '../src/index.js'),
                    options: options
                }
            }, {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            }, {
                test: /\.(css|txt|md)$/,
                type: 'asset/resource'
            }]
        },
        resolve: {
            extensions: ['.ts', '...']
        }
    });

    return new Promise<{bundleName: string; stats: Stats}>(function(resolve, reject) {
        compiler.run(function(error, stats) {
            if (error) {
                return reject(error);
            }

            if (!stats) {
                return reject(new Error('Webpack did not return compilation stats'));
            }

            resolve({
                bundleName,
                stats
            });
        });
    });
}
