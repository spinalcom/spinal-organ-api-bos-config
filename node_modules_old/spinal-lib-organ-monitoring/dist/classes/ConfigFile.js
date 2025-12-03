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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configFile = exports.ConfigFile = void 0;
var spinal_core_connectorjs_1 = require("spinal-core-connectorjs");
var path_1 = require("path");
var ConfigFileModel_1 = require("../models/ConfigFileModel");
var ConfigFile = /** @class */ (function () {
    function ConfigFile() {
    }
    ConfigFile.getInstance = function () {
        if (!this.instance)
            this.instance = new ConfigFile();
        return this.instance;
    };
    ConfigFile.prototype.init = function (connect, fileName, type, serverName, port) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (!fileName) {
                    console.log('Monitoring file name was not provided, therefore this program will not be monitored');
                    return [2 /*return*/];
                }
                ;
                return [2 /*return*/, this._loadOrMakeConfigFile(connect, fileName, type, serverName, port).then(function (file) {
                        _this.file = file;
                        _this.file.genericOrganData.bootTimestamp.set(Date.now());
                        _this._scheduleReInit();
                        return file;
                    })];
            });
        });
    };
    ConfigFile.prototype._loadOrMakeConfigFile = function (connect, fileName, type, serverName, port) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            spinal_core_connectorjs_1.spinalCore.load(connect, (0, path_1.resolve)("/etc/Organs/Monitoring/".concat(fileName)), function (file) { return resolve(file); }, function () {
                return connect.load_or_make_dir('/etc/Organs/Monitoring', function (directory) {
                    resolve(_this._createFile(directory, fileName, type, serverName, port));
                });
            });
        });
    };
    ConfigFile.prototype._createFile = function (directory, fileName, type, serverName, port) {
        var file = new ConfigFileModel_1.ConfigFileModel(fileName, type, serverName, port);
        directory.force_add_file(fileName, file, { model_type: 'ConfigFile' });
        return file;
    };
    ConfigFile.prototype._scheduleReInit = function () {
        var _this = this;
        setInterval(function () {
            _this._reInitializeFileConfig();
        }, 60000);
    };
    ConfigFile.prototype._reInitializeFileConfig = function () {
        this.file.updateRamUsage();
        this.file.genericOrganData.lastHealthTime.set(Date.now());
    };
    ConfigFile.prototype.getConfig = function () {
        return this.file.loadConfigModel();
    };
    ConfigFile.prototype.setConfig = function (obj) {
        return this.file.setConfigModel(obj);
    };
    ConfigFile.prototype.bindState = function (callback) {
        var _this = this;
        this.file.specificOrganData.state.bind(function () {
            callback(_this.file.specificOrganData.state.get());
        });
    };
    ConfigFile.prototype.setState = function (state) {
        this.file.specificOrganData.state.set(state);
    };
    ConfigFile.prototype.pushLog = function (message) {
        this.file.genericOrganData.logList.push({
            timeStamp: Date.now(),
            message: message,
        });
    };
    ConfigFile.prototype.pushLastAction = function (message) {
        this.file.specificOrganData.lastAction.date.set(Date.now());
        this.file.specificOrganData.lastAction.message.set(message);
    };
    return ConfigFile;
}());
exports.ConfigFile = ConfigFile;
exports.configFile = ConfigFile.getInstance();
exports.default = exports.configFile;
//# sourceMappingURL=ConfigFile.js.map