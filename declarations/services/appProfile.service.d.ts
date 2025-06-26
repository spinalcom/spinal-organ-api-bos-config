import { SpinalGraph, SpinalContext, SpinalNode } from "spinal-env-viewer-graph-service";
import { IProfile, IProfileAuthEdit, IProfileAuthRes, IProfileRes } from "../interfaces";
import { TAppSearch } from "../utils/findNodeBySearchKey";
export declare class AppProfileService {
    private static instance;
    context: SpinalContext;
    private constructor();
    static getInstance(): AppProfileService;
    init(): Promise<SpinalContext>;
    /**
     * Creates a new application profile node and authorizes access to APIs, apps, and contexts if provided.
     * @param appProfile The profile data to create.
     * @returns The created profile node and its authorized resources.
     */
    createAppProfile(appProfile: IProfile): Promise<IProfileRes>;
    /**
     * Retrieves the application profile node and its associated authorization structure.
     *
     * @param appProfile - The application profile identifier or a SpinalNode instance.
     * @returns A promise that resolves to an object containing the profile node and its authorization structure,
     *          or `undefined` if the node could not be found.
     */
    getAppProfile(appProfile: string | SpinalNode): Promise<IProfileRes>;
    /**
     * Updates an existing application profile node with new data and re-authorizes access to APIs, apps, and contexts.
     *
     * @param {string} appProfileId
     * @param {IProfileAuthEdit} appProfile
     * @return {*}  {Promise<IProfileRes>}
     * @memberof AppProfileService
     */
    updateAppProfile(appProfileId: string, appProfile: IProfileAuthEdit): Promise<IProfileRes>;
    /**
     * Retrieves all application profiles with their authorization structures.
     * @returns A promise that resolves to an array of profile nodes and their authorized resources.
     */
    getAllAppProfile(): Promise<IProfileRes[]>;
    /**
     * Retrieves all application profile nodes in the context.
     * @returns An array of SpinalNode instances representing all application profiles.
     */
    getAllAppProfileNodes(): Promise<SpinalNode<import("spinal-core-connectorjs").Model>[]>;
    /**
     * Deletes an application profile node from the graph.
     *
     * @param {string} appProfileId
     * @return {*}  {Promise<string>}
     * @memberof AppProfileService
     */
    deleteAppProfile(appProfileId: string): Promise<string>;
    /**
     * Retrieves the application profile node graph by its ID.
     * @param {string} profileId - The ID of the application profile.
     * @param {string} [digitalTwinId] - Optional digital twin ID for authorization.
     * @returns {Promise<SpinalGraph | void>} A promise that resolves to the SpinalGraph of the application profile or void if not found.
     */
    getAppProfileNodeGraph(profileId: string, digitalTwinId?: string): Promise<SpinalGraph | void>;
    /**
     * Authorizes an application profile to access specified contexts, apps, and APIs.
     * @param appProfile The application profile node or its ID.
     * @param data The authorization data containing context IDs, app IDs, and API IDs.
     * @returns A promise that resolves to the authorized resources.
     */
    authorizeProfileToAccessContext(appProfile: string | SpinalNode, contextIds: string | string[], digitalTwinId?: string): Promise<SpinalContext[]>;
    /**
     * Authorizes an application profile to access specified apps.
     *
     * @param {(string | SpinalNode)} appProfile
     * @param {(string | string[])} appIds
     * @return {*}
     * @memberof AppProfileService
     */
    authorizeProfileToAccessApps(appProfile: string | SpinalNode, appIds: string | string[]): Promise<SpinalNode<any>[]>;
    /**
     * Authorizes an application profile to access specified APIs.
     *
     * @param {(string | SpinalNode)} appProfile
     * @param {(string | string[])} apiIds
     * @return {*}
     * @memberof AppProfileService
     */
    authorizeProfileToAccessApis(appProfile: string | SpinalNode, apiIds: string | string[]): Promise<SpinalNode<any>[]>;
    /**
     * Retrieves the authorization structure for a given application profile.
     *
     * @param {(string | SpinalNode)} appProfile
     * @param {string} [digitalTwinId]
     * @return {*}  {Promise<IProfileAuthRes>}
     * @memberof AppProfileService
     */
    getAutorizationStructure(appProfile: string | SpinalNode, digitalTwinId?: string): Promise<IProfileAuthRes>;
    /**
     * Unauthorizes an application profile from accessing specified contexts.
     *
     * @param {(string | SpinalNode)} appProfile
     * @param {(string | string[])} contextIds
     * @param {string} [digitalTwinId]
     * @return {*}  {Promise<SpinalContext[]>}
     * @memberof AppProfileService
     */
    unauthorizeProfileToAccessContext(appProfile: string | SpinalNode, contextIds: string | string[], digitalTwinId?: string): Promise<SpinalContext[]>;
    /**
     * Unauthorizes an application profile from accessing specified apps.
     *
     * @param {(string | SpinalNode)} appProfile
     * @param {(string | string[])} appIds
     * @return {*}  {Promise<SpinalNode[]>}
     * @memberof AppProfileService
     */
    unauthorizeProfileToAccessApps(appProfile: string | SpinalNode, appIds: string | string[]): Promise<SpinalNode[]>;
    /**
     * Unauthorizes an application profile from accessing specified APIs.
     *
     * @param {(string | SpinalNode)} appProfile
     * @param {(string | string[])} apiIds
     * @return {*}  {Promise<SpinalNode[]>}
     * @memberof AppProfileService
     */
    unauthorizeProfileToAccessApis(appProfile: string | SpinalNode, apiIds: string | string[]): Promise<SpinalNode[]>;
    /**
     * Checks if an application profile has access to a specific context.
     *
     * @param {(string | SpinalNode)} appProfile
     * @param {string} contextId
     * @param {string} [digitalTwinId]
     * @return {*}  {Promise<SpinalNode>}
     * @memberof AppProfileService
     */
    profileHasAccessToContext(appProfile: string | SpinalNode, contextId: string, digitalTwinId?: string): Promise<SpinalNode>;
    /**
     * Checks if an application profile has access to a specific app.
     *
     * @param {TAppSearch} searchKeys
     * @param {(string | SpinalNode)} appProfile
     * @param {string} appId
     * @return {*}  {Promise<SpinalNode>}
     * @memberof AppProfileService
     */
    profileHasAccessToApp(searchKeys: TAppSearch, appProfile: string | SpinalNode, appId: string): Promise<SpinalNode>;
    /**
     * Checks if an application profile has access to a specific API.
     *
     * @param {(string | SpinalNode)} appProfile
     * @param {string} apiId
     * @return {*}  {Promise<SpinalNode>}
     * @memberof AppProfileService
     */
    profileHasAccessToApi(appProfile: string | SpinalNode, apiId: string): Promise<SpinalNode>;
    /**
     * Retrieves the contexts that an application profile is authorized to access.
     *
     * @param {(string | SpinalNode)} appProfile
     * @param {string} [digitalTwinId]
     * @return {*}  {Promise<SpinalContext[]>}
     * @memberof AppProfileService
     */
    getAuthorizedContexts(appProfile: string | SpinalNode, digitalTwinId?: string): Promise<SpinalContext[]>;
    /**
     * Retrieves the applications that an application profile is authorized to access.
     *
     * @param {(string | SpinalNode)} appProfile
     * @return {*}  {Promise<SpinalNode[]>}
     * @memberof AppProfileService
     */
    getAuthorizedApps(appProfile: string | SpinalNode): Promise<SpinalNode[]>;
    /**
     * Retrieves the APIs that an application profile is authorized to access.
     *
     * @param {(string | SpinalNode)} appProfile
     * @return {*}  {Promise<SpinalNode[]>}
     * @memberof AppProfileService
     */
    getAuthorizedApis(appProfile: string | SpinalNode): Promise<SpinalNode[]>;
    _getAppProfileNodeGraph(profileId: string): Promise<SpinalGraph | void>;
    _getAppProfileNode(appProfileId: string): Promise<SpinalNode>;
    private _renameProfile;
    private _findChildInContext;
    private _unauthorizeAll;
    private _authorizeAll;
}
