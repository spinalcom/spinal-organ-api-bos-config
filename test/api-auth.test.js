/*
 * Copyright 2026 SpinalCom - www.spinalcom.com
 * 
 * This file is part of SpinalCore.
 * 
 * Please read all of the following terms and conditions
 * of the Software license Agreement ("Agreement")
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
const path = require("node:path");
const { test } = require("node:test");

// Variables already set in the shell (e.g. API_BASE_URL) take precedence over .env.
require("dotenv").config({ path: path.resolve(__dirname, "../.env"), quiet: true });

const upstreamSwagger = require("spinal-organ-api-server/swagger-spec.json");
const adminSwagger = require("../src/swagger/swagger.json");

const methods = ["get", "post", "put", "delete", "patch"];
const baseUrl = process.env.API_BASE_URL || `${process.env.SERVER_PROTOCOL || "http"}://127.0.0.1:${process.env.SERVER_PORT || 2022}`;

function isProtected(operation, document) {
	const security = Object.hasOwn(operation, "security") ? operation.security : document.security;
	return Array.isArray(security) && security.some((requirement) => Object.keys(requirement).some((scheme) => scheme !== "all"));
}

function getProtectedOperations() {
	const operations = new Map();

	for (const document of [upstreamSwagger, adminSwagger]) {
		for (const [path, pathOperations] of Object.entries(document.paths || {})) {
			for (const method of methods) {
				const operation = pathOperations[method];
				if (!operation || !isProtected(operation, document)) continue;

				const key = `${method.toUpperCase()} ${path}`;
				operations.set(key, { method: method.toUpperCase(), path });
			}
		}
	}

	return [...operations.values()];
}

function materializePath(path) {
	return path.replace(/\{[^}]+\}/g, encodeURIComponent("auth-check"));
}

test("all documented protected API operations reject requests without credentials", async () => {
	const operations = getProtectedOperations();
	assert.ok(operations.length > 0, "No protected API operations were found in the Swagger specs");

	const failures = [];
	const concurrency = 8;

	for (let index = 0; index < operations.length; index += concurrency) {
		const batch = operations.slice(index, index + concurrency);
		await Promise.all(batch.map(async ({ method, path }) => {
			const url = new URL(materializePath(path), baseUrl);

			try {
				const response = await fetch(url, {
					method,
					redirect: "manual",
					signal: AbortSignal.timeout(10000),
				});
				await response.body?.cancel();

				if (response.status !== 401 && response.status !== 403) {
					failures.push(`${method} ${path}: expected 401/403, received ${response.status}`);
				}
			} catch (error) {
				failures.push(`${method} ${path}: request failed (${error.message})`);
			}
		}));
	}

	assert.deepEqual(failures, [], `Unauthenticated API requests were not rejected:\n${failures.join("\n")}`);
});
