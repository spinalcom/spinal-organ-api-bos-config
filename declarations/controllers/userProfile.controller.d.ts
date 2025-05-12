import { IProfile, IProfileAuthEdit, IProfileData } from '../interfaces';
import { Controller } from 'tsoa';
import * as express from 'express';
export declare class UserProfileController extends Controller {
    constructor();
    createUserProfile(req: express.Request, data: IProfile): Promise<IProfileData | {
        message: string;
    }>;
    getUserProfile(req: express.Request, id: string): Promise<IProfileData | {
        message: string;
    }>;
    getUserProfileByToken(req: express.Request): Promise<IProfileData | {
        message: string;
    }>;
    getAllUserProfile(req: express.Request): Promise<IProfileData[] | {
        message: string;
    }>;
    updateUserProfile(req: express.Request, id: string, data: IProfileAuthEdit): Promise<IProfileData | {
        message: string;
    }>;
    deleteUserProfile(req: express.Request, id: string): Promise<{
        message: string;
    }>;
    getAuthorizedContexts(req: express.Request, profileId: string, digitalTwinId?: string): Promise<any[] | {
        message: any;
    }>;
    getAuthorizedApps(req: express.Request, profileId: string): Promise<any[] | {
        message: any;
    }>;
    getAuthorizedAdminApps(req: express.Request, profileId: string): Promise<any[] | {
        message: any;
    }>;
    authorizeProfileToAccessContext(req: express.Request, profileId: string, data: {
        contextIds: string | string[];
        digitalTwinId?: string;
    }): Promise<any[] | {
        message: any;
    }>;
    authorizeProfileToAccessApps(req: express.Request, profileId: string, data: {
        appIds: string | string[];
    }): Promise<any[] | {
        message: any;
    }>;
    unauthorizeProfileToAccessContext(req: express.Request, profileId: string, data: {
        contextIds: string | string[];
        digitalTwinId?: string;
    }): Promise<any[] | {
        message: any;
    }>;
    unauthorizeProfileToAccessApps(req: express.Request, profileId: string, data: {
        appIds: string | string[];
    }): Promise<any[] | {
        message: any;
    }>;
    profileHasAccessToContext(req: express.Request, profileId: string, contextId: string, digitalTwinId?: string): Promise<boolean | {
        message: any;
    }>;
    profileHasAccessToApp(req: express.Request, profileId: string, appId: string): Promise<boolean | {
        message: any;
    }>;
    profileHasAccessToSubApp(req: express.Request, profileId: string, appNameOrId: string, subAppNameOrId: string): Promise<boolean | {
        message: any;
    }>;
}
declare const _default: UserProfileController;
export default _default;
