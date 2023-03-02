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
exports.AuthorizationService = exports.authorizationInstance = void 0;
const constant_1 = require("../constant");
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const spinal_core_connectorjs_type_1 = require("spinal-core-connectorjs_type");
const digitalTwin_service_1 = require("./digitalTwin.service");
const apps_service_1 = require("./apps.service");
const apis_service_1 = require("./apis.service");
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
    authorizeProfileToAccessContext(profile, digitalTwinId, contextIds) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Array.isArray(contextIds))
                contextIds = [contextIds];
            if (!digitalTwinId) {
                digitalTwinId = yield this._getActualDigitalTwinId();
                if (!digitalTwinId)
                    throw "No digital twin is setup";
            }
            const node = yield this.getAuthorizedDigitalTwinNode(profile, digitalTwinId, true);
            if (!node)
                throw `No digitalTwin found for ${digitalTwinId}`;
            const graph = yield node.getElement(false);
            return contextIds.reduce((prom, contextId) => __awaiter(this, void 0, void 0, function* () {
                const liste = yield prom;
                const context = yield digitalTwin_service_1.DigitalTwinService.getInstance().findContextInDigitalTwin(digitalTwinId, contextId);
                if (context) {
                    try {
                        yield graph.addContext(context);
                        liste.push(context);
                    }
                    catch (error) { }
                    return liste;
                }
            }), Promise.resolve([]));
        });
    }
    authorizeProfileToAccessApps(profile, appIds) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Array.isArray(appIds))
                appIds = [appIds];
            return appIds.reduce((prom, appId) => __awaiter(this, void 0, void 0, function* () {
                const liste = yield prom;
                const app = yield apps_service_1.AppService.getInstance().getBuildingApp(appId);
                if (app) {
                    try {
                        yield profile.addChild(app, constant_1.PROFILE_TO_AUTHORIZED_APP, constant_1.PTR_LST_TYPE);
                        liste.push(app);
                    }
                    catch (error) { }
                    return liste;
                }
            }), Promise.resolve([]));
        });
    }
    authorizeProfileToAccessAdminApps(profile, appIds) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Array.isArray(appIds))
                appIds = [appIds];
            return appIds.reduce((prom, appId) => __awaiter(this, void 0, void 0, function* () {
                const liste = yield prom;
                const app = yield apps_service_1.AppService.getInstance().getAdminApp(appId);
                if (app) {
                    try {
                        yield profile.addChild(app, constant_1.PROFILE_TO_AUTHORIZED_ADMIN_APP, constant_1.PTR_LST_TYPE);
                        liste.push(app);
                    }
                    catch (error) { }
                    return liste;
                }
            }), Promise.resolve([]));
        });
    }
    authorizeProfileToAccessApis(profile, apiIds) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Array.isArray(apiIds))
                apiIds = [apiIds];
            return apiIds.reduce((prom, apiId) => __awaiter(this, void 0, void 0, function* () {
                const liste = yield prom;
                const api = yield apis_service_1.APIService.getInstance().getApiRouteById(apiId);
                if (api) {
                    try {
                        yield profile.addChild(api, constant_1.PROFILE_TO_AUTHORIZED_API, constant_1.PTR_LST_TYPE);
                        liste.push(api);
                    }
                    catch (error) { }
                    return liste;
                }
            }), Promise.resolve([]));
        });
    }
    /////////////////////////////////////////////
    //               GET AUTHORIZED
    /////////////////////////////////////////////
    getAuthorizedContexts(profile, digitalTwinId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!digitalTwinId) {
                digitalTwinId = yield this._getActualDigitalTwinId();
                if (!digitalTwinId)
                    return [];
            }
            const digitalTwin = yield this.getAuthorizedDigitalTwinNode(profile, digitalTwinId);
            if (!digitalTwin)
                return [];
            const graph = yield digitalTwin.getElement(true);
            if (!graph)
                return [];
            return graph.getChildren("hasContext");
        });
    }
    getAuthorizedApps(profile) {
        return __awaiter(this, void 0, void 0, function* () {
            return profile.getChildren(constant_1.PROFILE_TO_AUTHORIZED_APP);
        });
    }
    getAuthorizedAdminApps(profile) {
        return __awaiter(this, void 0, void 0, function* () {
            return profile.getChildren(constant_1.PROFILE_TO_AUTHORIZED_ADMIN_APP);
        });
    }
    getAuthorizedApis(profile) {
        return __awaiter(this, void 0, void 0, function* () {
            return profile.getChildren(constant_1.PROFILE_TO_AUTHORIZED_API);
        });
    }
    getAuthorizedDigitalTwinNode(profile, digitalTwinId, createIfNotExist = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!digitalTwinId) {
                digitalTwinId = yield this._getActualDigitalTwinId();
            }
            const digitalTwins = yield profile.getChildren(constant_1.PROFILE_TO_AUTHORIZED_DIGITAL_TWIN_RELATION_NAME);
            const found = digitalTwins.find(el => { var _a; return el.getId().get() === digitalTwinId || ((_a = el.info.refId) === null || _a === void 0 ? void 0 : _a.get()) === digitalTwinId; });
            if (found)
                return found;
            if (createIfNotExist) {
                const digitalTwin = yield digitalTwin_service_1.DigitalTwinService.getInstance().getDigitalTwin(digitalTwinId);
                if (!digitalTwin)
                    return;
                const ref = yield this._createNodeReference(digitalTwin);
                return profile.addChild(ref, constant_1.PROFILE_TO_AUTHORIZED_DIGITAL_TWIN_RELATION_NAME, constant_1.PTR_LST_TYPE);
            }
        });
    }
    /////////////////////////////////////////////
    //               UNAUTHORIZE
    /////////////////////////////////////////////
    unauthorizeProfileToAccessContext(profile, digitalTwinId, contextIds) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Array.isArray(contextIds))
                contextIds = [contextIds];
            if (!digitalTwinId) {
                digitalTwinId = yield this._getActualDigitalTwinId();
                if (!digitalTwinId)
                    throw "No digital twin is setup";
            }
            const node = yield this.getAuthorizedDigitalTwinNode(profile, digitalTwinId, true);
            if (!node)
                throw `No digitalTwin found for ${digitalTwinId}`;
            const graph = yield node.getElement(false);
            return contextIds.reduce((prom, contextId) => __awaiter(this, void 0, void 0, function* () {
                const liste = yield prom;
                const context = yield digitalTwin_service_1.DigitalTwinService.getInstance().findContextInDigitalTwin(digitalTwinId, contextId);
                if (context) {
                    try {
                        yield graph.removeChild(context, "hasContext", constant_1.REF_TYPE);
                        liste.push(context);
                    }
                    catch (error) { }
                    return liste;
                }
            }), Promise.resolve([]));
        });
    }
    unauthorizeProfileToAccessApps(profile, appIds) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Array.isArray(appIds))
                appIds = [appIds];
            return appIds.reduce((prom, appId) => __awaiter(this, void 0, void 0, function* () {
                const liste = yield prom;
                const app = yield apps_service_1.AppService.getInstance().getBuildingApp(appId);
                if (app) {
                    try {
                        yield profile.removeChild(app, constant_1.PROFILE_TO_AUTHORIZED_APP, constant_1.PTR_LST_TYPE);
                        liste.push(app);
                    }
                    catch (error) { }
                    return liste;
                }
            }), Promise.resolve([]));
        });
    }
    unauthorizeProfileToAccessApis(profile, apiIds) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Array.isArray(apiIds))
                apiIds = [apiIds];
            return apiIds.reduce((prom, apiId) => __awaiter(this, void 0, void 0, function* () {
                const liste = yield prom;
                const api = yield apis_service_1.APIService.getInstance().getApiRouteById(apiId);
                if (api) {
                    try {
                        yield profile.removeChild(api, constant_1.PROFILE_TO_AUTHORIZED_API, constant_1.PTR_LST_TYPE);
                        liste.push(api);
                    }
                    catch (error) { }
                    return liste;
                }
            }), Promise.resolve([]));
        });
    }
    ///////////////////////////////////////////////
    //             VERIFICATION
    ///////////////////////////////////////////////
    profileHasAccessToContext(profile, digitalTwinId, contextId) {
        return __awaiter(this, void 0, void 0, function* () {
            const contexts = yield this.getAuthorizedContexts(profile, digitalTwinId);
            return contexts.some(el => el.getId().get() === contextId);
        });
    }
    profileHasAccessToApp(profile, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            const contexts = yield Promise.all([this.getAuthorizedApps(profile), this.getAuthorizedAdminApps(profile)]);
            return contexts.flat().some(el => el.getId().get() === appId);
        });
    }
    profileHasAccessToApi(profile, apiId) {
        return __awaiter(this, void 0, void 0, function* () {
            const contexts = yield this.getAuthorizedApis(profile);
            return contexts.some(el => el.getId().get() === apiId);
        });
    }
    ///////////////////////////////////////////////
    //             PRIVATE
    ///////////////////////////////////////////////
    _createNodeReference(node) {
        return __awaiter(this, void 0, void 0, function* () {
            const refNode = new spinal_env_viewer_graph_service_1.SpinalNode(node.getName().get(), node.getType().get(), new spinal_env_viewer_graph_service_1.SpinalGraph());
            refNode.info.add_attr({ refId: node.getId().get() });
            refNode.info.name.set(node.info.name);
            yield this._addRefToNode(node, refNode);
            return refNode;
        });
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
                references: new spinal_core_connectorjs_type_1.Ptr(new spinal_core_connectorjs_type_1.Lst([ref]))
            });
            return Promise.resolve(ref);
        }
    }
    _getRealNode(refNode) {
        return refNode.getElement(false);
    }
    _getActualDigitalTwinId() {
        return __awaiter(this, void 0, void 0, function* () {
            const actualDigitalTwin = yield digitalTwin_service_1.DigitalTwinService.getInstance().getActualDigitalTwin();
            if (actualDigitalTwin)
                return actualDigitalTwin.getId().get();
        });
    }
}
exports.default = AuthorizationService;
exports.AuthorizationService = AuthorizationService;
const authorizationInstance = AuthorizationService.getInstance();
exports.authorizationInstance = authorizationInstance;
//# sourceMappingURL=authorization.service.js.map