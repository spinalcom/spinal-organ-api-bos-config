import { IAdminCredential, IBosCredential, IUserCredential, IAppCredential, IApplicationToken, IUserToken, IOAuth2Credential } from "../interfaces";
export declare class AuthentificationService {
    private static instance;
    authPlatformIsConnected: boolean;
    private constructor();
    static getInstance(): AuthentificationService;
    init(): Promise<void>;
    authenticate(info: IUserCredential | IAppCredential | IOAuth2Credential): Promise<{
        code: number;
        data: string | IApplicationToken | IUserToken;
    }>;
    /**
     * Registers the client to the admin authentication server.
     *
     * @param urlAdmin - The URL of the admin authentication server. Must start with "http://" or "https://".
     * @param clientId - The client ID used for registration.
     * @param clientSecret - The client secret used for registration.
     * @returns A promise that resolves to the registered BOS credentials.
     * @throws {Error} If any of the parameters are invalid or if the registration request fails.
     */
    registerToAdmin(urlAdmin: string, clientId: string, clientSecret: string): Promise<IBosCredential>;
    /**
     * Retrieves the BOS to Admin credentials from the configuration context.
     *
     * This method asynchronously obtains the context associated with the
     * `BOS_CREDENTIAL_CONTEXT_NAME` using the `configServiceInstance`. If the context
     * is not found, the method returns `undefined`. Otherwise, it retrieves and returns
     * the credential information from the context.
     *
     * @returns A promise that resolves to an `IBosCredential` object containing the credentials,
     *          or `undefined` if the context is not available.
     */
    getBosToAdminCredential(): Promise<IBosCredential>;
    /**
     * Deletes the BOS and admin credential contexts from the configuration graph.
     *
     * This method attempts to retrieve and remove the BOS credential context and the admin credential context
     * from the configuration graph. If the BOS credential context exists, it is removed. If the admin credential
     * context does not exist, it attempts to remove it as well (note: this may be a logic error).
     *
     * @returns An object indicating that the credentials have been removed.
     * @async
     */
    deleteCredentials(): Promise<{
        removed: boolean;
    }>;
    /**
     * Creates a new set of admin credentials by generating a unique client ID and a JWT token.
     * The generated credentials are then saved or updated using the `editAdminCredential` method.
     *
     * @returns A promise that resolves to the newly created admin credential object.
     */
    createAdminCredential(): Promise<IAdminCredential>;
    editAdminCredential(admin: IAdminCredential): Promise<IAdminCredential>;
    /**
     * Retrieves the admin credentials from the configuration context.
     *
     * @returns A promise that resolves to the admin credentials (`IAdminCredential`) if the context exists,
     *          or `undefined` if the context is not found.
     *
     * @throws This method does not throw, but may return `undefined` if the admin credential context is missing.
     */
    getAdminCredential(): Promise<IAdminCredential>;
    /**
     * Sends data to the admin endpoint for registration or update.
     *
     * This method retrieves the necessary credentials and constructs the request body
     * before sending a PUT request to the admin's registration endpoint.
     *
     * @param update - If `true`, updates the admin data; if `false`, registers a new admin.
     * @returns A promise resolving to the Axios response of the PUT request.
     * @throws Error if no admin is registered.
     */
    sendDataToAdmin(update?: boolean): Promise<import("axios").AxiosResponse<any, any>>;
    /**
     * Retrieves the admin credentials if they exist, or optionally creates them if they do not.
     *
     * @param createIfNotExist - If `true`, creates the admin credentials if they do not already exist. Defaults to `false`.
     * @returns A promise that resolves to the admin credentials (`IAdminCredential`).
     */
    private _getOrCreateAdminCredential;
    /**
     * Asynchronously retrieves and formats JSON data required for authentication.
     *
     * @returns {Promise<IJsonData>} A promise that resolves to an object containing:
     * - `userProfileList`: The formatted list of user profiles.
     * - `appProfileList`: The formatted list of application profiles.
     * - `organList`: An empty array (reserved for future use).
     *
     * @remarks
     * The method currently does not include the application list (`appList`),
     * but this can be enabled by uncommenting the relevant line.
     */
    private getJsonData;
    private _getRequestBody;
    private _editBosCredential;
    private _formatUserProfiles;
    private _formatAppProfiles;
    private _getOrCreateContext;
    private _formatInfo;
}
