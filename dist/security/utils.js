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
exports.getToken = getToken;
exports.profileHasAccessToApi = profileHasAccessToApi;
const appProfile_service_1 = require("../services/appProfile.service");
const apis_service_1 = require("../services/apis.service");
function getToken(request) {
    const header = request.headers.authorization || request.headers.Authorization;
    if (header) {
        const [, token] = header.split(" ");
        if (token)
            return token;
    }
    return request.body?.token || request.query?.token || request.headers["x-access-token"];
}
async function profileHasAccessToApi(profile, apiUrl, method) {
    const api = await apis_service_1.APIService.getInstance().getApiRouteByRoute({ route: apiUrl, method });
    if (!api)
        return;
    return appProfile_service_1.AppProfileService.getInstance().profileHasAccessToApi(profile, api.getId().get());
}
// async function getProfileNode(profileId: string): Promise<SpinalNode> {
//     let profile = await UserProfileService.getInstance().getUserProfile(profileId);
//     if (profile) return profile.node;
//     profile = await AppProfileService.getInstance().getAppProfile(profileId);
//     if (profile) return profile.node;
// }
// export async function checkIfProfileHasAccess(req: Request, profileId: string): Promise<boolean> {
//     // const params = (<any>req).params;
//     // const profile = await getProfileNode(profileId);
//     // if (!profile) return false;
//     // for (const key in params) {
//     //     if (Object.prototype.hasOwnProperty.call(params, key)) {
//     //         const element = params[key];
//     //         if (element === profileId) continue;
//     //         const access = await authorizationInstance.profileHasAccess(profile, element);
//     //         if (!access) return false
//     //     }
//     // }
//     return true;
// }
//# sourceMappingURL=utils.js.map