/**
 * Provide precompiled templates to the Nunjucks runtime by template name.
 *
 * The supplied template map is retained by reference. Missing templates return
 * null from getSource so another loader can resolve them.
 *
 * @param {Object.<string, Object>} [precompiled={}]
 *     Precompiled template objects indexed by the names used in templates.
 */
export function WebpackPrecompiledLoader(precompiled = {}) {
    this.precompiled = precompiled;
}

/**
 * Look up a precompiled template and return its source descriptor.
 *
 * The descriptor identifies precompiled code, retains the stored template
 * object, and uses the requested template name as its path.
 *
 * @param {string} name
 *     Template name to look up in the precompiled template map.
 * @returns {?Object}
 *     Descriptor containing src.type, src.obj, and path, or null when the
 *     requested name is absent from the template map.
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
