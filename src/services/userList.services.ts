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

import axios from "axios";
import { SpinalContext, SpinalNode } from "spinal-env-viewer-graph-service";
import { USER_LIST_CONTEXT_TYPE, USER_LIST_CONTEXT_NAME, ADMIN_USERNAME, PTR_LST_TYPE, CONTEXT_TO_ADMIN_USER_RELATION, HTTP_CODES, TOKEN_RELATION_NAME, CONTEXT_TO_USER_RELATION_NAME, USER_TYPES, USER_TO_FAVORITE_APP_RELATION } from "../constant";
import { IUserCredential, IUserInfo, IUserToken } from "../interfaces";
import { configServiceInstance } from "./configFile.service";
import { Model } from "spinal-core-connectorjs_type";
import * as fileLog from "log-to-file";
import * as path from "path";
import { TokenService } from "./token.service";
import { UserProfileService } from "./userProfile.service";
import { AppService } from "./apps.service";
import { searchById } from "../utils/findNodeBySearchKey";
import { _comparePassword, _addUserToContext, _generateString, _getAuthPlateformInfo, _getUserInfo, _getUserProfileInfo, _hashPassword, getUserInfoByToken } from "../utils/UserAuthUtils";
import { userInfo } from "os";

export class UserListService {
  private static instance: UserListService;
  public context: SpinalContext;

  private constructor() { }

  public static getInstance(): UserListService {
    if (!this.instance) this.instance = new UserListService();
    return this.instance;
  }

  public async init(): Promise<SpinalContext> {
    this.context = await configServiceInstance.getContext(USER_LIST_CONTEXT_NAME);
    if (!this.context) {
      this.context = await configServiceInstance.addContext(USER_LIST_CONTEXT_NAME, USER_LIST_CONTEXT_TYPE);
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
  public async authenticateUser(user: IUserCredential): Promise<{ code: number; data: string | IUserToken }> {
    return this.authenticateAdmin(user);


    /**
    * If the user is not an admin, we will try to authenticate the user via the Auth platform.
    * commented because user authentication is now handled by authentication platform
    */

    // let isAdmin = true;
    // if (data.code === HTTP_CODES.INTERNAL_ERROR) {
    //   data = await this.authenticateUserViaAuthPlateform(user);
    //   isAdmin = false;
    // }

    // if (response.code !== HTTP_CODES.OK) return response;

    // const responseData = response.data;

    // // const type = isAdmin ? USER_TYPES.ADMIN : USER_TYPES.USER;
    // const type = USER_TYPES.ADMIN;

    // const info = {
    // name: user.userName,
    // userName: user.userName,
    // type,
    // userType: type,
    // userId: responseData.userId
    // };

    // const { password, ...userInfoWithoutPassword } = responseData.userInfo; // Destructure to remove password

    // responseData.userInfo = userInfoWithoutPassword; // Update responseData to exclude password

    // const token = responseData.token;
    // const node = await _addUserToContext(this.context, info);

    // await TokenService.getInstance().addUserToken(node, token, responseData);

    // return response;
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
  public async getUser(username: string): Promise<SpinalNode> {
    const users = await this.context.getChildren([CONTEXT_TO_ADMIN_USER_RELATION, CONTEXT_TO_USER_RELATION_NAME]);
    return users.find((el) => el.info.userName?.get() === username || el.info.userId?.get() === username);
  }

  /**
   * Retrieves the list of favorite applications for a given user.
   *
   * @param userId - The unique identifier of the user whose favorite apps are to be fetched.
   * @returns A promise that resolves to an array of `SpinalNode` instances representing the user's favorite applications.
   *          If the user does not exist, an empty array is returned.
   */
  public async getFavoriteApps(userId: string): Promise<SpinalNode[]> {
    const user = await this.getUser(userId);
    if (!user) return [];
    return user.getChildren(USER_TO_FAVORITE_APP_RELATION);
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
  public async addOneAppToFavorite(userId: string, userProfileId: string, appId: string): Promise<SpinalNode> {
    const hasAccess = await UserProfileService.getInstance().profileHasAccessToApp(searchById, userProfileId, appId);
    if (!hasAccess) throw { code: HTTP_CODES.UNAUTHORIZED, message: "unauthorized" };
    const promises = [this.getUser(userId), AppService.getInstance().getApps(searchById, appId)];

    return Promise.all(promises).then(async ([user, app]) => {
      if (!user) throw { code: HTTP_CODES.BAD_REQUEST, message: `No user found for ${userId}`, };
      if (!app) throw { code: HTTP_CODES.BAD_REQUEST, message: `No app found for ${appId}` };
      return user.addChild(app, USER_TO_FAVORITE_APP_RELATION, PTR_LST_TYPE);
    })
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
  public async addFavoriteApp(userId: string, userProfileId: string, appIds: string | string[]): Promise<SpinalNode[]> {
    if (!Array.isArray(appIds)) appIds = [appIds];

    const promises = appIds.map(async (appId) => this.addOneAppToFavorite(userId, userProfileId, appId).catch((error) => { }));

    return Promise.all(promises).then((results) => results.filter((el) => el instanceof SpinalNode) as SpinalNode[]);
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
  public async removeOneAppFromFavorite(userId: string, userProfileId: string, appId: string): Promise<SpinalNode> {
    const hasAccess = await UserProfileService.getInstance().profileHasAccessToApp(searchById, userProfileId, appId);
    if (!hasAccess) throw { code: HTTP_CODES.UNAUTHORIZED, message: "unauthorized" };
    const promises = [this.getUser(userId), AppService.getInstance().getApps(searchById, appId)];

    return Promise.all(promises).then(async ([user, app]) => {
      if (!user) throw { code: HTTP_CODES.BAD_REQUEST, message: `No user found for ${userId}` };
      if (!app) throw { code: HTTP_CODES.BAD_REQUEST, message: `No app found for ${appId}`, };

      await user.removeChild(app, USER_TO_FAVORITE_APP_RELATION, PTR_LST_TYPE);
      return app;
    })
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
  public async removeFavoriteApp(userId: string, userProfileId: string, appIds: string | string[]): Promise<SpinalNode[]> {
    if (!Array.isArray(appIds)) appIds = [appIds];

    const promises = appIds.map(async (appId) => this.removeOneAppFromFavorite(userId, userProfileId, appId).catch((error) => { }));
    return Promise.all(promises).then((results) => results.filter((el) => el instanceof SpinalNode) as SpinalNode[]);
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
  public async createAdminUser(userInfo?: IUserInfo): Promise<SpinalNode> {
    const userName = (userInfo && userInfo.userName) || ADMIN_USERNAME;

    const userExist = await this.getAdminUser(userName);
    if (userExist) return;

    const password = (userInfo && userInfo.password) || _generateString(16);

    const isAdmin = true;
    const userInfoFormatted = { name: userName, userName, type: USER_TYPES.ADMIN, userType: USER_TYPES.ADMIN, }
    const element = new Model({ userName, password: await _hashPassword(password) });

    return _addUserToContext(this.context, userInfoFormatted, element, isAdmin).then((result) => {
      // Log the admin credentials to a file for recovery
      fileLog(JSON.stringify({ userName, password }), path.resolve(__dirname, "../../.admin.log"));

      return result;
    })
  }

  /**
   * Retrieves an admin user node by its username.
   *
   * @param userName - The username of the admin user to retrieve.
   * @returns A promise that resolves to the corresponding `SpinalNode` if found, otherwise `undefined`.
   */
  public async getAdminUser(userName: string): Promise<SpinalNode> {
    const children = await this.context.getChildren(CONTEXT_TO_ADMIN_USER_RELATION);
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
  public async authenticateAdmin(user: IUserCredential): Promise<{ code: number; data: any | string }> {
    const adminNodeFound = await this.getAdminUser(user.userName);

    if (!adminNodeFound) return { code: HTTP_CODES.UNAUTHORIZED, data: "bad username and/or password" };

    const nodeElement = await adminNodeFound.getElement(true);

    const passwordMatch = await _comparePassword(user.password, nodeElement.password.get());
    if (!passwordMatch) return { code: HTTP_CODES.UNAUTHORIZED, data: "bad username and/or password" };

    const tokenPlayLoad = await TokenService.getInstance().generateTokenForAdmin(adminNodeFound);
    return { code: HTTP_CODES.OK, data: tokenPlayLoad };
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
  public async authenticateUserViaAuthPlateform(credentials: IUserCredential): Promise<{ code: HTTP_CODES; data: any }> {
    const authPlateformCredential = await _getAuthPlateformInfo();

    const url = `${authPlateformCredential.urlAdmin}/users/login`;

    return axios.post(url, credentials)
      .then(async (response) => {
        const payload = this.getUserDataFormatted(response.data, authPlateformCredential);
        return { code: HTTP_CODES.OK, data: payload };
      }).catch((err) => {
        return { code: HTTP_CODES.UNAUTHORIZED, data: "bad credential", };
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
  public async getUserDataFormatted(data: any, adminCredential?: any, useToken: boolean = false) {
    adminCredential = adminCredential || await _getAuthPlateformInfo();

    data.profile = await _getUserProfileInfo(data.token, adminCredential);
    data.userInfo = await (useToken ? getUserInfoByToken(adminCredential, data.token) : _getUserInfo(data.userId, adminCredential, data.token));

    return data;
  }



}
