import { IAppCredential, IApplicationToken, IOAuth2Credential } from '../interfaces';
import { SpinalContext, SpinalNode } from 'spinal-env-viewer-graph-service';
export declare function authenticateApplication(urlAdmin: string, idPlateform: string, application: IAppCredential | IOAuth2Credential, context: SpinalContext): Promise<{
    code: number;
    data: string | IApplicationToken;
}>;
export declare function _getProfileInfo(userToken: string, urlAdmin: string, idPlateform: string): Promise<any>;
export declare function _addUserToContext(context: SpinalContext, info: {
    [key: string]: any;
}, element?: spinal.Model): Promise<SpinalNode>;
