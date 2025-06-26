import { SpinalContext, SpinalNode } from 'spinal-env-viewer-graph-service';
export declare class AdminProfileService {
    private static instance;
    private _adminNode;
    private constructor();
    static getInstance(): AdminProfileService;
    get adminNode(): SpinalNode<any>;
    init(context: SpinalContext): Promise<SpinalNode>;
    /**
     * Retrieves the admin profile node from the specified context or the default user profile context.
     *
     * If the admin profile node has already been retrieved and cached, it returns the cached node.
     * Otherwise, it fetches the children of the context and searches for a node with the name
     * `ADMIN_PROFILE_NAME` and type `ADMIN_PROFILE_TYPE`.
     *
     * @param argContext - (Optional) The context from which to retrieve the admin profile node.
     *                     If not provided, the default user profile context is used.
     * @returns A promise that resolves to the admin profile `SpinalNode` if found, otherwise `undefined`.
     */
    getAdminProfile(argContext?: SpinalContext): Promise<SpinalNode>;
    /**
     * Adds one or more applications to the admin profile, authorizing access for the profile.
     *
     * @param apps - A single `SpinalNode` instance or an array of `SpinalNode` instances representing the applications to be added.
     * @returns A promise that resolves to an array of `SpinalNode` instances that have been authorized for the profile.
     */
    addAppToProfil(apps: SpinalNode | SpinalNode[]): Promise<SpinalNode[]>;
    /**
     * Authorizes the admin profile to access a sub-app under a specific app.
     * @param app The parent app node.
     * @param subApp The sub-app node to authorize.
     * @returns {Promise<SpinalNode[]>} A promise that resolves to an array of authorized sub-app nodes.
     */
    addSubAppToProfil(app: SpinalNode, subApp: SpinalNode): Promise<SpinalNode[]>;
    /**
     * Authorizes the admin profile to access the given admin apps.
     * @param apps One or more admin app nodes.
     * @returns {Promise<SpinalNode[]>} A promise that resolves to an array of authorized admin app nodes.
     */
    addAdminAppToProfil(apps: SpinalNode | SpinalNode[]): Promise<SpinalNode[]>;
    /**
     * Authorizes the admin profile to access the given APIs.
     * @param apis One or more API nodes.
     * @returns {Promise<SpinalNode[]>} A promise that resolves to an array of authorized API nodes.
     */
    addApiToProfil(apis: SpinalNode | SpinalNode[]): Promise<SpinalNode[]>;
    /**
     * Authorizes the admin profile to access the given digital twins.
     * Adds each digital twin as a child of the admin profile node using the appropriate relation.
     * @param digitalTwins One or more digital twin nodes.
     * @returns {Promise<SpinalNode[]>} A promise that resolves to an array of authorized digital twin nodes.
     */
    addDigitalTwinToAdminProfile(digitalTwins: SpinalNode | SpinalNode[]): Promise<SpinalNode[]>;
    /**
     * Synchronizes the admin profile by authorizing access to all digital twins, apps, admin apps, and APIs.
     *
     * @returns {Promise<any>} A promise that resolves to an object containing:
     *   - `digitaTwins`: The result of authorizing all digital twins.
     *   - `apps`: An array with the results of authorizing all apps and all admin apps.
     *   - `apis`: The result of authorizing all APIs.
     *
     * @remarks
     * This method aggregates the results of multiple asynchronous authorization operations
     * related to digital twins, applications, and APIs for the admin profile.
     */
    syncAdminProfile(): Promise<any>;
    /**
     * Creates a new admin profile node.
     * @returns {SpinalNode} The created admin profile node.
     * @private
     */
    private _createAdminProfile;
    /**
     * Authorizes all digital twins by retrieving them and adding them to the admin profile.
     *
     * @returns {Promise<SpinalNode[]>} A promise that resolves to an array of `SpinalNode` instances representing the authorized digital twins.
     * @private
     */
    private _authorizeAllDigitalTwin;
    /**
     * Authorizes all building applications by retrieving them and adding them to the admin profile.
     *
     * @returns {Promise<SpinalNode[]>} A promise that resolves to an array of `SpinalNode` instances representing the authorized building applications.
     * @private
     */
    private _authorizeAllApps;
    private _authorizeAllApis;
    private _authorizeAllAdminApps;
}
