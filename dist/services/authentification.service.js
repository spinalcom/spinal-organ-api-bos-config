"use strict";
/*
 * Copyright 2022 SpinalCom - www.spinalcom.com
 *
 * This file is part of SpinalCore.
 *
 * Please read all of the following terms and conditions
 * of the Free Software license Agreement ("Agreement")
 * carefully.
 *
 * This Agreement is a legally binding contract between
 * the Licensee (as defined below) and SpinalCom that
 * sets forth the terms and conditions that govern your
 * use of the Program. By installing and/or using the
 * Program, you agree to abide by all the terms and
 * conditions stated or referenced herein.
 *
 * If you do not agree to abide by these terms and
 * conditions, do not demonstrate your acceptance and do
 * not install or use the Program.
 * You should have received a copy of the license along
 * with this file. If not, see
 * <http://resources.spinalcom.com/licenses.pdf>.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthentificationService = void 0;
const axios_1 = require("axios");
const configFile_service_1 = require("./configFile.service");
const constant_1 = require("../constant");
const jwt = require('jsonwebtoken');
const uuid_1 = require("uuid");
const userProfile_service_1 = require("./userProfile.service");
const appProfile_service_1 = require("./appProfile.service");
const userList_services_1 = require("./userList.services");
const AuthError_1 = require("../security/AuthError");
const codeUnique_service_1 = require("./codeUnique.service");
const tokenKey = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d';
class AuthentificationService {
    static instance;
    authPlatformIsConnected = false;
    constructor() { }
    static getInstance() {
        if (!this.instance)
            this.instance = new AuthentificationService();
        return this.instance;
    }
    async init() { }
    consumeCodeUnique(code) {
        try {
            return codeUnique_service_1.SpinalCodeUniqueService.getInstance().consumeCode(code);
        }
        catch (error) {
            throw new AuthError_1.OtherError(constant_1.HTTP_CODES.BAD_REQUEST, "Code unique not valid");
        }
    }
    // public async authenticate(info: IUserCredential | IAppCredential | IOAuth2Credential): Promise<{ code: number; data: string | IApplicationToken | IUserToken }> {
    async authenticate(info) {
        const isUser = "userName" in info && "password" in info ? true : false;
        if (!isUser)
            return { code: constant_1.HTTP_CODES.BAD_REQUEST, data: "Invalid userName and/or password" };
        return userList_services_1.UserListService.getInstance().authenticateUser(info);
    }
    /**
     * Registers the client to the admin authentication server.
     *
     * @param urlAdmin - The URL of the admin authentication server. Must start with "http://" or "https://".
     * @param clientId - The client ID used for registration.
     * @param clientSecret - The client secret used for registration.
     * @returns A promise that resolves to the registered BOS credentials.
     * @throws {Error} If any of the parameters are invalid or if the registration request fails.
     */
    registerToAdmin(urlAdmin, clientId, clientSecret) {
        if (!urlAdmin || !(/^https?:\/\//.test(urlAdmin)))
            throw new Error("AUTH_SERVER_URL is not valid!");
        if (!clientId)
            throw new Error("AUTH_CLIENT_ID is not valid!");
        if (!clientSecret)
            throw new Error("AUTH_CLIENT_SECRET is not valid!");
        if (urlAdmin[urlAdmin.length - 1] === "/") {
            urlAdmin = urlAdmin.substring(0, urlAdmin.lastIndexOf('/'));
        }
        return axios_1.default.post(`${urlAdmin}/register`, {
            // platformCreationParms: pamInfo,
            clientId,
            clientSecret
        }).then((result) => {
            result.data.url = urlAdmin;
            result.data.clientId = clientId;
            this.authPlatformIsConnected = true;
            return this._editBosCredential(result.data);
        }).catch((e) => {
            this.authPlatformIsConnected = false;
            throw new Error(e.message);
        });
    }
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
    async getBosToAdminCredential() {
        let context = await configFile_service_1.configServiceInstance.getContext(constant_1.BOS_CREDENTIAL_CONTEXT_NAME);
        if (!context)
            return;
        return context.info.get();
    }
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
    async deleteCredentials() {
        let context = await configFile_service_1.configServiceInstance.getContext(constant_1.BOS_CREDENTIAL_CONTEXT_NAME);
        if (context)
            await context.removeFromGraph();
        let adminContext = await configFile_service_1.configServiceInstance.getContext(constant_1.ADMIN_CREDENTIAL_CONTEXT_NAME);
        if (!adminContext)
            await adminContext.removeFromGraph();
        return { removed: true };
    }
    // Admin credential
    /**
     * Creates a new set of admin credentials by generating a unique client ID and a JWT token.
     * The generated credentials are then saved or updated using the `editAdminCredential` method.
     *
     * @returns A promise that resolves to the newly created admin credential object.
     */
    createAdminCredential() {
        const clientId = (0, uuid_1.v4)();
        const token = jwt.sign({ clientId, type: 'ADMIN SERVER' }, tokenKey);
        return this.editAdminCredential({
            idPlatformOfAdmin: clientId,
            TokenAdminToPam: token
        });
    }
    async editAdminCredential(admin) {
        const context = await this._getOrCreateContext(constant_1.ADMIN_CREDENTIAL_CONTEXT_NAME, constant_1.ADMIN_CREDENTIAL_CONTEXT_TYPE);
        context.info.mod_attr("idPlatformOfAdmin", admin.idPlatformOfAdmin);
        context.info.mod_attr("TokenAdminToPam", admin.TokenAdminToPam);
        return admin;
    }
    /**
     * Retrieves the admin credentials from the configuration context.
     *
     * @returns A promise that resolves to the admin credentials (`IAdminCredential`) if the context exists,
     *          or `undefined` if the context is not found.
     *
     * @throws This method does not throw, but may return `undefined` if the admin credential context is missing.
     */
    async getAdminCredential() {
        let context = await configFile_service_1.configServiceInstance.getContext(constant_1.ADMIN_CREDENTIAL_CONTEXT_NAME);
        if (!context)
            return;
        return context.info.get();
    }
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
    async sendDataToAdmin(update = false) {
        const bosCredential = await this.getBosToAdminCredential();
        if (!bosCredential)
            throw new Error("No admin registered, register an admin and retry !");
        const endpoint = "register";
        const adminCredential = !update ? await this._getOrCreateAdminCredential(true) : {};
        const data = await this._getRequestBody(update, bosCredential, adminCredential);
        return axios_1.default.put(`${bosCredential.urlAdmin}/${endpoint}`, data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
    //////////////////////////////////////////////////
    //                      PRIVATE                 //
    //////////////////////////////////////////////////
    /**
     * Retrieves the admin credentials if they exist, or optionally creates them if they do not.
     *
     * @param createIfNotExist - If `true`, creates the admin credentials if they do not already exist. Defaults to `false`.
     * @returns A promise that resolves to the admin credentials (`IAdminCredential`).
     */
    async _getOrCreateAdminCredential(createIfNotExist = false) {
        const credentials = await this.getAdminCredential();
        if (credentials)
            return credentials;
        if (createIfNotExist)
            return this.createAdminCredential();
    }
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
    async getJsonData() {
        return {
            userProfileList: await this._formatUserProfiles(),
            appProfileList: await this._formatAppProfiles(),
            organList: [],
            // appList: await this._formatAppList()
        };
    }
    async _getRequestBody(update, bosCredential, adminCredential) {
        return JSON.stringify({
            TokenBosAdmin: bosCredential.tokenPamToAdmin,
            platformId: bosCredential.idPlateform,
            jsonData: await this.getJsonData(),
            ...(!update && {
                URLBos: `http://localhost:8060`,
                TokenAdminBos: adminCredential.TokenAdminToPam,
                idPlatformOfAdmin: adminCredential.idPlatformOfAdmin
            }),
        });
    }
    async _editBosCredential(bosCredential) {
        const context = await this._getOrCreateContext(constant_1.BOS_CREDENTIAL_CONTEXT_NAME, constant_1.BOS_CREDENTIAL_CONTEXT_TYPE);
        const contextInfo = context.info;
        if (bosCredential.TokenBosAdmin)
            contextInfo.mod_attr("tokenPamToAdmin", bosCredential.TokenBosAdmin);
        if (bosCredential.name)
            contextInfo.mod_attr("pamName", bosCredential.name);
        if (bosCredential.id)
            contextInfo.mod_attr("idPlateform", bosCredential.id);
        if (bosCredential.url)
            contextInfo.mod_attr("urlAdmin", bosCredential.url);
        // if (bosCredential.registerKey) contextInfo.mod_attr("registerKey", bosCredential.registerKey);
        if (bosCredential.clientId)
            contextInfo.mod_attr("clientId", bosCredential.clientId);
        return contextInfo.get();
    }
    _formatUserProfiles() {
        return userProfile_service_1.UserProfileService.getInstance().getAllUserProfileNodes().then((nodes) => {
            return nodes.map(el => ({
                userProfileId: el.info.id.get(),
                label: el.info.name.get()
            }));
        });
    }
    _formatAppProfiles() {
        return appProfile_service_1.AppProfileService.getInstance().getAllAppProfileNodes().then((nodes) => {
            return nodes.map(el => ({
                appProfileId: el.info.id.get(),
                label: el.info.name.get()
            }));
        });
    }
    async _getOrCreateContext(contextName, contextType) {
        let context = await configFile_service_1.configServiceInstance.getContext(contextName);
        if (!context)
            context = await configFile_service_1.configServiceInstance.addContext(contextName, contextType);
        return context;
    }
    _formatInfo(info) {
        const obj = { clientId: undefined, clientSecret: undefined };
        if ("client_id" in info) {
            // info["clientId"] = info["client_id"]
            // delete info.client_id;
            obj.clientId = info["client_id"];
        }
        if ("client_secret" in info) {
            // info["clientSecret"] = info["client_secret"]
            // delete info.client_secret;
            obj.clientSecret = info["client_secret"];
        }
        return (obj.clientId && obj.clientSecret ? obj : info);
    }
}
exports.AuthentificationService = AuthentificationService;
//# sourceMappingURL=authentification.service.js.map