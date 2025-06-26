import { SpinalGraph, SpinalContext, SpinalNode } from "spinal-env-viewer-graph-service";
import { IProfile, IProfileAuthEdit, IProfileAuthRes, IProfileRes } from "../interfaces";
import { TAppSearch } from "../utils/findNodeBySearchKey";
export declare class UserProfileService {
    private static instance;
    context: SpinalContext;
    private constructor();
    static getInstance(): UserProfileService;
    init(): Promise<SpinalContext>;
    /**
     * Creates a new user profile node and authorizes it to access specified APIs, apps, sub-apps, and contexts.
     *
     * @param userProfile - The user profile data containing the profile name and optional lists of API, app, sub-app, and context IDs to authorize.
     * @returns A promise that resolves to an object containing the created profile node and the results of the authorization operations.
     *
     * @remarks
     * - The method creates a new `SpinalNode` for the user profile.
     * - It conditionally authorizes the profile to access APIs, apps, sub-apps, and contexts based on the provided IDs.
     * - The new profile node is added as a child in the context with a specific relation.
     */
    createUserProfile(userProfile: IProfile): Promise<IProfileRes>;
    /**
     * Retrieves the user profile node and its associated authorization structure.
     *
     * @param userProfile - The user profile identifier as a string or a SpinalNode instance.
     * @returns A promise that resolves to an object containing the user profile node and its authorization structure,
     *          or `undefined` if the node could not be found.
     */
    getUserProfile(userProfile: string | SpinalNode): Promise<IProfileRes>;
    /**
     * Updates a user profile with the provided information.
     *
     * This method performs the following actions:
     * - Retrieves the user profile node by its ID.
     * - Renames the profile if a new name is provided.
     * - Revokes access to APIs, Apps, SubApps, and Contexts as specified.
     * - Grants access to APIs, Apps, SubApps, and Contexts as specified.
     * - Returns the updated user profile.
     *
     * @param userProfileId - The unique identifier of the user profile to update.
     * @param userProfile - An object containing the updated profile information and access rights.
     * @returns A promise that resolves to the updated user profile response, or `undefined` if the profile node is not found.
     */
    updateUserProfile(userProfileId: string, userProfile: IProfileAuthEdit): Promise<IProfileRes>;
    /**
     * Retrieves all user profiles.
     *
     * This method fetches all user profile nodes and then retrieves the corresponding user profile
     * information for each node. The results are returned as an array of `IProfileRes` objects.
     *
     * @returns {Promise<IProfileRes[]>} A promise that resolves to an array of user profile responses.
     */
    getAllUserProfile(): Promise<IProfileRes[]>;
    /**
     * Retrieves all user profile nodes within the current context.
     *
     * @returns {Promise<any[]>} A promise that resolves to an array of user profile nodes found in the context.
     */
    getAllUserProfileNodes(): Promise<SpinalNode<import("spinal-core-connectorjs").Model>[]>;
    /**
     * Deletes a user profile by its unique identifier.
     *
     * This method retrieves the user profile node associated with the given `userProfileId`.
     * If the node exists, it removes the node from the graph. If the node does not exist,
     * an error is thrown indicating that no profile was found for the provided ID.
     *
     * @param userProfileId - The unique identifier of the user profile to delete.
     * @returns A promise that resolves to the `userProfileId` of the deleted profile.
     * @throws {Error} If no user profile is found for the given `userProfileId`.
     */
    deleteUserProfile(userProfileId: string): Promise<string>;
    /**
     * Retrieves the SpinalGraph associated with a user profile and a specific digital twin.
     *
     * @param profileId - The unique identifier of the user profile.
     * @param digitalTwinId - (Optional) The unique identifier of the digital twin.
     * @returns A promise that resolves to the SpinalGraph instance if found, or void otherwise.
     */
    getUserProfileNodeGraph(profileId: string, digitalTwinId?: string): Promise<SpinalGraph | void>;
    /**
     * Authorizes a user profile to access one or more specified contexts within a digital twin.
     *
     * @param userProfile - The user profile to authorize, provided as either a string (profile ID) or a `SpinalNode` instance.
     * @param contextIds - The ID or array of IDs of the contexts to which access is being authorized.
     * @param digitalTwinId - (Optional) The ID of the digital twin in which the contexts reside.
     * @returns A promise that resolves to an array of `SpinalContext` objects representing the contexts the profile is authorized to access.
     */
    authorizeProfileToAccessContext(userProfile: string | SpinalNode, contextIds: string | string[], digitalTwinId?: string): Promise<SpinalContext[]>;
    /**
     * Authorizes a user profile to access one or more applications.
     *
     * @param userProfile - The user profile to authorize, either as a string identifier or a SpinalNode instance.
     * @param appIds - The application ID or an array of application IDs to which access should be granted.
     * @returns A promise that resolves with the result of the authorization operation.
     */
    authorizeProfileToAccessApps(userProfile: string | SpinalNode, appIds: string | string[]): Promise<SpinalNode<any>[]>;
    /**
     * Authorizes a user profile to access specific sub-applications within the provided applications.
     *
     * @param userProfile - The user profile to authorize, either as a string identifier or a SpinalNode instance.
     * @param apps - An array of SpinalNode instances representing the applications containing the sub-apps.
     * @param subAppIds - A single sub-app ID or an array of sub-app IDs to which access should be granted.
     * @returns A promise that resolves with the result of the authorization operation.
     */
    authorizeProfileToAccessSubApps(userProfile: string | SpinalNode, apps: SpinalNode[], subAppIds: string | string[]): Promise<SpinalNode<any>[]>;
    /**
     * Authorizes a user profile to access one or more APIs.
     *
     * @param userProfile - The user profile to authorize, either as a string identifier or a SpinalNode instance.
     * @param apiIds - The API ID or an array of API IDs to which access should be granted.
     * @returns A promise that resolves with the result of the authorization operation.
     */
    authorizeProfileToAccessApis(userProfile: string | SpinalNode, apiIds: string | string[]): Promise<SpinalNode<any>[]>;
    /**
     * Retrieves the authorization structure for a given user profile.
     *
     * This method gathers all authorized contexts, APIs, apps, and sub-apps for the specified user profile.
     * If the profile is of type ADMIN_PROFILE_TYPE, it also includes authorized admin apps.
     *
     * @param userProfile - The user profile identifier as a string or a SpinalNode instance.
     * @param digitalTwinId - (Optional) The unique identifier of the digital twin.
     * @returns A promise that resolves to an object containing the authorization structure.
     */
    getAutorizationStructure(userProfile: string | SpinalNode, digitalTwinId?: string): Promise<IProfileAuthRes>;
    /**
     * Revokes a user profile's authorization to access one or more contexts within a digital twin.
     *
     * @param userProfile - The user profile identifier or SpinalNode instance representing the profile.
     * @param contextIds - The ID or array of IDs of the contexts to unauthorize.
     * @param digitalTwinId - (Optional) The ID of the digital twin in which the contexts reside.
     * @returns A promise that resolves to an array of SpinalContext objects representing the affected contexts.
     */
    unauthorizeProfileToAccessContext(userProfile: string | SpinalNode, contextIds: string | string[], digitalTwinId?: string): Promise<SpinalContext[]>;
    /**
     * Revokes a user profile's authorization to access one or more applications.
     *
     * @param userProfile - The user profile identifier or SpinalNode instance representing the profile.
     * @param appIds - A single application ID or an array of application IDs to unauthorize.
     * @returns A promise that resolves to an array of SpinalNode instances representing the affected applications.
     */
    unauthorizeProfileToAccessApps(userProfile: string | SpinalNode, appIds: string | string[]): Promise<SpinalNode[]>;
    /**
     * Revokes a user profile's authorization to access one or more sub-applications.
     *
     * @param userProfile - The user profile identifier or SpinalNode instance representing the profile.
     * @param subAppIds - A single sub-application ID or an array of sub-application IDs to unauthorize.
     * @returns A promise that resolves to an array of SpinalNode instances representing the affected sub-applications.
     */
    unauthorizeProfileToAccessSubApps(userProfile: string | SpinalNode, subAppIds: string | string[]): Promise<SpinalNode[]>;
    /**
     * Revokes a user profile's access to one or more APIs.
     *
     * @param userProfile - The user profile to unauthorize, either as a string identifier or a SpinalNode instance.
     * @param apiIds - The API ID or an array of API IDs to revoke access from.
     * @returns A promise that resolves with the result of the unauthorization operation.
     */
    unauthorizeProfileToAccessApis(userProfile: string | SpinalNode, apiIds: string | string[]): Promise<SpinalNode[]>;
    /**
     * Checks whether a given user profile has access to a specific context within a digital twin.
     *
     * @param userProfile - The user profile identifier (string) or a SpinalNode representing the profile.
     * @param contextId - The identifier of the context to check access for.
     * @param digitalTwinId - (Optional) The identifier of the digital twin instance.
     * @returns A promise that resolves to the SpinalNode if the profile has access to the context.
     */
    profileHasAccessToContext(userProfile: string | SpinalNode, contextId: string, digitalTwinId?: string): Promise<SpinalNode>;
    /**
     * Checks if a user profile has access to a specific application.
     *
     * @param searchKeys - The search criteria used to locate the application.
     * @param userProfile - The user profile identifier or a SpinalNode representing the profile.
     * @param appId - The unique identifier of the application to check access for.
     * @returns A promise that resolves to the SpinalNode representing the application if access is granted.
     */
    profileHasAccessToApp(searchKeys: TAppSearch, userProfile: string | SpinalNode, appId: string): Promise<SpinalNode>;
    /**
     * Checks if a user profile has access to a specific sub-application within an application.
     *
     * @param searchKeys - The search criteria used to locate the application.
     * @param userProfile - The user profile identifier or a SpinalNode representing the profile.
     * @param appNameOrId - The name or ID of the application containing the sub-app.
     * @param subAppNameOrId - The name or ID of the sub-application to check access for.
     * @returns A promise that resolves to the SpinalNode representing the sub-application if access is granted.
     */
    profileHasAccessToSubApp(searchKeys: TAppSearch, userProfile: string | SpinalNode, appNameOrId: string, subAppNameOrId: string): Promise<SpinalNode>;
    /**
     * Checks if a user profile has access to a specific API.
     *
     * @param userProfile - The user profile identifier (string) or a SpinalNode representing the profile.
     * @param apiId - The unique identifier of the API to check access for.
     * @returns A promise that resolves to the SpinalNode representing the API if access is granted.
     */
    profileHasAccessToApi(userProfile: string | SpinalNode, apiId: string): Promise<SpinalNode>;
    /**
     * Retrieves all contexts that a user profile is authorized to access.
     *
     * @param userProfile - The user profile identifier (string) or a SpinalNode representing the profile.
     * @param digitalTwinId - (Optional) The unique identifier of the digital twin.
     * @returns A promise that resolves to an array of SpinalContext objects the profile is authorized to access.
     */
    getAuthorizedContexts(userProfile: string | SpinalNode, digitalTwinId?: string): Promise<SpinalContext[]>;
    /**
     * Retrieves all applications that a user profile is authorized to access.
     *
     * @param userProfile - The user profile identifier (string) or a SpinalNode representing the profile.
     * @returns A promise that resolves to an array of SpinalNode objects representing the authorized applications.
     */
    getAuthorizedApps(userProfile: string | SpinalNode): Promise<SpinalNode[]>;
    /**
     * Retrieves the list of authorized sub-applications for a given user profile.
     *
     * @param userProfile - The user profile identifier or a SpinalNode instance representing the user profile.
     * @returns A promise that resolves to an array of SpinalNode objects representing the authorized sub-applications.
     */
    getAuthorizedSubApps(userProfile: string | SpinalNode): Promise<SpinalNode[]>;
    /**
     * Retrieves the list of admin applications that the specified user profile is authorized to access.
     *
     * @param userProfile - The user profile identifier or a SpinalNode instance representing the user profile.
     * @returns A promise that resolves to an array of SpinalNode objects representing the authorized admin applications.
     */
    getAuthorizedAdminApps(userProfile: string | SpinalNode): Promise<SpinalNode[]>;
    /**
     * Retrieves all APIs that a user profile is authorized to access.
     *
     * @param userProfile - The user profile identifier (string) or a SpinalNode representing the profile.
     * @returns A promise that resolves to an array of SpinalNode objects representing the authorized APIs.
     */
    getAuthorizedApis(userProfile: string | SpinalNode): Promise<SpinalNode[]>;
    _getUserProfileNode(userProfileId: string): Promise<SpinalNode>;
    private _renameProfile;
    private _findChildInContext;
}
