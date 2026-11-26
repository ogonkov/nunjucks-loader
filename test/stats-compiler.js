import path from 'path';

import {createFsFromVolume, Volume} from 'memfs';
import webpack from 'webpack';


export function statsCompiler(fixture, options = {}) {
    const outputFileSystem = createFsFromVolume(new Volume());
    const bundlePath = path.join(__dirname, 'bundles/bundle.js');

    return new Promise(function(resolve, reject) {
        webpack({
            plugins: [compiler => { compiler.outputFileSystem = outputFileSystem; }],
            mode: 'development',
            devtool: false,
            target: 'node',
            context: __dirname,
            entry: `./${fixture}`,
            output: {
                libraryTarget: 'commonjs2',
                path: path.join(__dirname, 'bundles'),
                filename: path.basename(bundlePath),
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
                    test: /\.(css|txt|md)$/,
                    type: 'asset/resource'
                }]
            }
        }, function(error, stats) {
            if (error) {
                return reject(error);
            }

            resolve({
                outputFileSystem,
                bundlePath,
                stats
            });
        });
    });
}
