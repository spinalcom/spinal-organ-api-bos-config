import { SpinalContext } from "spinal-env-viewer-graph-service";
import { IAppCredential, IApplicationToken, IOAuth2Credential } from "../interfaces";
export declare class AppListService {
    private static instance;
    context: SpinalContext;
    private constructor();
    static getInstance(): AppListService;
    init(): Promise<SpinalContext>;
    /**
     * Authenticate an application using the admin platform.
     *
     * @param {(IAppCredential | IOAuth2Credential)} application
     * @return {*}  {(Promise<{ code: number; data: string | IApplicationToken }>)}
     * @memberof AppListService
     */
    authenticateApplication(application: IAppCredential | IOAuth2Credential): Promise<{
        code: number;
        data: string | IApplicationToken;
    }>;
    private _getAuthPlateformInfo;
}
