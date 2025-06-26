/// <reference types="node" />
import { IApiRoute, ISwaggerFile, ISwaggerPath, ISwaggerPathData } from "../interfaces";
export declare function _formatSwaggerFile(swaggerFile: ISwaggerFile): Promise<IApiRoute[]>;
export declare function _getMethod(path: ISwaggerPath): string[];
export declare function _getTags(item: ISwaggerPathData): string;
export declare function _getScope(item: ISwaggerPathData): string;
export declare function _readBuffer(buffer: Buffer): Promise<ISwaggerFile>;
export declare function _formatRoute(route: string): RegExp;
