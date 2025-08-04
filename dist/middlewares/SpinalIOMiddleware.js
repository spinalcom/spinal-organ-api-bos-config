"use strict";
/*
 * Copyright 2023 SpinalCom - www.spinalcom.com
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
const SpinalAPIMiddleware_1 = require("./SpinalAPIMiddleware");
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const constant_1 = require("../constant");
const services_1 = require("../services");
class SpinalIOMiddleware {
    config = {
        spinalConnector: {
            protocol: process.env.HUB_PROTOCOL || 'http',
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
    };
    conn;
    logService = services_1.WebsocketLogsService.getInstance();
    static instance;
    constructor(conn) {
        this.conn = conn;
    }
    static getInstance(conn) {
        if (!this.instance)
            this.instance = new SpinalIOMiddleware(conn);
        return this.instance;
    }
    tokenCheckMiddleware(io) {
        io.use(async (socket, next) => {
            let err;
            try {
                await this._getTokenInfo(socket);
            }
            catch (error) {
                err = error;
            }
            next(err);
        });
    }
    getGraph() {
        return SpinalAPIMiddleware_1.default.getInstance().getGraph();
    }
    async getProfileGraph(socket) {
        let profileId = await this._getProfileId(socket);
        return SpinalAPIMiddleware_1.default.getInstance().getProfileGraph(profileId);
    }
    async getContext(contextId, socket) {
        const profileId = await this._getProfileId(socket);
        if (typeof contextId === 'undefined')
            return;
        if (!isNaN(contextId))
            return SpinalAPIMiddleware_1.default.getInstance().load(contextId, profileId);
        const graph = await SpinalAPIMiddleware_1.default.getInstance().getProfileGraph(profileId);
        if (!graph)
            return;
        const contexts = await graph.getChildren();
        return contexts.find((el) => {
            if (el.getId().get() === contextId || el._server_id == contextId) {
                return true;
            }
            return false;
        });
    }
    async getNodeWithServerId(server_id, socket) {
        const profileId = await this._getProfileId(socket);
        return SpinalAPIMiddleware_1.default.getInstance().load(server_id, profileId);
    }
    async getNodeWithStaticId(nodeId, contextId, socket) {
        if (nodeId === contextId) {
            return this.getContext(nodeId, socket);
        }
        const context = await this.getContext(contextId, socket);
        if (context instanceof spinal_env_viewer_graph_service_1.SpinalContext) {
            const found = await context.findInContext(context, (node, stop) => {
                if (node.getId().get() === nodeId) {
                    stop();
                    return true;
                }
                return false;
            });
            return Array.isArray(found) ? found[0] : found;
        }
    }
    async getNode(nodeId, contextId, socket) {
        //@ts-ignore
        if (!isNaN(nodeId)) {
            const node = await this.getNodeWithServerId(nodeId, socket);
            //@ts-ignore
            if (node && node instanceof spinal_env_viewer_graph_service_1.SpinalNode)
                spinal_env_viewer_graph_service_1.SpinalGraphService._addNode(node);
            return node;
        }
        return this.getNodeWithStaticId(nodeId?.toString(), contextId, socket);
    }
    async _getTokenInfo(socket) {
        const { header, auth, query } = socket.handshake;
        const token = auth?.token || header?.token || query?.token;
        if (!token)
            throw new Error(constant_1.SECURITY_MESSAGES.INVALID_TOKEN);
        const tokenInfo = await services_1.TokenService.getInstance().tokenIsValid(token);
        if (!tokenInfo)
            throw new Error(constant_1.SECURITY_MESSAGES.INVALID_TOKEN);
        const sessionId = tokenInfo.userInfo?.id;
        socket.sessionId = sessionId;
        socket.userInfo = {
            id: tokenInfo.userInfo?.id,
            name: tokenInfo.userInfo?.userName,
        };
        return tokenInfo;
    }
    async _getProfileId(socket) {
        const tokenInfo = await this._getTokenInfo(socket);
        return (tokenInfo.profile.profileId ||
            tokenInfo.profile.userProfileBosConfigId ||
            tokenInfo.profile.appProfileBosConfigId);
    }
}
exports.default = SpinalIOMiddleware;
//# sourceMappingURL=SpinalIOMiddleware.js.map