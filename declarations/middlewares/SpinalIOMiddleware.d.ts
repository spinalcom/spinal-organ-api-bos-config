import { FileSystem } from 'spinal-core-connectorjs';
import { ISpinalIOMiddleware } from 'spinal-organ-api-pubsub';
import { Socket, Server } from 'socket.io';
import { SpinalGraph, SpinalNode } from 'spinal-env-viewer-graph-service';
import { WebsocketLogsService } from '../services';
import { IConfig } from 'spinal-organ-api-server';
export default class SpinalIOMiddleware implements ISpinalIOMiddleware {
    config: IConfig;
    conn: FileSystem;
    logService: WebsocketLogsService;
    private static instance;
    private constructor();
    static getInstance(conn?: spinal.FileSystem): ISpinalIOMiddleware;
    tokenCheckMiddleware(io: Server): void;
    getGraph(): Promise<SpinalGraph>;
    getProfileGraph(socket?: Socket): Promise<SpinalGraph>;
    getContext(contextId: number | string, socket?: Socket): Promise<SpinalNode>;
    getNodeWithServerId(server_id: number, socket?: Socket): Promise<SpinalNode>;
    getNodeWithStaticId(nodeId: string, contextId: string | number, socket?: Socket): Promise<SpinalNode>;
    getNode(nodeId: string | number, contextId?: string | number, socket?: Socket): Promise<SpinalNode>;
    private _getTokenInfo;
    private _getProfileId;
}
