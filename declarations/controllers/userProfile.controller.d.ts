import { IProfile, IProfileAuthEdit, IProfileData } from "../interfaces";
import { Controller } from "tsoa";
export declare class UserProfileController extends Controller {
    constructor();
    createUserProfile(data: IProfile): Promise<IProfileData | {
        message: string;
    }>;
    getUserProfile(id: string): Promise<IProfileData | {
        message: string;
    }>;
    getAllUserProfile(): Promise<IProfileData[] | {
        message: string;
    }>;
    updateUserProfile(id: string, data: IProfileAuthEdit): Promise<IProfileData | {
        message: string;
    }>;
    deleteUserProfile(id: string): Promise<{
        message: string;
    }>;
    getAuthorizedContexts(profileId: string, digitalTwinId?: string): Promise<any[] | {
        message: any;
    }>;
    getAuthorizedApps(profileId: string): Promise<any[] | {
        message: any;
    }>;
    getAuthorizedAdminApps(profileId: string): Promise<any[] | {
        message: any;
    }>;
    authorizeProfileToAccessContext(profileId: string, data: {
        contextIds: string | string[];
        digitalTwinId?: string;
    }): Promise<any[] | {
        message: any;
    }>;
    authorizeProfileToAccessApps(profileId: string, data: {
        appIds: string | string[];
    }): Promise<any[] | {
        message: any;
    }>;
    unauthorizeProfileToAccessContext(profileId: string, data: {
        contextIds: string | string[];
        digitalTwinId?: string;
    }): Promise<any[] | {
        message: any;
    }>;
    unauthorizeProfileToAccessApps(profileId: string, data: {
        appIds: string | string[];
    }): Promise<any[] | {
        message: any;
    }>;
    profileHasAccessToContext(profileId: string, contextId: string, digitalTwinId?: string): Promise<boolean | {
        message: any;
    }>;
    profileHasAccessToApp(profileId: string, appId: string): Promise<boolean | {
        message: any;
    }>;
}
declare const _default: UserProfileController;
export default _default;
