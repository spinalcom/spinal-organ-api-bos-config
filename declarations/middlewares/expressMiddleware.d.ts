import * as express from "express";
import { ValidateError } from "tsoa";
export declare function useHubProxy(app: express.Express): void;
export declare function useClientMiddleWare(app: express.Express): void;
/**
 * Puts a login in front of the documentation pages and of the swagger files
 * they are built from : any valid login for the API documentation, the admin
 * only for the documentation of the admin routes.
 *
 * Call this before the documentation routes are registered (initSwagger,
 * the static folder and runServerRest of spinal-organ-api-server).
 */
export declare function useDocsAuthentication(app: express.Express): void;
export declare function initSwagger(app: express.Express): void;
/**
 * Inject selected admin routes (from the local tsoa `swagger.json`) into the
 * `spinal-organ-api-server` OpenAPI document served at `/spinalcom-api-docs`.
 * Display the injected routes' tags before the existing API sections.
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
export declare function authenticateMiddleware(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void | express.Response<any, Record<string, any>>>;
export declare function authenticateRequest(app: express.Application): void;
