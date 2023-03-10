import { Controller } from "tsoa";
import { IApiRoute } from "../interfaces";
import * as express from "express";
export declare class APIController extends Controller {
    constructor();
    createBosApiRoute(req: express.Request, data: IApiRoute): Promise<IApiRoute | {
        message: string;
    }>;
    updateBosApiRoute(data: IApiRoute, id: string): Promise<IApiRoute | {
        message: string;
    }>;
    getBosApiRouteById(id: string): Promise<IApiRoute | {
        message: string;
    }>;
    getAllBosApiRoute(req: any): Promise<IApiRoute[] | {
        message: string;
    }>;
    deleteBosApiRoute(id: any): Promise<{
        message: string;
    }>;
    uploadBosSwaggerFile(file: any): Promise<IApiRoute[] | {
        message: string;
    }>;
}
declare const _default: APIController;
export default _default;
