const {rmSync} = require('node:fs');
const path = require('node:path');

module.exports = function() {
    rmSync(path.join(__dirname, 'bundles'), {recursive: true, force: true});
};
