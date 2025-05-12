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
const appList_services_1 = require("./appList.services");
const tokenKey = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d';
class AuthentificationService {
    constructor() { }
    static getInstance() {
        if (!this.instance)
            this.instance = new AuthentificationService();
        return this.instance;
    }
    async authenticate(info) {
        const isUser = "userName" in info && "password" in info ? true : false;
        if (isUser) {
            return userList_services_1.UserListService.getInstance().authenticateUser(info);
        }
        const appInfo = this._formatInfo(info);
        return appList_services_1.AppListService.getInstance().authenticateApplication(appInfo);
    }
    // PAM Credential
    registerToAdmin(pamInfo, adminInfo) {
        if (adminInfo.urlAdmin[adminInfo.urlAdmin.length - 1] === "/") {
            adminInfo.urlAdmin = adminInfo.urlAdmin.substring(0, adminInfo.urlAdmin.lastIndexOf('/'));
        }
        return axios_1.default.post(`${adminInfo.urlAdmin}/register`, {
            platformCreationParms: pamInfo,
            registerKey: adminInfo.registerKey
        }).then((result) => {
            result.data.url = adminInfo.urlAdmin;
            result.data.registerKey = adminInfo.registerKey;
            return this._editPamCredential(result.data);
        });
    }
    async getPamToAdminCredential() {
        let context = await configFile_service_1.configServiceInstance.getContext(constant_1.BOS_CREDENTIAL_CONTEXT_NAME);
        if (!context)
            return;
        return context.info.get();
    }
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
    async getAdminCredential() {
        let context = await configFile_service_1.configServiceInstance.getContext(constant_1.ADMIN_CREDENTIAL_CONTEXT_NAME);
        if (!context)
            return;
        return context.info.get();
    }
    async sendDataToAdmin(update = false) {
        const bosCredential = await this.getPamToAdminCredential();
        if (!bosCredential)
            throw new Error("No admin registered, register an admin and retry !");
        // const endpoint = update ? "update" : "register";
        const endpoint = "register";
        const adminCredential = !update ? await this._getOrCreateAdminCredential(true) : {};
        const data = await this._getRequestBody(update, bosCredential, adminCredential);
        return axios_1.default.put(`${bosCredential.urlAdmin}/${endpoint}`, data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
    // public async updateToken(oldToken: string) {
    //     const adminInfo = await this.getAdminCredential();
    //     const decodeToken = jwt.verify(oldToken, tokenKey);
    //     if (oldToken === adminInfo.TokenAdminBos && decodeToken.clienId === adminInfo.idPlatformOfAdmin) {
    //         const newToken = jwt
    //     } 
    // }
    //////////////////////////////////////////////////
    //                      PRIVATE                 //
    //////////////////////////////////////////////////
    async _getOrCreateAdminCredential(createIfNotExist = false) {
        const credentials = await this.getAdminCredential();
        if (credentials)
            return credentials;
        if (createIfNotExist)
            return this.createAdminCredential();
    }
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
    async _editPamCredential(bosCredential) {
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
        if (bosCredential.registerKey)
            contextInfo.mod_attr("registerKey", bosCredential.registerKey);
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
        if ("client_id" in info) {
            info["clientId"] = info["client_id"];
            delete info.client_id;
        }
        if ("client_secret" in info) {
            info["clientSecret"] = info["client_secret"];
            delete info.client_secret;
        }
        return info;
    }
}
exports.AuthentificationService = AuthentificationService;
//# sourceMappingURL=authentification.service.js.map