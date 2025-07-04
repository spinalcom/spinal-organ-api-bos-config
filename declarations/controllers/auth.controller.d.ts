import * as express from "express";
import { HTTP_CODES } from "../constant";
import { Controller } from "tsoa";
import { IAdmin, IAdminCredential, IAppCredential, IApplicationToken, IOAuth2Credential, IBosCredential, IUserCredential, IUserToken } from "../interfaces";
export declare class AuthController extends Controller {
    constructor();
    authenticate(credential: IUserCredential | IAppCredential | IOAuth2Credential): Promise<string | IApplicationToken | IUserToken | {
        message: string;
    }>;
    consumeCodeUnique(data: {
        code: string;
    }): Promise<string | IApplicationToken | IUserToken | {
        message: string;
    }>;
    registerToAdmin(req: express.Request, data: IAdmin): Promise<IBosCredential | {
        message: string;
    }>;
    getBosToAdminCredential(req: express.Request): Promise<IBosCredential | {
        message: string;
    }>;
    deleteAdmin(req: express.Request): Promise<{
        message: string;
    }>;
    getAdminCredential(req: express.Request): Promise<IAdminCredential | {
        message: string;
    }>;
    syncDataToAdmin(req: express.Request): Promise<{
        message: string;
    }>;
    tokenIsValid(data: {
        token: string;
    }): Promise<{
        code: HTTP_CODES;
        data: IUserToken | IApplicationToken;
        message?: undefined;
    } | {
        code: HTTP_CODES;
        message: string;
        data?: undefined;
    }>;
}
declare const _default: AuthController;
export default _default;
