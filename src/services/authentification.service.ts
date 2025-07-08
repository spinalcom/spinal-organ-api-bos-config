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

import { IAdmin, IAdminAppProfile, IAdminCredential, IAdminOrgan, IAdminUserProfile, IBosCredential, IJsonData, IUserCredential, IAppCredential, IApplicationToken, IUserToken, IOAuth2Credential } from "../interfaces";
import axios from "axios";
import { SpinalContext } from "spinal-env-viewer-graph-service";
import { configServiceInstance } from "./configFile.service";
import { ADMIN_CREDENTIAL_CONTEXT_NAME, ADMIN_CREDENTIAL_CONTEXT_TYPE, BOS_CREDENTIAL_CONTEXT_NAME, BOS_CREDENTIAL_CONTEXT_TYPE, HTTP_CODES } from "../constant";
const jwt = require('jsonwebtoken');
import { v4 as uuidv4 } from 'uuid';
import { UserProfileService } from "./userProfile.service";
import { AppProfileService } from "./appProfile.service";

import * as globalCache from 'global-cache';
import { UserListService } from "./userList.services";
import { TokenService } from "./token.service";
import { AppListService } from "./appList.services";
import { OtherError } from "../security/AuthError";
import { SpinalCodeUniqueService } from "./codeUnique.service";
const tokenKey = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d';


export class AuthentificationService {
    private static instance: AuthentificationService;
    public authPlatformIsConnected: boolean = false;

    private constructor() { }

    public static getInstance(): AuthentificationService {
        if (!this.instance) this.instance = new AuthentificationService();
        return this.instance;
    }

    async init() { }

    public consumeCodeUnique(code: string): Promise<any> {
        try {
            return SpinalCodeUniqueService.getInstance().consumeCode(code);
        } catch (error) {
            throw new OtherError(HTTP_CODES.BAD_REQUEST, "Code unique not valid");
        }
    }

    // public async authenticate(info: IUserCredential | IAppCredential | IOAuth2Credential): Promise<{ code: number; data: string | IApplicationToken | IUserToken }> {
    public async authenticate(info: IUserCredential): Promise<{ code: number; data: string | IUserToken }> {
        const isUser = "userName" in info && "password" in info ? true : false;

        if (!isUser) return { code: HTTP_CODES.BAD_REQUEST, data: "Invalid userName and/or password" };
        return UserListService.getInstance().authenticateUser(<IUserCredential>info);
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
    public registerToAdmin(urlAdmin: string, clientId: string, clientSecret: string): Promise<IBosCredential> {

        if (!urlAdmin || !(/^https?:\/\//.test(urlAdmin))) throw new Error("AUTH_SERVER_URL is not valid!");
        if (!clientId) throw new Error("AUTH_CLIENT_ID is not valid!");
        if (!clientSecret) throw new Error("AUTH_CLIENT_SECRET is not valid!");

        if (urlAdmin[urlAdmin.length - 1] === "/") {
            urlAdmin = urlAdmin.substring(0, urlAdmin.lastIndexOf('/'))
        }

        return axios.post(`${urlAdmin}/register`, {
            // platformCreationParms: pamInfo,
            clientId,
            clientSecret
        }).then((result) => {
            result.data.url = urlAdmin;
            result.data.clientId = clientId;
            this.authPlatformIsConnected = true;
            return this._editBosCredential(result.data)
        }).catch((e) => {
            this.authPlatformIsConnected = false;
            throw new Error(e.message);
        })
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
    public async getBosToAdminCredential(): Promise<IBosCredential> {
        let context = await configServiceInstance.getContext(BOS_CREDENTIAL_CONTEXT_NAME);
        if (!context) return;

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
    public async deleteCredentials() {
        let context = await configServiceInstance.getContext(BOS_CREDENTIAL_CONTEXT_NAME);
        if (context) await context.removeFromGraph();

        let adminContext = await configServiceInstance.getContext(ADMIN_CREDENTIAL_CONTEXT_NAME);
        if (!adminContext) await adminContext.removeFromGraph();

        return { removed: true }
    }

    // Admin credential

    /**
     * Creates a new set of admin credentials by generating a unique client ID and a JWT token.
     * The generated credentials are then saved or updated using the `editAdminCredential` method.
     *
     * @returns A promise that resolves to the newly created admin credential object.
     */
    public createAdminCredential(): Promise<IAdminCredential> {
        const clientId = uuidv4();
        const token = jwt.sign({ clientId, type: 'ADMIN SERVER' }, tokenKey);

        return this.editAdminCredential({
            idPlatformOfAdmin: clientId,
            TokenAdminToPam: token
        })
    }


    public async editAdminCredential(admin: IAdminCredential): Promise<IAdminCredential> {
        const context = await this._getOrCreateContext(ADMIN_CREDENTIAL_CONTEXT_NAME, ADMIN_CREDENTIAL_CONTEXT_TYPE);
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
    public async getAdminCredential(): Promise<IAdminCredential> {
        let context = await configServiceInstance.getContext(ADMIN_CREDENTIAL_CONTEXT_NAME);
        if (!context) return;

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
    public async sendDataToAdmin(update: boolean = false) {
        const bosCredential = await this.getBosToAdminCredential();
        if (!bosCredential) throw new Error("No admin registered, register an admin and retry !");

        const endpoint = "register";

        const adminCredential: any = !update ? await this._getOrCreateAdminCredential(true) : {};


        const data = await this._getRequestBody(update, bosCredential, adminCredential);

        return axios.put(`${bosCredential.urlAdmin}/${endpoint}`, data, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
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
    private async _getOrCreateAdminCredential(createIfNotExist: boolean = false): Promise<IAdminCredential> {
        const credentials = await this.getAdminCredential();
        if (credentials) return credentials;
        if (createIfNotExist) return this.createAdminCredential();
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
    private async getJsonData(): Promise<IJsonData> {
        return {
            userProfileList: await this._formatUserProfiles(),
            appProfileList: await this._formatAppProfiles(),
            organList: [],
            // appList: await this._formatAppList()
        }
    }

    private async _getRequestBody(update: boolean, bosCredential: IBosCredential, adminCredential: IAdminCredential) {
        return JSON.stringify({
            TokenBosAdmin: bosCredential.tokenPamToAdmin,
            platformId: bosCredential.idPlateform,
            jsonData: await this.getJsonData(),
            ...(!update && {
                URLBos: `http://localhost:8060`,
                TokenAdminBos: adminCredential.TokenAdminToPam,
                idPlatformOfAdmin: adminCredential.idPlatformOfAdmin
            }),
        })
    }

    private async _editBosCredential(bosCredential: any): Promise<IBosCredential> {
        const context = await this._getOrCreateContext(BOS_CREDENTIAL_CONTEXT_NAME, BOS_CREDENTIAL_CONTEXT_TYPE);
        const contextInfo = context.info;

        if (bosCredential.TokenBosAdmin) contextInfo.mod_attr("tokenPamToAdmin", bosCredential.TokenBosAdmin);
        if (bosCredential.name) contextInfo.mod_attr("pamName", bosCredential.name);
        if (bosCredential.id) contextInfo.mod_attr("idPlateform", bosCredential.id);
        if (bosCredential.url) contextInfo.mod_attr("urlAdmin", bosCredential.url);
        // if (bosCredential.registerKey) contextInfo.mod_attr("registerKey", bosCredential.registerKey);
        if (bosCredential.clientId) contextInfo.mod_attr("clientId", bosCredential.clientId);

        return contextInfo.get();
    }

    private _formatUserProfiles(): Promise<IAdminUserProfile[]> {
        return UserProfileService.getInstance().getAllUserProfileNodes().then((nodes) => {
            return nodes.map(el => ({
                userProfileId: el.info.id.get(),
                label: el.info.name.get()
            }))
        })
    }

    private _formatAppProfiles(): Promise<IAdminAppProfile[]> {
        return AppProfileService.getInstance().getAllAppProfileNodes().then((nodes) => {
            return nodes.map(el => ({
                appProfileId: el.info.id.get(),
                label: el.info.name.get()
            }))
        })
    }

    private async _getOrCreateContext(contextName: string, contextType: string): Promise<SpinalContext> {
        let context = await configServiceInstance.getContext(contextName);
        if (!context) context = await configServiceInstance.addContext(contextName, contextType);
        return context;
    }

    private _formatInfo(info: IAppCredential | IOAuth2Credential): IAppCredential {
        const obj: any = { clientId: undefined, clientSecret: undefined };

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

        return (obj.clientId && obj.clientSecret ? obj : info) as IAppCredential;
    }
}