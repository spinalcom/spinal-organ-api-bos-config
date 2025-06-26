import { IBosCredential } from "../interfaces";
import { SpinalContext, SpinalNode } from "spinal-env-viewer-graph-service";
export declare function _addUserToContext(context: SpinalContext, info: {
    [key: string]: any;
}, element?: spinal.Model, isAdmin?: boolean): Promise<SpinalNode>;
export declare function _hashPassword(password: string, saltRounds?: number): Promise<string>;
export declare function _comparePassword(password: string, hash: string): Promise<boolean>;
export declare function _generateString(length?: number): string;
export declare function _deleteUserToken(userNode: SpinalNode): Promise<boolean[]>;
export declare function _getUserProfileInfo(userToken: string, adminCredential: IBosCredential, isUser?: boolean): Promise<any>;
export declare function _getUserInfo(userId: string, adminCredential: IBosCredential, userToken: string): Promise<any>;
export declare function _getAuthPlateformInfo(): Promise<IBosCredential>;
export declare function getUserInfoByToken(adminCredential: IBosCredential, userToken: string): Promise<any>;
