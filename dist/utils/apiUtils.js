"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._formatRoute = exports._readBuffer = exports._getScope = exports._getTags = exports._getMethod = exports._formatSwaggerFile = void 0;
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
exports._formatSwaggerFile = _formatSwaggerFile;
function _getMethod(path) {
    const keys = Object.keys(path);
    return keys;
}
exports._getMethod = _getMethod;
function _getTags(item) {
    return (item.tags && item.tags[0]) || "";
}
exports._getTags = _getTags;
function _getScope(item) {
    return (item.security && item.security[0] && item.security[0].OauthSecurity && item.security[0].OauthSecurity[0]) || "";
}
exports._getScope = _getScope;
function _readBuffer(buffer) {
    return JSON.parse(buffer.toString());
}
exports._readBuffer = _readBuffer;
function _formatRoute(route) {
    if (route.includes("?"))
        route = route.substring(0, route.indexOf("?"));
    const routeFormatted = route.replace(/\{(.*?)\}/g, (el) => "([^,/]+)");
    return new RegExp(`^${routeFormatted}$`);
}
exports._formatRoute = _formatRoute;
//# sourceMappingURL=apiUtils.js.map