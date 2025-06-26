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
exports.UserListService = void 0;
const axios_1 = require("axios");
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const constant_1 = require("../constant");
const configFile_service_1 = require("./configFile.service");
const spinal_core_connectorjs_type_1 = require("spinal-core-connectorjs_type");
const fileLog = require("log-to-file");
const path = require("path");
const token_service_1 = require("./token.service");
const userProfile_service_1 = require("./userProfile.service");
const apps_service_1 = require("./apps.service");
const findNodeBySearchKey_1 = require("../utils/findNodeBySearchKey");
const UserAuthUtils_1 = require("../utils/UserAuthUtils");
class UserListService {
    constructor() { }
    static getInstance() {
        if (!this.instance)
            this.instance = new UserListService();
        return this.instance;
    }
    async init() {
        this.context = await configFile_service_1.configServiceInstance.getContext(constant_1.USER_LIST_CONTEXT_NAME);
        if (!this.context) {
            this.context = await configFile_service_1.configServiceInstance.addContext(constant_1.USER_LIST_CONTEXT_NAME, constant_1.USER_LIST_CONTEXT_TYPE);
        }
        // const info = { name: "admin", userName: "admin", password: this._generateString(15), };
        await this.createAdminUser();
        return this.context;
    }
    /**
     * Authenticates a user using admin credentials.
     * If authentication is successful, adds the user to the context and stores the token.
     * Removes password from user info before returning.
     * @param user - User credentials (username and password)
     * @returns An object with code and data (token or error message)
     */
    async authenticateUser(user) {
        let response = await this.authenticateAdmin(user);
        let isAdmin = true;
        // if (data.code === HTTP_CODES.INTERNAL_ERROR) {
        //   data = await this.authenticateUserViaAuthPlateform(user);
        //   isAdmin = false;
        // }
        if (response.code !== constant_1.HTTP_CODES.OK)
            return response;
        const responseData = response.data;
        const type = isAdmin ? constant_1.USER_TYPES.ADMIN : constant_1.USER_TYPES.USER;
        const info = { name: user.userName, userName: user.userName, type, userType: type, userId: responseData.userId };
        delete responseData.userInfo.password; // Remove password from user info
        const token = responseData.token;
        const node = await (0, UserAuthUtils_1._addUserToContext)(this.context, info);
        await token_service_1.TokenService.getInstance().addUserToken(node, token, responseData);
        return response;
    }
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
    async getUser(username) {
        const users = await this.context.getChildren([constant_1.CONTEXT_TO_ADMIN_USER_RELATION, constant_1.CONTEXT_TO_USER_RELATION_NAME]);
        return users.find((el) => el.info.userName?.get() === username || el.info.userId?.get() === username);
    }
    /**
     * Retrieves the list of favorite applications for a given user.
     *
     * @param userId - The unique identifier of the user whose favorite apps are to be fetched.
     * @returns A promise that resolves to an array of `SpinalNode` instances representing the user's favorite applications.
     *          If the user does not exist, an empty array is returned.
     */
    async getFavoriteApps(userId) {
        const user = await this.getUser(userId);
        if (!user)
            return [];
        return user.getChildren(constant_1.USER_TO_FAVORITE_APP_RELATION);
    }
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
    async addOneAppToFavorite(userId, userProfileId, appId) {
        const hasAccess = await userProfile_service_1.UserProfileService.getInstance().profileHasAccessToApp(findNodeBySearchKey_1.searchById, userProfileId, appId);
        if (!hasAccess)
            throw { code: constant_1.HTTP_CODES.UNAUTHORIZED, message: "unauthorized" };
        const promises = [this.getUser(userId), apps_service_1.AppService.getInstance().getApps(findNodeBySearchKey_1.searchById, appId)];
        return Promise.all(promises).then(async ([user, app]) => {
            if (!user)
                throw { code: constant_1.HTTP_CODES.BAD_REQUEST, message: `No user found for ${userId}`, };
            if (!app)
                throw { code: constant_1.HTTP_CODES.BAD_REQUEST, message: `No app found for ${appId}` };
            return user.addChild(app, constant_1.USER_TO_FAVORITE_APP_RELATION, constant_1.PTR_LST_TYPE);
        });
    }
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
    async addFavoriteApp(userId, userProfileId, appIds) {
        if (!Array.isArray(appIds))
            appIds = [appIds];
        const promises = appIds.map(async (appId) => this.addOneAppToFavorite(userId, userProfileId, appId).catch((error) => { }));
        return Promise.all(promises).then((results) => results.filter((el) => el instanceof spinal_env_viewer_graph_service_1.SpinalNode));
    }
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
    async removeOneAppFromFavorite(userId, userProfileId, appId) {
        const hasAccess = await userProfile_service_1.UserProfileService.getInstance().profileHasAccessToApp(findNodeBySearchKey_1.searchById, userProfileId, appId);
        if (!hasAccess)
            throw { code: constant_1.HTTP_CODES.UNAUTHORIZED, message: "unauthorized" };
        const promises = [this.getUser(userId), apps_service_1.AppService.getInstance().getApps(findNodeBySearchKey_1.searchById, appId)];
        return Promise.all(promises).then(async ([user, app]) => {
            if (!user)
                throw { code: constant_1.HTTP_CODES.BAD_REQUEST, message: `No user found for ${userId}` };
            if (!app)
                throw { code: constant_1.HTTP_CODES.BAD_REQUEST, message: `No app found for ${appId}`, };
            await user.removeChild(app, constant_1.USER_TO_FAVORITE_APP_RELATION, constant_1.PTR_LST_TYPE);
            return app;
        });
    }
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
    async removeFavoriteApp(userId, userProfileId, appIds) {
        if (!Array.isArray(appIds))
            appIds = [appIds];
        const promises = appIds.map(async (appId) => this.removeOneAppFromFavorite(userId, userProfileId, appId).catch((error) => { }));
        return Promise.all(promises).then((results) => results.filter((el) => el instanceof spinal_env_viewer_graph_service_1.SpinalNode));
    }
    /////////////////////////////////////////////
    //                  ADMIN                  //
    /////////////////////////////////////////////
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
    async createAdminUser(userInfo) {
        const userName = (userInfo && userInfo.userName) || constant_1.ADMIN_USERNAME;
        const userExist = await this.getAdminUser(userName);
        if (userExist)
            return;
        const password = (userInfo && userInfo.password) || (0, UserAuthUtils_1._generateString)(16);
        const isAdmin = true;
        const userInfoFormatted = { name: userName, userName, type: constant_1.USER_TYPES.ADMIN, userType: constant_1.USER_TYPES.ADMIN, };
        const element = new spinal_core_connectorjs_type_1.Model({ userName, password: await (0, UserAuthUtils_1._hashPassword)(password) });
        return (0, UserAuthUtils_1._addUserToContext)(this.context, userInfoFormatted, element, isAdmin).then((result) => {
            // Log the admin credentials to a file for recovery
            fileLog(JSON.stringify({ userName, password }), path.resolve(__dirname, "../../.admin.log"));
            return result;
        });
    }
    /**
     * Retrieves an admin user node by its username.
     *
     * @param userName - The username of the admin user to retrieve.
     * @returns A promise that resolves to the corresponding `SpinalNode` if found, otherwise `undefined`.
     */
    async getAdminUser(userName) {
        const children = await this.context.getChildren(constant_1.CONTEXT_TO_ADMIN_USER_RELATION);
        return children.find((el) => el.info.userName.get() === userName);
    }
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
    async authenticateAdmin(user) {
        const adminNodeFound = await this.getAdminUser(user.userName);
        if (!adminNodeFound)
            return { code: constant_1.HTTP_CODES.UNAUTHORIZED, data: "bad username and/or password" };
        const nodeElement = await adminNodeFound.getElement(true);
        const passwordMatch = await (0, UserAuthUtils_1._comparePassword)(user.password, nodeElement.password.get());
        if (!passwordMatch)
            return { code: constant_1.HTTP_CODES.UNAUTHORIZED, data: "bad username and/or password" };
        // await this._deleteUserToken(node);
        const playLoad = await token_service_1.TokenService.getInstance().getAdminPlayLoad(adminNodeFound);
        return { code: constant_1.HTTP_CODES.OK, data: playLoad };
    }
    /**
     * Authenticates a user via the external authentication platform.
     *
     * Sends a login request to the external platform using the provided credentials.
     * On success, formats and returns the user data; on failure, returns an unauthorized error.
     *
     * @param credentials - The user's login credentials.
     * @returns A promise resolving to an object with HTTP code and user data or error message.
     */
    async authenticateUserViaAuthPlateform(credentials) {
        const authPlateformCredential = await (0, UserAuthUtils_1._getAuthPlateformInfo)();
        const url = `${authPlateformCredential.urlAdmin}/users/login`;
        return axios_1.default.post(url, credentials)
            .then(async (response) => {
            const payload = this.getUserDataFormatted(response.data, authPlateformCredential);
            return { code: constant_1.HTTP_CODES.OK, data: payload };
        }).catch((err) => {
            return { code: constant_1.HTTP_CODES.UNAUTHORIZED, data: "bad credential", };
        });
    }
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
    async getUserDataFormatted(data, adminCredential, useToken = false) {
        adminCredential = adminCredential || await (0, UserAuthUtils_1._getAuthPlateformInfo)();
        data.profile = await (0, UserAuthUtils_1._getUserProfileInfo)(data.token, adminCredential);
        data.userInfo = await (useToken ? (0, UserAuthUtils_1.getUserInfoByToken)(adminCredential, data.token) : (0, UserAuthUtils_1._getUserInfo)(data.userId, adminCredential, data.token));
        return data;
    }
}
exports.UserListService = UserListService;
//# sourceMappingURL=userList.services.js.map