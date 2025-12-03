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
exports.Val = void 0;
var Obj_1 = require("./Obj");
/**
 * representation of a number
 * @export
 * @class Val
 * @extends {Obj<number>}
 */
var Val = /** @class */ (function (_super) {
    __extends(Val, _super);
    /**
     * Creates an instance of Val.
     * @param {(number | Val)} [data=0]
     * @memberof Val
     */
    function Val(data) {
        if (data === void 0) { data = 0; }
        var _this = _super.call(this) || this;
        _this._set(data);
        return _this;
    }
    /**
     * toggle true / false ( 1 / 0 )
     * @return {*}  {boolean}
     * @memberof Val
     */
    Val.prototype.toggle = function () {
        return this.set(!this._data);
    };
    /**
     * @return {*}  {boolean}
     * @memberof Val
     */
    Val.prototype.toBoolean = function () {
        return Boolean(this._data);
    };
    /**
     * @return {*}  {Val}
     * @memberof Val
     */
    Val.prototype.deep_copy = function () {
        return new Val(this._data);
    };
    /**
     * @param {number} v
     * @memberof Val
     */
    Val.prototype.add = function (v) {
        if (v) {
            this._data += v;
            this._signal_change();
        }
    };
    /**
     * we do not take _set from Obj because we want a conversion if value is not a number
     * @protected
     * @param {(string | boolean | number | Val)} value
     * @return {*}  {boolean}
     * @memberof Val
     */
    Val.prototype._set = function (value) {
        var n;
        if (typeof value === 'string' || typeof value === 'boolean') {
            n = Number(value);
            if (isNaN(n))
                console.log("Don't know how to transform ".concat(value, " to a Val"));
        }
        else if (value instanceof Val)
            n = value._data;
        else
            n = value;
        if (this._data !== n) {
            this._data = n;
            return true;
        }
        return false;
    };
    Val._constructorName = 'Val';
    return Val;
}(Obj_1.Obj));
exports.Val = Val;
//# sourceMappingURL=Val.js.map