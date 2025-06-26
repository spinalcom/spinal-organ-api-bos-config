/// <reference types="node" />
import { SpinalContext, SpinalNode } from "spinal-env-viewer-graph-service";
import { ISpinalApp } from "../interfaces";
import { ISubApp } from "../interfaces/ISubApp";
import { TAppSearch } from "../utils/findNodeBySearchKey";
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
    /**
     * Create an admin app in the admin apps group.
     *
     * @param {ISpinalApp} appInfo
     * @return {*}  {Promise<SpinalNode>}
     * @memberof AppService
     */
    createAdminApp(appInfo: ISpinalApp): Promise<SpinalNode>;
    /**
     * Create a building app in the building apps group.
     *
     * @param {ISpinalApp} appInfo
     * @param {boolean} [silenceAlreadyExist=false]
     * @return {*}  {Promise<SpinalNode>}
     * @memberof AppService
     */
    createBuildingApp(appInfo: ISpinalApp, silenceAlreadyExist?: boolean): Promise<SpinalNode>;
    /**
     * Create a subApp under a building app.
     *
     * @param {SpinalNode} appNode
     * @param {ISubApp} appInfo
     * @param {boolean} [silenceAlreadyExist=false]
     * @return {*}  {(Promise<SpinalNode | string>)}
     * @memberof AppService
     */
    createBuildingSubApp(appNode: SpinalNode, appInfo: ISubApp, silenceAlreadyExist?: boolean): Promise<SpinalNode | string>;
    /**
     * Creates a new admin application node or updates an existing one based on the provided app information.
     *
     * This method first retrieves (or creates) the admin applications group node. It then checks if an application
     * with the same name already exists as a child of this group. If it exists, the method updates the existing
     * application node; otherwise, it creates a new admin application node.
     *
     * @param appInfo - The information of the admin application to create or update.
     * @returns A promise that resolves to the created or updated SpinalNode, or `undefined` if the group node could not be retrieved.
     */
    createOrUpadteAdminApp(appInfo: ISpinalApp): Promise<SpinalNode>;
    /**
     * Retrieves all admin application nodes.
     *
     * @returns {Promise<SpinalNode[]>} A promise that resolves to an array of SpinalNode representing admin apps.
     */
    getAllAdminApps(): Promise<SpinalNode[]>;
    /**
     * Retrieves all building application nodes.
     *
     * This method fetches the group node associated with building applications
     * using the specified group name and type. If the group node exists, it returns
     * all its child nodes that are related via the application relation name.
     * If the group node does not exist, it returns an empty array.
     *
     * @returns {Promise<SpinalNode[]>} A promise that resolves to an array of building application nodes.
     */
    getAllBuildingApps(): Promise<SpinalNode[]>;
    /**
     * Retrieves all building applications and their sub-applications.
     *
     * This method fetches the group node associated with building applications
     * and retrieves all its child nodes that are related via the application relation name.
     * It then iterates through each building application to fetch its sub-applications,
     * collecting them into a single array of SpinalNode objects.
     *
     * @returns {Promise<SpinalNode[]>} A promise that resolves to an array of SpinalNode representing all building apps and their sub-apps.
     */
    getAllBuildingAppsAndSubApp(): Promise<SpinalNode[]>;
    /**
     * Retrieves an admin application node by search key (name or id).
     *
     * @param {TAppSearch} searchKeys - The search method(s) to use (e.g., by name or id).
     * @param {string} appNameOrId - The name or id of the admin app to find.
     * @returns {Promise<SpinalNode>} A promise that resolves to the found SpinalNode or undefined.
     */
    getAdminApp(searchKeys: TAppSearch, appNameOrId: string): Promise<SpinalNode>;
    /**
     * Retrieves a building application node based on the provided search keys and application name or ID.
     *
     * @param searchKeys - The search criteria used to filter building applications.
     * @param appNameOrId - The name or ID of the application to find.
     * @returns A promise that resolves to the matching `SpinalNode` if found.
     */
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
    /**
     * Searches for a building sub-application node within a list of application nodes.
     *
     * This method retrieves all sub-applications from the provided application nodes,
     * then searches for a sub-app that matches the given search key (by name or id).
     *
     * @param {TAppSearch} searchKeys - The search method(s) to use (e.g., by name or id).
     * @param {SpinalNode[]} appsNodes - The list of application nodes to search within.
     * @param {string} subAppNameOrId - The name or id of the sub-app to find.
     * @returns {Promise<SpinalNode>} A promise that resolves to the found sub-app node or undefined.
     */
    findBuildingSubAppInApps(searchKeys: TAppSearch, appsNodes: SpinalNode[], subAppNameOrId: string): Promise<SpinalNode>;
    /**
     * Formats an array of application nodes and adds their corresponding sub-applications.
     *
     * For each application node in the provided array, this method calls `formatAppAndAddSubApps`
     * to format the node and include its sub-apps (if any). If `subAppsNodes` is provided,
     * only sub-apps present in that list will be included. The method filters out any undefined
     * results (e.g., if a node does not match the filter criteria) and returns an array of
     * formatted application objects.
     *
     * @param {SpinalNode[]} appsNodes - The application nodes to format.
     * @param {SpinalNode[]} [subAppsNodes] - Optional list of sub-app nodes to include.
     * @returns {Promise<ISpinalApp[]>} A promise that resolves to an array of formatted applications.
     */
    formatAppsAndAddSubApps(appsNodes: SpinalNode[], subAppsNodes?: SpinalNode[]): Promise<ISpinalApp[]>;
    /**
     * Formats a single application node and adds its sub-applications if present.
     *
     * If the node is a building app, retrieves its sub-apps and includes them in the result.
     * If `subAppsNodes` is provided, only includes sub-apps present in that list.
     * Returns `undefined` if the app has sub-apps but none match the filter.
     *
     * @param appsNode - The application node to format.
     * @param subAppsNodes - Optional list of sub-app nodes to include.
     * @returns The formatted application object or undefined.
     */
    formatAppAndAddSubApps(appsNode: SpinalNode, subAppsNodes?: SpinalNode[]): Promise<ISpinalApp>;
    /**
     * Retrieves an application node (admin, building app, or sub-app) by search key (name or id).
     *
     * This method searches across all building apps, their sub-apps, and admin apps,
     * returning the first node that matches the provided search key.
     *
     * @param {TAppSearch} searchKeys - The search method(s) to use (e.g., by name or id).
     * @param {string} appNameOrId - The name or id of the app to find.
     * @returns {Promise<SpinalNode>} A promise that resolves to the found SpinalNode or undefined.
     */
    getApps(searchKeys: TAppSearch, appNameOrId: string): Promise<SpinalNode>;
    /**
     * Updates the information of an admin application node with the provided new information.
     *
     * @param appId - The unique identifier of the admin application to update.
     * @param newInfo - An object containing the new information to update the application with.
     * @returns A promise that resolves to the updated SpinalNode instance.
     * @throws Will throw an error if the application node cannot be found or the update fails.
     */
    updateAdminApp(appId: string, newInfo: ISpinalApp): Promise<SpinalNode>;
    /**
     * Updates the information of a building application node with the provided new information.
     *
     * @param appId - The unique identifier of the building application to update.
     * @param newInfo - An object containing the new information to update the application with.
     * @returns A promise that resolves to the updated SpinalNode instance.
     * @throws Will throw an error if the application node cannot be found or the update fails.
     */
    updateBuildingApp(appId: string, newInfo: ISpinalApp): Promise<SpinalNode>;
    /**
     * Updates the information of a given application node with new values provided in `newInfo`.
     *
     * Iterates over the keys in `newInfo` and updates the corresponding properties in `appNode.info`.
     * If the property exists, it is updated using the `set` method. If it does not exist, it is added using `add_attr`.
     * The property "documentationLink" is always updated or added, regardless of its existence in `appNode.info`.
     *
     * @param appNode - The application node whose information is to be updated.
     * @param newInfo - An object containing the new information to update in the application node.
     * @returns The updated application node, or `undefined` if `appNode` is not provided.
     */
    private _updateAppInfo;
    /**
     * Updates the information of a sub-application node within a building application.
     *
     * This method retrieves the sub-application node using the provided `appId` and `subAppId`,
     * then updates its attributes based on the `newInfo` object. Certain keys (`id`, `appConfig`, `parentApp`)
     * are skipped during the update. If an attribute exists, it is updated; otherwise, it is added.
     * The method also updates the sub-application's element with the new `appConfig` if provided.
     *
     * @param appId - The ID of the parent application.
     * @param subAppId - The ID of the sub-application to update.
     * @param newInfo - An object containing the new information for the sub-application.
     * @returns A promise that resolves to the updated `SpinalNode` representing the sub-application.
     */
    updateBuildingSubAppInfo(appId: string, subAppId: string, newInfo: ISubApp): Promise<SpinalNode>;
    /**
     * Deletes an admin application node by its ID.
     *
     * This method retrieves the admin application node using the provided appId.
     * If the node exists, it removes it from the graph and returns true.
     * If the node does not exist, it returns false.
     *
     * @param {string} appId - The ID of the admin application to delete.
     * @returns {Promise<boolean>} True if the admin app was deleted, false otherwise.
     */
    deleteAdminApp(appId: string): Promise<boolean>;
    /**
     * Deletes a building application node and all its sub-applications by the application's ID.
     *
     * This method retrieves the building application node using the provided appId.
     * If the node exists, it first removes all its sub-applications from the graph,
     * then removes the building application node itself.
     * Returns true if the building app was deleted, false otherwise.
     *
     * @param {string} appId - The ID of the building application to delete.
     * @returns {Promise<boolean>} True if the building app was deleted, false otherwise.
     */
    deleteBuildingApp(appId: string): Promise<boolean>;
    /**
     * Delete a subApp from a building app
     * @param {string} appId
     * @param {string} subAppId
     * @return {*} {Promise<boolean>} true if the subApp is deleted, false if not found
     * @memberof AppService
     */
    deleteBuildingSubApp(appId: string, subAppId: string): Promise<boolean>;
    /**
     * Uploads applications from a file (Excel or JSON) and creates or updates them in the graph.
     *
     * @param appType - The type of application to upload ('admin' or 'building').
     * @param fileData - The file data containing the applications (Excel or JSON format).
     * @param isExcel - Whether the file is in Excel format (default: false).
     * @returns A promise that resolves to an array of created or updated SpinalNode instances.
     */
    uploadApps(appType: keyof typeof AppsType, fileData: Buffer, isExcel?: boolean): Promise<SpinalNode[]>;
    /**
     * Uploads sub-applications from a file (Excel or JSON) and creates or updates them in the graph.
     *
     * @param fileData - The file data containing the sub-applications (Excel or JSON format).
     * @param isExcel - Whether the file is in Excel format (default: false).
     * @returns A promise that resolves to an object containing created/updated sub-app nodes and any errors.
     */
    uploadSubApps(fileData: Buffer, isExcel?: boolean): Promise<{
        subApps: SpinalNode[];
        errors: string[];
    }>;
    private _getApplicationGroupNode;
    private _convertExcelToJson;
    private _formatAppsJson;
    private _formatSubAppsJson;
}
