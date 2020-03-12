const {getModule} = require('./utils/get-module');

module.exports = function(filePath, ...args) {
    var importedSymbol = getModule(filePath);

    if (typeof importedSymbol === 'function') {
        return getModule(importedSymbol(...args));
    }

    return importedSymbol;
};
