module.exports = function(num, x, y, kwargs) {
    return num + (kwargs && kwargs.bar || 10);
};
