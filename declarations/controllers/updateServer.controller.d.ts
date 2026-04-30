import { Controller } from 'tsoa';
import * as express from 'express';
export declare class UpdateServerController extends Controller {
    constructor();
    updateServer(req: express.Request): Promise<{
        message: string;
        output?: string;
    }>;
}
