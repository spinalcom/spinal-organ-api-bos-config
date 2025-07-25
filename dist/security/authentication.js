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
exports.expressAuthentication = expressAuthentication;
exports.checkIfItIsAdmin = checkIfItIsAdmin;
exports.getProfileId = getProfileId;
exports.checkAndGetTokenInfo = checkAndGetTokenInfo;
exports.checkBeforeRedirectToApi = checkBeforeRedirectToApi;
const constant_1 = require("../constant");
const services_1 = require("../services");
const utils_1 = require("./utils");
const AuthError_1 = require("./AuthError");
const adminProfile_service_1 = require("../services/adminProfile.service");
async function expressAuthentication(request, securityName, scopes) {
    if (securityName === constant_1.SECURITY_NAME.all)
        return;
    const token = (0, utils_1.getToken)(request);
    if (!token)
        throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.INVALID_TOKEN);
    return token;
}
async function checkIfItIsAdmin(request) {
    let profileId = await getProfileId(request);
    return adminProfile_service_1.AdminProfileService.getInstance().adminNode.getId().get() === profileId;
}
async function getProfileId(request) {
    const tokenInfo = await checkAndGetTokenInfo(request);
    let profileId = tokenInfo.profile?.profileId || tokenInfo.profile?.userProfileBosConfigId || tokenInfo.profile?.appProfileBosConfigId;
    if (!profileId)
        throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.NO_PROFILE_FOUND);
    return profileId;
}
async function checkAndGetTokenInfo(request) {
    // check token validity
    const token = await expressAuthentication(request);
    const tokenInstance = services_1.TokenService.getInstance();
    const tokenInfo = await tokenInstance.tokenIsValid(token);
    if (!tokenInfo)
        throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.INVALID_TOKEN);
    return tokenInfo;
}
async function checkBeforeRedirectToApi(request, securityName, scopes) {
    const tokenInfo = await checkAndGetTokenInfo(request);
    // get profile Node
    let profileId = tokenInfo.profile.profileId || tokenInfo.profile.userProfileBosConfigId || tokenInfo.profile.appProfileBosConfigId;
    if (!profileId)
        throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.NO_PROFILE_FOUND);
    let profileNode = await services_1.AppProfileService.getInstance()._getAppProfileNode(profileId) || await services_1.UserProfileService.getInstance()._getUserProfileNode(profileId);
    if (!profileNode)
        throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.NO_PROFILE_FOUND);
    // Check if profile has access to api route
    if (profileNode.info.type.get() === constant_1.APP_PROFILE_TYPE) {
        const apiUrl = request.url;
        const method = request.method;
        const isAuthorized = await (0, utils_1.profileHasAccessToApi)(profileNode, apiUrl, method);
        if (!isAuthorized)
            throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
    }
    request.profileId = profileId;
    return tokenInfo;
}
//# sourceMappingURL=authentication.js.map