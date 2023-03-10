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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.context = yield configFile_service_1.configServiceInstance.getContext(constant_1.APP_PROFILE_CONTEXT_NAME);
            if (!this.context)
                this.context = yield configFile_service_1.configServiceInstance.addContext(constant_1.APP_PROFILE_CONTEXT_NAME, constant_1.APP_PROFILE_CONTEXT_TYPE);
            return this.context;
        });
    }
    /// CRUD BEGIN
    createAppProfile(appProfile) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileNode = new spinal_env_viewer_graph_service_1.SpinalNode(appProfile.name, constant_1.APP_PROFILE_TYPE);
            const obj = {
                node: profileNode
            };
            if (appProfile.apisIds)
                obj.apis = yield this.authorizeProfileToAccessApis(profileNode, appProfile.apisIds);
            if (appProfile.appsIds)
                obj.apps = yield this.authorizeProfileToAccessApps(profileNode, appProfile.appsIds);
            if (appProfile.contextIds)
                obj.contexts = yield this.authorizeProfileToAccessContext(profileNode, appProfile.contextIds);
            yield this.context.addChildInContext(profileNode, constant_1.CONTEXT_TO_USER_PROFILE_RELATION_NAME, constant_1.PTR_LST_TYPE, this.context);
            return obj;
        });
    }
    getAppProfile(appProfile) {
        return __awaiter(this, void 0, void 0, function* () {
            const node = appProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? appProfile : yield this._getAppProfileNode(appProfile);
            if (!node)
                return;
            return Object.assign({ node }, (yield this.getAutorizationStructure(node)));
        });
    }
    updateAppProfile(appProfileId, appProfile) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileNode = yield this._getAppProfileNode(appProfileId);
            if (!profileNode)
                return;
            this._renameProfile(profileNode, appProfile.name);
            if (appProfile.unauthorizeApisIds)
                yield this.unauthorizeProfileToAccessApis(profileNode, appProfile.unauthorizeApisIds);
            if (appProfile.unauthorizeAppsIds)
                yield this.unauthorizeProfileToAccessApps(profileNode, appProfile.unauthorizeAppsIds);
            if (appProfile.unauthorizeContextIds)
                yield this.unauthorizeProfileToAccessContext(profileNode, appProfile.unauthorizeContextIds);
            if (appProfile.apisIds)
                yield this.authorizeProfileToAccessApis(profileNode, appProfile.apisIds);
            if (appProfile.appsIds)
                yield this.authorizeProfileToAccessApps(profileNode, appProfile.appsIds);
            if (appProfile.contextIds)
                yield this.authorizeProfileToAccessContext(profileNode, appProfile.contextIds);
            return this.getAppProfile(profileNode);
        });
    }
    getAllAppProfile() {
        return __awaiter(this, void 0, void 0, function* () {
            const contexts = yield this.getAllAppProfileNodes();
            const promises = contexts.map(node => this.getAppProfile(node));
            return Promise.all(promises);
        });
    }
    getAllAppProfileNodes() {
        return this.context.getChildrenInContext();
    }
    deleteAppProfile(appProfileId) {
        return __awaiter(this, void 0, void 0, function* () {
            const node = yield this._getAppProfileNode(appProfileId);
            if (!node)
                throw new Error(`no profile Found for ${appProfileId}`);
            yield node.removeFromGraph();
            return appProfileId;
        });
    }
    getAppProfileNodeGraph(profileId, digitalTwinId) {
        return __awaiter(this, void 0, void 0, function* () {
            const profile = yield this._getAppProfileNode(profileId);
            if (profile) {
                const digitalTwin = yield authorization_service_1.authorizationInstance.getAuthorizedDigitalTwinNode(profile, digitalTwinId);
                if (digitalTwin)
                    return digitalTwin.getElement();
            }
        });
    }
    /// END CRUD
    /// AUTH BEGIN
    /////////////////////////////////////////////
    //               AUTHORIZE
    /////////////////////////////////////////////
    authorizeProfileToAccessContext(appProfile, contextIds, digitalTwinId) {
        return __awaiter(this, void 0, void 0, function* () {
            const profile = appProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? appProfile : yield this._getAppProfileNode(appProfile);
            return authorization_service_1.authorizationInstance.authorizeProfileToAccessContext(profile, digitalTwinId, contextIds);
        });
    }
    authorizeProfileToAccessApps(appProfile, appIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const profile = appProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? appProfile : yield this._getAppProfileNode(appProfile);
            return authorization_service_1.authorizationInstance.authorizeProfileToAccessApps(profile, appIds);
        });
    }
    authorizeProfileToAccessApis(appProfile, apiIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const profile = appProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? appProfile : yield this._getAppProfileNode(appProfile);
            return authorization_service_1.authorizationInstance.authorizeProfileToAccessApis(profile, apiIds);
        });
    }
    getAutorizationStructure(appProfile, digitalTwinId) {
        return __awaiter(this, void 0, void 0, function* () {
            const profile = appProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? appProfile : yield this._getAppProfileNode(appProfile);
            return {
                contexts: yield this.getAuthorizedContexts(profile, digitalTwinId),
                apis: yield this.getAuthorizedApis(profile),
                apps: yield this.getAuthorizedApps(profile)
            };
        });
    }
    /////////////////////////////////////////////
    //             UNAUTHORIZE
    /////////////////////////////////////////////
    unauthorizeProfileToAccessContext(appProfile, contextIds, digitalTwinId) {
        return __awaiter(this, void 0, void 0, function* () {
            const profile = appProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? appProfile : yield this._getAppProfileNode(appProfile);
            return authorization_service_1.authorizationInstance.unauthorizeProfileToAccessContext(profile, digitalTwinId, contextIds);
        });
    }
    unauthorizeProfileToAccessApps(appProfile, appIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const profile = appProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? appProfile : yield this._getAppProfileNode(appProfile);
            return authorization_service_1.authorizationInstance.unauthorizeProfileToAccessApps(profile, appIds);
        });
    }
    unauthorizeProfileToAccessApis(appProfile, apiIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const profile = appProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? appProfile : yield this._getAppProfileNode(appProfile);
            return authorization_service_1.authorizationInstance.unauthorizeProfileToAccessApis(profile, apiIds);
        });
    }
    ///////////////////////////////////////////////
    //             VERIFICATION
    ///////////////////////////////////////////////
    profileHasAccessToContext(appProfile, contextId, digitalTwinId) {
        return __awaiter(this, void 0, void 0, function* () {
            const profile = appProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? appProfile : yield this._getAppProfileNode(appProfile);
            return authorization_service_1.authorizationInstance.profileHasAccessToContext(profile, digitalTwinId, contextId);
        });
    }
    profileHasAccessToApp(appProfile, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            const profile = appProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? appProfile : yield this._getAppProfileNode(appProfile);
            return authorization_service_1.authorizationInstance.profileHasAccessToApp(profile, appId);
        });
    }
    profileHasAccessToApi(appProfile, apiId) {
        return __awaiter(this, void 0, void 0, function* () {
            const profile = appProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? appProfile : yield this._getAppProfileNode(appProfile);
            return authorization_service_1.authorizationInstance.profileHasAccessToApi(profile, apiId);
        });
    }
    /////////////////////////////////////////////
    //               GET AUTHORIZED
    /////////////////////////////////////////////
    getAuthorizedContexts(appProfile, digitalTwinId) {
        return __awaiter(this, void 0, void 0, function* () {
            const profile = appProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? appProfile : yield this._getAppProfileNode(appProfile);
            return authorization_service_1.authorizationInstance.getAuthorizedContexts(profile, digitalTwinId);
        });
    }
    getAuthorizedApps(appProfile) {
        return __awaiter(this, void 0, void 0, function* () {
            const profile = appProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? appProfile : yield this._getAppProfileNode(appProfile);
            return authorization_service_1.authorizationInstance.getAuthorizedApps(profile);
        });
    }
    getAuthorizedApis(appProfile) {
        return __awaiter(this, void 0, void 0, function* () {
            const profile = appProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? appProfile : yield this._getAppProfileNode(appProfile);
            return authorization_service_1.authorizationInstance.getAuthorizedApis(profile);
        });
    }
    ///////////////////////////////////////////////////////////
    ///                       PRIVATES                      //
    //////////////////////////////////////////////////////////
    _getAppProfileNodeGraph(profileId) {
        return __awaiter(this, void 0, void 0, function* () {
            const profile = yield this._getAppProfileNode(profileId);
            if (profile)
                return profile.getElement();
        });
    }
    _getAppProfileNode(appProfileId) {
        return __awaiter(this, void 0, void 0, function* () {
            const node = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(appProfileId);
            if (node)
                return node;
            return this._findChildInContext(this.context, appProfileId);
        });
    }
    _renameProfile(node, newName) {
        if (newName && newName.trim())
            node.info.name.set(newName);
    }
    _findChildInContext(startNode, nodeIdOrName) {
        return __awaiter(this, void 0, void 0, function* () {
            const children = yield startNode.getChildrenInContext(this.context);
            return children.find(el => {
                if (el.getId().get() === nodeIdOrName || el.getName().get() === nodeIdOrName) {
                    //@ts-ignore
                    spinal_env_viewer_graph_service_1.SpinalGraphService._addNode(el);
                    return true;
                }
                return false;
            });
        });
    }
}
exports.AppProfileService = AppProfileService;
//# sourceMappingURL=appProfile.service.js.map