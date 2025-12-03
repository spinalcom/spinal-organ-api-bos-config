"use strict";
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
exports.Bool = void 0;
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
var FileSystem_1 = require("../FileSystem/FileSystem");
var Obj_1 = require("./Obj");
/**
 * Bese representation of a Boolean
 * @export
 * @class Bool
 * @extends {Obj<boolean>}
 */
var Bool = /** @class */ (function (_super) {
    __extends(Bool, _super);
    /**
     * Creates an instance of Bool.
     * @param {(boolean | Bool)} [data=false]
     * @memberof Bool
     */
    function Bool(data) {
        if (data === void 0) { data = false; }
        var _this = _super.call(this) || this;
        _this._set(data);
        return _this;
    }
    /**
     * toggle true / false ( 1 / 0 )
     * @return {*}  {boolean}
     * @memberof Bool
     */
    Bool.prototype.toggle = function () {
        return this.set(!this._data);
    };
    /**
     * @return {*}  {boolean}
     * @memberof Bool
     */
    Bool.prototype.toBoolean = function () {
        return this._data;
    };
    /**
     * @return {*}  {Bool}
     * @memberof Bool
     */
    Bool.prototype.deep_copy = function () {
        return new Bool(this._data);
    };
    /**
     * we do not take _set from Obj because we want a conversion if value is not a boolean
     * @protected
     * @param {(string | boolean | Bool)} value
     * @return {*}  {boolean}
     * @memberof Bool
     */
    Bool.prototype._set = function (value) {
        var n;
        if (value === 'false')
            n = false;
        else if (value === 'true')
            n = true;
        else if (value instanceof Bool)
            n = value._data;
        else
            n = Boolean(value);
        if (this._data !== n) {
            this._data = n;
            return true;
        }
        return false;
    };
    /**
     * @param {IFsData} out
     * @memberof Bool
     */
    Bool.prototype._get_fs_data = function (out) {
        FileSystem_1.FileSystem.set_server_id_if_necessary(out, this);
        out.mod += "C ".concat(this._server_id, " ").concat(this._data ? 1 : 0, " ");
    };
    /**
     * @static
     * @type {string}
     * @memberof Bool
     */
    Bool._constructorName = 'Bool';
    return Bool;
}(Obj_1.Obj));
exports.Bool = Bool;
//# sourceMappingURL=Bool.js.map