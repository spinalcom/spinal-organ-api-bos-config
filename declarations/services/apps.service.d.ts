/// <reference types="node" />
import { SpinalContext, SpinalNode } from "spinal-env-viewer-graph-service";
import { IApp } from "../interfaces";
export declare const AppsType: Readonly<{
    admin: "admin";
    building: "building";
}>;
export declare class AppService {
    private static instance;
    context: SpinalContext;
    private constructor();
    static getInstance(): AppService;
    init(): Promise<SpinalContext>;
    createAdminApp(appInfo: IApp): Promise<SpinalNode>;
    createBuildingApp(appInfo: IApp): Promise<SpinalNode>;
    createOrUpadteAdminApp(appInfo: IApp): Promise<SpinalNode>;
    getAllAdminApps(): Promise<SpinalNode[]>;
    getAllBuildingApps(): Promise<SpinalNode[]>;
    getAdminApp(appId: string): Promise<SpinalNode>;
    getBuildingApp(appId: string): Promise<SpinalNode>;
    getApps(appId: string): Promise<SpinalNode>;
    updateAdminApp(appId: string, newInfo: IApp): Promise<SpinalNode>;
    updateBuildingApp(appId: string, newInfo: IApp): Promise<SpinalNode>;
    deleteAdminApp(appId: string): Promise<boolean>;
    deleteBuildingApp(appId: string): Promise<boolean>;
    uploadApps(appType: string, fileData: Buffer, isExcel?: boolean): Promise<SpinalNode[]>;
    private _getApplicationGroupNode;
    private _convertExcelToJson;
    private _formatAppsJson;
}
