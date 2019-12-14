module.exports = function(filePath) {
    return filePath && filePath.default || filePath;
};
