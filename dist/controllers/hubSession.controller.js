"use strict";
/*
 * Copyright 2023 SpinalCom - www.spinalcom.com
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
exports.HubSessionController = void 0;
const tsoa_1 = require("tsoa");
const express = require("express");
const constant_1 = require("../constant");
const authentication_1 = require("../security/authentication");
const SpinalAPIMiddleware_1 = require("../middlewares/SpinalAPIMiddleware");
const hubSession_service_1 = require("../services/hubSession.service");
const AuthError_1 = require("../security/AuthError");
let HubSessionController = class HubSessionController extends tsoa_1.Controller {
    constructor() {
        super();
    }
    createSession(req) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tokenInfo = yield (0, authentication_1.checkAndGetTokenInfo)(req);
                let profileId = ((_a = tokenInfo.profile) === null || _a === void 0 ? void 0 : _a.profileId) || ((_b = tokenInfo.profile) === null || _b === void 0 ? void 0 : _b.userProfileBosConfigId) || ((_c = tokenInfo.profile) === null || _c === void 0 ? void 0 : _c.appProfileBosConfigId);
                if (!profileId)
                    throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.NO_PROFILE_FOUND);
                const username = (_d = tokenInfo.userInfo) === null || _d === void 0 ? void 0 : _d.name;
                const graph = yield SpinalAPIMiddleware_1.default.getInstance().getProfileGraph(profileId);
                const sessionNumber = yield hubSession_service_1.HubSessionService.getInstance().createSession();
                if (sessionNumber && graph) {
                    this.setStatus(constant_1.HTTP_CODES.OK);
                    return { sessionNumber: parseInt(sessionNumber), graphServerId: graph._server_id, username };
                }
                throw { code: constant_1.HTTP_CODES.BAD_REQUEST, message: `Failed to create session` };
            }
            catch (error) {
                this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
};
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Get)("/createSession"),
    __param(0, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HubSessionController.prototype, "createSession", null);
HubSessionController = __decorate([
    (0, tsoa_1.Route)("/api/v1"),
    (0, tsoa_1.Tags)("Hub session"),
    __metadata("design:paramtypes", [])
], HubSessionController);
exports.HubSessionController = HubSessionController;
//# sourceMappingURL=hubSession.controller.js.map