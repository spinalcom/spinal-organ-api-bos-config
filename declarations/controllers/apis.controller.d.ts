import { Controller } from "tsoa";
import { IApiRoute } from "../interfaces";
import * as express from "express";
export declare class APIController extends Controller {
    constructor();
    createBosApiRoute(req: express.Request, data: IApiRoute): Promise<IApiRoute | {
        message: string;
    }>;
    updateBosApiRoute(req: express.Request, data: IApiRoute, id: string): Promise<IApiRoute | {
        message: string;
    }>;
    getBosApiRouteById(req: express.Request, id: string): Promise<IApiRoute | {
        message: string;
    }>;
    getAllBosApiRoute(req: any): Promise<IApiRoute[] | {
        message: string;
    }>;
    deleteBosApiRoute(req: any, id: any): Promise<{
        message: string;
    }>;
    uploadBosSwaggerFile(req: any, file: any): Promise<IApiRoute[] | {
        message: string;
    }>;
}
declare const _default: APIController;
export default _default;
