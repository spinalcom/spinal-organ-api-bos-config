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
exports.Str = void 0;
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
var Model_1 = require("./Model");
var Obj_1 = require("./Obj");
/**
 * representation of a string
 * @export
 * @class Str
 * @extends {Obj<string>}
 */
var Str = /** @class */ (function (_super) {
    __extends(Str, _super);
    // /**
    //  * @readonly
    //  * @type {number}
    //  * @memberof Str
    //  */
    // public get length(): number {
    //   return this._data.length;
    // }
    /**
     * Creates an instance of Str.
     * @param {(string | Str)} [data='']
     * @memberof Str
     */
    function Str(data) {
        if (data === void 0) { data = ''; }
        var _this = _super.call(this) || this;
        _this.length = 0;
        _this._data = data.toString();
        _this.length = _this._data.length;
        return _this;
    }
    /**
     * toggle presence of str in this
     * @param {string} str
     * @param {string} [space=' ']
     * @return {*}  {boolean}
     * @memberof Str
     */
    Str.prototype.toggle = function (str, space) {
        if (space === void 0) { space = ' '; }
        var i, l;
        l = this._data.split(space);
        i = l.indexOf(str);
        if (i < 0) {
            l.push(str);
        }
        else {
            l.splice(i, 1);
        }
        return this.set(l.join(' '));
    };
    /**
     * true if str is contained in this
     * @param {string} str
     * @return {*}  {boolean}
     * @memberof Str
     */
    Str.prototype.contains = function (str) {
        return this._data.indexOf(str) >= 0;
    };
    /**
     * @param {(string | Model)} str
     * @return {*}  {boolean}
     * @memberof Str
     */
    Str.prototype.equals = function (str) {
        return str instanceof Model_1.Model
            ? this.toString() === str.toString()
            : this._data === str;
    };
    /**
     * @return {*}  {string}
     * @memberof Str
     */
    Str.prototype.toString = function () {
        return this._data;
    };
    /**
     * @param {string} str
     * @return {*}  {boolean}
     * @memberof Str
     */
    Str.prototype.ends_with = function (str) {
        return this._data.endsWith(str);
    };
    /**
     * @return {*}  {Str}
     * @memberof Str
     */
    Str.prototype.deep_copy = function () {
        return new Str(this._data);
    };
    /**
     * @param {IFsData} out
     * @memberof Str
     */
    Str.prototype._get_fs_data = function (out) {
        FileSystem_1.FileSystem.set_server_id_if_necessary(out, this);
        out.mod += "C ".concat(this._server_id, " ").concat(encodeURI(this._data), " ");
    };
    /**
     * @protected
     * @param {(Str | string)} [value='']
     * @return {*}  {boolean}
     * @memberof Str
     */
    Str.prototype._set = function (value) {
        if (value === void 0) { value = ''; }
        var n = value.toString();
        if (this._data !== n) {
            this._data = n;
            this.length = this._data.length;
            return true;
        }
        return false;
    };
    /**
     * @protected
     * @return {*}  {string}
     * @memberof Str
     */
    Str.prototype._get_state = function () {
        return encodeURI(this._data);
    };
    Str.prototype._set_state = function (str, _map) {
        return this.set(decodeURIComponent(str));
    };
    Str._constructorName = 'Str';
    return Str;
}(Obj_1.Obj));
exports.Str = Str;
//# sourceMappingURL=Str.js.map