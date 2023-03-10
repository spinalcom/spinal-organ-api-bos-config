import { Controller } from "tsoa";
import { IApp } from "../interfaces";
import * as express from "express";
export declare class AppsController extends Controller {
    constructor();
    createAdminApp(appInfo: IApp): Promise<IApp | {
        message: string;
    }>;
    createBuildingApp(appInfo: IApp): Promise<IApp | {
        message: string;
    }>;
    getAllAdminApps(): Promise<IApp[] | {
        message: string;
    }>;
    getAllBuildingApps(): Promise<IApp[] | {
        message: string;
    }>;
    getAdminApp(appId: string): Promise<IApp | {
        message: string;
    }>;
    getBuildingApp(appId: string): Promise<IApp | {
        message: string;
    }>;
    updateAdminApp(appId: string, newInfo: IApp): Promise<IApp | {
        message: string;
    }>;
    updateBuildingApp(appId: string, newInfo: IApp): Promise<IApp | {
        message: string;
    }>;
    deleteAdminApp(appId: string): Promise<{
        message: string;
    }>;
    deleteBuildingApp(appId: string): Promise<{
        message: string;
    }>;
    uploadAdminApp(file: any): Promise<IApp[] | {
        message: string;
    }>;
    uploadBuildingApp(file: any): Promise<IApp[] | {
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
