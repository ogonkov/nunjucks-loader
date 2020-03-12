import nunjucks from 'nunjucks';

/**
 * @param {string}          source
 * @param {function[]}      extensions
 * @param {NunjucksOptions} options
 *
 * @returns {nunjucks.nodes.Root}
 */
export function getNodes(source, extensions, options) {
    return nunjucks.parser.parse(
        source,
        extensions,
        options
    );
}
