import { FileSystem } from "spinal-core-connectorjs";
import { ISpinalIOMiddleware, IConfig } from "spinal-organ-api-pubsub";
import { Socket, Server } from "socket.io";
import { SpinalGraph, SpinalNode } from "spinal-env-viewer-graph-service";
import { WebsocketLogsService } from "../services";
export default class SpinalIOMiddleware implements ISpinalIOMiddleware {
    config: IConfig;
    conn: FileSystem | undefined;
    logService: WebsocketLogsService;
    private static instance;
    private constructor();
    static getInstance(): SpinalIOMiddleware;
    setConnection(conn: FileSystem): void;
    tokenCheckMiddleware(io: Server): void;
    getGraph(): Promise<SpinalGraph>;
    getProfileGraph(socket?: Socket): Promise<SpinalGraph>;
    getContext(contextId: number | string, socket?: Socket): Promise<SpinalNode | undefined>;
    getNodeWithServerId(server_id: number, socket?: Socket): Promise<SpinalNode | undefined>;
    getNodeWithStaticId(nodeId: string, contextId: string | number, socket?: Socket): Promise<SpinalNode | undefined>;
    getNode(nodeId: string | number, contextId?: string | number, socket?: Socket): Promise<SpinalNode | undefined>;
    private _getTokenInfo;
    private _getProfileId;
}
