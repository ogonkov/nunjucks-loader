module.exports = function(api) {
    const isESM = api.env('esm');

    return {
        presets: [
            ['@babel/preset-env', {
                targets: {
                    node: isESM ? '13.2.0' : '8.9.0'
                }
            }]
        ]
    }
};
