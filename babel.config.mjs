import coreJs from 'core-js/package.json' with {type: 'json'};

import packageJson from './package.json' with {type: 'json'};

const nodeVersion = packageJson.engines.node;

export default function(api) {
    const isESM = api.env('esm');
    const isTest = api.env('test');

    return {
        targets: {node: nodeVersion.split(' || ')[0].replace(/^[^\d]*/, '')},
        presets: [
            ['@babel/preset-env', {modules: isESM ? false : 'commonjs'}]
        ],
        plugins: [
            ['babel-plugin-polyfill-corejs3', {method: 'usage-global', version: coreJs.version}],
            ...(isTest ? ['@babel/plugin-transform-dynamic-import'] : [])
        ]
    };
};
