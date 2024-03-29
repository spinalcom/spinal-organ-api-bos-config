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
exports.checkBeforeRedirectToApi = exports.checkAndGetTokenInfo = exports.getProfileId = exports.checkIfItIsAdmin = exports.expressAuthentication = void 0;
const constant_1 = require("../constant");
const services_1 = require("../services");
const utils_1 = require("./utils");
const AuthError_1 = require("./AuthError");
const adminProfile_service_1 = require("../services/adminProfile.service");
function expressAuthentication(request, securityName, scopes) {
    return __awaiter(this, void 0, void 0, function* () {
        if (securityName === constant_1.SECURITY_NAME.all)
            return;
        const token = (0, utils_1.getToken)(request);
        if (!token)
            throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.INVALID_TOKEN);
        return token;
    });
}
exports.expressAuthentication = expressAuthentication;
function checkIfItIsAdmin(request) {
    return __awaiter(this, void 0, void 0, function* () {
        let profileId = yield getProfileId(request);
        return adminProfile_service_1.AdminProfileService.getInstance().adminNode.getId().get() === profileId;
    });
}
exports.checkIfItIsAdmin = checkIfItIsAdmin;
function getProfileId(request) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        const tokenInfo = yield checkAndGetTokenInfo(request);
        let profileId = ((_a = tokenInfo.profile) === null || _a === void 0 ? void 0 : _a.profileId) || ((_b = tokenInfo.profile) === null || _b === void 0 ? void 0 : _b.userProfileBosConfigId) || ((_c = tokenInfo.profile) === null || _c === void 0 ? void 0 : _c.appProfileBosConfigId);
        if (!profileId)
            throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.NO_PROFILE_FOUND);
        return profileId;
    });
}
exports.getProfileId = getProfileId;
function checkAndGetTokenInfo(request) {
    return __awaiter(this, void 0, void 0, function* () {
        // check token validity
        const token = yield expressAuthentication(request);
        const tokenInstance = services_1.TokenService.getInstance();
        const tokenInfo = yield tokenInstance.tokenIsValid(token);
        if (!tokenInfo)
            throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.INVALID_TOKEN);
        return tokenInfo;
    });
}
exports.checkAndGetTokenInfo = checkAndGetTokenInfo;
function checkBeforeRedirectToApi(request, securityName, scopes) {
    return __awaiter(this, void 0, void 0, function* () {
        const tokenInfo = yield checkAndGetTokenInfo(request);
        // get profile Node
        let profileId = tokenInfo.profile.profileId || tokenInfo.profile.userProfileBosConfigId || tokenInfo.profile.appProfileBosConfigId;
        if (!profileId)
            throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.NO_PROFILE_FOUND);
        let profileNode = (yield services_1.AppProfileService.getInstance()._getAppProfileNode(profileId)) || (yield services_1.UserProfileService.getInstance()._getUserProfileNode(profileId));
        if (!profileNode)
            throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.NO_PROFILE_FOUND);
        // Check if profile has access to api route
        if (profileNode.info.type.get() === constant_1.APP_PROFILE_TYPE) {
            const apiUrl = request.url;
            const method = request.method;
            const isAuthorized = yield (0, utils_1.profileHasAccessToApi)(profileNode, apiUrl, method);
            if (!isAuthorized)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
        }
        request.profileId = profileId;
        return tokenInfo;
    });
}
exports.checkBeforeRedirectToApi = checkBeforeRedirectToApi;
//# sourceMappingURL=authentication.js.map