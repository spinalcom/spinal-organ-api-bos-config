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
const { test, before } = require("node:test");

require("ts-node/register/transpile-only");
const { FileSystem } = require("spinal-core-connectorjs");
const { SpinalContext, SpinalGraph, SpinalGraphService, SpinalNode } = require("spinal-env-viewer-graph-service");
const { SpinalRelationPtrLst, SPINAL_RELATION_PTR_LST_TYPE } = require("spinal-model-graph");
const relationChildrenRoute = require("spinal-organ-api-server/build/routes/nodes/relationChildrenNode");
const { SpinalAPIMiddleware } = require("../src/middlewares/SpinalAPIMiddleware.ts");

const middleware = SpinalAPIMiddleware.getInstance();
const PROFILE = "profile";

// what the hub has not sent yet: the fake connection gives it on load_ptr
const onHubOnly = new Map();
let lastServerId = 900000;

function inMemory(model) {
	FileSystem._objects[++lastServerId] = model;
	return lastServerId;
}

function onHub(model) {
	onHubOnly.set(++lastServerId, model);
	return lastServerId;
}

function relationOf(node, name) {
	for (const [, relations] of node.children) {
		if (relations.has(name)) return relations.getElement(name);
	}
	throw new Error(`no relation ${name}`);
}

function fakeResponse() {
	return {
		statusCode: 200,
		status(code) {
			this.statusCode = code;
			return this;
		},
		json(body) {
			this.body = body;
			return this;
		},
		send(body) {
			this.body = body;
			return this;
		},
	};
}

let graph, building, hidden;

before(async () => {
	graph = new SpinalGraph("graph");
	const spatial = new SpinalContext("Spatial");
	const other = new SpinalContext("Other");
	await graph.addContext(spatial);
	await graph.addContext(other);

	building = new SpinalNode("Building", "geographicBuilding");
	await spatial.addChildInContext(building, "hasGeographicBuilding", SPINAL_RELATION_PTR_LST_TYPE, spatial);
	await building.addChildInContext(new SpinalNode("Floor 1", "geographicFloor"), "hasGeographicFloor", SPINAL_RELATION_PTR_LST_TYPE, spatial);

	hidden = new SpinalNode("Hidden building", "geographicBuilding");
	await other.addChildInContext(hidden, "hasGeographicBuilding", SPINAL_RELATION_PTR_LST_TYPE, other);
	await hidden.addChildInContext(new SpinalNode("Hidden floor", "geographicFloor"), "hasGeographicFloor", SPINAL_RELATION_PTR_LST_TYPE, other);

	// the profile is given the Spatial context only
	const profileGraph = new SpinalGraph("profile graph");
	await profileGraph.addContext(spatial);
	middleware.addProfileToMap(PROFILE, profileGraph);

	middleware.setConnection({ load_ptr: (serverId, callback) => callback(onHubOnly.get(serverId)) });
});

test("GET /api/v1/relation/:id/children_node answers for a relation of a node the profile can read", async () => {
	const handlers = {};
	relationChildrenRoute(console, { get: (path, handler) => (handlers[path] = handler) }, middleware);
	const res = fakeResponse();

	// it used to answer 500 "node.getType(...).get is not a function"
	await handlers["/api/v1/relation/:id/children_node"]({ params: { id: String(inMemory(relationOf(building, "hasGeographicFloor"))) }, profileId: PROFILE }, res);

	assert.equal(res.statusCode, 200);
	assert.deepEqual(res.body.map((child) => child.name), ["Floor 1"]);
});

test("a relation of a node outside the profile's contexts is refused", async () => {
	await assert.rejects(middleware.load(inMemory(relationOf(hidden, "hasGeographicFloor")), PROFILE), { code: 401 });
});

test("the graph's relation to its contexts is refused: it would list every context", async () => {
	await assert.rejects(middleware.load(inMemory(relationOf(graph, "hasContext")), PROFILE), { code: 401 });
});

test("a relation the server has not loaded yet is checked the same way", { timeout: 2000 }, async () => {
	const relation = relationOf(building, "hasGeographicFloor");

	assert.equal(await middleware.load(onHub(relation), PROFILE), relation);
	await assert.rejects(middleware.load(onHub(relationOf(hidden, "hasGeographicFloor")), PROFILE), { code: 401 });
});

test("an error while checking a model loaded from the hub reaches the caller", { timeout: 2000 }, async () => {
	const relation = new SpinalRelationPtrLst(building, "broken");
	relation.getParent = async () => {
		throw new Error("parent not loadable");
	};

	await assert.rejects(middleware.load(onHub(relation), PROFILE), /parent not loadable/);
});

test("nodes are checked as before", async () => {
	assert.equal(await middleware.load(inMemory(building), PROFILE), building);
	assert.equal(SpinalGraphService.getRealNode(building.getId().get()), building);
	await assert.rejects(middleware.load(inMemory(hidden), PROFILE), { code: 401 });
	await assert.rejects(middleware.load(onHub(hidden), PROFILE), { code: 401 });
});
