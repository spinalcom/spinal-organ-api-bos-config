"use strict";
/*
 * Copyright 2022 SpinalCom - www.spinalcom.com
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
exports.AuthorizationService = exports.authorizationInstance = void 0;
const constant_1 = require("../constant");
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const spinal_core_connectorjs_type_1 = require("spinal-core-connectorjs_type");
const digitalTwin_service_1 = require("./digitalTwin.service");
const apps_service_1 = require("./apps.service");
const apis_service_1 = require("./apis.service");
const findNodeBySearchKey_1 = require("../utils/findNodeBySearchKey");
class AuthorizationService {
    constructor() { }
    static getInstance() {
        if (!this.instance)
            this.instance = new AuthorizationService();
        return this.instance;
    }
    // public async profileHasAccess(profile: SpinalNode, node: SpinalNode | string): Promise<boolean> {
    //     return
    // }
    /////////////////////////////////////////////
    //               AUTHORIZE
    /////////////////////////////////////////////
    async authorizeProfileToAccessContext(profile, digitalTwinId, contextIds) {
        if (!Array.isArray(contextIds))
            contextIds = [contextIds];
        if (!digitalTwinId) {
            digitalTwinId = await this._getActualDigitalTwinId();
            if (!digitalTwinId)
                throw "No digital twin is setup";
        }
        const node = await this.getAuthorizedDigitalTwinNode(profile, digitalTwinId, true);
        if (!node)
            throw `No digitalTwin found for ${digitalTwinId}`;
        const graph = await node.getElement(false);
        return contextIds.reduce(async (prom, contextId) => {
            const liste = await prom;
            const context = await digitalTwin_service_1.DigitalTwinService.getInstance().findContextInDigitalTwin(digitalTwinId, contextId);
            if (context) {
                try {
                    await graph.addContext(context);
                    liste.push(context);
                }
                catch (error) { }
                return liste;
            }
        }, Promise.resolve([]));
    }
    async authorizeProfileToAccessApps(profile, appIds) {
        if (!Array.isArray(appIds))
            appIds = [appIds];
        return appIds.reduce(async (prom, appId) => {
            const liste = await prom;
            const app = await apps_service_1.AppService.getInstance().getBuildingApp(findNodeBySearchKey_1.searchById, appId);
            if (app) {
                try {
                    await profile.addChild(app, constant_1.PROFILE_TO_AUTHORIZED_APP, constant_1.PTR_LST_TYPE);
                    liste.push(app);
                }
                catch (error) { }
                return liste;
            }
        }, Promise.resolve([]));
    }
    async authorizeProfileToAccessSubApps(profile, appNodes, subAppIds) {
        if (!Array.isArray(subAppIds))
            subAppIds = [subAppIds];
        const promises = [];
        for (const subAppId of subAppIds) {
            const subAppNode = await apps_service_1.AppService.getInstance().findBuildingSubAppInApps(findNodeBySearchKey_1.searchById, appNodes, subAppId);
            if (subAppNode) {
                promises.push(
                // Attempt to add the subApp to the profile as a child node. If the subApp is already added, catch the error and return the subApp node regardless.
                profile
                    .addChild(subAppNode, constant_1.PROFILE_TO_AUTHORIZED_SUB_APP, constant_1.PTR_LST_TYPE)
                    .catch(() => null)
                    .finally(() => subAppNode));
            }
        }
        return Promise.all(promises);
    }
    async authorizeProfileToAccessAdminApps(profile, appIds) {
        if (!Array.isArray(appIds))
            appIds = [appIds];
        return appIds.reduce(async (prom, appId) => {
            const liste = await prom;
            const app = await apps_service_1.AppService.getInstance().getAdminApp(findNodeBySearchKey_1.searchById, appId);
            if (app) {
                try {
                    await profile.addChild(app, constant_1.PROFILE_TO_AUTHORIZED_ADMIN_APP, constant_1.PTR_LST_TYPE);
                    liste.push(app);
                }
                catch (error) { }
                return liste;
            }
        }, Promise.resolve([]));
    }
    async authorizeProfileToAccessApis(profile, apiIds) {
        if (!Array.isArray(apiIds))
            apiIds = [apiIds];
        return apiIds.reduce(async (prom, apiId) => {
            const liste = await prom;
            const api = await apis_service_1.APIService.getInstance().getApiRouteById(apiId);
            if (api) {
                try {
                    await profile.addChild(api, constant_1.PROFILE_TO_AUTHORIZED_API, constant_1.PTR_LST_TYPE);
                    liste.push(api);
                }
                catch (error) { }
                return liste;
            }
        }, Promise.resolve([]));
    }
    /////////////////////////////////////////////
    //               GET AUTHORIZED
    /////////////////////////////////////////////
    async getAuthorizedContexts(profile, digitalTwinId) {
        if (!digitalTwinId) {
            digitalTwinId = await this._getActualDigitalTwinId();
            if (!digitalTwinId)
                return [];
        }
        const digitalTwin = await this.getAuthorizedDigitalTwinNode(profile, digitalTwinId);
        if (!digitalTwin)
            return [];
        const graph = await digitalTwin.getElement(true);
        if (!graph)
            return [];
        return graph.getChildren("hasContext");
    }
    async getAuthorizedApps(profile) {
        return profile.getChildren(constant_1.PROFILE_TO_AUTHORIZED_APP);
    }
    async getAuthorizedSubApps(profile) {
        return profile.getChildren(constant_1.PROFILE_TO_AUTHORIZED_SUB_APP);
    }
    async getAuthorizedAdminApps(profile) {
        return profile.getChildren(constant_1.PROFILE_TO_AUTHORIZED_ADMIN_APP);
    }
    async getAuthorizedApis(profile) {
        return profile.getChildren(constant_1.PROFILE_TO_AUTHORIZED_API);
    }
    async getAuthorizedDigitalTwinNode(profile, digitalTwinId, createIfNotExist = false) {
        if (!digitalTwinId) {
            digitalTwinId = await this._getActualDigitalTwinId();
        }
        const digitalTwins = await profile.getChildren(constant_1.PROFILE_TO_AUTHORIZED_DIGITAL_TWIN_RELATION_NAME);
        const found = digitalTwins.find((el) => el.getId().get() === digitalTwinId || el.info.refId?.get() === digitalTwinId);
        if (found)
            return found;
        if (createIfNotExist) {
            const digitalTwin = await digitalTwin_service_1.DigitalTwinService.getInstance().getDigitalTwin(digitalTwinId);
            if (!digitalTwin)
                return;
            const ref = await this._createNodeReference(digitalTwin);
            return profile.addChild(ref, constant_1.PROFILE_TO_AUTHORIZED_DIGITAL_TWIN_RELATION_NAME, constant_1.PTR_LST_TYPE);
        }
    }
    /////////////////////////////////////////////
    //               UNAUTHORIZE
    /////////////////////////////////////////////
    async unauthorizeProfileToAccessContext(profile, digitalTwinId, contextIds) {
        if (!Array.isArray(contextIds))
            contextIds = [contextIds];
        if (!digitalTwinId) {
            digitalTwinId = await this._getActualDigitalTwinId();
            if (!digitalTwinId)
                throw "No digital twin is setup";
        }
        const node = await this.getAuthorizedDigitalTwinNode(profile, digitalTwinId, true);
        if (!node)
            throw `No digitalTwin found for ${digitalTwinId}`;
        const graph = await node.getElement(false);
        return contextIds.reduce(async (prom, contextId) => {
            const liste = await prom;
            const context = await digitalTwin_service_1.DigitalTwinService.getInstance().findContextInDigitalTwin(digitalTwinId, contextId);
            if (context) {
                try {
                    await graph.removeChild(context, "hasContext", constant_1.REF_TYPE);
                    liste.push(context);
                }
                catch (error) { }
                return liste;
            }
        }, Promise.resolve([]));
    }
    async unauthorizeProfileToAccessApps(profile, appIds) {
        if (!Array.isArray(appIds))
            appIds = [appIds];
        return appIds.reduce(async (prom, appId) => {
            const liste = await prom;
            const app = await apps_service_1.AppService.getInstance().getBuildingApp(findNodeBySearchKey_1.searchById, appId);
            if (app) {
                try {
                    await profile.removeChild(app, constant_1.PROFILE_TO_AUTHORIZED_APP, constant_1.PTR_LST_TYPE);
                    liste.push(app);
                }
                catch (error) { }
                return liste;
            }
        }, Promise.resolve([]));
    }
    async unauthorizeProfileToAccessSubApps(profile, subAppIds) {
        if (!Array.isArray(subAppIds))
            subAppIds = [subAppIds];
        const result = [];
        const apps = await apps_service_1.AppService.getInstance().getAllBuildingAppsAndSubApp();
        for (const subAppId of subAppIds) {
            const subApp = apps.find((app) => app.info.id.get() === subAppId);
            if (subApp) {
                try {
                    await profile.removeChild(subApp, constant_1.PROFILE_TO_AUTHORIZED_APP, constant_1.PTR_LST_TYPE);
                    result.push(subApp);
                }
                catch (error) { }
            }
        }
        return result;
    }
    async unauthorizeProfileToAccessApis(profile, apiIds) {
        if (!Array.isArray(apiIds))
            apiIds = [apiIds];
        return apiIds.reduce(async (prom, apiId) => {
            const liste = await prom;
            const api = await apis_service_1.APIService.getInstance().getApiRouteById(apiId);
            if (api) {
                try {
                    await profile.removeChild(api, constant_1.PROFILE_TO_AUTHORIZED_API, constant_1.PTR_LST_TYPE);
                    liste.push(api);
                }
                catch (error) { }
                return liste;
            }
        }, Promise.resolve([]));
    }
    ///////////////////////////////////////////////
    //             VERIFICATION
    ///////////////////////////////////////////////
    async profileHasAccessToContext(profile, digitalTwinId, contextId) {
        const contexts = await this.getAuthorizedContexts(profile, digitalTwinId);
        return contexts.find((el) => el.getId().get() === contextId);
    }
    async profileHasAccessToApp(searchKeys, profile, appNameId) {
        const contexts = await Promise.all([this.getAuthorizedApps(profile), this.getAuthorizedSubApps(profile), this.getAuthorizedAdminApps(profile)]);
        return contexts.flat().find(findNodeBySearchKey_1.isNodeMatchSearchKey.bind(null, searchKeys, appNameId));
    }
    async profileHasAccessToSubApp(searchKeys, profile, appId, subAppId) {
        const [subApp, subAppsFromProfile] = await Promise.all([
            // subApp from context App
            apps_service_1.AppService.getInstance().getBuildingSubApp(searchKeys, appId, subAppId),
            // subApps from profile
            this.getAuthorizedSubApps(profile),
        ]);
        if (!subApp)
            return;
        return (0, findNodeBySearchKey_1.findNodeBySearchKey)(subAppsFromProfile, ["id"], subApp.info.id.get());
    }
    async profileHasAccessToApi(profile, apiId) {
        const contexts = await this.getAuthorizedApis(profile);
        return contexts.find((el) => el.getId().get() === apiId);
    }
    ///////////////////////////////////////////////
    //             PRIVATE
    ///////////////////////////////////////////////
    async _createNodeReference(node) {
        const refNode = new spinal_env_viewer_graph_service_1.SpinalNode(node.getName().get(), node.getType().get(), new spinal_env_viewer_graph_service_1.SpinalGraph());
        refNode.info.add_attr({ refId: node.getId().get() });
        refNode.info.name.set(node.info.name);
        await this._addRefToNode(node, refNode);
        return refNode;
    }
    _addRefToNode(node, ref) {
        if (node.info.references) {
            return new Promise((resolve, reject) => {
                node.info.references.load((lst) => {
                    lst.push(ref);
                    resolve(ref);
                });
            });
        }
        else {
            node.info.add_attr({
                references: new spinal_core_connectorjs_type_1.Ptr(new spinal_core_connectorjs_type_1.Lst([ref])),
            });
            return Promise.resolve(ref);
        }
    }
    _getRealNode(refNode) {
        return refNode.getElement(false);
    }
    async _getActualDigitalTwinId() {
        const actualDigitalTwin = await digitalTwin_service_1.DigitalTwinService.getInstance().getActualDigitalTwin();
        if (actualDigitalTwin)
            return actualDigitalTwin.getId().get();
    }
}
exports.default = AuthorizationService;
exports.AuthorizationService = AuthorizationService;
const authorizationInstance = AuthorizationService.getInstance();
exports.authorizationInstance = authorizationInstance;
//# sourceMappingURL=authorization.service.js.map