import { Controller } from "tsoa";
import { IApp } from "../interfaces";
import * as express from "express";
export declare class AppsController extends Controller {
    constructor();
    createAdminApp(req: express.Request, appInfo: IApp): Promise<IApp | {
        message: string;
    }>;
    createBuildingApp(req: express.Request, appInfo: IApp): Promise<IApp | {
        message: string;
    }>;
    getAllAdminApps(req: express.Request): Promise<IApp[] | {
        message: string;
    }>;
    getAllBuildingApps(req: express.Request): Promise<IApp[] | {
        message: string;
    }>;
    getAdminApp(req: express.Request, appId: string): Promise<IApp | {
        message: string;
    }>;
    getBuildingApp(req: express.Request, appId: string): Promise<IApp | {
        message: string;
    }>;
    updateAdminApp(req: express.Request, appId: string, newInfo: IApp): Promise<IApp | {
        message: string;
    }>;
    updateBuildingApp(req: express.Request, appId: string, newInfo: IApp): Promise<IApp | {
        message: string;
    }>;
    deleteAdminApp(req: express.Request, appId: string): Promise<{
        message: string;
    }>;
    deleteBuildingApp(req: express.Request, appId: string): Promise<{
        message: string;
    }>;
    uploadAdminApp(req: express.Request, file: any): Promise<IApp[] | {
        message: string;
    }>;
    uploadBuildingApp(req: express.Request, file: any): Promise<IApp[] | {
        message: string;
    }>;
    getFavoriteApps(request: express.Request): Promise<any[] | {
        message: any;
    }>;
    addAppToFavoris(request: express.Request, data: {
        appIds: string[];
    }): Promise<any[] | {
        message: any;
    }>;
    removeAppFromFavoris(request: express.Request, data: {
        appIds: string[];
    }): Promise<any[] | {
        message: any;
    }>;
}
declare const _default: AppsController;
export default _default;
