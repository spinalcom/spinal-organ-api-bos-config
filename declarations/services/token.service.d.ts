import { SpinalContext, SpinalNode } from "spinal-env-viewer-graph-service";
import { IApplicationToken, IUserToken } from "../interfaces";
export declare class TokenService {
    private static instance;
    context: SpinalContext;
    private constructor();
    static getInstance(): TokenService;
    init(): Promise<SpinalContext>;
    /**
     * Purges invalid or expired tokens from the context.
     * Iterates over all tokens and checks their validity.
     * If a token is expired, it will be deleted.
     * @returns {Promise<(IUserToken | IApplicationToken)[]>} Array of token data for valid tokens.
     */
    purgeToken(): Promise<(IUserToken | IApplicationToken)[]>;
    /**
     * Associates a new token with a user node by creating a token node and adding it as a child
     * to the specified user node using a predefined relation.
     *
     * @param userNode - The user node to which the token will be associated.
     * @param token - The token string to be added.
     * @param playload - Additional payload data to be stored with the token.
     * @returns A promise that resolves to the payload after the token has been added.
     */
    addUserToken(userNode: SpinalNode, token: string, playload: any): Promise<any>;
    /**
     * Generates a payload object for an admin user, including a JWT token and additional metadata.
     *
     * @param userNode - The SpinalNode representing the user for whom the payload is generated.
     * @param secret - (Optional) The secret key to sign the JWT token. If not provided, a random string is generated.
     * @param durationInMin - (Optional) The token expiration duration in minutes. Defaults to 7 days if not specified.
     * @returns A promise that resolves to an object containing user information, token details, and admin profile data.
     */
    getAdminPlayLoad(userNode: SpinalNode, secret?: string, durationInMin?: number): Promise<any>;
    /**
     * Adds a new token node to the context with the provided token and associated data.
     *
     * @param token - The unique identifier for the token node.
     * @param data - The data to associate with the token node, which will be used to create a new Model instance.
     * @returns A promise that resolves to the created child SpinalNode within the context.
     *
     * @remarks
     * - The method creates a new `SpinalNode` using the given token and data.
     * - The node is added as a child in the context using a predefined relation name and type.
     * - The token data is also cached globally using the token as the key.
     */
    addTokenToContext(token: string, data: any): Promise<SpinalNode>;
    /**
     * Retrieves token data from the cache or context.
     *
     * This method first attempts to retrieve the token data from a global cache.
     * If the data is not present in the cache, it fetches the children nodes from the context
     * using the specified relation name and searches for a node whose name matches the provided token.
     * If such a node is found, it retrieves its element, caches the result, and returns the element's data.
     * If the token is not found among the children, it delegates the check to the `_checkTokenNearAuthPlateform` method.
     *
     * @param token - The token string to retrieve data for.
     * @returns A promise that resolves to the token data if found, or the result of `_checkTokenNearAuthPlateform` if not.
     */
    getTokenData(token: string): Promise<any>;
    /**
     * Deletes a token node from the context.
     *
     * If the provided `token` is a `SpinalNode`, it will be used directly.
     * If the provided `token` is a string, it will search for a child node with a matching name.
     * If the token is not found, the method returns `true`.
     * Otherwise, it removes the token node from all its parent nodes using the specified relation and type.
     *
     * @param token - The token to delete, either as a `SpinalNode` instance or a string representing the token name.
     * @returns A promise that resolves to `true` if the token was successfully deleted or not found, or `false` if an error occurred during deletion.
     */
    deleteToken(token: SpinalNode | string): Promise<boolean>;
    /**
     * Checks if a token is valid and optionally deletes it if expired.
     *
     * @param token - The token string to validate.
     * @param deleteIfExpired - If true, deletes the token if it is expired. Defaults to false.
     * @returns A promise that resolves to the token data if valid, or undefined if expired and deleted.
     */
    tokenIsValid(token: string, deleteIfExpired?: boolean): Promise<IUserToken | IApplicationToken>;
    /**
     * Verifies the validity of a given token for a specified actor type.
     *
     * @param token - The token string to be verified.
     * @param actor - The type of actor associated with the token, either "user" or "app". Defaults to "user".
     * @returns A promise that resolves with the verification result data from the authentication service.
     */
    verifyToken(token: string, actor?: "user" | "app"): Promise<any>;
    private _checkTokenNearAuthPlateform;
    private _checkRequest;
    private _generateString;
    private _getAllTokens;
    private _scheduleTokenPurge;
    private _getAuthPlateformInfo;
}
