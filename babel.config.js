const nodeVersion = require('./package.json').engines.node;

module.exports = function(api) {
    const isESM = api.env('esm');

    return {
        presets: [
            ['@babel/preset-env', {
                modules: isESM ? false : 'auto',
                targets: {
                    node: isESM ? '13.2.0' : nodeVersion.replace(/>=\s+/, '')
                }
            }]
        ]
    }
};
