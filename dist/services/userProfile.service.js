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
exports.UserProfileService = void 0;
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const constant_1 = require("../constant");
const authorization_service_1 = require("./authorization.service");
const configFile_service_1 = require("./configFile.service");
const adminProfile_service_1 = require("./adminProfile.service");
class UserProfileService {
    constructor() { }
    static getInstance() {
        if (!this.instance) {
            this.instance = new UserProfileService();
        }
        return this.instance;
    }
    async init() {
        this.context = await configFile_service_1.configServiceInstance.getContext(constant_1.USER_PROFILE_CONTEXT_NAME);
        if (!this.context)
            this.context = await configFile_service_1.configServiceInstance.addContext(constant_1.USER_PROFILE_CONTEXT_NAME, constant_1.USER_PROFILE_CONTEXT_TYPE);
        await adminProfile_service_1.AdminProfileService.getInstance().init(this.context);
        return this.context;
    }
    /// CRUD BEGIN
    async createUserProfile(userProfile) {
        const profileNode = new spinal_env_viewer_graph_service_1.SpinalNode(userProfile.name, constant_1.USER_PROFILE_TYPE);
        const obj = {
            node: profileNode,
        };
        if (userProfile.apisIds)
            obj.apis = await this.authorizeProfileToAccessApis(profileNode, userProfile.apisIds);
        if (userProfile.appsIds) {
            obj.apps = await this.authorizeProfileToAccessApps(profileNode, userProfile.appsIds);
            if (userProfile.subAppsIds)
                obj.subApps = await this.authorizeProfileToAccessSubApps(profileNode, obj.apps, userProfile.subAppsIds);
        }
        if (userProfile.contextIds)
            obj.contexts = await this.authorizeProfileToAccessContext(profileNode, userProfile.contextIds);
        await this.context.addChildInContext(profileNode, constant_1.CONTEXT_TO_USER_PROFILE_RELATION_NAME, constant_1.PTR_LST_TYPE, this.context);
        return obj;
    }
    async getUserProfile(userProfile) {
        const node = userProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode
            ? userProfile
            : await this._getUserProfileNode(userProfile);
        if (!node)
            return;
        return {
            node,
            ...(await this.getAutorizationStructure(node)),
        };
    }
    async updateUserProfile(userProfileId, userProfile) {
        const profileNode = await this._getUserProfileNode(userProfileId);
        if (!profileNode)
            return;
        this._renameProfile(profileNode, userProfile.name);
        if (userProfile.unauthorizeApisIds)
            await this.unauthorizeProfileToAccessApis(profileNode, userProfile.unauthorizeApisIds);
        if (userProfile.unauthorizeAppsIds)
            await this.unauthorizeProfileToAccessApps(profileNode, userProfile.unauthorizeAppsIds);
        if (userProfile.unauthorizeSubAppsIds)
            await this.unauthorizeProfileToAccessSubApps(profileNode, userProfile.unauthorizeSubAppsIds);
        if (userProfile.unauthorizeContextIds)
            await this.unauthorizeProfileToAccessContext(profileNode, userProfile.unauthorizeContextIds);
        if (userProfile.apisIds)
            await this.authorizeProfileToAccessApis(profileNode, userProfile.apisIds);
        if (userProfile.appsIds) {
            const nodeApps = await this.authorizeProfileToAccessApps(profileNode, userProfile.appsIds);
            if (userProfile.subAppsIds)
                await this.authorizeProfileToAccessSubApps(profileNode, nodeApps, userProfile.subAppsIds);
        }
        if (userProfile.contextIds)
            await this.authorizeProfileToAccessContext(profileNode, userProfile.contextIds);
        return this.getUserProfile(profileNode);
    }
    async getAllUserProfile() {
        const contexts = await this.getAllUserProfileNodes();
        const promises = contexts.map((node) => this.getUserProfile(node));
        return Promise.all(promises);
    }
    getAllUserProfileNodes() {
        return this.context.getChildrenInContext();
    }
    async deleteUserProfile(userProfileId) {
        const node = await this._getUserProfileNode(userProfileId);
        if (!node)
            throw new Error(`no profile Found for ${userProfileId}`);
        await node.removeFromGraph();
        return userProfileId;
    }
    async getUserProfileNodeGraph(profileId, digitalTwinId) {
        const profile = await this._getUserProfileNode(profileId);
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
    async authorizeProfileToAccessContext(userProfile, contextIds, digitalTwinId) {
        const profile = userProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode
            ? userProfile
            : await this._getUserProfileNode(userProfile);
        return authorization_service_1.authorizationInstance.authorizeProfileToAccessContext(profile, digitalTwinId, contextIds);
    }
    async authorizeProfileToAccessApps(userProfile, appIds) {
        const profile = userProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode
            ? userProfile
            : await this._getUserProfileNode(userProfile);
        return authorization_service_1.authorizationInstance.authorizeProfileToAccessApps(profile, appIds);
    }
    async authorizeProfileToAccessSubApps(userProfile, apps, subAppIds) {
        const profile = userProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode
            ? userProfile
            : await this._getUserProfileNode(userProfile);
        return authorization_service_1.authorizationInstance.authorizeProfileToAccessSubApps(profile, apps, subAppIds);
    }
    async authorizeProfileToAccessApis(userProfile, apiIds) {
        const profile = userProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode
            ? userProfile
            : await this._getUserProfileNode(userProfile);
        return authorization_service_1.authorizationInstance.authorizeProfileToAccessApis(profile, apiIds);
    }
    async getAutorizationStructure(userProfile, digitalTwinId) {
        const profile = userProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode
            ? userProfile
            : await this._getUserProfileNode(userProfile);
        const res = {
            contexts: await this.getAuthorizedContexts(profile, digitalTwinId),
            apis: await this.getAuthorizedApis(profile),
            apps: await this.getAuthorizedApps(profile),
            subApps: await this.getAuthorizedSubApps(profile),
        };
        if (profile.getType().get() === constant_1.ADMIN_PROFILE_TYPE) {
            res.adminApps = await this.getAuthorizedAdminApps(profile);
        }
        return res;
        // return {
        //   contexts: await this.getAuthorizedContexts(profile, digitalTwinId),
        //   apis: await this.getAuthorizedApis(profile),
        //   subApps: await this.getAuthorizedSubApps(profile),
        //   apps: await this.getAuthorizedApps(profile),
        //   ...(profile.getType().get() === ADMIN_PROFILE_TYPE && {
        //     adminApps: await this.getAuthorizedAdminApps(profile),
        //   }),
        // };
    }
    /////////////////////////////////////////////
    //             UNAUTHORIZE
    /////////////////////////////////////////////
    async unauthorizeProfileToAccessContext(userProfile, contextIds, digitalTwinId) {
        const profile = userProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode
            ? userProfile
            : await this._getUserProfileNode(userProfile);
        return authorization_service_1.authorizationInstance.unauthorizeProfileToAccessContext(profile, digitalTwinId, contextIds);
    }
    async unauthorizeProfileToAccessApps(userProfile, appIds) {
        const profile = userProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode
            ? userProfile
            : await this._getUserProfileNode(userProfile);
        return authorization_service_1.authorizationInstance.unauthorizeProfileToAccessApps(profile, appIds);
    }
    async unauthorizeProfileToAccessSubApps(userProfile, subAppIds) {
        const profile = userProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode
            ? userProfile
            : await this._getUserProfileNode(userProfile);
        return authorization_service_1.authorizationInstance.unauthorizeProfileToAccessSubApps(profile, subAppIds);
    }
    async unauthorizeProfileToAccessApis(userProfile, apiIds) {
        const profile = userProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode
            ? userProfile
            : await this._getUserProfileNode(userProfile);
        return authorization_service_1.authorizationInstance.unauthorizeProfileToAccessApis(profile, apiIds);
    }
    ///////////////////////////////////////////////
    //             VERIFICATION
    ///////////////////////////////////////////////
    async profileHasAccessToContext(userProfile, contextId, digitalTwinId) {
        const profile = userProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode
            ? userProfile
            : await this._getUserProfileNode(userProfile);
        return authorization_service_1.authorizationInstance.profileHasAccessToContext(profile, digitalTwinId, contextId);
    }
    async profileHasAccessToApp(searchKeys, userProfile, appId) {
        const profile = userProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode
            ? userProfile
            : await this._getUserProfileNode(userProfile);
        return authorization_service_1.authorizationInstance.profileHasAccessToApp(searchKeys, profile, appId);
    }
    async profileHasAccessToSubApp(searchKeys, userProfile, appNameOrId, subAppNameOrId) {
        const profile = userProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode
            ? userProfile
            : await this._getUserProfileNode(userProfile);
        return authorization_service_1.authorizationInstance.profileHasAccessToSubApp(searchKeys, profile, appNameOrId, subAppNameOrId);
    }
    async profileHasAccessToApi(userProfile, apiId) {
        const profile = userProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode
            ? userProfile
            : await this._getUserProfileNode(userProfile);
        return authorization_service_1.authorizationInstance.profileHasAccessToApi(profile, apiId);
    }
    /////////////////////////////////////////////
    //               GET AUTHORIZED
    /////////////////////////////////////////////
    async getAuthorizedContexts(userProfile, digitalTwinId) {
        const profile = userProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode
            ? userProfile
            : await this._getUserProfileNode(userProfile);
        return authorization_service_1.authorizationInstance.getAuthorizedContexts(profile, digitalTwinId);
    }
    async getAuthorizedApps(userProfile) {
        const profile = userProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode
            ? userProfile
            : await this._getUserProfileNode(userProfile);
        return authorization_service_1.authorizationInstance.getAuthorizedApps(profile);
    }
    async getAuthorizedSubApps(userProfile) {
        const profile = userProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode
            ? userProfile
            : await this._getUserProfileNode(userProfile);
        return authorization_service_1.authorizationInstance.getAuthorizedSubApps(profile);
    }
    async getAuthorizedAdminApps(userProfile) {
        const profile = userProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode
            ? userProfile
            : await this._getUserProfileNode(userProfile);
        return authorization_service_1.authorizationInstance.getAuthorizedAdminApps(profile);
    }
    async getAuthorizedApis(userProfile) {
        const profile = userProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode
            ? userProfile
            : await this._getUserProfileNode(userProfile);
        return authorization_service_1.authorizationInstance.getAuthorizedApis(profile);
    }
    ///////////////////////////////////////////////////////////
    ///                       PRIVATES                      //
    //////////////////////////////////////////////////////////
    async _getUserProfileNode(userProfileId) {
        const node = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(userProfileId);
        if (node)
            return node;
        return this._findChildInContext(this.context, userProfileId);
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
exports.UserProfileService = UserProfileService;
//# sourceMappingURL=userProfile.service.js.map