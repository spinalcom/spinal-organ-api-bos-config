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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
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
    // @Security(SECURITY_NAME.admin)
    addDigitalTwin(req, data, set_as_actual_digitaltwin) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isAdmin = yield (0, authentication_1.checkIfItIsAdmin)(req);
                if (!isAdmin)
                    throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
                if (!data.name || !data.name.trim()) {
                    this.setStatus(constant_1.HTTP_CODES.BAD_REQUEST);
                    return { message: "The file name is mandatory" };
                }
                try {
                    const node = yield serviceInstance.createDigitalTwin(data.name, data.url, set_as_actual_digitaltwin);
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
        });
    }
    // @Security(SECURITY_NAME.admin)
    getAllDigitalTwins(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isAdmin = yield (0, authentication_1.checkIfItIsAdmin)(req);
                if (!isAdmin)
                    throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
                const digitalTwins = yield serviceInstance.getAllDigitalTwins();
                this.setStatus(constant_1.HTTP_CODES.OK);
                return digitalTwins.map(el => el.info.get());
            }
            catch (error) {
                this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    // @Security(SECURITY_NAME.admin)
    getDigitalTwin(req, digitaltwinId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isAdmin = yield (0, authentication_1.checkIfItIsAdmin)(req);
                if (!isAdmin)
                    throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
                const digitaltwin = yield serviceInstance.getDigitalTwin(digitaltwinId);
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
        });
    }
    // @Security(SECURITY_NAME.admin)
    setActualDigitalTwin(req, digitaltwinId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isAdmin = yield (0, authentication_1.checkIfItIsAdmin)(req);
                if (!isAdmin)
                    throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
                const node = yield serviceInstance.setActualDigitalTwin(digitaltwinId);
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
        });
    }
    // @Security(SECURITY_NAME.admin)
    getActualDigitalTwin(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isAdmin = yield (0, authentication_1.checkIfItIsAdmin)(req);
                if (!isAdmin)
                    throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
                const node = yield serviceInstance.getActualDigitalTwin();
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
        });
    }
    // @Security(SECURITY_NAME.admin)
    getDefaultDigitalTwinContexts(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isAdmin = yield (0, authentication_1.checkIfItIsAdmin)(req);
                if (!isAdmin)
                    throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
                const contexts = yield serviceInstance.getDigitalTwinContexts();
                this.setStatus(constant_1.HTTP_CODES.OK);
                return contexts.map(el => el.info.get());
            }
            catch (error) {
                this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    // @Security(SECURITY_NAME.admin)
    getDigitalTwinContexts(req, digitaltwinId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isAdmin = yield (0, authentication_1.checkIfItIsAdmin)(req);
                if (!isAdmin)
                    throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
                const contexts = yield serviceInstance.getDigitalTwinContexts(digitaltwinId);
                this.setStatus(constant_1.HTTP_CODES.OK);
                return contexts.map(el => el.info.get());
            }
            catch (error) {
                this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    // @Security(SECURITY_NAME.admin)
    editDigitalTwin(req, digitaltwinId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isAdmin = yield (0, authentication_1.checkIfItIsAdmin)(req);
                if (!isAdmin)
                    throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
                const node = yield serviceInstance.editDigitalTwin(digitaltwinId, data);
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
        });
    }
    // @Security(SECURITY_NAME.admin)
    removeDigitalTwin(req, digitaltwinId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isAdmin = yield (0, authentication_1.checkIfItIsAdmin)(req);
                if (!isAdmin)
                    throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
                const deleted = yield serviceInstance.removeDigitalTwin(digitaltwinId);
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
        });
    }
    // @Security(SECURITY_NAME.admin)
    removeActualDigitaTwin(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isAdmin = yield (0, authentication_1.checkIfItIsAdmin)(req);
                if (!isAdmin)
                    throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
                const deleted = yield serviceInstance.removeActualDigitaTwin();
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
        });
    }
};
__decorate([
    (0, tsoa_1.Post)("/add_digitaltwin"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Body)()),
    __param(2, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Boolean]),
    __metadata("design:returntype", Promise)
], DigitaltwinController.prototype, "addDigitalTwin", null);
__decorate([
    (0, tsoa_1.Get)("/get_all_digitaltwins"),
    __param(0, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DigitaltwinController.prototype, "getAllDigitalTwins", null);
__decorate([
    (0, tsoa_1.Get)("/get_digitaltwin/{digitaltwinId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DigitaltwinController.prototype, "getDigitalTwin", null);
__decorate([
    (0, tsoa_1.Put)("/set_as_actual_digitaltwin/{digitaltwinId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DigitaltwinController.prototype, "setActualDigitalTwin", null);
__decorate([
    (0, tsoa_1.Get)("/get_actual_digitaltwin"),
    __param(0, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DigitaltwinController.prototype, "getActualDigitalTwin", null);
__decorate([
    (0, tsoa_1.Get)("/get_digitaltwin_contexts"),
    __param(0, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DigitaltwinController.prototype, "getDefaultDigitalTwinContexts", null);
__decorate([
    (0, tsoa_1.Get)("/get_digitaltwin_contexts/{digitaltwinId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DigitaltwinController.prototype, "getDigitalTwinContexts", null);
__decorate([
    (0, tsoa_1.Put)("/update_digitaltwin/{digitaltwinId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], DigitaltwinController.prototype, "editDigitalTwin", null);
__decorate([
    (0, tsoa_1.Delete)("/delete_digitaltwin/{digitaltwinId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DigitaltwinController.prototype, "removeDigitalTwin", null);
__decorate([
    (0, tsoa_1.Delete)("/delete_actual_digitaltwin"),
    __param(0, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DigitaltwinController.prototype, "removeActualDigitaTwin", null);
DigitaltwinController = __decorate([
    (0, tsoa_1.Route)("/api/v1"),
    (0, tsoa_1.Tags)("DigitalTwin"),
    __metadata("design:paramtypes", [])
], DigitaltwinController);
exports.DigitaltwinController = DigitaltwinController;
exports.default = new DigitaltwinController();
//# sourceMappingURL=digitalTwin.controller.js.map