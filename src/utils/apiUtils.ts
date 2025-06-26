import { IApiRoute, ISwaggerFile, ISwaggerPath, ISwaggerPathData } from "../interfaces";

export function _formatSwaggerFile(swaggerFile: ISwaggerFile): Promise<IApiRoute[]> {
    try {
        const paths = swaggerFile.paths || [];
        const data: any = [];

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
    } catch (error) {
        throw new Error("Invalid swagger file");
    }
}

export function _getMethod(path: ISwaggerPath): string[] {
    const keys = Object.keys(path);
    return keys;
}

export function _getTags(item: ISwaggerPathData): string {
    return (item.tags && item.tags[0]) || "";
}

export function _getScope(item: ISwaggerPathData): string {
    return (item.security && item.security[0] && item.security[0].OauthSecurity && item.security[0].OauthSecurity[0]) || "";
}

export function _readBuffer(buffer: Buffer): Promise<ISwaggerFile> {
    return JSON.parse(buffer.toString());
}

export function _formatRoute(route: string): RegExp {
    if (route.includes("?")) route = route.substring(0, route.indexOf("?"));

    const routeFormatted = route.replace(/\{(.*?)\}/g, (el) => "([^,/]+)");
    return new RegExp(`^${routeFormatted}$`);
}