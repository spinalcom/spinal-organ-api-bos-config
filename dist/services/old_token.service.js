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
exports.TokenService = void 0;
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const constant_1 = require("../constant");
const configFile_service_1 = require("./configFile.service");
const spinal_core_connectorjs_type_1 = require("spinal-core-connectorjs_type");
const adminProfile_service_1 = require("./adminProfile.service");
const jwt = require("jsonwebtoken");
const globalCache = require("global-cache");
const cron = require("node-cron");
const authentification_service_1 = require("./authentification.service");
const axios_1 = require("axios");
const ApplicationAuthUtils_1 = require("../utils/ApplicationAuthUtils");
const UserAuthUtils_1 = require("../utils/UserAuthUtils");
class TokenService {
    static instance;
    context;
    constructor() { }
    static getInstance() {
        if (!this.instance)
            this.instance = new TokenService();
        return this.instance;
    }
    async init() {
        this.context = await configFile_service_1.configServiceInstance.getContext(constant_1.TOKEN_LIST_CONTEXT_NAME);
        if (!this.context) {
            this.context = await configFile_service_1.configServiceInstance.addContext(constant_1.TOKEN_LIST_CONTEXT_NAME, constant_1.TOKEN_LIST_CONTEXT_TYPE);
        }
        await this._scheduleTokenPurge();
        return this.context;
    }
    /**
     * Purges invalid or expired tokens from the context.
     * Iterates over all tokens and checks their validity.
     * If a token is expired, it will be deleted.
     * @returns {Promise<(IUserToken | IApplicationToken)[]>} Array of token data for valid tokens.
     */
    async purgeToken() {
        const tokens = await this._getAllTokens();
        const promises = tokens.map((token) => this.tokenIsValid(token, true));
        return Promise.all(promises);
    }
    /**
     * Associates a new token with a user node by creating a token node and adding it as a child
     * to the specified user node using a predefined relation.
     *
     * @param userNode - The user node to which the token will be associated.
     * @param token - The token string to be added.
     * @param playload - Additional payload data to be stored with the token.
     * @returns A promise that resolves to the payload after the token has been added.
     */
    async addUserToken(userNode, token, playload) {
        const tokenNode = await this.addTokenToContext(token, playload);
        await userNode.addChild(tokenNode, constant_1.TOKEN_RELATION_NAME, constant_1.PTR_LST_TYPE);
        return playload;
    }
    /**
     * Generates a payload object for an admin user, including a JWT token and additional metadata.
     *
     * @param userNode - The SpinalNode representing the user for whom the payload is generated.
     * @param secret - (Optional) The secret key to sign the JWT token. If not provided, a random string is generated.
     * @param durationInMin - (Optional) The token expiration duration in minutes. Defaults to 7 days if not specified.
     * @returns A promise that resolves to an object containing user information, token details, and admin profile data.
     */
    async getAdminPlayLoad(userNode, secret, durationInMin) {
        let playload = { userInfo: userNode.info.get() };
        durationInMin = durationInMin || 7 * 24 * 60 * 60; // par default 7jrs
        const key = secret || this._generateString(15);
        const token = jwt.sign(playload, key, { expiresIn: durationInMin });
        const adminProfile = await adminProfile_service_1.AdminProfileService.getInstance().getAdminProfile();
        const now = Date.now();
        playload = Object.assign({}, playload, {
            createdToken: now,
            expieredToken: now + durationInMin * 60 * 1000,
            userId: userNode.getId().get(),
            token: token,
            profile: { profileId: adminProfile.getId().get() },
        });
        return playload;
    }
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
    async addTokenToContext(token, data) {
        const node = new spinal_env_viewer_graph_service_1.SpinalNode(token, constant_1.TOKEN_TYPE, new spinal_core_connectorjs_type_1.Model(data));
        const child = await this.context.addChildInContext(node, constant_1.TOKEN_RELATION_NAME, constant_1.PTR_LST_TYPE);
        globalCache.set(data.token, data);
        return child;
    }
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
    async getTokenData(token) {
        const data = globalCache.get(token);
        if (data)
            return data;
        const children = await this.context.getChildren([constant_1.TOKEN_RELATION_NAME]);
        const found = children.find((node) => node.getName().get() === token);
        if (!found)
            return this._checkTokenNearAuthPlateform(token);
        const element = await found.getElement(true);
        if (element) {
            globalCache.set(token, element.get());
            return element.get();
        }
    }
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
    async deleteToken(token) {
        const found = token instanceof spinal_env_viewer_graph_service_1.SpinalNode ? token : await this.context.getChild((node) => node.getName().get() === token, constant_1.TOKEN_RELATION_NAME, constant_1.PTR_LST_TYPE);
        if (!found)
            return true;
        try {
            const parents = await found.getParents(constant_1.TOKEN_RELATION_NAME);
            for (const parent of parents) {
                await parent.removeChild(found, constant_1.TOKEN_RELATION_NAME, constant_1.PTR_LST_TYPE);
            }
            return true;
        }
        catch (error) {
            return false;
        }
    }
    /**
     * Checks if a token is valid and optionally deletes it if expired.
     *
     * @param token - The token string to validate.
     * @param deleteIfExpired - If true, deletes the token if it is expired. Defaults to false.
     * @returns A promise that resolves to the token data if valid, or undefined if expired and deleted.
     */
    async tokenIsValid(token, deleteIfExpired = false) {
        let data = await this.getTokenData(token);
        if (!data) {
            data = await this.verifyToken(token);
        }
        const expirationTime = data.expieredToken;
        const tokenExpired = expirationTime ? Date.now() >= expirationTime * 1000 : true;
        if (tokenExpired && deleteIfExpired) {
            await this.deleteToken(token);
            return;
        }
        return data;
    }
    /**
     * Verifies the validity of a given token for a specified actor type.
     *
     * @param token - The token string to be verified.
     * @param actor - The type of actor associated with the token, either "user" or "app". Defaults to "user".
     * @returns A promise that resolves with the verification result data from the authentication service.
     */
    async verifyToken(token, actor = "user") {
        const authAdmin = await authentification_service_1.AuthentificationService.getInstance().getBosToAdminCredential();
        return axios_1.default.post(`${authAdmin.urlAdmin}/tokens/verifyToken`, { tokenParam: token, actor }).then((result) => {
            return result.data;
        });
    }
    //////////////////////////////////////////////////
    //                        PRIVATE               //
    //////////////////////////////////////////////////
    async _checkTokenNearAuthPlateform(token) {
        try {
            const authPlateform = await this._getAuthPlateformInfo();
            let info;
            try {
                info = await this._checkRequest(authPlateform, token, "user");
            }
            catch (error) {
                info = await this._checkRequest(authPlateform, token, "application");
            }
            return info;
        }
        catch (error) {
            return;
        }
    }
    async _checkRequest(authPlateform, token, actor) {
        const url = `${authPlateform.urlAdmin}/tokens/verifyToken`;
        const result = await axios_1.default.post(url, { tokenParam: token, actor });
        const info = result.data;
        // const instance = actor === 'user' ? UserListService.getInstance() : AppListService.getInstance();
        if (actor === "application")
            info.profile = await (0, ApplicationAuthUtils_1._getProfileInfo)(token, authPlateform.urlAdmin, authPlateform);
        else
            info.profile = await (0, UserAuthUtils_1._getUserProfileInfo)(token, authPlateform);
        return info;
    }
    _generateString(length = 10) {
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789*/-_@#&";
        let text = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
            text += charset.charAt(Math.floor(Math.random() * n));
        }
        return text;
    }
    async _getAllTokens() {
        const tokens = await this.context.getChildren(constant_1.TOKEN_RELATION_NAME);
        return tokens.map((el) => el.getName().get());
    }
    _scheduleTokenPurge() {
        // cron.schedule('0 0 23 * * *', async () => {
        cron.schedule("30 */1 * * *", async () => {
            console.log(new Date().toUTCString(), "purge invalid tokens");
            await this.purgeToken();
        });
    }
    async _getAuthPlateformInfo() {
        const adminCredential = await authentification_service_1.AuthentificationService.getInstance().getBosToAdminCredential();
        if (!adminCredential)
            throw new Error("No authentication platform is registered");
        return adminCredential;
    }
}
exports.TokenService = TokenService;
//# sourceMappingURL=old_token.service.js.map