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
exports.Obj = void 0;
var FileSystem_1 = require("../FileSystem/FileSystem");
var Model_1 = require("./Model");
/**
 * @export
 * @class Obj
 * @extends {Model}
 * @template T
 */
var Obj = /** @class */ (function (_super) {
    __extends(Obj, _super);
    /**
     * Creates an instance of Obj.
     * @param {*} [data]
     * @memberof Obj
     */
    function Obj(data) {
        var _this = _super.call(this) || this;
        if (data != null) {
            _this._set(data);
        }
        return _this;
    }
    /**
     * @return {*}  {string}
     * @memberof Obj
     */
    Obj.prototype.toString = function () {
        var _a;
        return (_a = this._data) === null || _a === void 0 ? void 0 : _a.toString();
    };
    /**
     * @param {*} obj
     * @return {*}  {boolean}
     * @memberof Obj
     */
    Obj.prototype.equals = function (obj) {
        return obj instanceof Obj ? this._data === obj._data : this._data === obj;
    };
    /**
     * @return {*}  {*}
     * @memberof Obj
     */
    Obj.prototype.get = function () {
        return this._data;
    };
    /**
     * @param {IFsData} out
     * @memberof Obj
     */
    Obj.prototype._get_fs_data = function (out) {
        FileSystem_1.FileSystem.set_server_id_if_necessary(out, this);
        out.mod += "C ".concat(this._server_id, " ").concat(this.toString(), " ");
    };
    /**
     * @protected
     * @param {T} value
     * @return {*}  {boolean}
     * @memberof Obj
     */
    Obj.prototype._set = function (value) {
        if (this._data !== value) {
            this._data = value;
            return true;
        }
        return false;
    };
    /**
     * @@protected
     * @return {*}  {string}
     * @memberof Obj
     */
    Obj.prototype._get_state = function () {
        return this.toString();
    };
    /**
     * @param {string} str
     * @param {unknown} _map
     * @return {*}  {boolean}
     * @memberof Obj
     */
    Obj.prototype._set_state = function (str, _map) {
        return this.set(str);
    };
    Obj._constructorName = 'Obj';
    return Obj;
}(Model_1.Model));
exports.Obj = Obj;
//# sourceMappingURL=Obj.js.map