const assert = require('node:assert/strict');
const {readFileSync, writeFileSync} = require('node:fs');
const path = require('node:path');

const webpack = require('webpack');

async function main() {
    writeFileSync(path.join(__dirname, 'template.njk'), "Hello {{ name }}! {% set file = 'asset' %}{% static file + '.txt' %}");
    writeFileSync(path.join(__dirname, 'asset.txt'), 'packaged asset');

    for (const esModule of [false, true]) {
        const outputPath = path.join(__dirname, `output-${esModule}`);
        const stats = await new Promise((resolve, reject) => {
            webpack({
                mode: 'development',
                devtool: false,
                target: 'node',
                context: __dirname,
                entry: './template.njk',
                output: {
                    path: outputPath,
                    filename: 'bundle.cjs',
                    libraryTarget: 'commonjs2',
                    publicPath: '/',
                    assetModuleFilename: 'assets/[name][ext]'
                },
                module: {
                    rules: [{
                        test: /\.njk$/,
                        use: {
                            loader: require.resolve('simple-nunjucks-loader'),
                            options: {esModule, assetsPaths: [__dirname]}
                        }
                    }, {test: /\.txt$/, type: 'asset/resource'}]
                }
            }, (error, stats) => error ? reject(error) : resolve(stats));
        });
        assert.equal(stats.hasErrors(), false, stats.toString({all: false, errors: true}));
        const bundle = require(path.join(outputPath, 'bundle.cjs'));
        const render = bundle.default || bundle;
        assert.equal(await render({name: 'Ada'}), 'Hello Ada! /assets/asset.txt');
        assert.equal(readFileSync(path.join(outputPath, 'assets/asset.txt'), 'utf8'), 'packaged asset');
        console.log(`Packed consumer passed (esModule=${esModule})`);
    }
}

main().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
