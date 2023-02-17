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
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.context = yield configFile_service_1.configServiceInstance.getContext(constant_1.USER_PROFILE_CONTEXT_NAME);
            if (!this.context)
                this.context = yield configFile_service_1.configServiceInstance.addContext(constant_1.USER_PROFILE_CONTEXT_NAME, constant_1.USER_PROFILE_CONTEXT_TYPE);
            yield adminProfile_service_1.AdminProfileService.getInstance().init(this.context);
            return this.context;
        });
    }
    /// CRUD BEGIN
    createUserProfile(userProfile) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileNode = new spinal_env_viewer_graph_service_1.SpinalNode(userProfile.name, constant_1.USER_PROFILE_TYPE);
            const obj = {
                node: profileNode
            };
            if (userProfile.apisIds)
                obj.apis = yield this.authorizeProfileToAccessApis(profileNode, userProfile.apisIds);
            if (userProfile.appsIds)
                obj.apps = yield this.authorizeProfileToAccessApps(profileNode, userProfile.appsIds);
            if (userProfile.contextIds)
                obj.contexts = yield this.authorizeProfileToAccessContext(profileNode, userProfile.contextIds);
            yield this.context.addChildInContext(profileNode, constant_1.CONTEXT_TO_USER_PROFILE_RELATION_NAME, constant_1.PTR_LST_TYPE, this.context);
            return obj;
        });
    }
    getUserProfile(userProfile) {
        return __awaiter(this, void 0, void 0, function* () {
            const node = userProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? userProfile : yield this._getUserProfileNode(userProfile);
            if (!node)
                return;
            return Object.assign({ node }, (yield this.getAutorizationStructure(node)));
        });
    }
    updateUserProfile(userProfileId, userProfile) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileNode = yield this._getUserProfileNode(userProfileId);
            if (!profileNode)
                return;
            this._renameProfile(profileNode, userProfile.name);
            if (userProfile.unauthorizeApisIds)
                yield this.unauthorizeProfileToAccessApis(profileNode, userProfile.unauthorizeApisIds);
            if (userProfile.unauthorizeAppsIds)
                yield this.unauthorizeProfileToAccessApps(profileNode, userProfile.unauthorizeAppsIds);
            if (userProfile.unauthorizeContextIds)
                yield this.unauthorizeProfileToAccessContext(profileNode, userProfile.unauthorizeContextIds);
            if (userProfile.apisIds)
                yield this.authorizeProfileToAccessApis(profileNode, userProfile.apisIds);
            if (userProfile.appsIds)
                yield this.authorizeProfileToAccessApps(profileNode, userProfile.appsIds);
            if (userProfile.contextIds)
                yield this.authorizeProfileToAccessContext(profileNode, userProfile.contextIds);
            return this.getUserProfile(profileNode);
        });
    }
    getAllUserProfile() {
        return __awaiter(this, void 0, void 0, function* () {
            const contexts = yield this.getAllUserProfileNodes();
            const promises = contexts.map(node => this.getUserProfile(node));
            return Promise.all(promises);
        });
    }
    getAllUserProfileNodes() {
        return this.context.getChildrenInContext();
    }
    deleteUserProfile(userProfileId) {
        return __awaiter(this, void 0, void 0, function* () {
            const node = yield this._getUserProfileNode(userProfileId);
            if (!node)
                throw new Error(`no profile Found for ${userProfileId}`);
            yield node.removeFromGraph();
            return userProfileId;
        });
    }
    getUserProfileNodeGraph(profileId, digitalTwinId) {
        return __awaiter(this, void 0, void 0, function* () {
            const profile = yield this._getUserProfileNode(profileId);
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
    authorizeProfileToAccessContext(userProfile, contextIds, digitalTwinId) {
        return __awaiter(this, void 0, void 0, function* () {
            const profile = userProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? userProfile : yield this._getUserProfileNode(userProfile);
            return authorization_service_1.authorizationInstance.authorizeProfileToAccessContext(profile, digitalTwinId, contextIds);
        });
    }
    authorizeProfileToAccessApps(userProfile, appIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const profile = userProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? userProfile : yield this._getUserProfileNode(userProfile);
            return authorization_service_1.authorizationInstance.authorizeProfileToAccessApps(profile, appIds);
        });
    }
    authorizeProfileToAccessApis(userProfile, apiIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const profile = userProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? userProfile : yield this._getUserProfileNode(userProfile);
            return authorization_service_1.authorizationInstance.authorizeProfileToAccessApis(profile, apiIds);
        });
    }
    getAutorizationStructure(userProfile, digitalTwinId) {
        return __awaiter(this, void 0, void 0, function* () {
            const profile = userProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? userProfile : yield this._getUserProfileNode(userProfile);
            return Object.assign({ contexts: yield this.getAuthorizedContexts(profile, digitalTwinId), apis: yield this.getAuthorizedApis(profile), apps: yield this.getAuthorizedApps(profile) }, (profile.getType().get() === constant_1.ADMIN_PROFILE_TYPE && { adminApps: yield this.getAuthorizedAdminApps(profile) }));
        });
    }
    /////////////////////////////////////////////
    //             UNAUTHORIZE
    /////////////////////////////////////////////
    unauthorizeProfileToAccessContext(userProfile, contextIds, digitalTwinId) {
        return __awaiter(this, void 0, void 0, function* () {
            const profile = userProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? userProfile : yield this._getUserProfileNode(userProfile);
            return authorization_service_1.authorizationInstance.unauthorizeProfileToAccessContext(profile, digitalTwinId, contextIds);
        });
    }
    unauthorizeProfileToAccessApps(userProfile, appIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const profile = userProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? userProfile : yield this._getUserProfileNode(userProfile);
            return authorization_service_1.authorizationInstance.unauthorizeProfileToAccessApps(profile, appIds);
        });
    }
    unauthorizeProfileToAccessApis(userProfile, apiIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const profile = userProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? userProfile : yield this._getUserProfileNode(userProfile);
            return authorization_service_1.authorizationInstance.unauthorizeProfileToAccessApis(profile, apiIds);
        });
    }
    ///////////////////////////////////////////////
    //             VERIFICATION
    ///////////////////////////////////////////////
    profileHasAccessToContext(userProfile, contextId, digitalTwinId) {
        return __awaiter(this, void 0, void 0, function* () {
            const profile = userProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? userProfile : yield this._getUserProfileNode(userProfile);
            return authorization_service_1.authorizationInstance.profileHasAccessToContext(profile, digitalTwinId, contextId);
        });
    }
    profileHasAccessToApp(userProfile, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            const profile = userProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? userProfile : yield this._getUserProfileNode(userProfile);
            return authorization_service_1.authorizationInstance.profileHasAccessToApp(profile, appId);
        });
    }
    profileHasAccessToApi(userProfile, apiId) {
        return __awaiter(this, void 0, void 0, function* () {
            const profile = userProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? userProfile : yield this._getUserProfileNode(userProfile);
            return authorization_service_1.authorizationInstance.profileHasAccessToApi(profile, apiId);
        });
    }
    /////////////////////////////////////////////
    //               GET AUTHORIZED
    /////////////////////////////////////////////
    getAuthorizedContexts(userProfile, digitalTwinId) {
        return __awaiter(this, void 0, void 0, function* () {
            const profile = userProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? userProfile : yield this._getUserProfileNode(userProfile);
            return authorization_service_1.authorizationInstance.getAuthorizedContexts(profile, digitalTwinId);
        });
    }
    getAuthorizedApps(userProfile) {
        return __awaiter(this, void 0, void 0, function* () {
            const profile = userProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? userProfile : yield this._getUserProfileNode(userProfile);
            return authorization_service_1.authorizationInstance.getAuthorizedApps(profile);
        });
    }
    getAuthorizedAdminApps(userProfile) {
        return __awaiter(this, void 0, void 0, function* () {
            const profile = userProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? userProfile : yield this._getUserProfileNode(userProfile);
            return authorization_service_1.authorizationInstance.getAuthorizedAdminApps(profile);
        });
    }
    getAuthorizedApis(userProfile) {
        return __awaiter(this, void 0, void 0, function* () {
            const profile = userProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? userProfile : yield this._getUserProfileNode(userProfile);
            return authorization_service_1.authorizationInstance.getAuthorizedApis(profile);
        });
    }
    ///////////////////////////////////////////////////////////
    ///                       PRIVATES                      //
    //////////////////////////////////////////////////////////
    _getUserProfileNode(userProfileId) {
        return __awaiter(this, void 0, void 0, function* () {
            const node = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(userProfileId);
            if (node)
                return node;
            return this._findChildInContext(this.context, userProfileId);
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
exports.UserProfileService = UserProfileService;
//# sourceMappingURL=userProfile.service.js.map