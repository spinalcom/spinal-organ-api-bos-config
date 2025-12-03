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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var e_1, _a;
exports.__esModule = true;
var Spinalcore_1 = require("./Spinalcore");
__exportStar(require("./FileSystem/FileSystem"), exports);
__exportStar(require("./FileSystem/Models/Directory"), exports);
__exportStar(require("./FileSystem/Models/File"), exports);
__exportStar(require("./FileSystem/Models/Path"), exports);
__exportStar(require("./FileSystem/Models/Pbr"), exports);
__exportStar(require("./FileSystem/Models/Ptr"), exports);
__exportStar(require("./FileSystem/Models/RightSetList"), exports);
__exportStar(require("./FileSystem/Models/RightsItem"), exports);
__exportStar(require("./FileSystem/Models/SessionModel"), exports);
__exportStar(require("./FileSystem/Models/TiffFile"), exports);
__exportStar(require("./FileSystem/Models/User"), exports);
__exportStar(require("./FileSystem/Models/UserRight"), exports);
__exportStar(require("./interfaces/IAuthResponse"), exports);
__exportStar(require("./interfaces/ICreateSessionResponse"), exports);
__exportStar(require("./interfaces/IFileInfo"), exports);
__exportStar(require("./interfaces/IFileInfoOption"), exports);
__exportStar(require("./interfaces/IFlatModelMap"), exports);
__exportStar(require("./interfaces/IFsData"), exports);
__exportStar(require("./interfaces/INewDomElementParam"), exports);
__exportStar(require("./interfaces/IOptionFilesystem"), exports);
__exportStar(require("./interfaces/ISpinalModels"), exports);
__exportStar(require("./interfaces/IStateMap"), exports);
__exportStar(require("./interfaces/SpinalCallBackError"), exports);
__exportStar(require("./interfaces/SpinalFilterFunction"), exports);
__exportStar(require("./interfaces/SpinalLoadCallBack"), exports);
__exportStar(require("./interfaces/SpinalOnChangeBindModel"), exports);
__exportStar(require("./interfaces/SpinalSortFunction"), exports);
__exportStar(require("./interfaces/SpinalStoreCallBackSucess"), exports);
__exportStar(require("./interfaces/SpinalType"), exports);
__exportStar(require("./ModelProcessManager"), exports);
__exportStar(require("./Models/Bool"), exports);
__exportStar(require("./Models/Choice"), exports);
__exportStar(require("./Models/Lst"), exports);
__exportStar(require("./Models/Model"), exports);
__exportStar(require("./Models/Obj"), exports);
__exportStar(require("./Models/Str"), exports);
__exportStar(require("./Models/TypedArray"), exports);
__exportStar(require("./Models/TypedArray_Float64"), exports);
__exportStar(require("./Models/TypedArray_Int32"), exports);
__exportStar(require("./Models/Val"), exports);
__exportStar(require("./Models/Vec"), exports);
__exportStar(require("./Processes/BindProcess"), exports);
__exportStar(require("./Processes/GlobalBindFunction"), exports);
__exportStar(require("./Processes/Process"), exports);
__exportStar(require("./register"), exports);
__exportStar(require("./Spinalcore"), exports);
__exportStar(require("./SpinalUserManager"), exports);
__exportStar(require("./Utils/DomHelper"), exports);
__exportStar(require("./Utils/getUrlPath"), exports);
__exportStar(require("./Utils/isIterable"), exports);
__exportStar(require("./Utils/sendXhr"), exports);
var _loop_1 = function (key) {
    Object.defineProperty(exports, key, {
        enumerable: true,
        get: function () {
            // @ts-ignore
            return Spinalcore_1.spinalCore[key];
        }
    });
};
try {
    // populate export with spinalCore for
    // compatiblity with old lib that use require
    for (var _b = __values([
        '_def',
        'version',
        'connect',
        'connectWithSessionId',
        'auth',
        'authOrgan',
        'createSession',
        'store',
        'register_models',
        'loadPromise',
        'load',
        'load_type',
        'load_right',
        'load_directory',
        'load_ptr',
        'share_model',
        'right_flag',
        'extend',
        'defaultCallbackError',
    ]), _c = _b.next(); !_c.done; _c = _b.next()) {
        var key = _c.value;
        _loop_1(key);
    }
}
catch (e_1_1) { e_1 = { error: e_1_1 }; }
finally {
    try {
        if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
    }
    finally { if (e_1) throw e_1.error; }
}
//# sourceMappingURL=index.js.map