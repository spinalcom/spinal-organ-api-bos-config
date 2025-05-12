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
exports.DigitaltwinController = void 0;
const services_1 = require("../services");
const constant_1 = require("../constant");
const tsoa_1 = require("tsoa");
const express = require("express");
const authentication_1 = require("../security/authentication");
const AuthError_1 = require("../security/AuthError");
const serviceInstance = services_1.DigitalTwinService.getInstance();
let DigitaltwinController = class DigitaltwinController extends tsoa_1.Controller {
    constructor() {
        super();
    }
    async addDigitalTwin(req, data, set_as_actual_digitaltwin) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            if (!data.name || !data.name.trim()) {
                this.setStatus(constant_1.HTTP_CODES.BAD_REQUEST);
                return { message: "The file name is mandatory" };
            }
            try {
                const node = await serviceInstance.createDigitalTwin(data.name, data.url, set_as_actual_digitaltwin);
                this.setStatus(constant_1.HTTP_CODES.CREATED);
                return node.info.get();
            }
            catch (error) {
                this.setStatus(constant_1.HTTP_CODES.BAD_REQUEST);
                return { message: error.message };
            }
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async getAllDigitalTwins(req) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const digitalTwins = await serviceInstance.getAllDigitalTwins();
            this.setStatus(constant_1.HTTP_CODES.OK);
            return digitalTwins.map(el => el.info.get());
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async getDigitalTwin(req, digitaltwinId) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const digitaltwin = await serviceInstance.getDigitalTwin(digitaltwinId);
            if (digitaltwin) {
                this.setStatus(constant_1.HTTP_CODES.OK);
                return digitaltwin.info.get();
            }
            this.setStatus(constant_1.HTTP_CODES.NOT_FOUND);
            return { message: `No digitalTwin found for ${digitaltwinId}` };
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async setActualDigitalTwin(req, digitaltwinId) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const node = await serviceInstance.setActualDigitalTwin(digitaltwinId);
            if (node) {
                this.setStatus(constant_1.HTTP_CODES.OK);
                return node.info.get();
            }
            this.setStatus(constant_1.HTTP_CODES.NOT_FOUND);
            return { message: `No digitalTwin found for ${digitaltwinId}` };
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async getActualDigitalTwin(req) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const node = await serviceInstance.getActualDigitalTwin();
            if (node) {
                this.setStatus(constant_1.HTTP_CODES.OK);
                return node.info.get();
            }
            this.setStatus(constant_1.HTTP_CODES.NOT_FOUND);
            return { message: `No digitaltwin is set up` };
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async getDefaultDigitalTwinContexts(req) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const contexts = await serviceInstance.getDigitalTwinContexts();
            this.setStatus(constant_1.HTTP_CODES.OK);
            return contexts.map(el => el.info.get());
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async getDigitalTwinContexts(req, digitaltwinId) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const contexts = await serviceInstance.getDigitalTwinContexts(digitaltwinId);
            this.setStatus(constant_1.HTTP_CODES.OK);
            return contexts.map(el => el.info.get());
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async editDigitalTwin(req, digitaltwinId, data) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const node = await serviceInstance.editDigitalTwin(digitaltwinId, data);
            if (node) {
                this.setStatus(constant_1.HTTP_CODES.OK);
                return node.info.get();
            }
            this.setStatus(constant_1.HTTP_CODES.NOT_FOUND);
            return { message: `No digitaltwin found for ${digitaltwinId}` };
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async removeDigitalTwin(req, digitaltwinId) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const deleted = await serviceInstance.removeDigitalTwin(digitaltwinId);
            if (deleted) {
                this.setStatus(constant_1.HTTP_CODES.OK);
                return { message: `digitaltwin deleted with success` };
            }
            this.setStatus(constant_1.HTTP_CODES.BAD_REQUEST);
            return { message: `sommething went wrong, please check digitaltwin id` };
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async removeActualDigitaTwin(req) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const deleted = await serviceInstance.removeActualDigitaTwin();
            if (deleted) {
                this.setStatus(constant_1.HTTP_CODES.OK);
                return { message: `actual digitaltwin deleted with success` };
            }
            this.setStatus(constant_1.HTTP_CODES.BAD_REQUEST);
            return { message: `sommething went wrong, please check if default digitaltwin is set up` };
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
};
exports.DigitaltwinController = DigitaltwinController;
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Post)("/add_digitaltwin"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Body)()),
    __param(2, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Boolean]),
    __metadata("design:returntype", Promise)
], DigitaltwinController.prototype, "addDigitalTwin", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Get)("/get_all_digitaltwins"),
    __param(0, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DigitaltwinController.prototype, "getAllDigitalTwins", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Get)("/get_digitaltwin/{digitaltwinId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DigitaltwinController.prototype, "getDigitalTwin", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Put)("/set_as_actual_digitaltwin/{digitaltwinId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DigitaltwinController.prototype, "setActualDigitalTwin", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Get)("/get_actual_digitaltwin"),
    __param(0, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DigitaltwinController.prototype, "getActualDigitalTwin", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Get)("/get_digitaltwin_contexts"),
    __param(0, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DigitaltwinController.prototype, "getDefaultDigitalTwinContexts", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Get)("/get_digitaltwin_contexts/{digitaltwinId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DigitaltwinController.prototype, "getDigitalTwinContexts", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Put)("/update_digitaltwin/{digitaltwinId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], DigitaltwinController.prototype, "editDigitalTwin", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Delete)("/delete_digitaltwin/{digitaltwinId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DigitaltwinController.prototype, "removeDigitalTwin", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Delete)("/delete_actual_digitaltwin"),
    __param(0, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DigitaltwinController.prototype, "removeActualDigitaTwin", null);
exports.DigitaltwinController = DigitaltwinController = __decorate([
    (0, tsoa_1.Route)("/api/v1"),
    (0, tsoa_1.Tags)("DigitalTwin"),
    __metadata("design:paramtypes", [])
], DigitaltwinController);
exports.default = new DigitaltwinController();
//# sourceMappingURL=digitalTwin.controller.js.map