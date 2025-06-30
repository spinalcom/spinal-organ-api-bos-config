"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateApplication = authenticateApplication;
exports._getProfileInfo = _getProfileInfo;
exports._addUserToContext = _addUserToContext;
const axios_1 = require("axios");
const constant_1 = require("../constant");
const services_1 = require("../services");
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
function authenticateApplication(urlAdmin, idPlateform, application, context) {
    const url = `${urlAdmin}/applications/login`;
    return axios_1.default.post(url, application)
        .then(async (result) => {
        const data = result.data;
        data.profile = await _getProfileInfo(data.token, urlAdmin, idPlateform);
        data.userInfo = await _getApplicationInfo(data.applicationId, urlAdmin, data.token);
        const type = constant_1.USER_TYPES.APP;
        const info = { clientId: application.clientId, type, userType: type };
        const node = await _addUserToContext(context, info);
        await services_1.TokenService.getInstance().addUserToken(node, data.token, data);
        return {
            code: constant_1.HTTP_CODES.OK,
            data,
        };
    })
        .catch((err) => {
        return {
            code: constant_1.HTTP_CODES.UNAUTHORIZED,
            data: "bad credential",
        };
    });
}
function _getProfileInfo(userToken, urlAdmin, idPlateform) {
    let endpoint = "/tokens/getAppProfileByToken";
    return axios_1.default
        .post(urlAdmin + endpoint, {
        platformId: idPlateform,
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
function _getApplicationInfo(applicationId, adminUrl, userToken) {
    const config = {
        headers: {
            "Content-Type": "application/json",
            // "x-access-token": adminCredential.tokenBosAdmin
            "x-access-token": userToken,
        },
    };
    return axios_1.default.get(`${adminUrl}/applications/${applicationId}`, config)
        .then((result) => {
        return result.data;
    })
        .catch((err) => {
        console.error(err);
    });
}
async function _addUserToContext(context, info, element) {
    const users = await context.getChildrenInContext();
    const found = users.find((el) => el.info.clientId?.get() === info.clientId);
    if (found)
        return found;
    const nodeId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode(info, element);
    const node = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(nodeId);
    return context.addChildInContext(node, constant_1.CONTEXT_TO_APP_RELATION_NAME, constant_1.PTR_LST_TYPE, context);
}
//# sourceMappingURL=ApplicationAuthUtils.js.map