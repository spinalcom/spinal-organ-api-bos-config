"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._addUserToContext = _addUserToContext;
exports._hashPassword = _hashPassword;
exports._comparePassword = _comparePassword;
exports._generateString = _generateString;
exports._deleteUserToken = _deleteUserToken;
exports._getUserProfileInfo = _getUserProfileInfo;
exports._getUserInfo = _getUserInfo;
exports._getAuthPlateformInfo = _getAuthPlateformInfo;
exports.getUserInfoByToken = getUserInfoByToken;
const axios_1 = require("axios");
const services_1 = require("../services");
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const constant_1 = require("../constant");
const bcrypt = require("bcrypt");
async function _addUserToContext(context, info, element, isAdmin = false) {
    const users = await context.getChildrenInContext();
    const found = users.find((el) => el.info.userName?.get() === info.userName);
    if (found)
        return found;
    const nodeId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode(info, element);
    const node = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(nodeId);
    const relationName = isAdmin ? constant_1.CONTEXT_TO_ADMIN_USER_RELATION : constant_1.CONTEXT_TO_USER_RELATION_NAME;
    return context.addChildInContext(node, relationName, constant_1.PTR_LST_TYPE, context);
}
function _hashPassword(password, saltRounds = 10) {
    return bcrypt.hashSync(password, saltRounds);
}
function _comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
}
function _generateString(length = 10) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789*/-_@#&";
    let text = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        text += charset.charAt(Math.floor(Math.random() * n));
    }
    return text;
}
async function _deleteUserToken(userNode) {
    const tokens = await userNode.getChildren(constant_1.TOKEN_RELATION_NAME);
    const promises = tokens.map((token) => services_1.TokenService.getInstance().deleteToken(token));
    return Promise.all(promises);
}
function _getUserProfileInfo(userToken, adminCredential, isUser = true) {
    let urlAdmin = adminCredential.urlAdmin;
    let endpoint = "/tokens/getUserProfileByToken";
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
function _getUserInfo(userId, adminCredential, userToken) {
    const config = {
        headers: {
            "Content-Type": "application/json",
            "x-access-token": userToken,
        }
    };
    return axios_1.default.get(`${adminCredential.urlAdmin}/users/${userId}`, config)
        .then((result) => {
        return result.data;
    })
        .catch((err) => {
        console.error(err);
    });
}
async function _getAuthPlateformInfo() {
    const adminCredential = await services_1.AuthentificationService.getInstance().getBosToAdminCredential();
    if (!adminCredential)
        throw new Error("No authentication platform is registered");
    return adminCredential;
}
function getUserInfoByToken(adminCredential, userToken) {
    const data = { token: userToken };
    return axios_1.default.post(`${adminCredential.urlAdmin}/users/userInfo`, data).then((result) => {
        return result.data;
    }).catch((err) => {
        console.error(err);
    });
}
//# sourceMappingURL=UserAuthUtils.js.map