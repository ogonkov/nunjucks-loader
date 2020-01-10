function getModuleValue(importedModule) {
    return importedModule && importedModule.default || importedModule;
}

module.exports = function(filePath, ...args) {
    var importedSymbol = getModuleValue(filePath);

    if (typeof importedSymbol === 'function') {
        return getModuleValue(importedSymbol(...args));
    }

    return importedSymbol;
};
