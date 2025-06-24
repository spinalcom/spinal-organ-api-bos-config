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
exports._getNodeListInfo = exports._formatAuthRes = exports._formatProfile = void 0;
const services_1 = require("../services");
async function _formatProfile(data) {
    return {
        ...data.node.info.get(),
        ...(await _formatAuthRes(data)),
    };
}
exports._formatProfile = _formatProfile;
async function _formatAuthRes(data) {
    return {
        apps: await services_1.AppService.getInstance().formatAppsAndAddSubApps(data.apps, data.subApps),
        apis: _getNodeListInfo(data.apis),
        contexts: _getNodeListInfo(data.contexts),
        ...(data.adminApps && { adminApps: _getNodeListInfo(data.adminApps) }),
    };
}
exports._formatAuthRes = _formatAuthRes;
function _getNodeListInfo(nodes = []) {
    return nodes.map((el) => el.info.get());
}
exports._getNodeListInfo = _getNodeListInfo;
//# sourceMappingURL=profileUtils.js.map