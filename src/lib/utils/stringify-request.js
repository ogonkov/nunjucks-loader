/**
 * Convert a module request into a context-relative JavaScript string literal.
 *
 * @param {Object} loaderContext Webpack loader context providing contextify.
 * @param {string} request Module request to resolve relative to the context.
 * @returns {string} JSON-quoted request suitable for generated source code.
 */
export function stringifyRequest(loaderContext, request) {
    return JSON.stringify(loaderContext.utils.contextify(loaderContext.context, request));
}
