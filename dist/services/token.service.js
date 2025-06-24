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
const userList_services_1 = require("./userList.services");
const appList_services_1 = require("./appList.services");
class TokenService {
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
    async purgeToken() {
        const tokens = await this._getAllTokens();
        const promises = tokens.map((token) => this.tokenIsValid(token, true));
        return Promise.all(promises);
    }
    async addUserToken(userNode, token, playload) {
        const tokenNode = await this.addTokenToContext(token, playload);
        await userNode.addChild(tokenNode, constant_1.TOKEN_RELATION_NAME, constant_1.PTR_LST_TYPE);
        return playload;
    }
    async getAdminPlayLoad(userNode, secret, durationInMin) {
        const playload = {
            userInfo: userNode.info.get(),
        };
        durationInMin = durationInMin || 7 * 24 * 60 * 60; // par default 7jrs
        const key = secret || this._generateString(15);
        const token = jwt.sign(playload, key, { expiresIn: durationInMin });
        const adminProfile = await adminProfile_service_1.AdminProfileService.getInstance().getAdminProfile();
        const now = Date.now();
        playload.createdToken = now;
        playload.expieredToken = now + durationInMin * 60 * 1000;
        playload.userId = userNode.getId().get();
        playload.token = token;
        playload.profile = {
            profileId: adminProfile.getId().get(),
        };
        return playload;
    }
    async addTokenToContext(token, data) {
        const node = new spinal_env_viewer_graph_service_1.SpinalNode(token, constant_1.TOKEN_TYPE, new spinal_core_connectorjs_type_1.Model(data));
        const child = await this.context.addChildInContext(node, constant_1.TOKEN_RELATION_NAME, constant_1.PTR_LST_TYPE);
        globalCache.set(data.token, data);
        return child;
    }
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
    async deleteToken(token) {
        const found = token instanceof spinal_env_viewer_graph_service_1.SpinalNode
            ? token
            : await this.context.getChild((node) => node.getName().get() === token, constant_1.TOKEN_RELATION_NAME, constant_1.PTR_LST_TYPE);
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
    async tokenIsValid(token, deleteIfExpired = false) {
        let data = await this.getTokenData(token);
        if (!data) {
            data = await this.verifyToken(token);
        }
        ;
        const expirationTime = data.expieredToken;
        const tokenExpired = expirationTime ? Date.now() >= expirationTime * 1000 : true;
        if (tokenExpired) {
            if (deleteIfExpired)
                await this.deleteToken(token);
            return;
        }
        return data;
    }
    async verifyToken(token, actor = "user") {
        const authAdmin = await authentification_service_1.AuthentificationService.getInstance().getPamToAdminCredential();
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
                info = await this._checkRequest(authPlateform, token, 'user');
            }
            catch (error) {
                info = await this._checkRequest(authPlateform, token, 'application');
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
        const instance = actor === 'user'
            ? userList_services_1.UserListService.getInstance()
            : appList_services_1.AppListService.getInstance();
        info.profile = await instance._getProfileInfo(token, authPlateform);
        return info;
        // info.userInfo = await instance.
    }
    _generateString(length = 10) {
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789*/-_@#&';
        let text = '';
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
        cron.schedule('30 */1 * * *', async () => {
            console.log(new Date().toUTCString(), 'purge invalid tokens');
            await this.purgeToken();
        });
    }
    async _getAuthPlateformInfo() {
        const adminCredential = await authentification_service_1.AuthentificationService.getInstance().getPamToAdminCredential();
        if (!adminCredential)
            throw new Error('No authentication platform is registered');
        return adminCredential;
    }
}
exports.TokenService = TokenService;
//# sourceMappingURL=token.service.js.map