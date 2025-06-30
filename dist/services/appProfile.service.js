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
    static instance;
    context;
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
    /**
     * Creates a new application profile node and authorizes access to APIs, apps, and contexts if provided.
     * @param appProfile The profile data to create.
     * @returns The created profile node and its authorized resources.
     */
    async createAppProfile(appProfile) {
        const profileNode = new spinal_env_viewer_graph_service_1.SpinalNode(appProfile.name, constant_1.APP_PROFILE_TYPE);
        const obj = { node: profileNode };
        if (appProfile.apisIds)
            obj.apis = await this.authorizeProfileToAccessApis(profileNode, appProfile.apisIds);
        if (appProfile.appsIds)
            obj.apps = await this.authorizeProfileToAccessApps(profileNode, appProfile.appsIds);
        if (appProfile.contextIds)
            obj.contexts = await this.authorizeProfileToAccessContext(profileNode, appProfile.contextIds);
        await this.context.addChildInContext(profileNode, constant_1.CONTEXT_TO_USER_PROFILE_RELATION_NAME, constant_1.PTR_LST_TYPE, this.context);
        return obj;
    }
    /**
     * Retrieves the application profile node and its associated authorization structure.
     *
     * @param appProfile - The application profile identifier or a SpinalNode instance.
     * @returns A promise that resolves to an object containing the profile node and its authorization structure,
     *          or `undefined` if the node could not be found.
     */
    async getAppProfile(appProfile) {
        const node = appProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? appProfile : await this._getAppProfileNode(appProfile);
        if (!node)
            return;
        return { node, ...(await this.getAutorizationStructure(node)) };
    }
    /**
     * Updates an existing application profile node with new data and re-authorizes access to APIs, apps, and contexts.
     *
     * @param {string} appProfileId
     * @param {IProfileAuthEdit} appProfile
     * @return {*}  {Promise<IProfileRes>}
     * @memberof AppProfileService
     */
    async updateAppProfile(appProfileId, appProfile) {
        const profileNode = await this._getAppProfileNode(appProfileId);
        if (!profileNode)
            return;
        this._renameProfile(profileNode, appProfile.name);
        await this._unauthorizeAll(profileNode, appProfile);
        await this._authorizeAll(profileNode, appProfile);
        return this.getAppProfile(profileNode);
    }
    /**
     * Retrieves all application profiles with their authorization structures.
     * @returns A promise that resolves to an array of profile nodes and their authorized resources.
     */
    async getAllAppProfile() {
        const contexts = await this.getAllAppProfileNodes();
        const promises = contexts.map((node) => this.getAppProfile(node));
        return Promise.all(promises);
    }
    /**
     * Retrieves all application profile nodes in the context.
     * @returns An array of SpinalNode instances representing all application profiles.
     */
    getAllAppProfileNodes() {
        return this.context.getChildrenInContext();
    }
    /**
     * Deletes an application profile node from the graph.
     *
     * @param {string} appProfileId
     * @return {*}  {Promise<string>}
     * @memberof AppProfileService
     */
    async deleteAppProfile(appProfileId) {
        const node = await this._getAppProfileNode(appProfileId);
        if (!node)
            throw new Error(`no profile Found for ${appProfileId}`);
        await node.removeFromGraph();
        return appProfileId;
    }
    /**
     * Retrieves the application profile node graph by its ID.
     * @param {string} profileId - The ID of the application profile.
     * @param {string} [digitalTwinId] - Optional digital twin ID for authorization.
     * @returns {Promise<SpinalGraph | void>} A promise that resolves to the SpinalGraph of the application profile or void if not found.
     */
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
    /**
     * Authorizes an application profile to access specified contexts, apps, and APIs.
     * @param appProfile The application profile node or its ID.
     * @param data The authorization data containing context IDs, app IDs, and API IDs.
     * @returns A promise that resolves to the authorized resources.
     */
    async authorizeProfileToAccessContext(appProfile, contextIds, digitalTwinId) {
        const profile = appProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? appProfile : await this._getAppProfileNode(appProfile);
        return authorization_service_1.authorizationInstance.authorizeProfileToAccessContext(profile, digitalTwinId, contextIds);
    }
    /**
     * Authorizes an application profile to access specified apps.
     *
     * @param {(string | SpinalNode)} appProfile
     * @param {(string | string[])} appIds
     * @return {*}
     * @memberof AppProfileService
     */
    async authorizeProfileToAccessApps(appProfile, appIds) {
        const profile = appProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? appProfile : await this._getAppProfileNode(appProfile);
        return authorization_service_1.authorizationInstance.authorizeProfileToAccessApps(profile, appIds);
    }
    /**
     * Authorizes an application profile to access specified APIs.
     *
     * @param {(string | SpinalNode)} appProfile
     * @param {(string | string[])} apiIds
     * @return {*}
     * @memberof AppProfileService
     */
    async authorizeProfileToAccessApis(appProfile, apiIds) {
        const profile = appProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? appProfile : await this._getAppProfileNode(appProfile);
        return authorization_service_1.authorizationInstance.authorizeProfileToAccessApis(profile, apiIds);
    }
    /**
     * Retrieves the authorization structure for a given application profile.
     *
     * @param {(string | SpinalNode)} appProfile
     * @param {string} [digitalTwinId]
     * @return {*}  {Promise<IProfileAuthRes>}
     * @memberof AppProfileService
     */
    async getAutorizationStructure(appProfile, digitalTwinId) {
        const profile = appProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? appProfile : await this._getAppProfileNode(appProfile);
        return {
            contexts: await this.getAuthorizedContexts(profile, digitalTwinId),
            apis: await this.getAuthorizedApis(profile),
            apps: await this.getAuthorizedApps(profile),
        };
    }
    /////////////////////////////////////////////
    //             UNAUTHORIZE
    /////////////////////////////////////////////
    /**
     * Unauthorizes an application profile from accessing specified contexts.
     *
     * @param {(string | SpinalNode)} appProfile
     * @param {(string | string[])} contextIds
     * @param {string} [digitalTwinId]
     * @return {*}  {Promise<SpinalContext[]>}
     * @memberof AppProfileService
     */
    async unauthorizeProfileToAccessContext(appProfile, contextIds, digitalTwinId) {
        const profile = appProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? appProfile : await this._getAppProfileNode(appProfile);
        return authorization_service_1.authorizationInstance.unauthorizeProfileToAccessContext(profile, digitalTwinId, contextIds);
    }
    /**
     * Unauthorizes an application profile from accessing specified apps.
     *
     * @param {(string | SpinalNode)} appProfile
     * @param {(string | string[])} appIds
     * @return {*}  {Promise<SpinalNode[]>}
     * @memberof AppProfileService
     */
    async unauthorizeProfileToAccessApps(appProfile, appIds) {
        const profile = appProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? appProfile : await this._getAppProfileNode(appProfile);
        return authorization_service_1.authorizationInstance.unauthorizeProfileToAccessApps(profile, appIds);
    }
    /**
     * Unauthorizes an application profile from accessing specified APIs.
     *
     * @param {(string | SpinalNode)} appProfile
     * @param {(string | string[])} apiIds
     * @return {*}  {Promise<SpinalNode[]>}
     * @memberof AppProfileService
     */
    async unauthorizeProfileToAccessApis(appProfile, apiIds) {
        const profile = appProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? appProfile : await this._getAppProfileNode(appProfile);
        return authorization_service_1.authorizationInstance.unauthorizeProfileToAccessApis(profile, apiIds);
    }
    ///////////////////////////////////////////////
    //             VERIFICATION
    ///////////////////////////////////////////////
    /**
     * Checks if an application profile has access to a specific context.
     *
     * @param {(string | SpinalNode)} appProfile
     * @param {string} contextId
     * @param {string} [digitalTwinId]
     * @return {*}  {Promise<SpinalNode>}
     * @memberof AppProfileService
     */
    async profileHasAccessToContext(appProfile, contextId, digitalTwinId) {
        const profile = appProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? appProfile : await this._getAppProfileNode(appProfile);
        return authorization_service_1.authorizationInstance.profileHasAccessToContext(profile, digitalTwinId, contextId);
    }
    /**
     * Checks if an application profile has access to a specific app.
     *
     * @param {TAppSearch} searchKeys
     * @param {(string | SpinalNode)} appProfile
     * @param {string} appId
     * @return {*}  {Promise<SpinalNode>}
     * @memberof AppProfileService
     */
    async profileHasAccessToApp(searchKeys, appProfile, appId) {
        const profile = appProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? appProfile : await this._getAppProfileNode(appProfile);
        return authorization_service_1.authorizationInstance.profileHasAccessToApp(searchKeys, profile, appId);
    }
    /**
     * Checks if an application profile has access to a specific API.
     *
     * @param {(string | SpinalNode)} appProfile
     * @param {string} apiId
     * @return {*}  {Promise<SpinalNode>}
     * @memberof AppProfileService
     */
    async profileHasAccessToApi(appProfile, apiId) {
        const profile = appProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? appProfile : await this._getAppProfileNode(appProfile);
        return authorization_service_1.authorizationInstance.profileHasAccessToApi(profile, apiId);
    }
    /////////////////////////////////////////////
    //               GET AUTHORIZED
    /////////////////////////////////////////////
    /**
     * Retrieves the contexts that an application profile is authorized to access.
     *
     * @param {(string | SpinalNode)} appProfile
     * @param {string} [digitalTwinId]
     * @return {*}  {Promise<SpinalContext[]>}
     * @memberof AppProfileService
     */
    async getAuthorizedContexts(appProfile, digitalTwinId) {
        const profile = appProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? appProfile : await this._getAppProfileNode(appProfile);
        return authorization_service_1.authorizationInstance.getAuthorizedContexts(profile, digitalTwinId);
    }
    /**
     * Retrieves the applications that an application profile is authorized to access.
     *
     * @param {(string | SpinalNode)} appProfile
     * @return {*}  {Promise<SpinalNode[]>}
     * @memberof AppProfileService
     */
    async getAuthorizedApps(appProfile) {
        const profile = appProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? appProfile : await this._getAppProfileNode(appProfile);
        return authorization_service_1.authorizationInstance.getAuthorizedApps(profile);
    }
    /**
     * Retrieves the APIs that an application profile is authorized to access.
     *
     * @param {(string | SpinalNode)} appProfile
     * @return {*}  {Promise<SpinalNode[]>}
     * @memberof AppProfileService
     */
    async getAuthorizedApis(appProfile) {
        const profile = appProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? appProfile : await this._getAppProfileNode(appProfile);
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
            if (el.getId().get() === nodeIdOrName || el.getName().get() === nodeIdOrName) {
                //@ts-ignore
                spinal_env_viewer_graph_service_1.SpinalGraphService._addNode(el);
                return true;
            }
            return false;
        });
    }
    _unauthorizeAll(profile, data) {
        const unauthorizePromises = [];
        if (data.unauthorizeApisIds)
            unauthorizePromises.push(this.unauthorizeProfileToAccessApis(profile, data.unauthorizeApisIds));
        if (data.unauthorizeAppsIds)
            unauthorizePromises.push(this.unauthorizeProfileToAccessApps(profile, data.unauthorizeAppsIds));
        if (data.unauthorizeContextIds)
            unauthorizePromises.push(this.unauthorizeProfileToAccessContext(profile, data.unauthorizeContextIds));
        return Promise.all(unauthorizePromises);
    }
    async _authorizeAll(profile, data) {
        const authorizePromises = [];
        authorizePromises.push(this.authorizeProfileToAccessApis(profile, data.apiIds || []));
        authorizePromises.push(this.authorizeProfileToAccessApps(profile, data.appsIds || []));
        authorizePromises.push(this.authorizeProfileToAccessContext(profile, data.contextIds || []));
        const [apis, apps, contexts] = await Promise.all(authorizePromises);
        return {
            apis,
            apps,
            contexts
        };
    }
}
exports.AppProfileService = AppProfileService;
//# sourceMappingURL=appProfile.service.js.map