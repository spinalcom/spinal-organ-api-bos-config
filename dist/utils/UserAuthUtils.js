"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserInfoByToken = exports._getAuthPlateformInfo = exports._getUserInfo = exports._getUserProfileInfo = exports._deleteUserToken = exports._generateString = exports._comparePassword = exports._hashPassword = exports._addUserToContext = void 0;
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
exports._addUserToContext = _addUserToContext;
function _hashPassword(password, saltRounds = 10) {
    return bcrypt.hashSync(password, saltRounds);
}
exports._hashPassword = _hashPassword;
function _comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
}
exports._comparePassword = _comparePassword;
function _generateString(length = 10) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789*/-_@#&";
    let text = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        text += charset.charAt(Math.floor(Math.random() * n));
    }
    return text;
}
exports._generateString = _generateString;
async function _deleteUserToken(userNode) {
    const tokens = await userNode.getChildren(constant_1.TOKEN_RELATION_NAME);
    const promises = tokens.map((token) => services_1.TokenService.getInstance().deleteToken(token));
    return Promise.all(promises);
}
exports._deleteUserToken = _deleteUserToken;
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
exports._getUserProfileInfo = _getUserProfileInfo;
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
exports._getUserInfo = _getUserInfo;
async function _getAuthPlateformInfo() {
    const adminCredential = await services_1.AuthentificationService.getInstance().getBosToAdminCredential();
    if (!adminCredential)
        throw new Error("No authentication platform is registered");
    return adminCredential;
}
exports._getAuthPlateformInfo = _getAuthPlateformInfo;
function getUserInfoByToken(adminCredential, userToken) {
    const data = { token: userToken };
    return axios_1.default.post(`${adminCredential.urlAdmin}/users/userInfo`, data).then((result) => {
        return result.data;
    }).catch((err) => {
        console.error(err);
    });
}
exports.getUserInfoByToken = getUserInfoByToken;
//# sourceMappingURL=UserAuthUtils.js.map