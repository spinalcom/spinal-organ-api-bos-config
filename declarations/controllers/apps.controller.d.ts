import { Controller } from 'tsoa';
import { ISpinalApp } from '../interfaces';
import * as express from 'express';
import { ISubApp } from '../interfaces/ISubApp';
export declare class AppsController extends Controller {
    constructor();
    createAdminApp(req: express.Request, appInfo: ISpinalApp): Promise<ISpinalApp | {
        message: string;
    }>;
    createBuildingApp(req: express.Request, appInfo: ISpinalApp): Promise<ISpinalApp | {
        message: string;
    }>;
    createBuildingSubApp(req: express.Request, appId: string, appInfo: ISubApp): Promise<ISubApp | {
        message: string;
    }>;
    getAllAdminApps(req: express.Request): Promise<ISpinalApp[] | {
        message: string;
    }>;
    getAllBuildingApps(req: express.Request): Promise<ISpinalApp[] | {
        message: string;
    }>;
    getAdminApp(req: express.Request, appNameOrId: string): Promise<ISpinalApp | {
        message: string;
    }>;
    /**
     * Get building app by name or id
     * @param {express.Request} req express request
     * @param {string} appNaneOrId app name or id
     * @return {*}  {(Promise<ISpinalApp | { message: string }>)}
     * @memberof AppsController
     */
    getBuildingApp(req: express.Request, appNaneOrId: string): Promise<ISpinalApp | {
        message: string;
    }>;
    /**
     * Get building sub app configuration by name or id
     * @param {express.Request} req
     * @param {string} appNameOrId
     * @param {string} subAppNameOrId
     * @return {*}  {(Promise<any | { message: string }>)}
     * @memberof AppsController
     */
    getBuildingSubApp(req: express.Request, appNameOrId: string, subAppNameOrId: string): Promise<any | {
        message: string;
    }>;
    updateAdminApp(req: express.Request, appId: string, newInfo: ISpinalApp): Promise<ISpinalApp | {
        message: string;
    }>;
    updateBuildingApp(req: express.Request, appId: string, newInfo: ISpinalApp): Promise<ISpinalApp | {
        message: string;
    }>;
    updateBuildingSubApp(req: express.Request, appId: string, subAppId: string, newInfo: ISubApp): Promise<ISubApp | {
        message: string;
    }>;
    deleteAdminApp(req: express.Request, appId: string): Promise<{
        message: string;
    }>;
    deleteBuildingApp(req: express.Request, appId: string): Promise<{
        message: string;
    }>;
    deleteBuildingSubApp(req: express.Request, appId: string, subAppId: string): Promise<{
        message: string;
    }>;
    uploadAdminApp(req: express.Request, file: any): Promise<ISpinalApp[] | {
        message: string;
    }>;
    uploadBuildingApp(req: express.Request, file: any): Promise<ISpinalApp[] | {
        message: string;
    }>;
    uploadBuildingSubApp(req: express.Request, file: any): Promise<{
        subApps?: ISpinalApp[];
        errors?: string[] | string;
    }>;
    getFavoriteApps(request: express.Request): Promise<ISpinalApp[] | {
        message: any;
    }>;
    addAppToFavoris(request: express.Request, data: {
        appIds: string[];
    }): Promise<ISpinalApp[] | {
        message: any;
    }>;
    removeAppFromFavoris(request: express.Request, data: {
        appIds: string[];
    }): Promise<ISpinalApp[] | {
        message: any;
    }>;
}
declare const _default: AppsController;
export default _default;
