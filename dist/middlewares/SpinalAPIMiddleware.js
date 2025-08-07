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
exports.SpinalAPIMiddleware = void 0;
const spinal_core_connectorjs_1 = require("spinal-core-connectorjs");
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const constant_1 = require("../constant");
const services_1 = require("../services");
class SpinalAPIMiddleware {
    config = {
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
    conn;
    loadedPtr = new Map();
    iteratorGraph = this._geneGraph();
    profilesToGraph = new Map();
    static instance;
    graph;
    constructor(conn) {
        this.conn = conn;
    }
    static getInstance(conn) {
        if (!this.instance)
            this.instance = new SpinalAPIMiddleware(conn);
        return this.instance;
    }
    async getGraph() {
        const next = await this.iteratorGraph.next();
        return next.value;
    }
    async getProfileGraph(profileId) {
        let graph = this.profilesToGraph.get(profileId);
        if (graph)
            return graph;
        graph = await services_1.AppProfileService.getInstance().getAppProfileNodeGraph(profileId);
        if (!graph)
            graph = await services_1.UserProfileService.getInstance().getUserProfileNodeGraph(profileId);
        if (!graph)
            throw { code: 401, message: `No graph found for ${profileId}` };
        this.profilesToGraph.set(profileId, graph);
        return graph;
    }
    addProfileToMap(profileId, graph) {
        this.profilesToGraph.set(profileId, graph);
    }
    async load(server_id, profileId) {
        if (!server_id)
            return Promise.reject({ code: 406, message: "Invalid serverId" });
        if (!profileId)
            return Promise.reject({ code: constant_1.HTTP_CODES.UNAUTHORIZED, message: "Unauthorized" });
        let node = spinal_core_connectorjs_1.FileSystem._objects[server_id];
        if (!node)
            return this._loadwithConnect(server_id, profileId);
        if (node instanceof spinal_core_connectorjs_1.File)
            return node;
        const found = await this._nodeIsBelongUserContext(node, profileId);
        if (!found)
            return Promise.reject({ code: constant_1.HTTP_CODES.UNAUTHORIZED, message: "Unauthorized" });
        // @ts-ignore
        spinal_env_viewer_graph_service_1.SpinalGraphService._addNode(node);
        // @ts-ignore
        return Promise.resolve(node);
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
    async *_geneGraph() {
        await this.setGraph();
        while (true) {
            yield this.graph;
        }
    }
    async setGraph(actualDigitalTwin) {
        if (!actualDigitalTwin) {
            actualDigitalTwin =
                await services_1.DigitalTwinService.getInstance().getActualDigitalTwin();
        }
        const url = actualDigitalTwin.info.url.get();
        const graph = await this._loadNewGraph(url);
        this.graph = graph;
        await spinal_env_viewer_graph_service_1.SpinalGraphService.setGraph(graph);
        return graph;
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
            this.conn.load_ptr(server_id, async (model) => {
                if (!model)
                    return reject({ code: 404, message: "Node is not found" });
                if (model instanceof spinal_core_connectorjs_1.File)
                    return resolve(model);
                const contextFound = await this._nodeIsBelongUserContext(model, profileId);
                if (!contextFound)
                    return reject({ code: 401, message: "Unauthorized" });
                // @ts-ignore
                spinal_env_viewer_graph_service_1.SpinalGraphService._addNode(model);
                // @ts-ignore
                return resolve(model);
            });
        });
    }
    async _nodeIsBelongUserContext(node, profileId) {
        const type = node.getType().get();
        if (constant_1.EXCLUDES_TYPES.indexOf(type) !== -1)
            return true;
        const contexts = await this._getProfileContexts(profileId);
        const found = contexts.find(context => {
            if (node instanceof spinal_env_viewer_graph_service_1.SpinalContext)
                return node.getId().get() === context.getId().get();
            return node.belongsToContext(context);
        });
        return found ? true : false;
    }
    async _getProfileContexts(profileId) {
        const graph = await this.getProfileGraph(profileId);
        if (!graph)
            throw new Error("no graph found");
        const contexts = await graph.getChildren(["hasContext"]);
        //addContext to SpinalNode map
        return contexts.map(context => {
            //@ts-ignore
            spinal_env_viewer_graph_service_1.SpinalGraphService._addNode(context);
            return context;
        });
    }
}
exports.default = SpinalAPIMiddleware;
exports.SpinalAPIMiddleware = SpinalAPIMiddleware;
//# sourceMappingURL=SpinalAPIMiddleware.js.map