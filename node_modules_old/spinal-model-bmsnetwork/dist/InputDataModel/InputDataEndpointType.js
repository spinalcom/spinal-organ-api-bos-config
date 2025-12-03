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
exports.InputDataEndpointType = void 0;
/**
 * @enum {number}
 */
var InputDataEndpointType;
(function (InputDataEndpointType) {
    InputDataEndpointType[InputDataEndpointType["Temperature"] = 0] = "Temperature";
    InputDataEndpointType[InputDataEndpointType["Hygrometry"] = 1] = "Hygrometry";
    InputDataEndpointType[InputDataEndpointType["Power"] = 2] = "Power";
    InputDataEndpointType[InputDataEndpointType["Occupation"] = 3] = "Occupation";
    InputDataEndpointType[InputDataEndpointType["Light"] = 4] = "Light";
    InputDataEndpointType[InputDataEndpointType["Alarm"] = 5] = "Alarm";
    InputDataEndpointType[InputDataEndpointType["Other"] = 6] = "Other";
    InputDataEndpointType[InputDataEndpointType["Consigne"] = 7] = "Consigne";
    InputDataEndpointType[InputDataEndpointType["co2"] = 8] = "co2";
})(InputDataEndpointType || (exports.InputDataEndpointType = InputDataEndpointType = {}));
//# sourceMappingURL=InputDataEndpointType.js.map