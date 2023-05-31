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
const SpinalAPIMiddleware_1 = require("./SpinalAPIMiddleware");
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const constant_1 = require("../constant");
const services_1 = require("../services");
const spinalAPIMiddleware = SpinalAPIMiddleware_1.default.getInstance();
class SpinalIOMiddleware {
    constructor(conn) {
        this.config = {
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
        this.logService = services_1.WebsocketLogsService.getInstance();
        this.getGraph = spinalAPIMiddleware.getGraph.bind(spinalAPIMiddleware);
        this.conn = conn;
    }
    static getInstance(conn) {
        if (!this.instance)
            this.instance = new SpinalIOMiddleware(conn);
        return this.instance;
    }
    tokenCheckMiddleware(io) {
        io.use((socket, next) => __awaiter(this, void 0, void 0, function* () {
            let err;
            try {
                yield this._getTokenInfo(socket);
            }
            catch (error) {
                err = error;
            }
            next(err);
        }));
    }
    getProfileGraph(socket) {
        return __awaiter(this, void 0, void 0, function* () {
            let profileId = yield this._getProfileId(socket);
            return spinalAPIMiddleware.getProfileGraph(profileId);
        });
    }
    getContext(contextId, socket) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileId = yield this._getProfileId(socket);
            if (typeof contextId === 'undefined')
                return;
            if (!isNaN(contextId))
                return spinalAPIMiddleware.load(contextId, profileId);
            const graph = yield spinalAPIMiddleware.getProfileGraph(profileId);
            if (!graph)
                return;
            const contexts = yield graph.getChildren();
            return contexts.find((el) => {
                if (el.getId().get() === contextId || el._server_id == contextId) {
                    return true;
                }
                return false;
            });
        });
    }
    getNodeWithServerId(server_id, socket) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileId = yield this._getProfileId(socket);
            return spinalAPIMiddleware.load(server_id, profileId);
        });
    }
    getNodeWithStaticId(nodeId, contextId, socket) {
        return __awaiter(this, void 0, void 0, function* () {
            if (nodeId === contextId) {
                return this.getContext(nodeId, socket);
            }
            const context = yield this.getContext(contextId, socket);
            if (context instanceof spinal_env_viewer_graph_service_1.SpinalContext) {
                const found = yield context.findInContext(context, (node, stop) => {
                    if (node.getId().get() === nodeId) {
                        stop();
                        return true;
                    }
                    return false;
                });
                return Array.isArray(found) ? found[0] : found;
            }
        });
    }
    getNode(nodeId, contextId, socket) {
        return __awaiter(this, void 0, void 0, function* () {
            //@ts-ignore
            if (!isNaN(nodeId)) {
                const node = yield this.getNodeWithServerId(nodeId, socket);
                //@ts-ignore
                if (node && node instanceof spinal_env_viewer_graph_service_1.SpinalNode)
                    SpinalGraphService._addNode(node);
                return node;
            }
            return this.getNodeWithStaticId(nodeId === null || nodeId === void 0 ? void 0 : nodeId.toString(), contextId, socket);
        });
    }
    _getTokenInfo(socket) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const { header, auth, query } = socket.handshake;
            const token = (auth === null || auth === void 0 ? void 0 : auth.token) || (header === null || header === void 0 ? void 0 : header.token) || (query === null || query === void 0 ? void 0 : query.token);
            if (!token)
                throw new Error(constant_1.SECURITY_MESSAGES.INVALID_TOKEN);
            const tokenInfo = yield services_1.TokenService.getInstance().tokenIsValid(token);
            if (!tokenInfo)
                throw new Error(constant_1.SECURITY_MESSAGES.INVALID_TOKEN);
            const sessionId = (_a = tokenInfo.userInfo) === null || _a === void 0 ? void 0 : _a.id;
            socket.sessionId = sessionId;
            socket.userInfo = {
                id: (_b = tokenInfo.userInfo) === null || _b === void 0 ? void 0 : _b.id,
                name: (_c = tokenInfo.userInfo) === null || _c === void 0 ? void 0 : _c.userName,
            };
            return tokenInfo;
        });
    }
    _getProfileId(socket) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenInfo = yield this._getTokenInfo(socket);
            return (tokenInfo.profile.profileId ||
                tokenInfo.profile.userProfileBosConfigId ||
                tokenInfo.profile.appProfileBosConfigId);
        });
    }
}
exports.default = SpinalIOMiddleware;
//# sourceMappingURL=SpinalIOMiddleware.js.map