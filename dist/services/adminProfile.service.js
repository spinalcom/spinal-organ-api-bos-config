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
    init(context) {
        return __awaiter(this, void 0, void 0, function* () {
            let node = yield this.getAdminProfile(context);
            if (!node) {
                node = this._createAdminProfile();
                yield context.addChildInContext(node, constant_1.CONTEXT_TO_USER_PROFILE_RELATION_NAME, constant_1.PTR_LST_TYPE, context);
            }
            this._adminNode = node;
            yield this.syncAdminProfile();
            return node;
        });
    }
    getAdminProfile(argContext) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._adminNode)
                return this._adminNode;
            const context = argContext || userProfile_service_1.UserProfileService.getInstance().context;
            if (!context)
                return;
            const children = yield context.getChildren();
            return children.find(el => {
                return el.getName().get() === constant_1.ADMIN_PROFILE_NAME && el.getType().get() === constant_1.ADMIN_PROFILE_TYPE;
            });
        });
    }
    addAppToProfil(apps) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Array.isArray(apps))
                apps = [apps];
            return userProfile_service_1.UserProfileService.getInstance().authorizeProfileToAccessApps(this._adminNode, apps.map(el => el.getId().get()));
        });
    }
    addAdminAppToProfil(apps) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Array.isArray(apps))
                apps = [apps];
            return authorization_service_1.default.getInstance().authorizeProfileToAccessAdminApps(this._adminNode, apps.map(el => el.getId().get()));
        });
    }
    addApiToProfil(apis) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Array.isArray(apis))
                apis = [apis];
            return userProfile_service_1.UserProfileService.getInstance().authorizeProfileToAccessApis(this._adminNode, apis.map(el => el.getId().get()));
        });
    }
    addDigitalTwinToAdminProfile(digitalTwins) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Array.isArray(digitalTwins))
                digitalTwins = [digitalTwins];
            return digitalTwins.reduce((prom, digitalTwin) => __awaiter(this, void 0, void 0, function* () {
                const liste = yield prom;
                try {
                    const node = yield this._adminNode.addChild(digitalTwin, constant_1.PROFILE_TO_AUTHORIZED_DIGITAL_TWIN_RELATION_NAME, constant_1.PTR_LST_TYPE);
                    liste.push(node);
                }
                catch (error) { }
                return liste;
            }), Promise.resolve([]));
        });
    }
    syncAdminProfile() {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                digitaTwins: yield this._authorizeAllDigitalTwin(),
                apps: yield Promise.all([this._authorizeAllApps(), this._authorizeAllAdminApps()]),
                apis: yield this._authorizeAllApis()
            };
        });
    }
    _createAdminProfile() {
        const info = {
            name: constant_1.ADMIN_PROFILE_NAME,
            type: constant_1.ADMIN_PROFILE_TYPE
        };
        const graph = new spinal_env_viewer_graph_service_1.SpinalGraph(constant_1.ADMIN_PROFILE_NAME);
        const profileId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode(info, graph);
        const node = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(profileId);
        return node;
    }
    _authorizeAllDigitalTwin() {
        return __awaiter(this, void 0, void 0, function* () {
            const digitalTwins = yield digitalTwin_service_1.DigitalTwinService.getInstance().getAllDigitalTwins();
            return this.addDigitalTwinToAdminProfile(digitalTwins);
        });
    }
    _authorizeAllApps() {
        return __awaiter(this, void 0, void 0, function* () {
            const buildingApps = yield apps_service_1.AppService.getInstance().getAllBuildingApps();
            return this.addAppToProfil(buildingApps);
        });
    }
    _authorizeAllAdminApps() {
        return __awaiter(this, void 0, void 0, function* () {
            const adminApps = yield apps_service_1.AppService.getInstance().getAllAdminApps();
            return this.addAdminAppToProfil(adminApps);
        });
    }
    _authorizeAllApis() {
        return __awaiter(this, void 0, void 0, function* () {
            const apis = yield apis_service_1.APIService.getInstance().getAllApiRoute();
            return this.addApiToProfil(apis);
        });
    }
}
exports.AdminProfileService = AdminProfileService;
//# sourceMappingURL=adminProfile.service.js.map