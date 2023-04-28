import { Controller } from "tsoa";
import * as express from "express";
export declare class HubSessionController extends Controller {
    constructor();
    createSession(req: express.Request): Promise<{
        sessionNumber?: number;
        graphServerId?: number;
        username?: string;
    } | {
        message: string;
    }>;
}
