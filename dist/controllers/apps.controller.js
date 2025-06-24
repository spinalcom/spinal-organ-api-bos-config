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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppsController = void 0;
const services_1 = require("../services");
const tsoa_1 = require("tsoa");
const constant_1 = require("../constant");
const express = require("express");
const AuthError_1 = require("../security/AuthError");
const authentication_1 = require("../security/authentication");
const findNodeBySearchKey_1 = require("../utils/findNodeBySearchKey");
const appServiceInstance = services_1.AppService.getInstance();
let AppsController = class AppsController extends tsoa_1.Controller {
    constructor() {
        super();
    }
    async createAdminApp(req, appInfo) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const node = await appServiceInstance.createAdminApp(appInfo);
            if (node) {
                this.setStatus(constant_1.HTTP_CODES.CREATED);
                return node.info.get();
            }
            this.setStatus(constant_1.HTTP_CODES.BAD_REQUEST);
            return {
                message: 'oops, something went wrong, please check your input data',
            };
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async createBuildingApp(req, appInfo) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const node = await appServiceInstance.createBuildingApp(appInfo);
            if (node) {
                this.setStatus(constant_1.HTTP_CODES.CREATED);
                return node.info.get();
            }
            this.setStatus(constant_1.HTTP_CODES.BAD_REQUEST);
            return {
                message: 'oops, something went wrong, please check your input data',
            };
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async createBuildingSubApp(req, appId, appInfo) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const profileId = await (0, authentication_1.getProfileId)(req);
            const appNode = await services_1.UserProfileService.getInstance().profileHasAccessToApp(findNodeBySearchKey_1.searchById, profileId, appId);
            if (!appNode)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            if (appInfo && !appInfo.appConfig) {
                this.setStatus(constant_1.HTTP_CODES.BAD_REQUEST);
                return { message: 'AppConfig is required' };
            }
            const subAppNode = await appServiceInstance.createBuildingSubApp(appNode, appInfo);
            if (typeof subAppNode === 'string') {
                this.setStatus(constant_1.HTTP_CODES.CONFLICT);
                return { message: subAppNode };
            }
            else if (subAppNode) {
                this.setStatus(constant_1.HTTP_CODES.CREATED);
                return subAppNode.info.get();
            }
            this.setStatus(constant_1.HTTP_CODES.BAD_REQUEST);
            return {
                message: 'oops, something went wrong, please check your input data',
            };
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async getAllAdminApps(req) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const nodes = await appServiceInstance.getAllAdminApps();
            this.setStatus(constant_1.HTTP_CODES.OK);
            return nodes.map((el) => el.info.get());
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async getAllBuildingApps(req) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const nodes = await appServiceInstance.getAllBuildingApps();
            const res = await appServiceInstance.formatAppsAndAddSubApps(nodes);
            this.setStatus(constant_1.HTTP_CODES.OK);
            return res;
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async getAdminApp(req, appNameOrId) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const node = await appServiceInstance.getAdminApp(findNodeBySearchKey_1.searchByNameOrId, appNameOrId);
            if (node) {
                this.setStatus(constant_1.HTTP_CODES.OK);
                return node.info.get();
            }
            this.setStatus(constant_1.HTTP_CODES.NOT_FOUND);
            return { message: `No application found for this id (${appNameOrId})` };
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    /**
     * Get building app by name or id
     * @param {express.Request} req express request
     * @param {string} appNaneOrId app name or id
     * @return {*}  {(Promise<ISpinalApp | { message: string }>)}
     * @memberof AppsController
     */
    async getBuildingApp(req, appNaneOrId) {
        try {
            const profileId = await (0, authentication_1.getProfileId)(req);
            const node = await services_1.UserProfileService.getInstance().profileHasAccessToApp(findNodeBySearchKey_1.searchByNameOrId, profileId, appNaneOrId);
            if (!node)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            if (node) {
                const res = await appServiceInstance.formatAppAndAddSubApps(node);
                this.setStatus(constant_1.HTTP_CODES.OK);
                return res;
            }
            this.setStatus(constant_1.HTTP_CODES.NOT_FOUND);
            return {
                message: `No application found for appNaneOrId : '${appNaneOrId}'`,
            };
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    /**
     * Get building sub app configuration by name or id
     * @param {express.Request} req
     * @param {string} appNameOrId
     * @param {string} subAppNameOrId
     * @return {*}  {(Promise<any | { message: string }>)}
     * @memberof AppsController
     */
    async getBuildingSubApp(req, appNameOrId, subAppNameOrId) {
        try {
            const profileId = await (0, authentication_1.getProfileId)(req);
            const node = await services_1.UserProfileService.getInstance().profileHasAccessToSubApp(findNodeBySearchKey_1.searchByNameOrId, profileId, appNameOrId, subAppNameOrId);
            if (!node)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            if (node) {
                const elem = await node.getElement();
                if (elem) {
                    const res = elem.get();
                    this.setStatus(constant_1.HTTP_CODES.OK);
                    return res;
                }
                this.setStatus(constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: `Failed to load configuration` };
            }
            this.setStatus(constant_1.HTTP_CODES.NOT_FOUND);
            return { message: `Failed to load configuration` };
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async updateAdminApp(req, appId, newInfo) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const node = await appServiceInstance.updateAdminApp(appId, newInfo);
            if (node) {
                this.setStatus(constant_1.HTTP_CODES.OK);
                return node.info.get();
            }
            this.setStatus(constant_1.HTTP_CODES.BAD_REQUEST);
            return { message: `Something went wrong, please check your input data.` };
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async updateBuildingApp(req, appId, newInfo) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const node = await appServiceInstance.updateBuildingApp(appId, newInfo);
            if (node) {
                const res = await appServiceInstance.formatAppAndAddSubApps(node);
                this.setStatus(constant_1.HTTP_CODES.OK);
                return res;
            }
            this.setStatus(constant_1.HTTP_CODES.BAD_REQUEST);
            return { message: `Something went wrong, please check your input data.` };
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async updateBuildingSubApp(req, appId, subAppId, newInfo) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const node = await appServiceInstance.updateBuildingSubAppInfo(appId, subAppId, newInfo);
            if (node) {
                this.setStatus(constant_1.HTTP_CODES.OK);
                return node.info.get();
            }
            this.setStatus(constant_1.HTTP_CODES.BAD_REQUEST);
            return { message: `Something went wrong, please check your input data.` };
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async deleteAdminApp(req, appId) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const isDeleted = await appServiceInstance.deleteAdminApp(appId);
            const status = isDeleted ? constant_1.HTTP_CODES.OK : constant_1.HTTP_CODES.BAD_REQUEST;
            const message = isDeleted
                ? `${appId} is deleted with success`
                : 'something went wrong, please check your input data';
            this.setStatus(status);
            return { message };
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async deleteBuildingApp(req, appId) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const isDeleted = await appServiceInstance.deleteBuildingApp(appId);
            const status = isDeleted ? constant_1.HTTP_CODES.OK : constant_1.HTTP_CODES.BAD_REQUEST;
            const message = isDeleted
                ? `${appId} is deleted with success`
                : 'something went wrong, please check your input data';
            this.setStatus(status);
            return { message };
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async deleteBuildingSubApp(req, appId, subAppId) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const isDeleted = await appServiceInstance.deleteBuildingSubApp(appId, subAppId);
            const status = isDeleted ? constant_1.HTTP_CODES.OK : constant_1.HTTP_CODES.BAD_REQUEST;
            const message = isDeleted
                ? `${appId} is deleted with success`
                : 'something went wrong, please check your input data';
            this.setStatus(status);
            return { message };
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async uploadAdminApp(req, file) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            if (!file) {
                this.setStatus(constant_1.HTTP_CODES.BAD_REQUEST);
                return { message: 'No file uploaded' };
            }
            // if (file && !(/.*\.json$/.test(file.originalname) || /.*\.xlsx$/.test(file.originalname))) {
            if (file && !/.*\.xlsx$/.test(file.originalname)) {
                this.setStatus(constant_1.HTTP_CODES.BAD_REQUEST);
                return { message: 'The selected file must be a json or excel file' };
            }
            const isExcel = /.*\.xlsx$/.test(file.originalname);
            const apps = await appServiceInstance.uploadApps(services_1.AppsType.admin, file.buffer, isExcel);
            if (apps && apps.length > 0) {
                this.setStatus(constant_1.HTTP_CODES.CREATED);
                return apps.map((node) => node.info.get());
            }
            this.setStatus(constant_1.HTTP_CODES.BAD_REQUEST);
            return {
                message: 'oops, something went wrong, please check your input data',
            };
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async uploadBuildingApp(req, file) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            if (!file) {
                this.setStatus(constant_1.HTTP_CODES.BAD_REQUEST);
                return { message: 'No file uploaded' };
            }
            if (file &&
                !(/.*\.json$/.test(file.originalname) ||
                    /.*\.xlsx$/.test(file.originalname))) {
                this.setStatus(constant_1.HTTP_CODES.BAD_REQUEST);
                return { message: 'The selected file must be a json or excel file' };
            }
            const isExcel = /.*\.xlsx$/.test(file.originalname);
            const apps = await appServiceInstance.uploadApps(services_1.AppsType.building, file.buffer, isExcel);
            if (apps && apps.length > 0) {
                this.setStatus(constant_1.HTTP_CODES.CREATED);
                return apps.map((node) => node.info.get());
            }
            this.setStatus(constant_1.HTTP_CODES.BAD_REQUEST);
            return {
                message: 'oops, something went wrong, please check your input data',
            };
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async uploadBuildingSubApp(req, file) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            if (!file) {
                this.setStatus(constant_1.HTTP_CODES.BAD_REQUEST);
                return { errors: 'No file uploaded' };
            }
            if (file &&
                !(/.*\.json$/.test(file.originalname) ||
                    /.*\.xlsx$/.test(file.originalname))) {
                this.setStatus(constant_1.HTTP_CODES.BAD_REQUEST);
                return { errors: 'The selected file must be a json or excel file' };
            }
            const isExcel = /.*\.xlsx$/.test(file.originalname);
            const apps = await appServiceInstance.uploadSubApps(file.buffer, isExcel);
            if (apps && apps.subApps.length > 0) {
                this.setStatus(constant_1.HTTP_CODES.CREATED);
                const result = {
                    subApps: apps.subApps.map((node) => node.info.get()),
                };
                if (apps.errors && apps.errors.length > 0) {
                    result.errors = apps.errors;
                }
                return result;
            }
            this.setStatus(constant_1.HTTP_CODES.BAD_REQUEST);
            return {
                errors: apps.errors || 'something went wrong, please check your input data',
            };
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { errors: error.message };
        }
    }
    async getFavoriteApps(request) {
        try {
            const tokenInfo = await (0, authentication_1.checkAndGetTokenInfo)(request);
            let userName = tokenInfo.userInfo.userName;
            const nodes = await services_1.UserListService.getInstance().getFavoriteApps(userName);
            const subApps = nodes.filter((node) => node.info.type.get() === constant_1.BUILDING_SUB_APP_TYPE);
            const parents = await Promise.all(subApps.map((node) => node.getParents(constant_1.SUB_APP_RELATION_NAME)));
            const apps = nodes.reduce((acc, node) => {
                if (node.info.type.get() !== constant_1.BUILDING_SUB_APP_TYPE)
                    acc.add(node);
                return acc;
            }, new Set(parents.flat()));
            // const res = nodes.map((node) => node.info.get());
            const res = await services_1.AppService.getInstance().formatAppsAndAddSubApps(Array.from(apps), subApps);
            this.setStatus(constant_1.HTTP_CODES.OK);
            return res;
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async addAppToFavoris(request, data) {
        try {
            const tokenInfo = await (0, authentication_1.checkAndGetTokenInfo)(request);
            let profileId = tokenInfo.profile.profileId || tokenInfo.profile.userProfileBosConfigId;
            let userName = tokenInfo.userInfo.userName;
            await services_1.UserListService.getInstance().addFavoriteApp(userName, profileId, data.appIds);
            const nodes = await services_1.UserListService.getInstance().getFavoriteApps(userName);
            const subApps = nodes.filter((node) => node.info.type.get() === constant_1.BUILDING_SUB_APP_TYPE);
            const parents = await Promise.all(subApps.map((node) => node.getParents(constant_1.SUB_APP_RELATION_NAME)));
            const apps = nodes.reduce((acc, node) => {
                if (node.info.type.get() !== constant_1.BUILDING_SUB_APP_TYPE)
                    acc.add(node);
                return acc;
            }, new Set(parents.flat()));
            // const res = nodes.map((node) => node.info.get());
            const res = await services_1.AppService.getInstance().formatAppsAndAddSubApps(Array.from(apps), subApps);
            this.setStatus(constant_1.HTTP_CODES.OK);
            return res;
            // return nodes.map((node) => node.info.get());
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async removeAppFromFavoris(request, data) {
        try {
            const tokenInfo = await (0, authentication_1.checkAndGetTokenInfo)(request);
            let profileId = tokenInfo.profile.profileId || tokenInfo.profile.userProfileBosConfigId;
            let userName = tokenInfo.userInfo.userName;
            await services_1.UserListService.getInstance().removeFavoriteApp(userName, profileId, data.appIds);
            const nodes = await services_1.UserListService.getInstance().getFavoriteApps(userName);
            const subApps = nodes.filter((node) => node.info.type.get() === constant_1.BUILDING_SUB_APP_TYPE);
            const parents = await Promise.all(subApps.map((node) => node.getParents(constant_1.SUB_APP_RELATION_NAME)));
            const apps = nodes.reduce((acc, node) => {
                if (node.info.type.get() !== constant_1.BUILDING_SUB_APP_TYPE)
                    acc.add(node);
                return acc;
            }, new Set(parents.flat()));
            // const res = nodes.map((node) => node.info.get());
            const res = await services_1.AppService.getInstance().formatAppsAndAddSubApps(Array.from(apps), subApps);
            this.setStatus(constant_1.HTTP_CODES.OK);
            return res;
            // nodes.map((node) => node.info.get());
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
};
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Post)('/create_admin_app'),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AppsController.prototype, "createAdminApp", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Post)('/create_building_app'),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AppsController.prototype, "createBuildingApp", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Post)('/create_building_sub_app/{appId}'),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], AppsController.prototype, "createBuildingSubApp", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Get)('/get_all_admin_apps'),
    __param(0, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppsController.prototype, "getAllAdminApps", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Get)('/get_all_building_apps'),
    __param(0, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppsController.prototype, "getAllBuildingApps", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Get)('/get_admin_app/{appNameOrId}'),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AppsController.prototype, "getAdminApp", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Get)('/get_building_app/{appNaneOrId}'),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AppsController.prototype, "getBuildingApp", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Get)('/get_building_sub_app/{appNameOrId}/{subAppNameOrId}'),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], AppsController.prototype, "getBuildingSubApp", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Put)('/update_admin_app/{appId}'),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], AppsController.prototype, "updateAdminApp", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Put)('/update_building_app/{appId}'),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], AppsController.prototype, "updateBuildingApp", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Put)('/update_building_sub_app/{appId}/{subAppId}'),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Path)()),
    __param(3, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Object]),
    __metadata("design:returntype", Promise)
], AppsController.prototype, "updateBuildingSubApp", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Delete)('/delete_admin_app/{appId}'),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AppsController.prototype, "deleteAdminApp", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Delete)('/delete_building_app/{appId}'),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AppsController.prototype, "deleteBuildingApp", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Delete)('/delete_building_sub_app/{appId}/{subAppId}'),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], AppsController.prototype, "deleteBuildingSubApp", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Post)('/upload_admin_apps'),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AppsController.prototype, "uploadAdminApp", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Post)('/upload_building_apps'),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AppsController.prototype, "uploadBuildingApp", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Post)('/upload_building_sub_apps'),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AppsController.prototype, "uploadBuildingSubApp", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Get)('/get_favorite_apps'),
    __param(0, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppsController.prototype, "getFavoriteApps", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Post)('/add_app_to_favoris'),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AppsController.prototype, "addAppToFavoris", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Post)('/remove_app_from_favoris'),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AppsController.prototype, "removeAppFromFavoris", null);
AppsController = __decorate([
    (0, tsoa_1.Route)('/api/v1'),
    (0, tsoa_1.Tags)('Applications'),
    __metadata("design:paramtypes", [])
], AppsController);
exports.AppsController = AppsController;
exports.default = new AppsController();
//# sourceMappingURL=apps.controller.js.map