"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._formatSwaggerFile = _formatSwaggerFile;
exports._getMethod = _getMethod;
exports._getTags = _getTags;
exports._getScope = _getScope;
exports._readBuffer = _readBuffer;
exports._formatRoute = _formatRoute;
function _formatSwaggerFile(swaggerFile) {
    try {
        const paths = swaggerFile.paths || [];
        const data = [];
        for (const key in paths) {
            if (Object.prototype.hasOwnProperty.call(paths, key)) {
                const methods = _getMethod(paths[key]);
                let items = methods.map((method) => {
                    return {
                        route: key,
                        method: method && method.toUpperCase(),
                        tag: _getTags(paths[key][method]),
                        scope: _getScope(paths[key][method]),
                    };
                });
                data.push(...items);
            }
        }
        return data;
    }
    catch (error) {
        throw new Error("Invalid swagger file");
    }
}
function _getMethod(path) {
    const keys = Object.keys(path);
    return keys;
}
function _getTags(item) {
    return (item.tags && item.tags[0]) || "";
}
function _getScope(item) {
    return (item.security && item.security[0] && item.security[0].OauthSecurity && item.security[0].OauthSecurity[0]) || "";
}
function _readBuffer(buffer) {
    return JSON.parse(buffer.toString());
}
function _formatRoute(route) {
    if (route.includes("?"))
        route = route.substring(0, route.indexOf("?"));
    const routeFormatted = route.replace(/\{(.*?)\}/g, (el) => "([^,/]+)");
    return new RegExp(`^${routeFormatted}$`);
}
//# sourceMappingURL=apiUtils.js.map