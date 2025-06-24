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
exports.AppProfileController = void 0;
const constant_1 = require("../constant");
const services_1 = require("../services");
const tsoa_1 = require("tsoa");
const profileUtils_1 = require("../utils/profileUtils");
const express = require("express");
const authentication_1 = require("../security/authentication");
const AuthError_1 = require("../security/AuthError");
const adminProfile_service_1 = require("../services/adminProfile.service");
const serviceInstance = services_1.AppProfileService.getInstance();
let AppProfileController = class AppProfileController extends tsoa_1.Controller {
    constructor() {
        super();
    }
    async createAppProfile(req, data) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            if (!data.name) {
                this.setStatus(constant_1.HTTP_CODES.BAD_REQUEST);
                return { message: 'The profile name is required' };
            }
            const profile = await serviceInstance.createAppProfile(data);
            this.setStatus(constant_1.HTTP_CODES.CREATED);
            return await (0, profileUtils_1._formatProfile)(profile);
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async getAppProfile(req, id) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const data = await serviceInstance.getAppProfile(id);
            if (data) {
                this.setStatus(constant_1.HTTP_CODES.OK);
                return await (0, profileUtils_1._formatProfile)(data);
            }
            this.setStatus(constant_1.HTTP_CODES.NOT_FOUND);
            return { message: `no profile found for ${id}` };
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async getAllAppProfile(req) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const nodes = (await serviceInstance.getAllAppProfile()) || [];
            this.setStatus(constant_1.HTTP_CODES.OK);
            return await Promise.all(nodes.map((el) => (0, profileUtils_1._formatProfile)(el)));
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async updateAppProfile(req, id, data) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const node = await serviceInstance.updateAppProfile(id, data);
            if (node) {
                this.setStatus(constant_1.HTTP_CODES.OK);
                return await (0, profileUtils_1._formatProfile)(node);
            }
            this.setStatus(constant_1.HTTP_CODES.NOT_FOUND);
            return { message: `no profile found for ${id}` };
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async deleteAppProfile(req, id) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            await serviceInstance.deleteAppProfile(id);
            this.setStatus(constant_1.HTTP_CODES.OK);
            return { message: 'user profile deleted' };
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    //////////////////////////////////////////////////////////////////////////
    async authorizeProfileToAccessContext(req, profileId, data) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const contexts = await serviceInstance.authorizeProfileToAccessContext(profileId, data.contextIds, data.digitalTwinId);
            if (contexts) {
                this.setStatus(constant_1.HTTP_CODES.OK);
                return (0, profileUtils_1._getNodeListInfo)(contexts);
            }
            this.setStatus(constant_1.HTTP_CODES.BAD_REQUEST);
            return { message: 'something went wrong please check your input' };
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async authorizeProfileToAccessApis(req, profileId, data) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const apis = await serviceInstance.authorizeProfileToAccessApis(profileId, data.apiIds);
            if (apis) {
                this.setStatus(constant_1.HTTP_CODES.OK);
                return (0, profileUtils_1._getNodeListInfo)(apis);
            }
            this.setStatus(constant_1.HTTP_CODES.BAD_REQUEST);
            return { message: 'something went wrong please check your input' };
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async unauthorizeProfileToAccessContext(req, profileId, data) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const contexts = await serviceInstance.unauthorizeProfileToAccessContext(profileId, data.contextIds, data.digitalTwinId);
            if (contexts) {
                this.setStatus(constant_1.HTTP_CODES.OK);
                return (0, profileUtils_1._getNodeListInfo)(contexts);
            }
            this.setStatus(constant_1.HTTP_CODES.BAD_REQUEST);
            return { message: 'something went wrong please check your input' };
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async unauthorizeProfileToAccessApis(req, profileId, data) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const apis = await serviceInstance.unauthorizeProfileToAccessApis(profileId, data.apiIds);
            if (apis) {
                this.setStatus(constant_1.HTTP_CODES.OK);
                return (0, profileUtils_1._getNodeListInfo)(apis);
            }
            this.setStatus(constant_1.HTTP_CODES.BAD_REQUEST);
            return { message: 'something went wrong please check your input' };
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async profileHasAccessToContext(req, profileId, contextId, digitalTwinId) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const hasAccess = await serviceInstance.profileHasAccessToContext(profileId, contextId, digitalTwinId);
            this.setStatus(constant_1.HTTP_CODES.OK);
            return hasAccess ? true : false;
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async profileHasAccessToApi(req, profileId, apiId) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const hasAccess = await serviceInstance.profileHasAccessToApi(profileId, apiId);
            this.setStatus(constant_1.HTTP_CODES.OK);
            return hasAccess ? true : false;
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async getAuthorizedContexts(req, profileId, digitalTwinId) {
        try {
            const id = await (0, authentication_1.getProfileId)(req);
            const isAdmin = adminProfile_service_1.AdminProfileService.getInstance().adminNode.getId().get() === id;
            if (!isAdmin && profileId !== id)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const contexts = await serviceInstance.getAuthorizedContexts(profileId, digitalTwinId);
            this.setStatus(constant_1.HTTP_CODES.OK);
            return (0, profileUtils_1._getNodeListInfo)(contexts);
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async getAuthorizedApis(req, profileId) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const contexts = await serviceInstance.getAuthorizedApis(profileId);
            this.setStatus(constant_1.HTTP_CODES.OK);
            return (0, profileUtils_1._getNodeListInfo)(contexts);
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
};
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Post)('/create_profile'),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AppProfileController.prototype, "createAppProfile", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Get)('/get_profile/{id}'),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AppProfileController.prototype, "getAppProfile", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Get)('/get_all_profile'),
    __param(0, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppProfileController.prototype, "getAllAppProfile", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Put)('/edit_profile/{id}'),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], AppProfileController.prototype, "updateAppProfile", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Delete)('/delete_profile/{id}'),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AppProfileController.prototype, "deleteAppProfile", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Post)('/authorize_profile_to_access_contexts/{profileId}'),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], AppProfileController.prototype, "authorizeProfileToAccessContext", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Post)('/authorize_profile_to_access_apis/{profileId}'),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], AppProfileController.prototype, "authorizeProfileToAccessApis", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Post)('/unauthorize_profile_to_access_contexts/{profileId}'),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], AppProfileController.prototype, "unauthorizeProfileToAccessContext", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Post)('/unauthorize_profile_to_access_apis/{profileId}'),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], AppProfileController.prototype, "unauthorizeProfileToAccessApis", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Get)('/profile_has_access_to_context/{profileId}/{contextId}'),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Path)()),
    __param(3, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], AppProfileController.prototype, "profileHasAccessToContext", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Get)('/profile_has_access_to_api/{profileId}/{apiId}'),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], AppProfileController.prototype, "profileHasAccessToApi", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Get)('/get_authorized_contexts/{profileId}'),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], AppProfileController.prototype, "getAuthorizedContexts", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Get)('/get_authorized_apis/{profileId}'),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AppProfileController.prototype, "getAuthorizedApis", null);
AppProfileController = __decorate([
    (0, tsoa_1.Route)('/api/v1/app_profile'),
    (0, tsoa_1.Tags)('App Profiles'),
    __metadata("design:paramtypes", [])
], AppProfileController);
exports.AppProfileController = AppProfileController;
exports.default = new AppProfileController();
//# sourceMappingURL=appProfile.controller.js.map