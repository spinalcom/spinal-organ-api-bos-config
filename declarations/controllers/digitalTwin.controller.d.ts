import { Controller } from "tsoa";
import * as express from 'express';
export declare class DigitaltwinController extends Controller {
    constructor();
    addDigitalTwin(req: express.Request, data: {
        name: string;
        url: string;
    }, set_as_actual_digitaltwin?: boolean): Promise<any>;
    getAllDigitalTwins(req: express.Request): Promise<any[] | {
        message: any;
    }>;
    getDigitalTwin(req: express.Request, digitaltwinId: string): Promise<any>;
    setActualDigitalTwin(req: express.Request, digitaltwinId: string): Promise<any>;
    getActualDigitalTwin(req: express.Request): Promise<any>;
    getDefaultDigitalTwinContexts(req: express.Request): Promise<any[] | {
        message: any;
    }>;
    getDigitalTwinContexts(req: express.Request, digitaltwinId: string): Promise<any[] | {
        message: any;
    }>;
    editDigitalTwin(req: express.Request, digitaltwinId: string, data: {
        name?: string;
        url?: string;
    }): Promise<any>;
    removeDigitalTwin(req: express.Request, digitaltwinId: string): Promise<{
        message: any;
    }>;
    removeActualDigitaTwin(req: express.Request): Promise<{
        message: any;
    }>;
}
declare const _default: DigitaltwinController;
export default _default;
