import { Controller } from 'tsoa';
import * as express from 'express';
export declare class WebsocketLogsController extends Controller {
    private _websocketLogService;
    constructor();
    getWebsocketState(req: express.Request): Promise<{
        state: import("spinal-service-pubsub-logs").WEBSOCKET_STATE;
        since: number;
    } | {
        message: any;
    }>;
    getNbClientConnected(req: express.Request): Promise<{
        numberOfClientConnected: any;
    } | {
        message: any;
    }>;
    readWebsocketLogs(req: express.Request, begin: string | number, end: string | number): Promise<import("spinal-service-pubsub-logs").ISpinalDateValue[] | {
        message: any;
    }>;
    readCurrentWeekLogs(req: express.Request): Promise<import("spinal-service-pubsub-logs").ISpinalDateValue[] | {
        message: any;
    }>;
    readCurrentYearLogs(req: express.Request): Promise<import("spinal-service-pubsub-logs").ISpinalDateValue[] | {
        message: any;
    }>;
    readLast24hLogs(req: express.Request): Promise<import("spinal-service-pubsub-logs").ISpinalDateValue[] | {
        message: any;
    }>;
}
