"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SWAGGER_UI_ROUTES = exports.ADMIN_DOCS_ROUTES = exports.USER_DOCS_ROUTES = exports.DOCS_DEFAULT_PAGE = exports.DOCS_LOGOUT_PATH = exports.DOCS_LOGIN_PATH = exports.DOCS_COOKIE_NAME = void 0;
exports.useDocsAuth = useDocsAuth;
exports.safeNext = safeNext;
const express = require("express");
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
exports.DOCS_COOKIE_NAME = "bos_docs_token";
exports.DOCS_LOGIN_PATH = "/docs/login";
exports.DOCS_LOGOUT_PATH = "/docs/logout";
exports.DOCS_DEFAULT_PAGE = "/spinalcom-api-docs";
/** documentation of the API : any valid login */
exports.USER_DOCS_ROUTES = ["/spinalcom-api-docs", "/spinalcom-api-redoc-docs", "/swagger-spec", "/docs/swagger.json"];
/**
 * documentation of the admin routes : admin only.
 * /swagger/swagger.json is the same file, reachable through the static folder
 * when PATH_DIR_STATIC_HTML is not set.
 */
exports.ADMIN_DOCS_ROUTES = ["/admin_docs", "/admin/swagger.json", "/swagger/swagger.json"];
/**
 * the Swagger UI pages : the token of the login is given to their "Authorize",
 * so that the routes can be tried without typing it again
 */
exports.SWAGGER_UI_ROUTES = ["/spinalcom-api-docs", "/admin_docs"];
const DEFAULT_SESSION_MS = 60 * 60 * 1000;
/**
 * Must be called before the documentation routes are registered.
 */
function useDocsAuth(app, deps) {
    const formParser = express.urlencoded({ extended: false });
    app.get(exports.DOCS_LOGIN_PATH, (req, res) => {
        const reason = req.query.reason === "admin" ? "This page needs an administrator account." : "";
        sendLoginPage(res, 200, safeNext(req.query.next), reason);
    });
    app.post(exports.DOCS_LOGIN_PATH, formParser, async (req, res) => {
        const next = safeNext(req.body?.next);
        const userName = typeof req.body?.userName === "string" ? req.body.userName : "";
        const password = typeof req.body?.password === "string" ? req.body.password : "";
        let login = null;
        try {
            if (userName && password)
                login = await deps.login(userName, password);
        }
        catch (error) {
            console.error("[docs auth] login failed :", error?.message ?? error);
        }
        if (!login?.token)
            return sendLoginPage(res, 401, next, "Wrong username or password.");
        const remainingMs = login.expiresAt ? login.expiresAt * 1000 - Date.now() : DEFAULT_SESSION_MS;
        res.cookie(exports.DOCS_COOKIE_NAME, login.token, {
            httpOnly: true,
            sameSite: "lax",
            secure: req.secure,
            path: "/",
            maxAge: remainingMs > 0 ? remainingMs : DEFAULT_SESSION_MS,
        });
        res.redirect(next);
    });
    app.get(exports.DOCS_LOGOUT_PATH, (req, res) => {
        res.clearCookie(exports.DOCS_COOKIE_NAME, { path: "/" });
        res.redirect(exports.DOCS_LOGIN_PATH);
    });
    // app.use matches the prefixes the way express matches the routes they
    // protect (case, trailing slash, sub paths)
    for (const route of exports.USER_DOCS_ROUTES)
        app.use(route, docsGuard(deps, false, exports.SWAGGER_UI_ROUTES.includes(route)));
    for (const route of exports.ADMIN_DOCS_ROUTES)
        app.use(route, docsGuard(deps, true, exports.SWAGGER_UI_ROUTES.includes(route)));
}
function docsGuard(deps, adminOnly, isSwaggerUi) {
    return async (req, res, next) => {
        let profileId = null;
        let token;
        try {
            token = readToken(req);
            if (token)
                profileId = await deps.getProfileId(token);
        }
        catch (error) {
            profileId = null;
        }
        if (!profileId)
            return deny(req, res, 401);
        let isAdmin = false;
        try {
            isAdmin = deps.isAdminProfile(profileId);
        }
        catch (error) {
            isAdmin = false;
        }
        if (adminOnly && !isAdmin)
            return deny(req, res, 403);
        res.setHeader("Cache-Control", "private, no-cache");
        if (isSwaggerUi && req.method === "GET")
            authorizeSwaggerUi(res, token);
        next();
    };
}
/**
 * Adds a script to the Swagger UI page, that fills its "Authorize" with the
 * token of the login. The page is built by swagger-ui-express (for
 * /spinalcom-api-docs, the one of spinal-organ-api-server), which sends it
 * with res.send : the script is added there, to the html page only.
 */
function authorizeSwaggerUi(res, token) {
    const send = res.send;
    res.send = function (body) {
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
function swaggerAuthorizeScript(token) {
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
function deny(req, res, status) {
    const isPage = req.method === "GET" && String(req.headers.accept ?? "").includes("text/html");
    if (!isPage) {
        return res.status(status).json({ message: status === 401 ? "Authentication required" : "Administrator account required" });
    }
    const query = new URLSearchParams({ next: req.originalUrl });
    if (status === 403)
        query.set("reason", "admin");
    res.redirect(`${exports.DOCS_LOGIN_PATH}?${query.toString()}`);
}
function readToken(req) {
    const fromCookie = readCookie(req, exports.DOCS_COOKIE_NAME);
    if (fromCookie)
        return fromCookie;
    const header = req.headers.authorization;
    if (header) {
        const [, token] = header.split(" ");
        if (token)
            return token;
    }
    const accessToken = req.headers["x-access-token"];
    return typeof accessToken === "string" ? accessToken : undefined;
}
function readCookie(req, name) {
    for (const part of String(req.headers.cookie ?? "").split(";")) {
        const index = part.indexOf("=");
        if (index === -1 || part.slice(0, index).trim() !== name)
            continue;
        try {
            return decodeURIComponent(part.slice(index + 1).trim());
        }
        catch (error) {
            return undefined;
        }
    }
    return undefined;
}
/**
 * Where to go after the login : only a path of this server, so that the login
 * page can't be used to redirect to another site.
 */
function safeNext(value) {
    if (typeof value !== "string")
        return exports.DOCS_DEFAULT_PAGE;
    if (!/^\/[\x21-\x7e]*$/.test(value))
        return exports.DOCS_DEFAULT_PAGE;
    if (value.startsWith("//") || value.includes("\\"))
        return exports.DOCS_DEFAULT_PAGE;
    return value;
}
function escapeHtml(value) {
    return value.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);
}
function sendLoginPage(res, status, next, message) {
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
<form method="post" action="${exports.DOCS_LOGIN_PATH}">
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
//# sourceMappingURL=docsAuth.js.map