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
exports.Ptr = void 0;
var Model_1 = require("../../Models/Model");
var FileSystem_1 = require("../FileSystem");
/**
 * @export
 * @class Ptr
 * @extends {Model}
 * @template T
 */
var Ptr = /** @class */ (function (_super) {
    __extends(Ptr, _super);
    /**
     * Creates an instance of Ptr.
     * @param {*} [model]
     * @memberof Ptr
     */
    function Ptr(model) {
        var _this = _super.call(this) || this;
        /**
         * @type {{ model?: T; value?: any }}
         * @memberof Ptr
         */
        _this.data = {};
        _this._set(model);
        return _this;
    }
    /**
     * @param {SpinalLoadCallBack<T>} [callback]
     * @return {*}  {Promise<T>}
     * @memberof Ptr
     */
    Ptr.prototype.load = function (callback) {
        var _a, _b;
        if (this.data.model != null) {
            if (typeof callback === 'function') {
                callback(this.data.model, false);
            }
            else {
                return Promise.resolve(this.data.model);
            }
        }
        else {
            if (this.data.value === 0)
                console.error("Ptr ".concat(this._server_id, " load with value 0."));
            if (typeof callback === 'function') {
                (_a = FileSystem_1.FileSystem.get_inst()) === null || _a === void 0 ? void 0 : _a.load_ptr(this.data.value, callback);
            }
            else {
                return (_b = FileSystem_1.FileSystem.get_inst()) === null || _b === void 0 ? void 0 : _b.load_ptr(this.data.value);
            }
        }
    };
    /**
     * @param {IFsData} out
     * @memberof Ptr
     */
    Ptr.prototype._get_fs_data = function (out) {
        FileSystem_1.FileSystem.set_server_id_if_necessary(out, this);
        if (this.data.model != null) {
            FileSystem_1.FileSystem.set_server_id_if_necessary(out, this.data.model);
            out.mod += "C ".concat(this._server_id, " ").concat(this.data.model._server_id, " ");
            this.data.value = this.data.model._server_id;
            if (this.data.model._server_id & 3) {
                FileSystem_1.FileSystem._ptr_to_update[this.data.model._server_id] = this;
            }
        }
        else {
            out.mod += "C ".concat(this._server_id, " ").concat(this.data.value, " ");
        }
    };
    /**
     * @protected
     * @param {(number | T)} model
     * @return {*}  {boolean}
     * @memberof Ptr
     */
    Ptr.prototype._set = function (model) {
        if (typeof model === 'number') {
            var res = this.data.value !== model;
            this.data = {
                value: model
            };
            return res;
        }
        if (model instanceof Model_1.Model) {
            var res = this.data.value !== model._server_id;
            this.data = {
                model: model,
                value: model._server_id
            };
            return res;
        }
        return false;
    };
    /**
     * @protected
     * @return {*}
     * @memberof Ptr
     */
    Ptr.prototype._get_state = function () {
        return this.data.toString();
    };
    /**
     * @param {string} str
     * @param {unknown} _map
     * @return {*}  {boolean}
     * @memberof Ptr
     */
    Ptr.prototype._set_state = function (str, _map) {
        return this.set(str);
    };
    /**
     * @static
     * @type {string}
     * @memberof Ptr
     */
    Ptr._constructorName = 'Ptr';
    return Ptr;
}(Model_1.Model));
exports.Ptr = Ptr;
//# sourceMappingURL=Ptr.js.map