module.exports = function(num, x, y, kwargs, callback) {
    setTimeout(function() {
        const cb = typeof kwargs === 'function' ? kwargs : callback;
        cb(null, num + (kwargs && kwargs.bar || 10));
    }, 1000);
};

module.exports.async = true;
