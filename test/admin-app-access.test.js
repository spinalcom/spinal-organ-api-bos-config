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
const { SpinalNode } = require("spinal-env-viewer-graph-service");
const { AuthorizationService } = require("../src/services/authorization.service.ts");
const { AppService } = require("../src/services/apps.service.ts");
const { searchByName } = require("../src/utils/findNodeBySearchKey.ts");
const { PTR_LST_TYPE, PROFILE_TO_AUTHORIZED_APP, PROFILE_TO_AUTHORIZED_SUB_APP, PROFILE_TO_AUTHORIZED_ADMIN_APP, ADMIN_APP_TYPE, BUILDING_APP_TYPE } = require("../src/constant.ts");
const ADMIN_APPS = require("../src/defaultApps/adminApps.json");

const service = AuthorizationService.getInstance();
const userProfilesApp = ADMIN_APPS.user_profiles.name;
const appsApp = ADMIN_APPS.apps.name;

// the admin apps of the BOS
const adminApps = [new SpinalNode(userProfilesApp, ADMIN_APP_TYPE), new SpinalNode(appsApp, ADMIN_APP_TYPE)];

async function profileWith(relation, app) {
	const profile = new SpinalNode("profile", "UserProfile");
	await profile.addChild(app, relation, PTR_LST_TYPE);
	return profile;
}

before(() => {
	AppService.getInstance().getAllAdminApps = async () => adminApps;
});

test("a profile that was given the admin app has access", async () => {
	const profile = await profileWith(PROFILE_TO_AUTHORIZED_ADMIN_APP, adminApps[0]);

	assert.equal(await service.profileHasAccessToAdminApp(searchByName, profile, userProfilesApp), adminApps[0]);
	assert.equal(await service.profileHasAccessToAdminApp(searchByName, profile, userProfilesApp.toUpperCase()), adminApps[0]);
});

test("an admin app gives no access to the routes of another admin app", async () => {
	const profile = await profileWith(PROFILE_TO_AUTHORIZED_ADMIN_APP, adminApps[0]);

	assert.equal(await service.profileHasAccessToAdminApp(searchByName, profile, appsApp), undefined);
	assert.equal(await service.profileHasAccessToAdminApp(searchByName, profile, "not an app"), undefined);
});

test("a building app with the name of an admin app gives no access", async () => {
	const lookalike = new SpinalNode(userProfilesApp, BUILDING_APP_TYPE);
	const profile = await profileWith(PROFILE_TO_AUTHORIZED_APP, lookalike);

	// what the admin routes used before : the name was enough
	assert.equal(await service.profileHasAccessToApp(searchByName, profile, userProfilesApp), lookalike);
	assert.equal(await service.profileHasAccessToAdminApp(searchByName, profile, userProfilesApp), undefined);
});

test("a sub app with the name of an admin app gives no access", async () => {
	const profile = await profileWith(PROFILE_TO_AUTHORIZED_SUB_APP, new SpinalNode(userProfilesApp, "BuildingSubApp"));

	assert.equal(await service.profileHasAccessToAdminApp(searchByName, profile, userProfilesApp), undefined);
});

test("an app with the name and the type of an admin app, that is not one, gives no access", async () => {
	const lookalike = new SpinalNode(userProfilesApp, ADMIN_APP_TYPE);
	const profile = await profileWith(PROFILE_TO_AUTHORIZED_ADMIN_APP, lookalike);

	assert.equal(await service.profileHasAccessToAdminApp(searchByName, profile, userProfilesApp), undefined);
});
