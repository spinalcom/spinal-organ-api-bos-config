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
    static instance;
    context;
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
    /**
     * Creates a new user profile node and authorizes it to access specified APIs, apps, sub-apps, and contexts.
     *
     * @param userProfile - The user profile data containing the profile name and optional lists of API, app, sub-app, and context IDs to authorize.
     * @returns A promise that resolves to an object containing the created profile node and the results of the authorization operations.
     *
     * @remarks
     * - The method creates a new `SpinalNode` for the user profile.
     * - It conditionally authorizes the profile to access APIs, apps, sub-apps, and contexts based on the provided IDs.
     * - The new profile node is added as a child in the context with a specific relation.
     */
    async createUserProfile(userProfile) {
        const profileNode = new spinal_env_viewer_graph_service_1.SpinalNode(userProfile.name, constant_1.USER_PROFILE_TYPE);
        const obj = { node: profileNode };
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
    /**
     * Retrieves the user profile node and its associated authorization structure.
     *
     * @param userProfile - The user profile identifier as a string or a SpinalNode instance.
     * @returns A promise that resolves to an object containing the user profile node and its authorization structure,
     *          or `undefined` if the node could not be found.
     */
    async getUserProfile(userProfile) {
        const node = userProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? userProfile : await this._getUserProfileNode(userProfile);
        if (!node)
            return;
        return {
            node,
            ...(await this.getAutorizationStructure(node)),
        };
    }
    /**
     * Updates a user profile with the provided information.
     *
     * This method performs the following actions:
     * - Retrieves the user profile node by its ID.
     * - Renames the profile if a new name is provided.
     * - Revokes access to APIs, Apps, SubApps, and Contexts as specified.
     * - Grants access to APIs, Apps, SubApps, and Contexts as specified.
     * - Returns the updated user profile.
     *
     * @param userProfileId - The unique identifier of the user profile to update.
     * @param userProfile - An object containing the updated profile information and access rights.
     * @returns A promise that resolves to the updated user profile response, or `undefined` if the profile node is not found.
     */
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
    /**
     * Retrieves all user profiles.
     *
     * This method fetches all user profile nodes and then retrieves the corresponding user profile
     * information for each node. The results are returned as an array of `IProfileRes` objects.
     *
     * @returns {Promise<IProfileRes[]>} A promise that resolves to an array of user profile responses.
     */
    async getAllUserProfile() {
        const contexts = await this.getAllUserProfileNodes();
        const promises = contexts.map((node) => this.getUserProfile(node));
        return Promise.all(promises);
    }
    /**
     * Retrieves all user profile nodes within the current context.
     *
     * @returns {Promise<any[]>} A promise that resolves to an array of user profile nodes found in the context.
     */
    getAllUserProfileNodes() {
        return this.context.getChildrenInContext();
    }
    /**
     * Deletes a user profile by its unique identifier.
     *
     * This method retrieves the user profile node associated with the given `userProfileId`.
     * If the node exists, it removes the node from the graph. If the node does not exist,
     * an error is thrown indicating that no profile was found for the provided ID.
     *
     * @param userProfileId - The unique identifier of the user profile to delete.
     * @returns A promise that resolves to the `userProfileId` of the deleted profile.
     * @throws {Error} If no user profile is found for the given `userProfileId`.
     */
    async deleteUserProfile(userProfileId) {
        const node = await this._getUserProfileNode(userProfileId);
        if (!node)
            throw new Error(`no profile Found for ${userProfileId}`);
        await node.removeFromGraph();
        return userProfileId;
    }
    /**
     * Retrieves the SpinalGraph associated with a user profile and a specific digital twin.
     *
     * @param profileId - The unique identifier of the user profile.
     * @param digitalTwinId - (Optional) The unique identifier of the digital twin.
     * @returns A promise that resolves to the SpinalGraph instance if found, or void otherwise.
     */
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
    /**
     * Authorizes a user profile to access one or more specified contexts within a digital twin.
     *
     * @param userProfile - The user profile to authorize, provided as either a string (profile ID) or a `SpinalNode` instance.
     * @param contextIds - The ID or array of IDs of the contexts to which access is being authorized.
     * @param digitalTwinId - (Optional) The ID of the digital twin in which the contexts reside.
     * @returns A promise that resolves to an array of `SpinalContext` objects representing the contexts the profile is authorized to access.
     */
    async authorizeProfileToAccessContext(userProfile, contextIds, digitalTwinId) {
        const profile = userProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? userProfile : await this._getUserProfileNode(userProfile);
        return authorization_service_1.authorizationInstance.authorizeProfileToAccessContext(profile, digitalTwinId, contextIds);
    }
    /**
     * Authorizes a user profile to access one or more applications.
     *
     * @param userProfile - The user profile to authorize, either as a string identifier or a SpinalNode instance.
     * @param appIds - The application ID or an array of application IDs to which access should be granted.
     * @returns A promise that resolves with the result of the authorization operation.
     */
    async authorizeProfileToAccessApps(userProfile, appIds) {
        const profile = userProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? userProfile : await this._getUserProfileNode(userProfile);
        return authorization_service_1.authorizationInstance.authorizeProfileToAccessApps(profile, appIds);
    }
    /**
     * Authorizes a user profile to access specific sub-applications within the provided applications.
     *
     * @param userProfile - The user profile to authorize, either as a string identifier or a SpinalNode instance.
     * @param apps - An array of SpinalNode instances representing the applications containing the sub-apps.
     * @param subAppIds - A single sub-app ID or an array of sub-app IDs to which access should be granted.
     * @returns A promise that resolves with the result of the authorization operation.
     */
    async authorizeProfileToAccessSubApps(userProfile, apps, subAppIds) {
        const profile = userProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? userProfile : await this._getUserProfileNode(userProfile);
        return authorization_service_1.authorizationInstance.authorizeProfileToAccessSubApps(profile, apps, subAppIds);
    }
    /**
     * Authorizes a user profile to access one or more APIs.
     *
     * @param userProfile - The user profile to authorize, either as a string identifier or a SpinalNode instance.
     * @param apiIds - The API ID or an array of API IDs to which access should be granted.
     * @returns A promise that resolves with the result of the authorization operation.
     */
    async authorizeProfileToAccessApis(userProfile, apiIds) {
        const profile = userProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? userProfile : await this._getUserProfileNode(userProfile);
        return authorization_service_1.authorizationInstance.authorizeProfileToAccessApis(profile, apiIds);
    }
    /**
     * Retrieves the authorization structure for a given user profile.
     *
     * This method gathers all authorized contexts, APIs, apps, and sub-apps for the specified user profile.
     * If the profile is of type ADMIN_PROFILE_TYPE, it also includes authorized admin apps.
     *
     * @param userProfile - The user profile identifier as a string or a SpinalNode instance.
     * @param digitalTwinId - (Optional) The unique identifier of the digital twin.
     * @returns A promise that resolves to an object containing the authorization structure.
     */
    async getAutorizationStructure(userProfile, digitalTwinId) {
        const profile = userProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? userProfile : await this._getUserProfileNode(userProfile);
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
    }
    /////////////////////////////////////////////
    //             UNAUTHORIZE
    /////////////////////////////////////////////
    /**
     * Revokes a user profile's authorization to access one or more contexts within a digital twin.
     *
     * @param userProfile - The user profile identifier or SpinalNode instance representing the profile.
     * @param contextIds - The ID or array of IDs of the contexts to unauthorize.
     * @param digitalTwinId - (Optional) The ID of the digital twin in which the contexts reside.
     * @returns A promise that resolves to an array of SpinalContext objects representing the affected contexts.
     */
    async unauthorizeProfileToAccessContext(userProfile, contextIds, digitalTwinId) {
        const profile = userProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? userProfile : await this._getUserProfileNode(userProfile);
        return authorization_service_1.authorizationInstance.unauthorizeProfileToAccessContext(profile, digitalTwinId, contextIds);
    }
    /**
     * Revokes a user profile's authorization to access one or more applications.
     *
     * @param userProfile - The user profile identifier or SpinalNode instance representing the profile.
     * @param appIds - A single application ID or an array of application IDs to unauthorize.
     * @returns A promise that resolves to an array of SpinalNode instances representing the affected applications.
     */
    async unauthorizeProfileToAccessApps(userProfile, appIds) {
        const profile = userProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? userProfile : await this._getUserProfileNode(userProfile);
        return authorization_service_1.authorizationInstance.unauthorizeProfileToAccessApps(profile, appIds);
    }
    /**
     * Revokes a user profile's authorization to access one or more sub-applications.
     *
     * @param userProfile - The user profile identifier or SpinalNode instance representing the profile.
     * @param subAppIds - A single sub-application ID or an array of sub-application IDs to unauthorize.
     * @returns A promise that resolves to an array of SpinalNode instances representing the affected sub-applications.
     */
    async unauthorizeProfileToAccessSubApps(userProfile, subAppIds) {
        const profile = userProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? userProfile : await this._getUserProfileNode(userProfile);
        return authorization_service_1.authorizationInstance.unauthorizeProfileToAccessSubApps(profile, subAppIds);
    }
    /**
     * Revokes a user profile's access to one or more APIs.
     *
     * @param userProfile - The user profile to unauthorize, either as a string identifier or a SpinalNode instance.
     * @param apiIds - The API ID or an array of API IDs to revoke access from.
     * @returns A promise that resolves with the result of the unauthorization operation.
     */
    async unauthorizeProfileToAccessApis(userProfile, apiIds) {
        const profile = userProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? userProfile : await this._getUserProfileNode(userProfile);
        return authorization_service_1.authorizationInstance.unauthorizeProfileToAccessApis(profile, apiIds);
    }
    ///////////////////////////////////////////////
    //             VERIFICATION
    ///////////////////////////////////////////////
    /**
     * Checks whether a given user profile has access to a specific context within a digital twin.
     *
     * @param userProfile - The user profile identifier (string) or a SpinalNode representing the profile.
     * @param contextId - The identifier of the context to check access for.
     * @param digitalTwinId - (Optional) The identifier of the digital twin instance.
     * @returns A promise that resolves to the SpinalNode if the profile has access to the context.
     */
    async profileHasAccessToContext(userProfile, contextId, digitalTwinId) {
        const profile = userProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? userProfile : await this._getUserProfileNode(userProfile);
        return authorization_service_1.authorizationInstance.profileHasAccessToContext(profile, digitalTwinId, contextId);
    }
    /**
     * Checks if a user profile has access to a specific application.
     *
     * @param searchKeys - The search criteria used to locate the application.
     * @param userProfile - The user profile identifier or a SpinalNode representing the profile.
     * @param appId - The unique identifier of the application to check access for.
     * @returns A promise that resolves to the SpinalNode representing the application if access is granted.
     */
    async profileHasAccessToApp(searchKeys, userProfile, appId) {
        const profile = userProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? userProfile : await this._getUserProfileNode(userProfile);
        return authorization_service_1.authorizationInstance.profileHasAccessToApp(searchKeys, profile, appId);
    }
    /**
     * Checks if a user profile has access to a specific sub-application within an application.
     *
     * @param searchKeys - The search criteria used to locate the application.
     * @param userProfile - The user profile identifier or a SpinalNode representing the profile.
     * @param appNameOrId - The name or ID of the application containing the sub-app.
     * @param subAppNameOrId - The name or ID of the sub-application to check access for.
     * @returns A promise that resolves to the SpinalNode representing the sub-application if access is granted.
     */
    async profileHasAccessToSubApp(searchKeys, userProfile, appNameOrId, subAppNameOrId) {
        const profile = userProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? userProfile : await this._getUserProfileNode(userProfile);
        return authorization_service_1.authorizationInstance.profileHasAccessToSubApp(searchKeys, profile, appNameOrId, subAppNameOrId);
    }
    /**
     * Checks if a user profile has access to a specific API.
     *
     * @param userProfile - The user profile identifier (string) or a SpinalNode representing the profile.
     * @param apiId - The unique identifier of the API to check access for.
     * @returns A promise that resolves to the SpinalNode representing the API if access is granted.
     */
    async profileHasAccessToApi(userProfile, apiId) {
        const profile = userProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? userProfile : await this._getUserProfileNode(userProfile);
        return authorization_service_1.authorizationInstance.profileHasAccessToApi(profile, apiId);
    }
    /////////////////////////////////////////////
    //               GET AUTHORIZED
    /////////////////////////////////////////////
    /**
     * Retrieves all contexts that a user profile is authorized to access.
     *
     * @param userProfile - The user profile identifier (string) or a SpinalNode representing the profile.
     * @param digitalTwinId - (Optional) The unique identifier of the digital twin.
     * @returns A promise that resolves to an array of SpinalContext objects the profile is authorized to access.
     */
    async getAuthorizedContexts(userProfile, digitalTwinId) {
        const profile = userProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? userProfile : await this._getUserProfileNode(userProfile);
        return authorization_service_1.authorizationInstance.getAuthorizedContexts(profile, digitalTwinId);
    }
    /**
     * Retrieves all applications that a user profile is authorized to access.
     *
     * @param userProfile - The user profile identifier (string) or a SpinalNode representing the profile.
     * @returns A promise that resolves to an array of SpinalNode objects representing the authorized applications.
     */
    async getAuthorizedApps(userProfile) {
        const profile = userProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? userProfile : await this._getUserProfileNode(userProfile);
        return authorization_service_1.authorizationInstance.getAuthorizedApps(profile);
    }
    /**
     * Retrieves the list of authorized sub-applications for a given user profile.
     *
     * @param userProfile - The user profile identifier or a SpinalNode instance representing the user profile.
     * @returns A promise that resolves to an array of SpinalNode objects representing the authorized sub-applications.
     */
    async getAuthorizedSubApps(userProfile) {
        const profile = userProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? userProfile : await this._getUserProfileNode(userProfile);
        return authorization_service_1.authorizationInstance.getAuthorizedSubApps(profile);
    }
    /**
     * Retrieves the list of admin applications that the specified user profile is authorized to access.
     *
     * @param userProfile - The user profile identifier or a SpinalNode instance representing the user profile.
     * @returns A promise that resolves to an array of SpinalNode objects representing the authorized admin applications.
     */
    async getAuthorizedAdminApps(userProfile) {
        const profile = userProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? userProfile : await this._getUserProfileNode(userProfile);
        return authorization_service_1.authorizationInstance.getAuthorizedAdminApps(profile);
    }
    /**
     * Retrieves all APIs that a user profile is authorized to access.
     *
     * @param userProfile - The user profile identifier (string) or a SpinalNode representing the profile.
     * @returns A promise that resolves to an array of SpinalNode objects representing the authorized APIs.
     */
    async getAuthorizedApis(userProfile) {
        const profile = userProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? userProfile : await this._getUserProfileNode(userProfile);
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
            if (el.getId().get() === nodeIdOrName || el.getName().get() === nodeIdOrName) {
                spinal_env_viewer_graph_service_1.SpinalGraphService._addNode(el);
                return true;
            }
            return false;
        });
    }
}
exports.UserProfileService = UserProfileService;
//# sourceMappingURL=userProfile.service.js.map