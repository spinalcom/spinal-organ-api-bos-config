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

import { FileSystem } from 'spinal-core-connectorjs';
import { ISpinalIOMiddleware } from "spinal-organ-api-pubsub";
import SpinalAPIMiddleware from "./SpinalAPIMiddleware";
import { Socket, Server } from "socket.io";
import { SpinalContext, SpinalGraph, SpinalNode } from "spinal-env-viewer-graph-service";
import { SECURITY_MESSAGES } from "../constant";
import { TokenService } from "../services";
import { NextFunction } from "express";
import { IConfig } from "spinal-organ-api-server";

const spinalAPIMiddleware = SpinalAPIMiddleware.getInstance();

export default class SpinalIOMiddleware implements ISpinalIOMiddleware {
    config: IConfig = {
        spinalConnector: {
            protocol: process.env.SPINALHUB_PROTOCOL || 'http',
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
    conn: FileSystem;
    private static instance: ISpinalIOMiddleware;

    private constructor(conn: spinal.FileSystem) {
        this.conn = conn;
    }

    static getInstance(conn?: spinal.FileSystem): ISpinalIOMiddleware {
        if (!this.instance) this.instance = new SpinalIOMiddleware(conn);
        return this.instance;
    }

    public tokenCheckMiddleware(io: Server): void {
        io.use(async (socket: Socket, next: NextFunction) => {
            let err;
            try {
                await this._getTokenInfo(socket);
            } catch (error) {
                err = error;
            }

            next(err);
        })
    }

    getGraph = spinalAPIMiddleware.getGraph.bind(spinalAPIMiddleware);

    public async getProfileGraph(socket?: Socket): Promise<SpinalGraph> {
        let profileId = await this._getProfileId(socket);

        return spinalAPIMiddleware.getProfileGraph(profileId);
    }



    public async getContext(contextId: number | string, socket?: Socket): Promise<SpinalNode> {
        const profileId = await this._getProfileId(socket);
        if (typeof contextId === "undefined") return;
        if (!isNaN((contextId as any))) return spinalAPIMiddleware.load(<number>contextId, profileId);

        const graph = await spinalAPIMiddleware.getProfileGraph(profileId);
        if (!graph) return;

        const contexts = await graph.getChildren();
        return contexts.find(el => {
            if (el.getId().get() === contextId || el._server_id == contextId) {
                return true;
            }
            return false;
        })
    }

    public async getNodeWithServerId(server_id: number, socket?: Socket): Promise<SpinalNode> {
        const profileId = await this._getProfileId(socket);
        return spinalAPIMiddleware.load(server_id, profileId);
    }

    public async getNodeWithStaticId(nodeId: string, contextId: string | number, socket?: Socket): Promise<SpinalNode> {
        if (nodeId === contextId) {
            return this.getContext(nodeId, socket);
        }

        const context = await this.getContext(contextId, socket);
        if (context instanceof SpinalContext) {

            const found = await context.findInContext(context, (node, stop) => {
                if (node.getId().get() === nodeId) {
                    stop()
                    return true;
                }

                return false;
            })

            return Array.isArray(found) ? found[0] : found;
        }

    }

    public async getNode(nodeId: string | number, contextId?: string | number, socket?: Socket): Promise<SpinalNode> {
        //@ts-ignore
        if (!isNaN(nodeId)) {
            const node = await this.getNodeWithServerId(<number>nodeId, socket);
            //@ts-ignore
            if (node && node instanceof SpinalNode) SpinalGraphService._addNode(node);

            return node;
        }

        return this.getNodeWithStaticId(nodeId?.toString(), contextId, socket);
    }

    private async _getTokenInfo(socket: Socket) {
        const { header, auth, query } = (<any>socket.handshake);
        const token = auth?.token || header?.token || query?.token
        if (!token) throw new Error(SECURITY_MESSAGES.INVALID_TOKEN);

        const tokenInfo: any = await TokenService.getInstance().tokenIsValid(token);
        if (!tokenInfo) throw new Error(SECURITY_MESSAGES.INVALID_TOKEN);
        return tokenInfo;
    }

    private async _getProfileId(socket: Socket): Promise<string> {
        const tokenInfo = await this._getTokenInfo(socket);
        return tokenInfo.profile.profileId || tokenInfo.profile.userProfileBosConfigId || tokenInfo.profile.appProfileBosConfigId;
    }

}