import { IProfile, IProfileAuthEdit, IProfileData } from "../interfaces";
import { Controller } from "tsoa";
import * as express from "express";
export declare class AppProfileController extends Controller {
    constructor();
    createAppProfile(req: express.Request, data: IProfile): Promise<IProfileData | {
        message: string;
    }>;
    getAppProfile(req: express.Request, id: string): Promise<IProfileData | {
        message: string;
    }>;
    getAllAppProfile(req: express.Request): Promise<IProfileData[] | {
        message: string;
    }>;
    updateAppProfile(req: express.Request, id: string, data: IProfileAuthEdit): Promise<IProfileData | {
        message: string;
    }>;
    deleteAppProfile(req: express.Request, id: string): Promise<{
        message: string;
    }>;
    authorizeProfileToAccessContext(req: express.Request, profileId: string, data: {
        contextIds: string | string[];
        digitalTwinId?: string;
    }): Promise<any[] | {
        message: any;
    }>;
    authorizeProfileToAccessApis(req: express.Request, profileId: string, data: {
        apiIds: string | string[];
    }): Promise<any[] | {
        message: any;
    }>;
    unauthorizeProfileToAccessContext(req: express.Request, profileId: string, data: {
        contextIds: string | string[];
        digitalTwinId?: string;
    }): Promise<any[] | {
        message: any;
    }>;
    unauthorizeProfileToAccessApis(req: express.Request, profileId: string, data: {
        apiIds: string | string[];
    }): Promise<any[] | {
        message: any;
    }>;
    profileHasAccessToContext(req: express.Request, profileId: string, contextId: string, digitalTwinId?: string): Promise<boolean | {
        message: any;
    }>;
    profileHasAccessToApi(req: express.Request, profileId: string, apiId: string): Promise<boolean | {
        message: any;
    }>;
    getAuthorizedContexts(req: express.Request, profileId: string, digitalTwinId?: string): Promise<any[] | {
        message: any;
    }>;
    getAuthorizedApis(req: express.Request, profileId: string): Promise<any[] | {
        message: any;
    }>;
}
declare const _default: AppProfileController;
export default _default;
