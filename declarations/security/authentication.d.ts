import * as express from "express";
export declare function expressAuthentication(request: express.Request, securityName?: string, scopes?: string[]): Promise<string>;
export declare function checkIfItIsAdmin(request: express.Request): Promise<boolean>;
export declare function getProfileId(request: express.Request): Promise<string>;
export declare function checkAndGetTokenInfo(request: express.Request): Promise<any>;
export declare function checkIfItIsAuthPlateform(request: express.Request): Promise<boolean>;
export declare function checkBeforeRedirectToApi(request: express.Request, securityName: string, scopes?: string[]): Promise<any>;
