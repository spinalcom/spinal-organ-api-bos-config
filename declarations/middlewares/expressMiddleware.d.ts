import * as express from "express";
import { ValidateError } from "tsoa";
export declare function useHubProxy(app: express.Express): void;
export declare function useClientMiddleWare(app: express.Express): void;
export declare function initSwagger(app: express.Express): void;
/**
 * Inject selected admin routes (from the local tsoa `swagger.json`) into the
 * `spinal-organ-api-server` OpenAPI document served at `/spinalcom-api-docs`.
 *
 * Call this once, after `runServerRest()`.
 *
 */
export declare function injectAdminRoutesIntoApiDocs(routeKeys?: string[]): void;
export declare function useApiMiddleWare(app: express.Express): void;
export declare function errorHandler(err: unknown, req: express.Request, res: express.Response, next: express.NextFunction): express.Response | void;
export declare function _formatValidationError(err: ValidateError): {
    message: string;
    details: import("tsoa").FieldErrors;
};
export declare function authenticateRequest(app: express.Application): void;
