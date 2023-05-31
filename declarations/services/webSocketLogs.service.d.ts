import { WEBSOCKET_STATE, SpinalLog } from 'spinal-service-pubsub-logs';
import { SpinalContext } from 'spinal-env-viewer-graph-service';
import { Server } from 'socket.io';
export default class WebsocketLogsService {
    private static _instance;
    private _alertTime;
    private timeoutIds;
    private _directory;
    private _spinalQueue;
    private _logPromMap;
    private _lastSendTime;
    private _io;
    private context;
    private constructor();
    static getInstance(): WebsocketLogsService;
    setIo(io: Server): void;
    init(): Promise<SpinalContext<any>>;
    createLog(type: string, action: string, targetInfo?: {
        id: string;
        name: string;
    }, nodeInfo?: {
        id: string;
        name: string;
        [key: string]: string;
    }): void;
    getClientConnected(): Promise<{
        numberOfClientConnected: any;
    }>;
    getLogModel(): Promise<SpinalLog>;
    getWebsocketState(): Promise<{
        state: WEBSOCKET_STATE;
        since: number;
    }>;
    getCurrent(): Promise<import("spinal-service-pubsub-logs").ISpinalDateValue>;
    getDataFromLast24Hours(): Promise<import("spinal-service-pubsub-logs").ISpinalDateValue[]>;
    getDataFromLastHours(numberOfHours: number): Promise<import("spinal-service-pubsub-logs").ISpinalDateValue[]>;
    getDataFromYesterday(): Promise<import("spinal-service-pubsub-logs").ISpinalDateValue[]>;
    getFromIntervalTime(start: string | number | Date, end: string | number | Date): Promise<import("spinal-service-pubsub-logs").ISpinalDateValue[]>;
    private _startTimer;
    private _createAlert;
    private _addLogs;
    private _addToQueue;
    private _createLogsInGraph;
    private _changeBuildingState;
    private _getDirectory;
    private _fileExistInDirectory;
    private _listenSpinalQueueEvent;
}
export { WebsocketLogsService };
