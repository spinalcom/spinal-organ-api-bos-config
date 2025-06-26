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
exports.AdminProfileService = void 0;
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const constant_1 = require("../constant");
const authorization_service_1 = require("./authorization.service");
const userProfile_service_1 = require("./userProfile.service");
const digitalTwin_service_1 = require("./digitalTwin.service");
const apps_service_1 = require("./apps.service");
const apis_service_1 = require("./apis.service");
class AdminProfileService {
    constructor() { }
    static getInstance() {
        if (!this.instance) {
            this.instance = new AdminProfileService();
        }
        return this.instance;
    }
    get adminNode() {
        return this._adminNode;
    }
    async init(context) {
        let node = await this.getAdminProfile(context);
        if (!node) {
            node = this._createAdminProfile();
            await context.addChildInContext(node, constant_1.CONTEXT_TO_USER_PROFILE_RELATION_NAME, constant_1.PTR_LST_TYPE, context);
        }
        this._adminNode = node;
        await this.syncAdminProfile();
        return node;
    }
    /**
     * Retrieves the admin profile node from the specified context or the default user profile context.
     *
     * If the admin profile node has already been retrieved and cached, it returns the cached node.
     * Otherwise, it fetches the children of the context and searches for a node with the name
     * `ADMIN_PROFILE_NAME` and type `ADMIN_PROFILE_TYPE`.
     *
     * @param argContext - (Optional) The context from which to retrieve the admin profile node.
     *                     If not provided, the default user profile context is used.
     * @returns A promise that resolves to the admin profile `SpinalNode` if found, otherwise `undefined`.
     */
    async getAdminProfile(argContext) {
        if (this._adminNode)
            return this._adminNode;
        const context = argContext || userProfile_service_1.UserProfileService.getInstance().context;
        if (!context)
            return;
        const children = await context.getChildren();
        return children.find((el) => {
            return (el.getName().get() === constant_1.ADMIN_PROFILE_NAME &&
                el.getType().get() === constant_1.ADMIN_PROFILE_TYPE);
        });
    }
    /**
     * Adds one or more applications to the admin profile, authorizing access for the profile.
     *
     * @param apps - A single `SpinalNode` instance or an array of `SpinalNode` instances representing the applications to be added.
     * @returns A promise that resolves to an array of `SpinalNode` instances that have been authorized for the profile.
     */
    async addAppToProfil(apps) {
        if (!Array.isArray(apps))
            apps = [apps];
        return userProfile_service_1.UserProfileService.getInstance().authorizeProfileToAccessApps(this._adminNode, apps.map((el) => el.getId().get()));
    }
    /**
     * Authorizes the admin profile to access a sub-app under a specific app.
     * @param app The parent app node.
     * @param subApp The sub-app node to authorize.
     * @returns {Promise<SpinalNode[]>} A promise that resolves to an array of authorized sub-app nodes.
     */
    async addSubAppToProfil(app, subApp) {
        return userProfile_service_1.UserProfileService.getInstance().authorizeProfileToAccessSubApps(this._adminNode, [app], subApp.getId().get());
    }
    /**
     * Authorizes the admin profile to access the given admin apps.
     * @param apps One or more admin app nodes.
     * @returns {Promise<SpinalNode[]>} A promise that resolves to an array of authorized admin app nodes.
     */
    async addAdminAppToProfil(apps) {
        if (!Array.isArray(apps))
            apps = [apps];
        return authorization_service_1.default.getInstance().authorizeProfileToAccessAdminApps(this._adminNode, apps.map((el) => el.getId().get()));
    }
    /**
     * Authorizes the admin profile to access the given APIs.
     * @param apis One or more API nodes.
     * @returns {Promise<SpinalNode[]>} A promise that resolves to an array of authorized API nodes.
     */
    async addApiToProfil(apis) {
        if (!Array.isArray(apis))
            apis = [apis];
        return userProfile_service_1.UserProfileService.getInstance().authorizeProfileToAccessApis(this._adminNode, apis.map((el) => el.getId().get()));
    }
    /**
     * Authorizes the admin profile to access the given digital twins.
     * Adds each digital twin as a child of the admin profile node using the appropriate relation.
     * @param digitalTwins One or more digital twin nodes.
     * @returns {Promise<SpinalNode[]>} A promise that resolves to an array of authorized digital twin nodes.
     */
    async addDigitalTwinToAdminProfile(digitalTwins) {
        if (!Array.isArray(digitalTwins))
            digitalTwins = [digitalTwins];
        const promises = [];
        for (const digitalTwin of digitalTwins) {
            promises.push(this._adminNode
                .addChild(digitalTwin, constant_1.PROFILE_TO_AUTHORIZED_DIGITAL_TWIN_RELATION_NAME, constant_1.PTR_LST_TYPE).catch((error) => { }));
        }
        return Promise.all(promises).then((result) => {
            return result.filter((node) => node instanceof spinal_env_viewer_graph_service_1.SpinalNode);
        });
    }
    /**
     * Synchronizes the admin profile by authorizing access to all digital twins, apps, admin apps, and APIs.
     *
     * @returns {Promise<any>} A promise that resolves to an object containing:
     *   - `digitaTwins`: The result of authorizing all digital twins.
     *   - `apps`: An array with the results of authorizing all apps and all admin apps.
     *   - `apis`: The result of authorizing all APIs.
     *
     * @remarks
     * This method aggregates the results of multiple asynchronous authorization operations
     * related to digital twins, applications, and APIs for the admin profile.
     */
    async syncAdminProfile() {
        return {
            digitaTwins: await this._authorizeAllDigitalTwin(),
            apps: await Promise.all([
                this._authorizeAllApps(),
                this._authorizeAllAdminApps(),
            ]),
            apis: await this._authorizeAllApis(),
        };
    }
    /**
     * Creates a new admin profile node.
     * @returns {SpinalNode} The created admin profile node.
     * @private
     */
    _createAdminProfile() {
        const info = {
            name: constant_1.ADMIN_PROFILE_NAME,
            type: constant_1.ADMIN_PROFILE_TYPE,
        };
        const graph = new spinal_env_viewer_graph_service_1.SpinalGraph(constant_1.ADMIN_PROFILE_NAME);
        const profileId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode(info, graph);
        const node = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(profileId);
        return node;
    }
    /**
     * Authorizes all digital twins by retrieving them and adding them to the admin profile.
     *
     * @returns {Promise<SpinalNode[]>} A promise that resolves to an array of `SpinalNode` instances representing the authorized digital twins.
     * @private
     */
    async _authorizeAllDigitalTwin() {
        const digitalTwins = await digitalTwin_service_1.DigitalTwinService.getInstance().getAllDigitalTwins();
        return this.addDigitalTwinToAdminProfile(digitalTwins);
    }
    /**
     * Authorizes all building applications by retrieving them and adding them to the admin profile.
     *
     * @returns {Promise<SpinalNode[]>} A promise that resolves to an array of `SpinalNode` instances representing the authorized building applications.
     * @private
     */
    async _authorizeAllApps() {
        const buildingApps = await apps_service_1.AppService.getInstance().getAllBuildingApps();
        return this.addAppToProfil(buildingApps);
    }
    async _authorizeAllApis() {
        const apis = await apis_service_1.APIService.getInstance().getAllApiRoute();
        return this.addApiToProfil(apis);
    }
    async _authorizeAllAdminApps() {
        const adminApps = await apps_service_1.AppService.getInstance().getAllAdminApps();
        return this.addAdminAppToProfil(adminApps);
    }
}
exports.AdminProfileService = AdminProfileService;
//# sourceMappingURL=adminProfile.service.js.map