/**
 * Convert a module request into a context-relative JavaScript string literal.
 *
 * Webpack contextify resolves the request relative to the loader's context.
 * JSON quoting then escapes the result for insertion into generated code;
 * the returned value includes its surrounding quotation marks.
 *
 * @param {Object} loaderContext
 *     Webpack loader context providing context and utils.contextify.
 * @param {string} request
 *     Module request to express relative to the loader's context.
 * @returns {string}
 *     JSON-quoted request ready to embed as a source-code string literal.
 */
export function stringifyRequest(loaderContext, request) {
    return JSON.stringify(loaderContext.utils.contextify(loaderContext.context, request));
}
