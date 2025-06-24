"use strict";
/*
 * Copyright 2022 SpinalCom - www.spinalcom.com
 *
 * This file is part of SpinalCore.
 *
 * Please read all of the followi../interfaces/IProfileResitions
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
exports.AppProfileService = void 0;
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const constant_1 = require("../constant");
const authorization_service_1 = require("./authorization.service");
const configFile_service_1 = require("./configFile.service");
class AppProfileService {
    constructor() { }
    static getInstance() {
        if (!this.instance) {
            this.instance = new AppProfileService();
        }
        return this.instance;
    }
    async init() {
        this.context = await configFile_service_1.configServiceInstance.getContext(constant_1.APP_PROFILE_CONTEXT_NAME);
        if (!this.context)
            this.context = await configFile_service_1.configServiceInstance.addContext(constant_1.APP_PROFILE_CONTEXT_NAME, constant_1.APP_PROFILE_CONTEXT_TYPE);
        return this.context;
    }
    /// CRUD BEGIN
    async createAppProfile(appProfile) {
        const profileNode = new spinal_env_viewer_graph_service_1.SpinalNode(appProfile.name, constant_1.APP_PROFILE_TYPE);
        const obj = {
            node: profileNode,
        };
        if (appProfile.apisIds)
            obj.apis = await this.authorizeProfileToAccessApis(profileNode, appProfile.apisIds);
        if (appProfile.appsIds)
            obj.apps = await this.authorizeProfileToAccessApps(profileNode, appProfile.appsIds);
        if (appProfile.contextIds)
            obj.contexts = await this.authorizeProfileToAccessContext(profileNode, appProfile.contextIds);
        await this.context.addChildInContext(profileNode, constant_1.CONTEXT_TO_USER_PROFILE_RELATION_NAME, constant_1.PTR_LST_TYPE, this.context);
        return obj;
    }
    async getAppProfile(appProfile) {
        const node = appProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode
            ? appProfile
            : await this._getAppProfileNode(appProfile);
        if (!node)
            return;
        return {
            node,
            ...(await this.getAutorizationStructure(node)),
        };
    }
    async updateAppProfile(appProfileId, appProfile) {
        const profileNode = await this._getAppProfileNode(appProfileId);
        if (!profileNode)
            return;
        this._renameProfile(profileNode, appProfile.name);
        if (appProfile.unauthorizeApisIds)
            await this.unauthorizeProfileToAccessApis(profileNode, appProfile.unauthorizeApisIds);
        if (appProfile.unauthorizeAppsIds)
            await this.unauthorizeProfileToAccessApps(profileNode, appProfile.unauthorizeAppsIds);
        if (appProfile.unauthorizeContextIds)
            await this.unauthorizeProfileToAccessContext(profileNode, appProfile.unauthorizeContextIds);
        if (appProfile.apisIds)
            await this.authorizeProfileToAccessApis(profileNode, appProfile.apisIds);
        if (appProfile.appsIds)
            await this.authorizeProfileToAccessApps(profileNode, appProfile.appsIds);
        if (appProfile.contextIds)
            await this.authorizeProfileToAccessContext(profileNode, appProfile.contextIds);
        return this.getAppProfile(profileNode);
    }
    async getAllAppProfile() {
        const contexts = await this.getAllAppProfileNodes();
        const promises = contexts.map((node) => this.getAppProfile(node));
        return Promise.all(promises);
    }
    getAllAppProfileNodes() {
        return this.context.getChildrenInContext();
    }
    async deleteAppProfile(appProfileId) {
        const node = await this._getAppProfileNode(appProfileId);
        if (!node)
            throw new Error(`no profile Found for ${appProfileId}`);
        await node.removeFromGraph();
        return appProfileId;
    }
    async getAppProfileNodeGraph(profileId, digitalTwinId) {
        const profile = await this._getAppProfileNode(profileId);
        if (profile) {
            const digitalTwin = await authorization_service_1.authorizationInstance.getAuthorizedDigitalTwinNode(profile, digitalTwinId);
            if (digitalTwin)
                return digitalTwin.getElement();
        }
    }
    /// END CRUD
    /// AUTH BEGIN
    /////////////////////////////////////////////
    //               AUTHORIZE
    /////////////////////////////////////////////
    async authorizeProfileToAccessContext(appProfile, contextIds, digitalTwinId) {
        const profile = appProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode
            ? appProfile
            : await this._getAppProfileNode(appProfile);
        return authorization_service_1.authorizationInstance.authorizeProfileToAccessContext(profile, digitalTwinId, contextIds);
    }
    async authorizeProfileToAccessApps(appProfile, appIds) {
        const profile = appProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode
            ? appProfile
            : await this._getAppProfileNode(appProfile);
        return authorization_service_1.authorizationInstance.authorizeProfileToAccessApps(profile, appIds);
    }
    async authorizeProfileToAccessApis(appProfile, apiIds) {
        const profile = appProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode
            ? appProfile
            : await this._getAppProfileNode(appProfile);
        return authorization_service_1.authorizationInstance.authorizeProfileToAccessApis(profile, apiIds);
    }
    async getAutorizationStructure(appProfile, digitalTwinId) {
        const profile = appProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode
            ? appProfile
            : await this._getAppProfileNode(appProfile);
        return {
            contexts: await this.getAuthorizedContexts(profile, digitalTwinId),
            apis: await this.getAuthorizedApis(profile),
            apps: await this.getAuthorizedApps(profile),
        };
    }
    /////////////////////////////////////////////
    //             UNAUTHORIZE
    /////////////////////////////////////////////
    async unauthorizeProfileToAccessContext(appProfile, contextIds, digitalTwinId) {
        const profile = appProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode
            ? appProfile
            : await this._getAppProfileNode(appProfile);
        return authorization_service_1.authorizationInstance.unauthorizeProfileToAccessContext(profile, digitalTwinId, contextIds);
    }
    async unauthorizeProfileToAccessApps(appProfile, appIds) {
        const profile = appProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode
            ? appProfile
            : await this._getAppProfileNode(appProfile);
        return authorization_service_1.authorizationInstance.unauthorizeProfileToAccessApps(profile, appIds);
    }
    async unauthorizeProfileToAccessApis(appProfile, apiIds) {
        const profile = appProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode
            ? appProfile
            : await this._getAppProfileNode(appProfile);
        return authorization_service_1.authorizationInstance.unauthorizeProfileToAccessApis(profile, apiIds);
    }
    ///////////////////////////////////////////////
    //             VERIFICATION
    ///////////////////////////////////////////////
    async profileHasAccessToContext(appProfile, contextId, digitalTwinId) {
        const profile = appProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode
            ? appProfile
            : await this._getAppProfileNode(appProfile);
        return authorization_service_1.authorizationInstance.profileHasAccessToContext(profile, digitalTwinId, contextId);
    }
    async profileHasAccessToApp(searchKeys, appProfile, appId) {
        const profile = appProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode
            ? appProfile
            : await this._getAppProfileNode(appProfile);
        return authorization_service_1.authorizationInstance.profileHasAccessToApp(searchKeys, profile, appId);
    }
    async profileHasAccessToApi(appProfile, apiId) {
        const profile = appProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode
            ? appProfile
            : await this._getAppProfileNode(appProfile);
        return authorization_service_1.authorizationInstance.profileHasAccessToApi(profile, apiId);
    }
    /////////////////////////////////////////////
    //               GET AUTHORIZED
    /////////////////////////////////////////////
    async getAuthorizedContexts(appProfile, digitalTwinId) {
        const profile = appProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode
            ? appProfile
            : await this._getAppProfileNode(appProfile);
        return authorization_service_1.authorizationInstance.getAuthorizedContexts(profile, digitalTwinId);
    }
    async getAuthorizedApps(appProfile) {
        const profile = appProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode
            ? appProfile
            : await this._getAppProfileNode(appProfile);
        return authorization_service_1.authorizationInstance.getAuthorizedApps(profile);
    }
    async getAuthorizedApis(appProfile) {
        const profile = appProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode
            ? appProfile
            : await this._getAppProfileNode(appProfile);
        return authorization_service_1.authorizationInstance.getAuthorizedApis(profile);
    }
    ///////////////////////////////////////////////////////////
    ///                       PRIVATES                      //
    //////////////////////////////////////////////////////////
    async _getAppProfileNodeGraph(profileId) {
        const profile = await this._getAppProfileNode(profileId);
        if (profile)
            return profile.getElement();
    }
    async _getAppProfileNode(appProfileId) {
        const node = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(appProfileId);
        if (node)
            return node;
        return this._findChildInContext(this.context, appProfileId);
    }
    _renameProfile(node, newName) {
        if (newName && newName.trim())
            node.info.name.set(newName);
    }
    async _findChildInContext(startNode, nodeIdOrName) {
        const children = await startNode.getChildrenInContext(this.context);
        return children.find((el) => {
            if (el.getId().get() === nodeIdOrName ||
                el.getName().get() === nodeIdOrName) {
                //@ts-ignore
                spinal_env_viewer_graph_service_1.SpinalGraphService._addNode(el);
                return true;
            }
            return false;
        });
    }
}
exports.AppProfileService = AppProfileService;
//# sourceMappingURL=appProfile.service.js.map