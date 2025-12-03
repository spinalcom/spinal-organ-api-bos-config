"use strict";
/*
 * Copyright 2023 SpinalCom - www.spinalcom.com
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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigFileModel = void 0;
var spinal_core_connectorjs_1 = require("spinal-core-connectorjs");
var generate_password_1 = __importDefault(require("generate-password"));
var getmac_1 = __importDefault(require("getmac"));
var ip = require('ip');
var ConfigFileModel = /** @class */ (function (_super) {
    __extends(ConfigFileModel, _super);
    function ConfigFileModel(name, type, serverName, port) {
        var _this = _super.call(this) || this;
        if (spinal_core_connectorjs_1.FileSystem._sig_server === false)
            return _this;
        _this.add_attr({
            genericOrganData: {
                id: generate_password_1.default.generate({ length: 20, numbers: true }),
                name: name,
                type: type,
                bootTimestamp: Date.now(),
                lastHealthTime: Date.now(),
                macAdress: (0, getmac_1.default)(),
                ramRssUsed: '',
                serverName: serverName,
                version: '',
                logList: [],
            },
            specificOrganData: {
                port: port,
                lastAction: {
                    message: 'connected',
                    date: Date.now(),
                },
            },
        });
        _this.updateRamUsage();
        return _this;
    }
    ConfigFileModel.prototype.addToConfigFileModel = function () {
        var fileLst = new spinal_core_connectorjs_1.Lst();
        this.data.add_attr(fileLst);
        return fileLst;
    };
    ConfigFileModel.prototype.updateIPandMacAdress = function () {
        console.log((0, getmac_1.default)());
    };
    ConfigFileModel.prototype.updateRamUsage = function () {
        var _a, _b;
        var used = process.memoryUsage();
        var value = "".concat(Math.round((used.rss / 1024 / 1024) * 100) / 100, " MB");
        (_b = (_a = this.genericOrganData) === null || _a === void 0 ? void 0 : _a.ramRssUsed) === null || _b === void 0 ? void 0 : _b.set(value);
    };
    ConfigFileModel.prototype.loadConfigModel = function () {
        if (typeof this.specificOrganConfig === 'undefined') {
            return undefined;
        }
        else {
            return this.specificOrganConfig.load();
        }
    };
    ConfigFileModel.prototype.setConfigModel = function (model) {
        this.add_attr('specificOrganConfig', new spinal_core_connectorjs_1.Ptr(model));
    };
    return ConfigFileModel;
}(spinal_core_connectorjs_1.Model));
exports.ConfigFileModel = ConfigFileModel;
spinal_core_connectorjs_1.spinalCore.register_models(ConfigFileModel, 'ConfigFileModel');
//# sourceMappingURL=ConfigFileModel.js.map