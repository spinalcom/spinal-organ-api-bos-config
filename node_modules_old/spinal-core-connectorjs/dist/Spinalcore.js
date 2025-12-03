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
exports.spinalCore = void 0;
var FileSystem_1 = require("./FileSystem/FileSystem");
var ModelProcessManager_1 = require("./ModelProcessManager");
var sendXhr_1 = require("./Utils/sendXhr");
var spinalCore = /** @class */ (function () {
    function spinalCore() {
    }
    /**
     * @static
     * @param {(URL | string)} options
     * @param {string} [accessToken]
     * @return {*}  {FileSystem}
     * @memberof spinalCore
     */
    spinalCore.connect = function (options, accessToken) {
        var parsedOpt = typeof options === 'string' ? new URL(options) : options;
        if (parsedOpt.pathname.slice(-1)[0] !== '/') {
            parsedOpt.pathname += '/';
        }
        var opt = {
            protocol: parsedOpt.protocol,
            home_dir: parsedOpt.pathname,
            url: parsedOpt.hostname,
            port: parsedOpt.port,
            userid: parsedOpt.username,
            password: parsedOpt.password,
            accessToken: accessToken
        };
        return new FileSystem_1.FileSystem(opt);
    };
    /**
     * @static
     * @param {(URL | string)} options
     * @param {number} sessionId
     * @param {string} [accessToken]
     * @return {*}  {FileSystem}
     * @memberof spinalCore
     */
    spinalCore.connectWithSessionId = function (options, sessionId, accessToken) {
        var parsedOpt = typeof options === 'string' ? new URL(options) : options;
        if (parsedOpt.pathname.slice(-1)[0] !== '/') {
            parsedOpt.pathname += '/';
        }
        var opt = {
            protocol: parsedOpt.protocol,
            home_dir: parsedOpt.pathname,
            url: parsedOpt.hostname,
            port: parsedOpt.port,
            sessionId: sessionId,
            accessToken: accessToken
        };
        return new FileSystem_1.FileSystem(opt);
    };
    /**
     * @static
     * @param {(URL | string)} options
     * @param {string} username
     * @param {string} password
     * @return {*}  {Promise<IAuthResponse>}
     * @memberof spinalCore
     */
    spinalCore.auth = function (options, username, password) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, sendXhr_1.sendXhr)(options, '/api/v1/auth', 'POST', { 'Content-Type': 'application/json' }, JSON.stringify({ userName: username, password: password }))];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, JSON.parse(res)];
                }
            });
        });
    };
    /**
     * @static
     * @param {(URL | string)} options
     * @param {string} bosRegisterKey
     * @param {string} organName
     * @param {string} organType
     * @return {*}  {Promise<IAuthResponse>}
     * @memberof spinalCore
     */
    spinalCore.authOrgan = function (options, bosRegisterKey, organName, organType) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, sendXhr_1.sendXhr)(options, '/api/v1/authOrgan', 'POST', { 'Content-Type': 'application/json' }, JSON.stringify({ bosRegisterKey: bosRegisterKey, organName: organName, organType: organType }))];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, JSON.parse(res)];
                }
            });
        });
    };
    /**
     * @static
     * @param {(URL | string)} options
     * @param {string} token
     * @return {*}  {Promise<ICreateSessionResponse>}
     * @memberof spinalCore
     */
    spinalCore.createSession = function (options, token) {
        return __awaiter(this, void 0, void 0, function () {
            var accessToken, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        accessToken = token.startsWith('Bearer ') ? token : "Bearer ".concat(token);
                        return [4 /*yield*/, (0, sendXhr_1.sendXhr)(options, '/api/v1/createSession', 'GET', {
                                authorization: accessToken
                            })];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, JSON.parse(res)];
                }
            });
        });
    };
    spinalCore.store = function (fs, model, path, optionOrCb, callback_error, fileOption) {
        if (fileOption === void 0) { fileOption = {
            model_type: 'Model'
        }; }
        return __awaiter(this, void 0, void 0, function () {
            var lst, file_name, home_dir, dir, file, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        lst = path.split('/');
                        file_name = lst.pop();
                        if (lst[0] === '')
                            lst.splice(0, 1);
                        path = lst.join('/'); // Absolute paths are not allowed
                        home_dir = FileSystem_1.FileSystem.get_inst()._home_dir;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, fs.load_or_make_dir(home_dir + path)];
                    case 2:
                        dir = _a.sent();
                        file = dir.detect(function (x) { return x.name.get() === file_name; });
                        if (file != null)
                            dir.remove(file);
                        if (typeof optionOrCb === 'function') {
                            dir.add_file(file_name, model, fileOption);
                            optionOrCb();
                        }
                        else {
                            dir.add_file(file_name, model, optionOrCb ? optionOrCb : fileOption);
                        }
                        return [2 /*return*/];
                    case 3:
                        error_1 = _a.sent();
                        if (typeof optionOrCb === 'undefined')
                            throw error_1;
                        if (typeof callback_error === 'undefined') {
                            spinalCore.defaultCallbackError();
                        }
                        else
                            callback_error();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    spinalCore.register_models = function (modelList, name) {
        if (name)
            return ModelProcessManager_1.ModelProcessManager.register_models(modelList, name);
        return ModelProcessManager_1.ModelProcessManager.register_models(modelList);
    };
    /**
     * @static
     * @template T
     * @param {FileSystem} fs
     * @param {string} path
     * @return {*}  {Promise<T>}
     * @memberof spinalCore
     */
    spinalCore.loadPromise = function (fs, path) {
        return __awaiter(this, void 0, void 0, function () {
            var lst, file_name, home_dir, current_dir, file;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        lst = path.split('/');
                        file_name = lst.pop();
                        if (lst[0] === '')
                            lst.splice(0, 1);
                        path = lst.join('/'); // Absolute paths are not allowed
                        home_dir = FileSystem_1.FileSystem.get_inst()._home_dir;
                        return [4 /*yield*/, fs.load_or_make_dir("".concat(home_dir).concat(path))];
                    case 1:
                        current_dir = _a.sent();
                        file = current_dir.detect(function (x) { return x.name.get() === file_name; });
                        if (file)
                            return [2 /*return*/, file.load()];
                        throw new Error('File not Found');
                }
            });
        });
    };
    spinalCore.load = function (fs, path, callback_success, callback_error) {
        if (typeof callback_success === 'undefined')
            return spinalCore.loadPromise(fs, path);
        if (typeof callback_error === 'undefined')
            callback_error = spinalCore.defaultCallbackError;
        // Parse path
        var lst = path.split('/');
        var file_name = lst.pop();
        if (lst[0] === '')
            lst.splice(0, 1);
        path = lst.join('/'); // Absolute paths are not allowed
        var home_dir = FileSystem_1.FileSystem.get_inst()._home_dir;
        fs.load_or_make_dir("".concat(home_dir).concat(path), function (current_dir, err) {
            if (err) {
                return callback_error();
            }
            else {
                var file = current_dir.detect(function (x) { return x.name.get() === file_name; });
                if (file != null) {
                    return file.load(function (data, err) {
                        if (err) {
                            return callback_error();
                        }
                        else {
                            return callback_success(data);
                        }
                    });
                }
                else {
                    return callback_error();
                }
            }
        });
    };
    /**
     * loads all the models of a specific type
     * @static
     * @template T
     * @param {FileSystem} fs
     * @param {string} type
     * @param {SpinalLoadCallBack<T>} callback_success
     * @param {SpinalCallBackError} [callback_error]
     * @return {*}  {void}
     * @memberof spinalCore
     */
    spinalCore.load_type = function (fs, type, callback_success, callback_error) {
        if (typeof callback_error === 'undefined') {
            callback_error = spinalCore.defaultCallbackError;
        }
        return fs.load_type(type, function (data, error) {
            if (!data || error)
                callback_error();
            else
                callback_success(data, error);
        });
    };
    spinalCore.load_right = function (fs, ptr, callback_success, callback_error) {
        if (typeof callback_success === 'function') {
            if (typeof callback_error === 'undefined') {
                callback_error = spinalCore.defaultCallbackError;
            }
            fs.load_right(ptr, function (data, err) {
                if (err)
                    return callback_error();
                else
                    return callback_success(data, err);
            });
        }
        else {
            return fs.load_right(ptr);
        }
    };
    spinalCore.load_directory = function (fs, path, callback) {
        if (typeof callback === 'function')
            return fs.load(path, callback);
        return fs.load(path);
    };
    spinalCore.load_ptr = function (fs, ptr, callback) {
        if (typeof callback === 'function')
            return fs.load_ptr(ptr, callback);
        return fs.load_ptr(ptr);
    };
    /**
     * @static
     * @param {FileSystem} fs
     * @param {number} ptr
     * @param {string} file_name
     * @param {number} right_flag
     * @param {string} targetName
     * @return {*}  {void}
     * @memberof spinalCore
     */
    spinalCore.share_model = function (fs, ptr, file_name, right_flag, targetName) {
        return fs.share_model(ptr, file_name, right_flag, targetName);
    };
    /**
     * "public static" method: extend one object as a class, using the same 'class' concept as coffeescript
     * @deprecated
     * @static
     * @param {*} child
     * @param {*} parent
     * @return {*}  {*}
     * @memberof spinalCore
     */
    spinalCore.extend = function (child, parent) {
        return FileSystem_1.FileSystem.extend(child, parent);
    };
    /**
     * default callback function
     * @static
     * @return {*}  {void}
     * @memberof spinalCore
     */
    spinalCore.defaultCallbackError = function () {
        return console.log('Model could not be loaded. You can pass a callback to handle this error.');
    };
    spinalCore._def = ModelProcessManager_1.ModelProcessManager._def;
    spinalCore.version = ModelProcessManager_1.ModelProcessManager.spinal.version;
    spinalCore.right_flag = { AD: 1, WR: 2, RD: 4 };
    return spinalCore;
}());
exports.spinalCore = spinalCore;
//# sourceMappingURL=Spinalcore.js.map