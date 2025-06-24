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
const bcrypt = require("bcrypt");
const fileLog = require("log-to-file");
const path = require("path");
const token_service_1 = require("./token.service");
const authentification_service_1 = require("./authentification.service");
const userProfile_service_1 = require("./userProfile.service");
const apps_service_1 = require("./apps.service");
const findNodeBySearchKey_1 = require("../utils/findNodeBySearchKey");
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
        const info = {
            name: 'admin',
            userName: 'admin',
            password: this._generateString(15),
        };
        await this.createAdminUser(info);
        return this.context;
    }
    async authenticateUser(user) {
        let data = await this.authAdmin(user);
        let isAdmin = true;
        // if (data.code === HTTP_CODES.INTERNAL_ERROR) {
        //   data = await this.authUserViaAuthPlateform(user);
        //   isAdmin = false;
        // }
        if (data.code === constant_1.HTTP_CODES.OK) {
            const type = isAdmin ? constant_1.USER_TYPES.ADMIN : constant_1.USER_TYPES.USER;
            const info = {
                name: user.userName,
                userName: user.userName,
                type,
                userType: type,
                userId: data.data.userId,
            };
            const playload = data.data;
            const token = data.data.token;
            const node = await this._addUserToContext(info);
            delete data.data.userInfo.password;
            await token_service_1.TokenService.getInstance().addUserToken(node, token, playload);
        }
        return data;
    }
    async getUser(username) {
        const users = await this.context.getChildren([
            constant_1.CONTEXT_TO_ADMIN_USER_RELATION,
            constant_1.CONTEXT_TO_USER_RELATION_NAME,
        ]);
        return users.find((el) => el.info.userName?.get() === username ||
            el.info.userId?.get() === username);
    }
    async getFavoriteApps(userId) {
        const user = await this.getUser(userId);
        if (!user)
            return [];
        return user.getChildren(constant_1.USER_TO_FAVORITE_APP_RELATION);
    }
    async addFavoriteApp(userId, userProfileId, appIds) {
        if (!Array.isArray(appIds))
            appIds = [appIds];
        return appIds.reduce(async (prom, appId) => {
            const list = await prom;
            try {
                const hasAccess = await userProfile_service_1.UserProfileService.getInstance().profileHasAccessToApp(findNodeBySearchKey_1.searchById, userProfileId, appId);
                if (!hasAccess)
                    throw { code: constant_1.HTTP_CODES.UNAUTHORIZED, message: 'unauthorized' };
                const [user, app] = await Promise.all([
                    this.getUser(userId),
                    apps_service_1.AppService.getInstance().getApps(findNodeBySearchKey_1.searchById, appId),
                ]);
                if (!user)
                    throw {
                        code: constant_1.HTTP_CODES.BAD_REQUEST,
                        message: `No user found for ${userId}`,
                    };
                if (!app)
                    throw {
                        code: constant_1.HTTP_CODES.BAD_REQUEST,
                        message: `No app found for ${appId}`,
                    };
                await user.addChild(app, constant_1.USER_TO_FAVORITE_APP_RELATION, constant_1.PTR_LST_TYPE);
                list.push(app);
            }
            catch (error) { }
            return list;
        }, Promise.resolve([]));
    }
    async removeFavoriteApp(userId, userProfileId, appIds) {
        if (!Array.isArray(appIds))
            appIds = [appIds];
        return appIds.reduce(async (prom, appId) => {
            const list = await prom;
            try {
                const hasAccess = await userProfile_service_1.UserProfileService.getInstance().profileHasAccessToApp(findNodeBySearchKey_1.searchById, userProfileId, appId);
                if (!hasAccess)
                    throw { code: constant_1.HTTP_CODES.UNAUTHORIZED, message: 'unauthorized' };
                const [user, app] = await Promise.all([
                    this.getUser(userId),
                    apps_service_1.AppService.getInstance().getApps(findNodeBySearchKey_1.searchById, appId),
                ]);
                if (!user)
                    throw {
                        code: constant_1.HTTP_CODES.BAD_REQUEST,
                        message: `No user found for ${userId}`,
                    };
                if (!app)
                    throw {
                        code: constant_1.HTTP_CODES.BAD_REQUEST,
                        message: `No app found for ${appId}`,
                    };
                await user.removeChild(app, constant_1.USER_TO_FAVORITE_APP_RELATION, constant_1.PTR_LST_TYPE);
                list.push(app);
            }
            catch (error) { }
            return list;
        }, Promise.resolve([]));
    }
    /////////////////////////////////////////////
    //                  ADMIN                  //
    /////////////////////////////////////////////
    async createAdminUser(userInfo) {
        const userName = (userInfo && userInfo.userName) || constant_1.ADMIN_USERNAME;
        const userExist = await this.getAdminUser(userName);
        if (userExist)
            return;
        const password = (userInfo && userInfo.password) || this._generateString(16);
        fileLog(JSON.stringify({ userName, password }), path.resolve(__dirname, '../../.admin.log'));
        return this._addUserToContext({
            name: userName,
            userName,
            type: constant_1.USER_TYPES.ADMIN,
            userType: constant_1.USER_TYPES.ADMIN,
        }, new spinal_core_connectorjs_type_1.Model({ userName, password: await this._hashPassword(password) }), true);
    }
    async getAdminUser(userName) {
        const children = await this.context.getChildren(constant_1.CONTEXT_TO_ADMIN_USER_RELATION);
        return children.find((el) => el.info.userName.get() === userName);
    }
    async authAdmin(user) {
        const node = await this.getAdminUser(user.userName);
        if (!node)
            return {
                code: constant_1.HTTP_CODES.INTERNAL_ERROR,
                data: 'bad username and/or password',
            };
        const element = await node.getElement(true);
        const success = await this._comparePassword(user.password, element.password.get());
        if (!success)
            return {
                code: constant_1.HTTP_CODES.UNAUTHORIZED,
                data: 'bad username and/or password',
            };
        // await this._deleteUserToken(node);
        const res = await token_service_1.TokenService.getInstance().getAdminPlayLoad(node);
        return { code: constant_1.HTTP_CODES.OK, data: res };
    }
    async authUserViaAuthPlateform(user) {
        const adminCredential = await this._getAuthPlateformInfo();
        const url = `${adminCredential.urlAdmin}/users/login`;
        return axios_1.default
            .post(url, user)
            .then(async (result) => {
            const data = this.getUserDataFormatted(result.data, adminCredential);
            return {
                code: constant_1.HTTP_CODES.OK,
                data,
            };
        })
            .catch((err) => {
            console.error(err);
            return {
                code: constant_1.HTTP_CODES.UNAUTHORIZED,
                data: 'bad credential',
            };
        });
    }
    async getUserDataFormatted(data, adminCredential) {
        adminCredential = adminCredential || await this._getAuthPlateformInfo();
        data.profile = await this._getProfileInfo(data.token, adminCredential);
        data.userInfo = await this._getUserInfo(data.userId, adminCredential, data.token);
        return data;
    }
    //////////////////////////////////////////////////
    //                    PRIVATE                   //
    //////////////////////////////////////////////////
    async _addUserToContext(info, element, isAdmin = false) {
        const users = await this.context.getChildrenInContext();
        const found = users.find((el) => el.info.userName?.get() === info.userName);
        if (found)
            return found;
        const nodeId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode(info, element);
        const node = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(nodeId);
        const relationName = isAdmin
            ? constant_1.CONTEXT_TO_ADMIN_USER_RELATION
            : constant_1.CONTEXT_TO_USER_RELATION_NAME;
        return this.context.addChildInContext(node, relationName, constant_1.PTR_LST_TYPE, this.context);
    }
    _hashPassword(password, saltRounds = 10) {
        return bcrypt.hashSync(password, saltRounds);
    }
    _comparePassword(password, hash) {
        return bcrypt.compare(password, hash);
    }
    _generateString(length = 10) {
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789*/-_@#&';
        let text = '';
        for (var i = 0, n = charset.length; i < length; ++i) {
            text += charset.charAt(Math.floor(Math.random() * n));
        }
        return text;
    }
    async _deleteUserToken(userNode) {
        const tokens = await userNode.getChildren(constant_1.TOKEN_RELATION_NAME);
        const promises = tokens.map((token) => token_service_1.TokenService.getInstance().deleteToken(token));
        return Promise.all(promises);
    }
    _getProfileInfo(userToken, adminCredential, isUser = true) {
        let urlAdmin = adminCredential.urlAdmin;
        let endpoint = '/tokens/getUserProfileByToken';
        return axios_1.default
            .post(urlAdmin + endpoint, {
            platformId: adminCredential.idPlateform,
            token: userToken,
        })
            .then((result) => {
            if (!result.data)
                return;
            const data = result.data;
            delete data.password;
            return data;
        })
            .catch((err) => {
            return {};
        });
    }
    _getUserInfo(userId, adminCredential, userToken) {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                // "x-access-token": adminCredential.tokenBosAdmin
                'x-access-token': userToken,
            },
        };
        return axios_1.default.get(`${adminCredential.urlAdmin}/users/${userId}`, config).then((result) => {
            return result.data;
        }).catch((err) => {
            console.error(err);
        });
    }
    async _getAuthPlateformInfo() {
        const adminCredential = await authentification_service_1.AuthentificationService.getInstance().getPamToAdminCredential();
        if (!adminCredential)
            throw new Error('No authentication platform is registered');
        return adminCredential;
    }
}
exports.UserListService = UserListService;
//# sourceMappingURL=userList.services.js.map