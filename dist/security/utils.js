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
exports.profileHasAccessToApi = void 0;
const appProfile_service_1 = require("../services/appProfile.service");
const apis_service_1 = require("../services/apis.service");
function profileHasAccessToApi(profile, apiUrl, method) {
    return __awaiter(this, void 0, void 0, function* () {
        const api = yield apis_service_1.APIService.getInstance().getApiRouteByRoute({ route: apiUrl, method });
        if (!api)
            return false;
        return appProfile_service_1.AppProfileService.getInstance().profileHasAccessToApi(profile, api.getId().get());
    });
}
exports.profileHasAccessToApi = profileHasAccessToApi;
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