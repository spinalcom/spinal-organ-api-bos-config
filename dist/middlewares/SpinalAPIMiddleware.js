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
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpinalAPIMiddleware = void 0;
const spinal_core_connectorjs_1 = require("spinal-core-connectorjs");
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const constant_1 = require("../constant");
const services_1 = require("../services");
const digitalTwinService = services_1.DigitalTwinService.getInstance();
class SpinalAPIMiddleware {
    constructor(conn) {
        this.config = {
            spinalConnector: {
                protocol: process.env.HUB_PROTOCOL || 'http',
                user: process.env.USER_ID,
                password: process.env.USER_MDP,
                host: process.env.HUB_HOST,
                port: process.env.HUB_PORT
            },
            api: {
                port: process.env.SERVER_PORT
            },
            file: {
                path: process.env.CONFIG_DIRECTORY_PATH
            }
        };
        this.iteratorGraph = this._geneGraph();
        this.profilesToGraph = new Map();
        this.conn = conn;
    }
    static getInstance(conn) {
        if (!this.instance)
            this.instance = new SpinalAPIMiddleware(conn);
        return this.instance;
    }
    getGraph() {
        return __awaiter(this, void 0, void 0, function* () {
            const next = yield this.iteratorGraph.next();
            return next.value;
        });
    }
    getProfileGraph(profileId) {
        return __awaiter(this, void 0, void 0, function* () {
            let graph = this.profilesToGraph.get(profileId);
            if (graph)
                return graph;
            graph = yield services_1.AppProfileService.getInstance().getAppProfileNodeGraph(profileId);
            if (!graph)
                graph = yield services_1.UserProfileService.getInstance().getUserProfileNodeGraph(profileId);
            if (!graph)
                throw { code: 401, message: `No graph found for ${profileId}` };
            this.profilesToGraph.set(profileId, graph);
            return graph;
        });
    }
    addProfileToMap(profileId, graph) {
        this.profilesToGraph.set(profileId, graph);
    }
    load(server_id, profileId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!server_id)
                return Promise.reject({ code: 406, message: "Invalid serverId" });
            if (!profileId)
                return Promise.reject({ code: constant_1.HTTP_CODES.UNAUTHORIZED, message: "Unauthorized" });
            let node = spinal_core_connectorjs_1.FileSystem._objects[server_id];
            if (!node)
                return this._loadwithConnect(server_id, profileId);
            if (node instanceof spinal_core_connectorjs_1.File)
                return node;
            const found = yield this._nodeIsBelongUserContext(node, profileId);
            if (!found)
                return Promise.reject({ code: constant_1.HTTP_CODES.UNAUTHORIZED, message: "Unauthorized" });
            // @ts-ignore
            spinal_env_viewer_graph_service_1.SpinalGraphService._addNode(node);
            // @ts-ignore
            return Promise.resolve(node);
        });
    }
    loadPtr(ptr) {
        if (ptr instanceof spinal_core_connectorjs_1.spinalCore._def['File'])
            return this.loadPtr(ptr._ptr);
        const server_id = ptr.data.value;
        if (this.loadedPtr.has(server_id)) {
            return this.loadedPtr.get(server_id);
        }
        const prom = new Promise((resolve, reject) => {
            try {
                this.conn.load_ptr(server_id, (model) => {
                    if (!model) {
                        reject(new Error(`LoadedPtr Error server_id: '${server_id}'`));
                    }
                    else {
                        resolve(model);
                    }
                });
            }
            catch (e) {
                reject(e);
            }
        });
        this.loadedPtr.set(server_id, prom);
        return prom;
    }
    //////////////////////////////////////////////
    //               PRIVATES                   //
    //////////////////////////////////////////////
    _geneGraph() {
        return __asyncGenerator(this, arguments, function* _geneGraph_1() {
            let graph;
            const actualDigitalTwin = yield __await(digitalTwinService.getActualDigitalTwin());
            graph = yield __await(digitalTwinService.getDigitalTwinGraph(actualDigitalTwin));
            while (true) {
                const url = actualDigitalTwin.info.url.get();
                if (!graph) {
                    graph = yield __await(this._loadNewGraph(url));
                }
                if (graph)
                    yield __await(spinal_env_viewer_graph_service_1.SpinalGraphService.setGraph(graph));
                yield yield __await(graph);
            }
        });
    }
    _loadNewGraph(path) {
        return new Promise((resolve, reject) => {
            spinal_core_connectorjs_1.spinalCore.load(this.conn, path, (graph) => {
                resolve(graph);
            }, () => {
                console.error(`File does not exist in location ${path}`);
                reject();
            });
        });
    }
    _loadwithConnect(server_id, profileId) {
        return new Promise((resolve, reject) => {
            this.conn.load_ptr(server_id, (model) => __awaiter(this, void 0, void 0, function* () {
                if (!model)
                    return reject({ code: 404, message: "Node is not found" });
                if (model instanceof spinal_core_connectorjs_1.File)
                    return resolve(model);
                const contextFound = yield this._nodeIsBelongUserContext(model, profileId);
                if (!contextFound)
                    return reject({ code: 401, message: "Unauthorized" });
                // @ts-ignore
                spinal_env_viewer_graph_service_1.SpinalGraphService._addNode(model);
                // @ts-ignore
                return resolve(model);
            }));
        });
    }
    _nodeIsBelongUserContext(node, profileId) {
        return __awaiter(this, void 0, void 0, function* () {
            const type = node.getType().get();
            if (constant_1.EXCLUDES_TYPES.indexOf(type) !== -1)
                return true;
            const contexts = yield this._getProfileContexts(profileId);
            const found = contexts.find(context => {
                if (node instanceof spinal_env_viewer_graph_service_1.SpinalContext)
                    return node.getId().get() === context.getId().get();
                return node.belongsToContext(context);
            });
            return found ? true : false;
        });
    }
    _getProfileContexts(profileId) {
        return __awaiter(this, void 0, void 0, function* () {
            const graph = yield this.getProfileGraph(profileId);
            if (!graph)
                throw new Error("no graph found");
            const contexts = yield graph.getChildren(["hasContext"]);
            //addContext to SpinalNode map
            return contexts.map(context => {
                //@ts-ignore
                spinal_env_viewer_graph_service_1.SpinalGraphService._addNode(context);
                return context;
            });
        });
    }
}
exports.default = SpinalAPIMiddleware;
exports.SpinalAPIMiddleware = SpinalAPIMiddleware;
//# sourceMappingURL=SpinalAPIMiddleware.js.map