/// <reference types="node" />
import { SpinalContext, SpinalNode } from 'spinal-env-viewer-graph-service';
import { ISpinalApp } from '../interfaces';
import { ISubApp } from '../interfaces/ISubApp';
import { TAppSearch } from '../utils/findNodeBySearchKey';
export declare const AppsType: Readonly<{
    admin: string;
    building: string;
}>;
export declare class AppService {
    private static instance;
    context: SpinalContext;
    private constructor();
    static getInstance(): AppService;
    init(): Promise<SpinalContext>;
    createAdminApp(appInfo: ISpinalApp): Promise<SpinalNode>;
    createBuildingApp(appInfo: ISpinalApp, silenceAlreadyExist?: boolean): Promise<SpinalNode>;
    createBuildingSubApp(appNode: SpinalNode, appInfo: ISubApp, silenceAlreadyExist?: boolean): Promise<SpinalNode | string>;
    createOrUpadteAdminApp(appInfo: ISpinalApp): Promise<SpinalNode>;
    getAllAdminApps(): Promise<SpinalNode[]>;
    getAllBuildingApps(): Promise<SpinalNode[]>;
    getAllBuildingAppsAndSubApp(): Promise<SpinalNode[]>;
    getAdminApp(searchKeys: TAppSearch, appNameOrId: string): Promise<SpinalNode>;
    getBuildingApp(searchKeys: TAppSearch, appNameOrId: string): Promise<SpinalNode>;
    /**
     * Get a building subApp from a building app
     * if subAppNameOrId is not provided, return the first subApp found
     * if subAppNameOrId is provided, return the subApp with the id or name or undefined
     * @param {TAppSearch} searchKeys
     * @param {string} appNameOrId
     * @param {string} [subAppNameOrId]
     * @return {*}  {Promise<SpinalNode>}
     * @memberof AppService
     */
    getBuildingSubApp(searchKeys: TAppSearch, appNameOrId: string, subAppNameOrId: string): Promise<SpinalNode>;
    findBuildingSubAppInApps(searchKeys: TAppSearch, appsNodes: SpinalNode[], subAppNameOrId: string): Promise<SpinalNode>;
    formatAppsAndAddSubApps(appsNodes: SpinalNode[], subAppsNodes?: SpinalNode[]): Promise<ISpinalApp[]>;
    formatAppAndAddSubApps(appsNode: SpinalNode, subAppsNodes?: SpinalNode[]): Promise<ISpinalApp>;
    getApps(searchKeys: TAppSearch, appNameOrId: string): Promise<SpinalNode>;
    updateAdminApp(appId: string, newInfo: ISpinalApp): Promise<SpinalNode>;
    updateBuildingApp(appId: string, newInfo: ISpinalApp): Promise<SpinalNode>;
    private _updateAppInfo;
    updateBuildingSubAppInfo(appId: string, subAppId: string, newInfo: ISubApp): Promise<SpinalNode>;
    deleteAdminApp(appId: string): Promise<boolean>;
    deleteBuildingApp(appId: string): Promise<boolean>;
    /**
     * Delete a subApp from a building app
     * @param {string} appId
     * @param {string} subAppId
     * @return {*} {Promise<boolean>} true if the subApp is deleted, false if not found
     * @memberof AppService
     */
    deleteBuildingSubApp(appId: string, subAppId: string): Promise<boolean>;
    uploadApps(appType: keyof typeof AppsType, fileData: Buffer, isExcel?: boolean): Promise<SpinalNode[]>;
    uploadSubApps(fileData: Buffer, isExcel?: boolean): Promise<{
        subApps: SpinalNode[];
        errors: string[];
    }>;
    private _getApplicationGroupNode;
    private _convertExcelToJson;
    private _formatAppsJson;
    private _formatSubAppsJson;
}
