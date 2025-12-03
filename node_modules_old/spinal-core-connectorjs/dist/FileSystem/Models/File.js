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
exports.__esModule = true;
exports.File = void 0;
var ModelProcessManager_1 = require("../../ModelProcessManager");
var Model_1 = require("../../Models/Model");
var Ptr_1 = require("./Ptr");
/**
 * representation of a virtual File
 * @export
 * @class File
 * @extends {Model}
 * @template T
 */
var File = /** @class */ (function (_super) {
    __extends(File, _super);
    /**
     * Creates an instance of File.
     * @param {string} [name='']
     * @param {(number | T)} [ptr_or_model=0]
     * @param {*} [info={}]
     * @memberof File
     */
    function File(name, ptr_or_model, info) {
        if (name === void 0) { name = ''; }
        if (ptr_or_model === void 0) { ptr_or_model = 0; }
        var _a;
        var _this = _super.call(this) || this;
        var cp_info = {};
        if (!info)
            info = {};
        for (var key in info) {
            cp_info[key] = info[key];
        }
        if (ptr_or_model instanceof Model_1.Model) {
            if (!('model_type' in cp_info)) {
                cp_info.model_type = ModelProcessManager_1.ModelProcessManager.get_object_class(ptr_or_model);
            }
            (_a = ptr_or_model.get_file_info) === null || _a === void 0 ? void 0 : _a.call(ptr_or_model, cp_info);
        }
        _this.add_attr({
            name: name,
            _created_at: Date.now(),
            _ptr: new Ptr_1.Ptr(ptr_or_model),
            _info: cp_info
        });
        return _this;
    }
    File.prototype.load = function (callback) {
        if (typeof callback === 'function')
            this._ptr.load(callback);
        else
            return this._ptr.load();
    };
    /**
     * @static
     * @type {string}
     * @memberof File
     */
    File._constructorName = 'File';
    return File;
}(Model_1.Model));
exports.File = File;
//# sourceMappingURL=File.js.map