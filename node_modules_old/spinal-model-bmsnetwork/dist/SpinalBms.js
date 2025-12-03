"use strict";
/*
 * Copyright 2018 SpinalCom - www.spinalcom.com
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
exports.SpinalBmsEndpointGroup = exports.SpinalBmsEndpoint = exports.SpinalBmsNetwork = exports.SpinalBmsDevice = void 0;
const SpinalBmsDevice_1 = require("./bms-network/SpinalBmsDevice");
Object.defineProperty(exports, "SpinalBmsDevice", { enumerable: true, get: function () { return SpinalBmsDevice_1.SpinalBmsDevice; } });
const SpinalBmsNetwork_1 = require("./bms-network/SpinalBmsNetwork");
Object.defineProperty(exports, "SpinalBmsNetwork", { enumerable: true, get: function () { return SpinalBmsNetwork_1.SpinalBmsNetwork; } });
const SpinalBmsEndpoint_1 = require("./bms-network/SpinalBmsEndpoint");
Object.defineProperty(exports, "SpinalBmsEndpoint", { enumerable: true, get: function () { return SpinalBmsEndpoint_1.SpinalBmsEndpoint; } });
const SpinalBmsEndpointGroup_1 = require("./bms-network/SpinalBmsEndpointGroup");
Object.defineProperty(exports, "SpinalBmsEndpointGroup", { enumerable: true, get: function () { return SpinalBmsEndpointGroup_1.SpinalBmsEndpointGroup; } });
const obj = {
    SpinalBmsDevice: SpinalBmsDevice_1.SpinalBmsDevice,
    SpinalBmsNetwork: SpinalBmsNetwork_1.SpinalBmsNetwork,
    SpinalBmsEndpoint: SpinalBmsEndpoint_1.SpinalBmsEndpoint,
    SpinalBmsEndpointGroup: SpinalBmsEndpointGroup_1.SpinalBmsEndpointGroup,
};
exports.default = obj;
//# sourceMappingURL=SpinalBms.js.map