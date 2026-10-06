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
const adminProfile_service_1 = require("../services/adminProfile.service");
const constants_1 = require("spinal-env-viewer-plugin-documentation-service/dist/Models/constants");
const parseTime_1 = require("../utils/parseTime");
// node types of the documents (files and directories) of the documentation service
const DOCUMENT_NODE_TYPES = [constants_1.FILE_NODE_TYPE, constants_1.DIRECTORY_NODE_TYPE];
// relations linking a document node to its parents : directory -> file, directory -> directory, owner -> root directory
const DOCUMENT_PARENT_RELATIONS = [constants_1.TO_FILE_RELATION, constants_1.TO_FOLDER_RELATION, constants_1.TO_ROOT_DIRECTORY_RELATION];
// upper bound of nodes visited while looking for an authorized parent of a document
const MAX_DOCUMENT_PARENTS_VISITED = 500;
class SpinalAPIMiddleware {
    config = {
        spinalConnector: {
            protocol: process.env.HUB_PROTOCOL || "http",
            user: process.env.USER_ID,
            password: process.env.USER_MDP,
            host: process.env.HUB_HOST,
            port: process.env.HUB_PORT,
        },
        api: {
            port: process.env.SERVER_PORT,
        },
        file: {
            path: process.env.CONFIG_DIRECTORY_PATH,
        },
        preload: {
            workHoursStart: (0, parseTime_1.parseTimeOfDay)(process.env.WORK_HOURS_START, 8 * 60),
            workHoursEnd: (0, parseTime_1.parseTimeOfDay)(process.env.WORK_HOURS_END, 19 * 60),
            idleDelay: (0, parseTime_1.parseDuration)(process.env.PRELOAD_IDLE_DELAY, 2000),
            batchSize: (0, parseTime_1.parseDuration)(process.env.PRELOAD_BATCH_SIZE, 20) || 20,
            batchDelay: (0, parseTime_1.parseDuration)(process.env.PRELOAD_BATCH_DELAY, 50),
        }
    };
    conn;
    loadedPtr = new Map();
    iteratorGraph = this._geneGraph();
    profilesToGraph = new Map();
    static instance;
    graph;
    constructor() { }
    static getInstance() {
        if (!this.instance)
            this.instance = new SpinalAPIMiddleware();
        return this.instance;
    }
    setConnection(conn) {
        this.conn = conn;
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
        const model = spinal_core_connectorjs_1.FileSystem._objects[server_id];
        if (!model)
            return this._loadwithConnect(server_id, profileId);
        return this._checkModelAccess(model, server_id, profileId);
    }
    loadPtr(ptr) {
        if (ptr instanceof spinal_core_connectorjs_1.spinalCore._def["File"])
            return this.loadPtr(ptr._ptr);
        const server_id = ptr.data.value;
        if (this.loadedPtr.has(server_id)) {
            return this.loadedPtr.get(server_id);
        }
        const prom = new Promise((resolve, reject) => {
            try {
                if (!this.conn)
                    return reject(new Error("No connection available"));
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
            actualDigitalTwin = await services_1.DigitalTwinService.getInstance().getActualDigitalTwin();
        }
        const url = actualDigitalTwin.info.url.get();
        const graph = await this._loadNewGraph(url);
        this.graph = graph;
        await spinal_env_viewer_graph_service_1.SpinalGraphService.setGraph(graph);
        return graph;
    }
    _loadNewGraph(path) {
        return new Promise((resolve, reject) => {
            if (!this.conn)
                return reject(new Error("No connection available"));
            spinal_core_connectorjs_1.spinalCore.load(this.conn, path, (graph) => resolve(graph), () => {
                console.error(`File does not exist in location ${path}`);
                reject();
            });
        });
    }
    _loadwithConnect(server_id, profileId) {
        return new Promise((resolve, reject) => {
            if (!this.conn)
                return reject(new Error("No connection available"));
            try {
                // the connector does not handle the callback result : it must never throw nor return a rejected promise
                this.conn.load_ptr(server_id, (model) => {
                    if (!model)
                        return reject({ code: constant_1.HTTP_CODES.NOT_FOUND, message: "Node is not found" });
                    this._checkModelAccess(model, server_id, profileId).then(resolve, reject);
                });
            }
            catch (error) {
                reject(this._toHttpError(error));
            }
        });
    }
    /**
     * Returns the model if the profile can access it :
     * - a node must belong to an authorized context (see _nodeIsBelongUserContext) ;
     * - a file (or document) must be linked to a node accessible to the profile (see _fileIsAccessible).
     * Any other model (Lst, Ptr, Path, FileVersion...) is refused.
     * A refused model rejects the returned promise with a { code, message } error.
     */
    async _checkModelAccess(model, server_id, profileId) {
        let authorized = false;
        try {
            if (model instanceof spinal_env_viewer_graph_service_1.SpinalNode) {
                authorized = await this._nodeIsBelongUserContext(model, profileId);
                // @ts-ignore
                if (authorized)
                    spinal_env_viewer_graph_service_1.SpinalGraphService._addNode(model);
            }
            else if (model instanceof spinal_core_connectorjs_1.File) {
                authorized = await this._fileIsAccessible(model, profileId);
            }
            else {
                return Promise.reject({ code: constant_1.HTTP_CODES.BAD_REQUEST, message: `The id ${server_id} does not refer to a node nor a file` });
            }
        }
        catch (error) {
            return Promise.reject(this._toHttpError(error));
        }
        if (!authorized)
            return Promise.reject({ code: constant_1.HTTP_CODES.UNAUTHORIZED, message: "Unauthorized" });
        return model;
    }
    _toHttpError(error) {
        if (error?.code && error?.message)
            return error;
        return { code: constant_1.HTTP_CODES.INTERNAL_ERROR, message: error?.message || String(error) };
    }
    async _nodeIsBelongUserContext(node, profileId) {
        const type = node.getType().get();
        if (constant_1.EXCLUDES_TYPES.indexOf(type) !== -1)
            return true;
        const contexts = await this._getProfileContexts(profileId);
        if (this._nodeBelongsToContexts(node, contexts))
            return true;
        // a document is also accessible through the objects it is linked to (directories, then the owner of the root directory)
        if (DOCUMENT_NODE_TYPES.indexOf(type) !== -1)
            return this._documentNodeIsLinkedToUserContext(node, contexts, profileId);
        return false;
    }
    _nodeBelongsToContexts(node, contexts) {
        const found = contexts.find((context) => {
            if (node instanceof spinal_env_viewer_graph_service_1.SpinalContext)
                return node.getId().get() === context.getId().get();
            return node.belongsToContext(context);
        });
        return found ? true : false;
    }
    /**
     * Walks up the parents of a document node through the directories (DirectoryhasFiles, DirectoryhasDirectory)
     * up to the root directory and its owner (hasFiles).
     * A directory is authorized if it belongs to an authorized context ; an owner (room, equipment, ticket...)
     * is authorized with the same rule as any other node and is not walked through.
     */
    async _documentNodeIsLinkedToUserContext(documentNode, contexts, profileId) {
        const visited = new Set([documentNode]);
        let queue = [documentNode];
        while (queue.length > 0) {
            const nextQueue = [];
            for (const node of queue) {
                const parents = await node.getParents(DOCUMENT_PARENT_RELATIONS);
                for (const parent of parents) {
                    if (visited.has(parent))
                        continue;
                    if (visited.size >= MAX_DOCUMENT_PARENTS_VISITED)
                        return false;
                    visited.add(parent);
                    const parentType = parent.getType().get();
                    if (DOCUMENT_NODE_TYPES.indexOf(parentType) === -1) {
                        if (await this._nodeIsBelongUserContext(parent, profileId))
                            return true;
                        continue;
                    }
                    if (this._nodeBelongsToContexts(parent, contexts))
                        return true;
                    nextQueue.push(parent);
                }
            }
            queue = nextQueue;
        }
        return false;
    }
    /**
     * A file is accessible if the node it refers to (SpinalDocument or file converted by the documentation service)
     * is accessible. A file that can't be attached to any node (e.g. an old Drive file) is reserved to the admin profile.
     */
    async _fileIsAccessible(file, profileId) {
        const fileNode = await this._getFileNode(file);
        if (fileNode)
            return this._nodeIsBelongUserContext(fileNode, profileId);
        return this._isAdminProfile(profileId);
    }
    async _getFileNode(file) {
        let node;
        const anyFile = file;
        if (typeof anyFile.getNode === "function") {
            node = await anyFile.getNode();
        }
        else {
            const nodePtr = anyFile._info?.node;
            if (!nodePtr || typeof nodePtr.load !== "function")
                return;
            node = await new Promise((resolve) => nodePtr.load((element) => resolve(element)));
        }
        if (!(node instanceof spinal_env_viewer_graph_service_1.SpinalNode))
            return;
        // the node must refer back to the file, otherwise the link is not reliable
        const elementPtr = node.element;
        const refersToFile = elementPtr?.data?.model === file || (!!file._server_id && elementPtr?.data?.value === file._server_id);
        return refersToFile ? node : undefined;
    }
    _isAdminProfile(profileId) {
        const adminNode = adminProfile_service_1.AdminProfileService.getInstance().adminNode;
        return !!adminNode && adminNode.getId().get() === profileId;
    }
    async _getProfileContexts(profileId) {
        const graph = await this.getProfileGraph(profileId);
        if (!graph)
            throw new Error("no graph found");
        const contexts = await graph.getChildren(["hasContext"]);
        //addContext to SpinalNode map
        return contexts.map((context) => {
            //@ts-ignore
            spinal_env_viewer_graph_service_1.SpinalGraphService._addNode(context);
            return context;
        });
    }
}
exports.default = SpinalAPIMiddleware;
exports.SpinalAPIMiddleware = SpinalAPIMiddleware;
//# sourceMappingURL=SpinalAPIMiddleware.js.map