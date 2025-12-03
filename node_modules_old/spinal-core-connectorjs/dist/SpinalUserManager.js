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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
exports.__esModule = true;
exports.SpinalUserManager = void 0;
var sendXhr_1 = require("./Utils/sendXhr");
var SpinalUserManager = /** @class */ (function () {
    function SpinalUserManager() {
    }
    SpinalUserManager.get_user_id = function (options, username, password, success_callback, error_callback) {
        if (error_callback === void 0) { error_callback = null; }
        return __awaiter(this, void 0, void 0, function () {
            var get_cmd, response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        get_cmd = "/get_user_id?u=".concat(username, "&p=").concat(password);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, (0, sendXhr_1.sendXhr)(options, get_cmd, 'GET')];
                    case 2:
                        response = _a.sent();
                        if (parseInt(response) === -1)
                            throw new Error('command rejected by the server');
                        if (typeof success_callback === 'function') {
                            success_callback(response);
                        }
                        return [2 /*return*/, response];
                    case 3:
                        error_1 = _a.sent();
                        SpinalUserManager._if_error(error_callback, 'get_user_id', error_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SpinalUserManager.get_admin_id = function (options, adminName, password, success_callback, error_callback) {
        if (error_callback === void 0) { error_callback = null; }
        return __awaiter(this, void 0, void 0, function () {
            var get_cmd, response, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        get_cmd = "/get_admin_id?u=".concat(adminName, "&p=").concat(password);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, (0, sendXhr_1.sendXhr)(options, get_cmd, 'GET')];
                    case 2:
                        response = _a.sent();
                        if (parseInt(response) === -1)
                            throw new Error('command rejected by the server');
                        if (typeof success_callback === 'function') {
                            success_callback(response);
                        }
                        return [2 /*return*/, response];
                    case 3:
                        error_2 = _a.sent();
                        SpinalUserManager._if_error(error_callback, 'get_admin_id', error_2);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SpinalUserManager.new_account = function (options, username, password, success_callback, error_callback) {
        if (error_callback === void 0) { error_callback = null; }
        return __awaiter(this, void 0, void 0, function () {
            var get_cmd, response, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        get_cmd = "/get_new_account?e=".concat(username, "&p=").concat(password, "&cp=").concat(password);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, (0, sendXhr_1.sendXhr)(options, get_cmd, 'GET')];
                    case 2:
                        response = _a.sent();
                        if (parseInt(response) === -1)
                            throw new Error('command rejected by the server');
                        if (typeof success_callback === 'function') {
                            success_callback(response);
                        }
                        return [2 /*return*/, response];
                    case 3:
                        error_3 = _a.sent();
                        SpinalUserManager._if_error(error_callback, 'get_new_account', error_3);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SpinalUserManager.change_password = function (options, user_id, password, newPassword, success_callback, error_callback) {
        if (error_callback === void 0) { error_callback = null; }
        return __awaiter(this, void 0, void 0, function () {
            var get_cmd, response, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        get_cmd = "/get_change_user_password?e=".concat(user_id, "&op=").concat(password, "&np=").concat(newPassword, "&cp=").concat(newPassword);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, (0, sendXhr_1.sendXhr)(options, get_cmd, 'GET')];
                    case 2:
                        response = _a.sent();
                        if (parseInt(response) === -1)
                            throw new Error('command rejected by the server');
                        if (typeof success_callback === 'function') {
                            success_callback(response);
                        }
                        return [2 /*return*/, response];
                    case 3:
                        error_4 = _a.sent();
                        SpinalUserManager._if_error(error_callback, 'get_change_user_password', error_4);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SpinalUserManager.delete_account = function (options, userId, password, userNameToDelete, success_callback, error_callback) {
        if (error_callback === void 0) { error_callback = null; }
        return __awaiter(this, void 0, void 0, function () {
            var get_cmd, response, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        get_cmd = "/get_delete_account?e=".concat(userNameToDelete, "&i=").concat(userId, "&p=").concat(password);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, (0, sendXhr_1.sendXhr)(options, get_cmd, 'GET')];
                    case 2:
                        response = _a.sent();
                        if (parseInt(response) === -1)
                            throw new Error('command rejected by the server');
                        if (typeof success_callback === 'function') {
                            success_callback(response);
                        }
                        return [2 /*return*/, response];
                    case 3:
                        error_5 = _a.sent();
                        SpinalUserManager._if_error(error_callback, 'get_delete_account', error_5);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SpinalUserManager.change_password_by_admin = function (options, targetUsername, targetPassword, adminUserId, adminPassword, success_callback, error_callback) {
        if (error_callback === void 0) { error_callback = null; }
        return __awaiter(this, void 0, void 0, function () {
            var get_cmd, response, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        get_cmd = "/get_change_user_password_by_admin?u=".concat(targetUsername, "&np=").concat(targetPassword, "&a=").concat(adminUserId, "&ap=").concat(adminPassword);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, (0, sendXhr_1.sendXhr)(options, get_cmd, 'GET')];
                    case 2:
                        response = _a.sent();
                        if (parseInt(response) === -1)
                            throw new Error('command rejected by the server');
                        if (typeof success_callback === 'function') {
                            success_callback(response);
                        }
                        return [2 /*return*/, response];
                    case 3:
                        error_6 = _a.sent();
                        SpinalUserManager._if_error(error_callback, 'get_change_user_password_by_admin', error_6);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SpinalUserManager.delete_account_by_admin = function (options, targetUsername, adminUserId, adminPassword, success_callback, error_callback) {
        if (error_callback === void 0) { error_callback = null; }
        return __awaiter(this, void 0, void 0, function () {
            var get_cmd, response, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        get_cmd = "/get_delete_account_by_admin?u=".concat(targetUsername, "&a=").concat(adminUserId, "&ap=").concat(adminPassword);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, (0, sendXhr_1.sendXhr)(options, get_cmd, 'GET')];
                    case 2:
                        response = _a.sent();
                        if (parseInt(response) === -1)
                            throw new Error('command rejected by the server');
                        if (typeof success_callback === 'function') {
                            success_callback(response);
                        }
                        return [2 /*return*/, response];
                    case 3:
                        error_7 = _a.sent();
                        SpinalUserManager._if_error(error_callback, 'get_delete_account_by_admin', error_7);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SpinalUserManager.change_account_rights_by_admin = function (options, targetUsername, targetAcountRight, adminUserId, adminPassword, success_callback, error_callback) {
        if (error_callback === void 0) { error_callback = null; }
        return __awaiter(this, void 0, void 0, function () {
            var get_cmd, response, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        get_cmd = "/get_change_account_rights_by_admin?u=".concat(targetUsername, "&ri=").concat(targetAcountRight, "&a=").concat(adminUserId, "&ap=").concat(adminPassword);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, (0, sendXhr_1.sendXhr)(options, get_cmd, 'GET')];
                    case 2:
                        response = _a.sent();
                        if (parseInt(response) === -1)
                            throw new Error('command rejected by the server');
                        if (typeof success_callback === 'function') {
                            success_callback(response);
                        }
                        return [2 /*return*/, response];
                    case 3:
                        error_8 = _a.sent();
                        SpinalUserManager._if_error(error_callback, 'get_change_account_rights_by_admin', error_8);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SpinalUserManager._if_error = function (error_callback, fun, response) {
        if (error_callback !== null) {
            return error_callback(response);
        }
        else {
            return console.log('Error on ' + fun + ' and the error_callback was not set.');
        }
    };
    return SpinalUserManager;
}());
exports.SpinalUserManager = SpinalUserManager;
//# sourceMappingURL=SpinalUserManager.js.map