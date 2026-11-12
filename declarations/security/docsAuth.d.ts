import * as express from "express";
/**
 * Login in front of the API documentation.
 *
 * A browser can't send an Authorization header when it opens a page, so the
 * token obtained at login is kept in an HttpOnly cookie. The cookie is only
 * read here : it does not authenticate the API routes, which still need
 * their Bearer token.
 *
 * This file has no dependency on the services (they are given through
 * IDocsAuthDeps), so that it can be tested without a hub.
 */
export declare const DOCS_COOKIE_NAME = "bos_docs_token";
export declare const DOCS_LOGIN_PATH = "/docs/login";
export declare const DOCS_LOGOUT_PATH = "/docs/logout";
export declare const DOCS_DEFAULT_PAGE = "/spinalcom-api-docs";
/** documentation of the API : any valid login */
export declare const USER_DOCS_ROUTES: string[];
/**
 * documentation of the admin routes : admin only.
 * /swagger/swagger.json is the same file, reachable through the static folder
 * when PATH_DIR_STATIC_HTML is not set.
 */
export declare const ADMIN_DOCS_ROUTES: string[];
/**
 * the Swagger UI pages : the token of the login is given to their "Authorize",
 * so that the routes can be tried without typing it again
 */
export declare const SWAGGER_UI_ROUTES: string[];
export interface IDocsLogin {
    token: string;
    /** expiration of the token, in seconds since epoch */
    expiresAt?: number;
}
export interface IDocsAuthDeps {
    /** the token of the user, null when the credentials are refused */
    login(userName: string, password: string): Promise<IDocsLogin | null>;
    /** the profile id behind a token, null when the token is not valid */
    getProfileId(token: string): Promise<string | null>;
    isAdminProfile(profileId: string): boolean;
}
/**
 * Must be called before the documentation routes are registered.
 */
export declare function useDocsAuth(app: express.Express, deps: IDocsAuthDeps): void;
/**
 * Where to go after the login : only a path of this server, so that the login
 * page can't be used to redirect to another site.
 */
export declare function safeNext(value: unknown): string;
