export function stringifyRequest(loaderContext, request) {
    return JSON.stringify(loaderContext.utils.contextify(loaderContext.context, request));
}
