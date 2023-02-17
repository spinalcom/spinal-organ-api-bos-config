import { IProfile, IProfileAuthEdit, IProfileData } from "../interfaces";
import { Controller } from "tsoa";
export declare class AppProfileController extends Controller {
    constructor();
    createAppProfile(data: IProfile): Promise<IProfileData | {
        message: string;
    }>;
    getAppProfile(id: string): Promise<IProfileData | {
        message: string;
    }>;
    getAllAppProfile(): Promise<IProfileData[] | {
        message: string;
    }>;
    updateAppProfile(id: string, data: IProfileAuthEdit): Promise<IProfileData | {
        message: string;
    }>;
    deleteAppProfile(id: string): Promise<{
        message: string;
    }>;
    authorizeProfileToAccessContext(profileId: string, data: {
        contextIds: string | string[];
        digitalTwinId?: string;
    }): Promise<any[] | {
        message: any;
    }>;
    authorizeProfileToAccessApis(profileId: string, data: {
        apiIds: string | string[];
    }): Promise<any[] | {
        message: any;
    }>;
    unauthorizeProfileToAccessContext(profileId: string, data: {
        contextIds: string | string[];
        digitalTwinId?: string;
    }): Promise<any[] | {
        message: any;
    }>;
    unauthorizeProfileToAccessApis(profileId: string, data: {
        apiIds: string | string[];
    }): Promise<any[] | {
        message: any;
    }>;
    profileHasAccessToContext(profileId: string, contextId: string, digitalTwinId?: string): Promise<boolean | {
        message: any;
    }>;
    profileHasAccessToApi(profileId: string, apiId: string): Promise<boolean | {
        message: any;
    }>;
    getAuthorizedContexts(profileId: string, digitalTwinId?: string): Promise<any[] | {
        message: any;
    }>;
    getAuthorizedApis(profileId: string): Promise<any[] | {
        message: any;
    }>;
}
declare const _default: AppProfileController;
export default _default;
