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

const assert = require("node:assert/strict");
const { test, before, after } = require("node:test");
const express = require("express");

require("ts-node/register/transpile-only");
const swaggerUi = require("swagger-ui-express");
const { useDocsAuth, safeNext, USER_DOCS_ROUTES, ADMIN_DOCS_ROUTES, SWAGGER_UI_ROUTES, DOCS_COOKIE_NAME } = require("../src/security/docsAuth.ts");

// fake accounts : token -> profile
const accounts = {
	admin: { password: "admin-pwd", token: "admin-token", profileId: "admin-profile" },
	user: { password: "user-pwd", token: "user-token", profileId: "user-profile" },
};

let server;
let baseUrl;

before(async () => {
	const app = express();
	useDocsAuth(app, {
		login: async (userName, password) => {
			const account = accounts[userName];
			return account && account.password === password ? { token: account.token } : null;
		},
		getProfileId: async (token) => {
			if (token === "broken-token") throw new Error("token service down");
			return Object.values(accounts).find((account) => account.token === token)?.profileId ?? null;
		},
		isAdminProfile: (profileId) => profileId === accounts.admin.profileId,
	});
	// stand-ins for the documentation routes, registered after the guard like the real ones
	for (const route of [...USER_DOCS_ROUTES, ...ADMIN_DOCS_ROUTES]) app.use(route, (req, res) => res.send(`content of ${route}`));

	server = app.listen(0, "127.0.0.1");
	await new Promise((resolve) => server.once("listening", resolve));
	baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(() => server.close());

function get(path, headers = {}) {
	return fetch(baseUrl + path, { headers, redirect: "manual" });
}

async function login(userName, password, next) {
	const body = new URLSearchParams({ userName, password });
	if (next) body.set("next", next);
	const response = await fetch(`${baseUrl}/docs/login`, { method: "POST", body, redirect: "manual" });
	const cookie = (response.headers.get("set-cookie") || "").split(";")[0];
	return { response, cookie };
}

test("every documentation route rejects a request without login", async () => {
	for (const route of [...USER_DOCS_ROUTES, ...ADMIN_DOCS_ROUTES]) {
		for (const path of [route, `${route}/`, route.toUpperCase(), `${route}/swagger-ui.css`]) {
			const response = await get(path);
			assert.equal(response.status, 401, `GET ${path}`);
			assert.doesNotMatch(await response.text(), /content of/);
		}
	}
});

test("a browser is sent to the login page, and comes back after the login", async () => {
	const response = await get("/admin_docs/", { accept: "text/html" });
	assert.equal(response.status, 302);
	assert.equal(response.headers.get("location"), "/docs/login?next=%2Fadmin_docs%2F");

	const page = await get(response.headers.get("location"));
	assert.equal(page.status, 200);
	assert.match(await page.text(), /name="next" value="\/admin_docs\/"/);

	const { response: logged } = await login("admin", accounts.admin.password, "/admin_docs/");
	assert.equal(logged.status, 302);
	assert.equal(logged.headers.get("location"), "/admin_docs/");
});

test("the login cookie is HttpOnly and gives access", async () => {
	const { response, cookie } = await login("admin", accounts.admin.password);
	assert.match(response.headers.get("set-cookie"), /HttpOnly/);
	assert.match(response.headers.get("set-cookie"), /SameSite=Lax/);
	assert.equal(cookie, `${DOCS_COOKIE_NAME}=admin-token`);

	for (const route of [...USER_DOCS_ROUTES, ...ADMIN_DOCS_ROUTES]) {
		const allowed = await get(route, { cookie });
		assert.equal(allowed.status, 200, `GET ${route}`);
		assert.equal(await allowed.text(), `content of ${route}`);
	}
});

test("a wrong password is refused and sets no cookie", async () => {
	for (const [userName, password] of [["admin", "nope"], ["unknown", "admin-pwd"], ["admin", ""]]) {
		const { response, cookie } = await login(userName, password);
		assert.equal(response.status, 401);
		assert.equal(cookie, "");
	}
});

test("a user that is not admin reads the API documentation but not the admin one", async () => {
	const { cookie } = await login("user", accounts.user.password);

	for (const route of USER_DOCS_ROUTES) assert.equal((await get(route, { cookie })).status, 200, `GET ${route}`);
	for (const route of ADMIN_DOCS_ROUTES) assert.equal((await get(route, { cookie })).status, 403, `GET ${route}`);

	const page = await get("/admin_docs", { cookie, accept: "text/html" });
	assert.equal(page.status, 302);
	assert.equal(page.headers.get("location"), "/docs/login?next=%2Fadmin_docs&reason=admin");
});

test("a Bearer token works like the cookie, an invalid token does not", async () => {
	assert.equal((await get("/swagger-spec", { authorization: "Bearer user-token" })).status, 200);
	assert.equal((await get("/admin/swagger.json", { authorization: "Bearer user-token" })).status, 403);
	assert.equal((await get("/admin/swagger.json", { authorization: "Bearer admin-token" })).status, 200);
	assert.equal((await get("/swagger-spec", { authorization: "Bearer forged" })).status, 401);
	assert.equal((await get("/swagger-spec", { cookie: `${DOCS_COOKIE_NAME}=forged` })).status, 401);
	assert.equal((await get("/swagger-spec", { cookie: `${DOCS_COOKIE_NAME}=broken-token` })).status, 401);
});

test("logout clears the cookie", async () => {
	const response = await get("/docs/logout");
	assert.equal(response.status, 302);
	assert.match(response.headers.get("set-cookie"), new RegExp(`${DOCS_COOKIE_NAME}=;`));
});

test("the login never redirects to another site", async () => {
	for (const next of ["https://evil.example", "//evil.example", "/\\evil.example", "javascript:alert(1)", "/a b", undefined, 12]) {
		assert.equal(safeNext(next), "/spinalcom-api-docs", String(next));
	}
	assert.equal(safeNext("/admin_docs/?a=1#/Auth"), "/admin_docs/?a=1#/Auth");

	const { response } = await login("admin", accounts.admin.password, "//evil.example");
	assert.equal(response.headers.get("location"), "/spinalcom-api-docs");
});

test("the login page escapes what it echoes", async () => {
	const page = await get(`/docs/login?next=${encodeURIComponent('/x"><script>alert(1)</script>')}`);
	assert.doesNotMatch(await page.text(), /<script>/);
});

test("the Swagger UI pages are authorized with the token of the login", async (t) => {
	// the real swagger-ui-express, mounted like the documentation routes are
	const app = express();
	useDocsAuth(app, {
		login: async () => null,
		getProfileId: async (token) => (token === 'admin-"</script>-token' ? "admin-profile" : null),
		isAdminProfile: () => true,
	});
	const spec = require("../src/swagger/swagger.json");
	for (const route of SWAGGER_UI_ROUTES) app.use(route, swaggerUi.serve, (req, res, next) => swaggerUi.setup(spec)(req, res, next));
	app.use("/swagger-spec", (req, res) => res.send("<html><body>not a Swagger UI page</body></html>"));

	const swaggerServer = app.listen(0, "127.0.0.1");
	await new Promise((resolve) => swaggerServer.once("listening", resolve));
	t.after(() => swaggerServer.close());
	const url = `http://127.0.0.1:${swaggerServer.address().port}`;
	const headers = { authorization: 'Bearer admin-"</script>-token' };

	for (const route of SWAGGER_UI_ROUTES) {
		const page = await fetch(`${url}${route}/`, { headers });
		const html = await page.text();
		assert.equal(page.status, 200, route);
		assert.equal(page.headers.get("cache-control"), "no-store", route);
		assert.match(html, /swagger-ui-init\.js/, route);
		assert.match(html, /ui\.preauthorizeApiKey\(name, token\)/, route);
		// the token is in the page, and can't close the script tag
		assert.ok(html.includes('var token = "admin-\\"\\u003c/script>-token";'), route);
		assert.equal(html.split("</script>").length, html.split("<script").length, route);

		// only the page gets the script, not the files it loads
		const init = await fetch(`${url}${route}/swagger-ui-init.js`, { headers });
		assert.equal(init.status, 200, route);
		assert.doesNotMatch(await init.text(), /admin-/, route);
	}

	// neither does a documentation route that is not a Swagger UI page
	const other = await fetch(`${url}/swagger-spec`, { headers });
	assert.doesNotMatch(await other.text(), /admin-/);

	// and nothing is given without a valid login
	const refused = await fetch(`${url}/admin_docs/`, { headers: { authorization: "Bearer forged" } });
	assert.equal(refused.status, 401);
	assert.doesNotMatch(await refused.text(), /forged|preauthorize/);
});
