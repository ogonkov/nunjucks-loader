/**
 * Provide precompiled templates to the Nunjucks runtime by template name.
 * Missing templates return null so another loader can resolve them.
 *
 * @param {Object.<string, Object>} [precompiled={}] Precompiled templates indexed by template name.
 */
export function WebpackPrecompiledLoader(precompiled = {}) {
    this.precompiled = precompiled;
}

/**
 * Look up a precompiled template and return its source descriptor.
 *
 * @param {string} name Template name to look up.
 * @returns {?Object} Precompiled code and its path, or null when unavailable.
 */
WebpackPrecompiledLoader.prototype.getSource = function getSource(name) {
    if (!(name in this.precompiled)) {
        return null;
    }

    return {
        src: {
            type: 'code',
            obj: this.precompiled[name]
        },
        path: name
    };
};
