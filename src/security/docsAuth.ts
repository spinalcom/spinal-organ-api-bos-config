/*
 * Copyright 2026 SpinalCom - www.spinalcom.com
 *
 * This file is part of SpinalCore.
 *
 * Please read all of the following terms and conditions
 * of the Free Software license Agreement ("Agreement")
 * carefully.
 *
 * This Agreement is a legally binding contract between
 * the Licensee (as defined below) and SpinalCom that
 * sets forth the terms and conditions that govern your
 * use of the Program. By installing and/or using the
 * Program, you agree to abide by all the terms and
 * conditions stated or referenced herein.
 *
 * If you do not agree to abide by these terms and
 * conditions, do not demonstrate your acceptance and do
 * not install or use the Program.
 * You should have received a copy of the license along
 * with this file. If not, see
 * <http://resources.spinalcom.com/licenses.pdf>.
 */

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

export const DOCS_COOKIE_NAME = "bos_docs_token";
export const DOCS_LOGIN_PATH = "/docs/login";
export const DOCS_LOGOUT_PATH = "/docs/logout";
export const DOCS_DEFAULT_PAGE = "/spinalcom-api-docs";

/** documentation of the API : any valid login */
export const USER_DOCS_ROUTES = ["/spinalcom-api-docs", "/spinalcom-api-redoc-docs", "/swagger-spec", "/docs/swagger.json"];

/**
 * documentation of the admin routes : admin only.
 * /swagger/swagger.json is the same file, reachable through the static folder
 * when PATH_DIR_STATIC_HTML is not set.
 */
export const ADMIN_DOCS_ROUTES = ["/admin_docs", "/admin/swagger.json", "/swagger/swagger.json"];

/**
 * the Swagger UI pages : the token of the login is given to their "Authorize",
 * so that the routes can be tried without typing it again
 */
export const SWAGGER_UI_ROUTES = ["/spinalcom-api-docs", "/admin_docs"];

const DEFAULT_SESSION_MS = 60 * 60 * 1000;

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
export function useDocsAuth(app: express.Express, deps: IDocsAuthDeps): void {
	const formParser = express.urlencoded({ extended: false });

	app.get(DOCS_LOGIN_PATH, (req, res) => {
		const reason = req.query.reason === "admin" ? "This page needs an administrator account." : "";
		sendLoginPage(res, 200, safeNext(req.query.next), reason);
	});

	app.post(DOCS_LOGIN_PATH, formParser, async (req, res) => {
		const next = safeNext(req.body?.next);
		const userName = typeof req.body?.userName === "string" ? req.body.userName : "";
		const password = typeof req.body?.password === "string" ? req.body.password : "";

		let login: IDocsLogin | null = null;
		try {
			if (userName && password) login = await deps.login(userName, password);
		} catch (error) {
			console.error("[docs auth] login failed :", error?.message ?? error);
		}
		if (!login?.token) return sendLoginPage(res, 401, next, "Wrong username or password.");

		const remainingMs = login.expiresAt ? login.expiresAt * 1000 - Date.now() : DEFAULT_SESSION_MS;
		res.cookie(DOCS_COOKIE_NAME, login.token, {
			httpOnly: true,
			sameSite: "lax",
			secure: req.secure,
			path: "/",
			maxAge: remainingMs > 0 ? remainingMs : DEFAULT_SESSION_MS,
		});
		res.redirect(next);
	});

	app.get(DOCS_LOGOUT_PATH, (req, res) => {
		res.clearCookie(DOCS_COOKIE_NAME, { path: "/" });
		res.redirect(DOCS_LOGIN_PATH);
	});

	// app.use matches the prefixes the way express matches the routes they
	// protect (case, trailing slash, sub paths)
	for (const route of USER_DOCS_ROUTES) app.use(route, docsGuard(deps, false, SWAGGER_UI_ROUTES.includes(route)));
	for (const route of ADMIN_DOCS_ROUTES) app.use(route, docsGuard(deps, true, SWAGGER_UI_ROUTES.includes(route)));
}

function docsGuard(deps: IDocsAuthDeps, adminOnly: boolean, isSwaggerUi: boolean): express.RequestHandler {
	return async (req, res, next) => {
		let profileId: string | null = null;
		let token: string | undefined;
		try {
			token = readToken(req);
			if (token) profileId = await deps.getProfileId(token);
		} catch (error) {
			profileId = null;
		}

		if (!profileId) return deny(req, res, 401);

		let isAdmin = false;
		try {
			isAdmin = deps.isAdminProfile(profileId);
		} catch (error) {
			isAdmin = false;
		}
		if (adminOnly && !isAdmin) return deny(req, res, 403);

		res.setHeader("Cache-Control", "private, no-cache");
		if (isSwaggerUi && req.method === "GET") authorizeSwaggerUi(res, token);
		next();
	};
}

/**
 * Adds a script to the Swagger UI page, that fills its "Authorize" with the
 * token of the login. The page is built by swagger-ui-express (for
 * /spinalcom-api-docs, the one of spinal-organ-api-server), which sends it
 * with res.send : the script is added there, to the html page only.
 */
function authorizeSwaggerUi(res: express.Response, token: string): void {
	const send = res.send;
	res.send = function (body?: any) {
		res.send = send;
		const contentType = String(res.getHeader("Content-Type") ?? "text/html");
		if (typeof body === "string" && contentType.includes("html") && body.includes("</body>")) {
			// the page now holds the token : it must not be kept by the browser
			res.setHeader("Cache-Control", "no-store");
			body = body.replace("</body>", () => `${swaggerAuthorizeScript(token)}\n</body>`);
		}
		return send.call(res, body);
	};
}

function swaggerAuthorizeScript(token: string): string {
	// "<" is escaped so that the token can't close the script tag
	const value = JSON.stringify(token).replace(/</g, "\\u003c");
	// the security schemes are only known once Swagger UI has read the spec
	return `<script>
(function () {
	var token = ${value};
	var tries = 0;
	var timer = setInterval(function () {
		tries += 1;
		try {
			var ui = window.ui;
			var schemes = ui && ui.specSelectors.specJson().getIn(["components", "securitySchemes"]);
			if (schemes && schemes.size) {
				clearInterval(timer);
				schemes.forEach(function (scheme, name) {
					var isBearer = scheme.get("type") === "http" && String(scheme.get("scheme")).toLowerCase() === "bearer";
					if (isBearer) ui.preauthorizeApiKey(name, token);
				});
				return;
			}
		} catch (error) {}
		if (tries > 100) clearInterval(timer);
	}, 100);
})();
</script>`;
}

function deny(req: express.Request, res: express.Response, status: 401 | 403) {
	const isPage = req.method === "GET" && String(req.headers.accept ?? "").includes("text/html");
	if (!isPage) {
		return res.status(status).json({ message: status === 401 ? "Authentication required" : "Administrator account required" });
	}
	const query = new URLSearchParams({ next: req.originalUrl });
	if (status === 403) query.set("reason", "admin");
	res.redirect(`${DOCS_LOGIN_PATH}?${query.toString()}`);
}

function readToken(req: express.Request): string | undefined {
	const fromCookie = readCookie(req, DOCS_COOKIE_NAME);
	if (fromCookie) return fromCookie;

	const header = req.headers.authorization;
	if (header) {
		const [, token] = header.split(" ");
		if (token) return token;
	}
	const accessToken = req.headers["x-access-token"];
	return typeof accessToken === "string" ? accessToken : undefined;
}

function readCookie(req: express.Request, name: string): string | undefined {
	for (const part of String(req.headers.cookie ?? "").split(";")) {
		const index = part.indexOf("=");
		if (index === -1 || part.slice(0, index).trim() !== name) continue;
		try {
			return decodeURIComponent(part.slice(index + 1).trim());
		} catch (error) {
			return undefined;
		}
	}
	return undefined;
}

/**
 * Where to go after the login : only a path of this server, so that the login
 * page can't be used to redirect to another site.
 */
export function safeNext(value: unknown): string {
	if (typeof value !== "string") return DOCS_DEFAULT_PAGE;
	if (!/^\/[\x21-\x7e]*$/.test(value)) return DOCS_DEFAULT_PAGE;
	if (value.startsWith("//") || value.includes("\\")) return DOCS_DEFAULT_PAGE;
	return value;
}

function escapeHtml(value: string): string {
	return value.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);
}

function sendLoginPage(res: express.Response, status: number, next: string, message: string) {
	res.status(status).setHeader("Cache-Control", "no-store");
	res.type("html").send(`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>API documentation - Sign in</title>
<style>
	body { margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #f2f3f5; font-family: sans-serif; color: #222; }
	form { width: 100%; max-width: 340px; margin: 16px; padding: 28px; background: #fff; border-radius: 8px; box-shadow: 0 2px 12px rgba(0, 0, 0, 0.12); }
	img { display: block; max-width: 180px; margin: 0 auto 20px; }
	h1 { margin: 0 0 20px; font-size: 18px; text-align: center; }
	label { display: block; margin-bottom: 14px; font-size: 13px; }
	input { display: block; width: 100%; box-sizing: border-box; margin-top: 6px; padding: 9px; border: 1px solid #c4c7cc; border-radius: 4px; font-size: 14px; }
	button { width: 100%; padding: 10px; border: 0; border-radius: 4px; background: #14202c; color: #fff; font-size: 14px; cursor: pointer; }
	.message { margin: 0 0 16px; padding: 9px; border-radius: 4px; background: #fdecea; color: #a12622; font-size: 13px; }
</style>
</head>
<body>
<form method="post" action="${DOCS_LOGIN_PATH}">
	<img src="/admin/logo" alt="SpinalCom">
	<h1>API documentation</h1>
	${message ? `<p class="message">${escapeHtml(message)}</p>` : ""}
	<input type="hidden" name="next" value="${escapeHtml(next)}">
	<label>Username<input name="userName" autocomplete="username" required autofocus></label>
	<label>Password<input name="password" type="password" autocomplete="current-password" required></label>
	<button type="submit">Sign in</button>
</form>
</body>
</html>`);
}
