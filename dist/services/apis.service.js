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
exports.APIService = void 0;
const constant_1 = require("../constant");
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const configFile_service_1 = require("./configFile.service");
const utils_1 = require("../utils/utils");
const adminProfile_service_1 = require("./adminProfile.service");
class APIService {
    constructor() { }
    static getInstance() {
        if (!this.instance)
            this.instance = new APIService();
        return this.instance;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.context = yield configFile_service_1.configServiceInstance.getContext(constant_1.API_ROUTES_CONTEXT_NAME);
            if (!this.context)
                this.context = yield configFile_service_1.configServiceInstance.addContext(constant_1.API_ROUTES_CONTEXT_NAME, constant_1.API_ROUTES_CONTEXT_TYPE);
            return this.context;
        });
    }
    createApiRoute(routeInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            const apiExist = yield this.getApiRouteByRoute(routeInfo);
            if (apiExist) {
                console.log('log exists');
                return apiExist;
            }
            delete routeInfo.id;
            routeInfo.type = constant_1.API_ROUTE_TYPE;
            routeInfo.name = routeInfo.route;
            const routeId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode(routeInfo, undefined);
            const node = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(routeId);
            yield adminProfile_service_1.AdminProfileService.getInstance().addApiToProfil(node);
            return this.context.addChildInContext(node, constant_1.API_RELATION_NAME, constant_1.PTR_LST_TYPE, this.context);
        });
    }
    updateApiRoute(routeId, newValue) {
        return __awaiter(this, void 0, void 0, function* () {
            delete newValue.id;
            delete newValue.type;
            const route = yield this.getApiRouteById(routeId);
            if (!route)
                throw new Error(`no api route Found for ${routeId}`);
            for (const key in newValue) {
                if (Object.prototype.hasOwnProperty.call(newValue, key) &&
                    route.info[key]) {
                    const element = newValue[key];
                    route.info[key].set(element);
                }
            }
            return route;
        });
    }
    getApiRouteById(routeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const children = yield this.context.getChildrenInContext(this.context);
            return children.find((el) => el.getId().get() === routeId);
        });
    }
    getApiRouteByRoute(apiRoute) {
        return __awaiter(this, void 0, void 0, function* () {
            const children = yield this.context.getChildrenInContext(this.context);
            if (apiRoute.route.includes('?'))
                apiRoute.route = apiRoute.route.substring(0, apiRoute.route.indexOf('?'));
            return children.find((el) => {
                const { route, method } = el.info.get();
                if (route &&
                    method &&
                    method.toLowerCase() === apiRoute.method.toLowerCase()) {
                    const routeFormatted = this._formatRoute(route);
                    // return routeFormatted.toLowerCase() === apiRoute.route.toLowerCase() || apiRoute.route.match(routeFormatted);
                    return apiRoute.route.match(routeFormatted);
                }
                return false;
            });
        });
    }
    getAllApiRoute() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.context.getChildrenInContext(this.context);
        });
    }
    deleteApiRoute(routeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const route = yield this.getApiRouteById(routeId);
            if (!route)
                throw new Error(`no api route Found for ${routeId}`);
            yield (0, utils_1.removeNodeReferences)(route);
            yield route.removeFromGraph();
            return routeId;
        });
    }
    uploadSwaggerFile(buffer) {
        return __awaiter(this, void 0, void 0, function* () {
            const swaggerData = yield this._readBuffer(buffer);
            const routes = yield this._formatSwaggerFile(swaggerData);
            return routes.reduce((prom, route) => __awaiter(this, void 0, void 0, function* () {
                const list = yield prom;
                try {
                    const r = yield this.createApiRoute(route);
                    list.push(r);
                }
                catch (error) { }
                return list;
            }), Promise.resolve([]));
        });
    }
    //////////////////////////////////////////////
    //                  PRIVATE                 //
    //////////////////////////////////////////////
    // private async _getOrGetRoutesGroup(type: string) {
    //     const children = await this.context.getChildren([CONTEXT_TO_API_ROUTE_GROUP_RELATION_NAME]);
    //     let found = children.find(el => el.getType().get() === type);
    //     if (found) return found;
    //     const name = type === BUILDING_API_GROUP_TYPE ? BUILDING_API_GROUP_NAME : PORTOFOLIO_API_GROUP_NAME;
    //     let node = new SpinalNode(name, type);
    //     return this.context.addChildInContext(node, CONTEXT_TO_API_ROUTE_GROUP_RELATION_NAME, PTR_LST_TYPE, this.context);
    // }
    _formatSwaggerFile(swaggerFile) {
        try {
            const paths = swaggerFile.paths || [];
            const data = [];
            for (const key in paths) {
                if (Object.prototype.hasOwnProperty.call(paths, key)) {
                    const methods = this._getMethod(paths[key]);
                    let items = methods.map((method) => {
                        return {
                            route: key,
                            method: method && method.toUpperCase(),
                            tag: this._getTags(paths[key][method]),
                            scope: this._getScope(paths[key][method]),
                        };
                    });
                    data.push(...items);
                }
            }
            return data;
        }
        catch (error) {
            throw new Error('Invalid swagger file');
        }
    }
    _getMethod(path) {
        const keys = Object.keys(path);
        return keys;
    }
    _getTags(item) {
        return (item.tags && item.tags[0]) || '';
    }
    _getScope(item) {
        return ((item.security &&
            item.security[0] &&
            item.security[0].OauthSecurity &&
            item.security[0].OauthSecurity[0]) ||
            '');
    }
    _readBuffer(buffer) {
        return JSON.parse(buffer.toString());
    }
    _formatRoute(route) {
        if (route.includes('?'))
            route = route.substring(0, route.indexOf('?'));
        // const routeFormatted = route.replace(/\{(.*?)\}/g, (el) => '(.*?)');
        const routeFormatted = route.replace(/\{(.*?)\}/g, (el) => '([^,/]+)');
        return new RegExp(`^${routeFormatted}$`);
    }
}
exports.APIService = APIService;
//# sourceMappingURL=apis.service.js.map