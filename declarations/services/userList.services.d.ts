import { SpinalContext, SpinalNode } from "spinal-env-viewer-graph-service";
import { HTTP_CODES } from "../constant";
import { IUserCredential, IUserInfo, IUserToken } from "../interfaces";
export declare class UserListService {
    private static instance;
    context: SpinalContext;
    private constructor();
    static getInstance(): UserListService;
    init(): Promise<SpinalContext>;
    /**
     * Authenticates a user using admin credentials.
     * If authentication is successful, adds the user to the context and stores the token.
     * Removes password from user info before returning.
     * @param user - User credentials (username and password)
     * @returns An object with code and data (token or error message)
     */
    authenticateUser(user: IUserCredential): Promise<{
        code: number;
        data: string | IUserToken;
    }>;
    /**
     * Retrieves a user node from the context by matching the provided username.
     *
     * This method searches through the children of the context node using the specified
     * relations (`CONTEXT_TO_ADMIN_USER_RELATION` and `CONTEXT_TO_USER_RELATION_NAME`).
     * It returns the first user node whose `userName` or `userId` matches the given username.
     *
     * @param username - The username or user ID to search for.
     * @returns A promise that resolves to the matching `SpinalNode`, or `undefined` if no match is found.
     */
    getUser(username: string): Promise<SpinalNode>;
    /**
     * Retrieves the list of favorite applications for a given user.
     *
     * @param userId - The unique identifier of the user whose favorite apps are to be fetched.
     * @returns A promise that resolves to an array of `SpinalNode` instances representing the user's favorite applications.
     *          If the user does not exist, an empty array is returned.
     */
    getFavoriteApps(userId: string): Promise<SpinalNode[]>;
    /**
     * Adds a single application to the user's list of favorite applications.
     *
     * Checks if the user's profile has access to the specified app before adding.
     * Throws an error if the user or app is not found, or if access is unauthorized.
     *
     * @param userId - The unique identifier of the user.
     * @param userProfileId - The unique identifier of the user's profile.
     * @param appId - The unique identifier of the application to add as favorite.
     * @returns A promise that resolves to the added `SpinalNode` representing the app.
     */
    addOneAppToFavorite(userId: string, userProfileId: string, appId: string): Promise<SpinalNode>;
    /**
     * Adds one or more applications to the user's list of favorite applications.
     *
     * Iterates over the provided app IDs and attempts to add each as a favorite for the user.
     * If an app cannot be added (e.g., due to lack of access or not found), it is silently skipped.
     *
     * @param userId - The unique identifier of the user.
     * @param userProfileId - The unique identifier of the user's profile.
     * @param appIds - A single app ID or an array of app IDs to add as favorites.
     * @returns A promise that resolves to an array of successfully added `SpinalNode` instances.
     */
    addFavoriteApp(userId: string, userProfileId: string, appIds: string | string[]): Promise<SpinalNode[]>;
    /**
     * Removes a single application from the user's list of favorite applications.
     *
     * Checks if the user's profile has access to the specified app before removing.
     * Throws an error if the user or app is not found, or if access is unauthorized.
     *
     * @param userId - The unique identifier of the user.
     * @param userProfileId - The unique identifier of the user's profile.
     * @param appId - The unique identifier of the application to remove from favorites.
     * @returns A promise that resolves to the removed `SpinalNode` representing the app.
     */
    removeOneAppFromFavorite(userId: string, userProfileId: string, appId: string): Promise<SpinalNode>;
    /**
     * Removes one or more applications from the user's list of favorite applications.
     *
     * Iterates over the provided app IDs and attempts to remove each from the user's favorites.
     * If an app cannot be removed (e.g., due to lack of access or not found), it is silently skipped.
     *
     * @param userId - The unique identifier of the user.
     * @param userProfileId - The unique identifier of the user's profile.
     * @param appIds - A single app ID or an array of app IDs to remove from favorites.
     * @returns A promise that resolves to an array of successfully removed `SpinalNode` instances.
     */
    removeFavoriteApp(userId: string, userProfileId: string, appIds: string | string[]): Promise<SpinalNode[]>;
    /**
     * Creates an admin user if one does not already exist.
     *
     * If a userInfo object is provided, uses its userName and password; otherwise, uses defaults.
     * Logs the admin credentials to a file for recovery.
     * Hashes the password before storing.
     *
     * @param userInfo - Optional user information for the admin user.
     * @returns A promise that resolves to the created SpinalNode, or undefined if the user already exists.
     */
    createAdminUser(userInfo?: IUserInfo): Promise<SpinalNode>;
    /**
     * Retrieves an admin user node by its username.
     *
     * @param userName - The username of the admin user to retrieve.
     * @returns A promise that resolves to the corresponding `SpinalNode` if found, otherwise `undefined`.
     */
    getAdminUser(userName: string): Promise<SpinalNode>;
    /**
     * Authenticates an admin user by verifying the provided credentials.
     *
     * Checks if the admin user exists and if the password matches.
     * If authentication is successful, returns a payload with user data and token.
     * Otherwise, returns an unauthorized error.
     *
     * @param user - The admin user's credentials (username and password).
     * @returns An object containing the HTTP code and either the user data or an error message.
     */
    authenticateAdmin(user: IUserCredential): Promise<{
        code: number;
        data: any | string;
    }>;
    /**
     * Authenticates a user via the external authentication platform.
     *
     * Sends a login request to the external platform using the provided credentials.
     * On success, formats and returns the user data; on failure, returns an unauthorized error.
     *
     * @param credentials - The user's login credentials.
     * @returns A promise resolving to an object with HTTP code and user data or error message.
     */
    authenticateUserViaAuthPlateform(credentials: IUserCredential): Promise<{
        code: HTTP_CODES;
        data: any;
    }>;
    /**
     * Retrieves and formats user data by enriching the provided data object with user profile and user information.
     *
     * @param data - The initial user data object, expected to contain at least a `token` and `userId` property.
     * @param adminCredential - (Optional) Administrative credentials to use for fetching user information. If not provided, credentials are obtained internally.
     * @returns A promise that resolves to the enriched user data object, including `profile` and `userInfo` properties.
     */
    /**
      * Retrieves user data and formats it by adding profile and user info.
      * @param data - The user data to format.
      * @param adminCredential - Optional admin credentials for fetching user info.
      * @param useToken - Whether to use the token for fetching user info.
      * @returns A promise resolving to the formatted user data.
      */
    getUserDataFormatted(data: any, adminCredential?: any, useToken?: boolean): Promise<any>;
}
