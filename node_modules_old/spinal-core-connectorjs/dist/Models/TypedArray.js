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
exports.TypedArray = void 0;
var FileSystem_1 = require("../FileSystem/FileSystem");
var Model_1 = require("./Model");
var TypedArray = /** @class */ (function (_super) {
    __extends(TypedArray, _super);
    /**
     * Creates an instance of TypedArray.
     * @param {(number | number[])} [size]
     * @param {T} [data]
     * @memberof TypedArray
     */
    function TypedArray(size, data) {
        var _this = _super.call(this) || this;
        // size
        var tmpSize;
        if (size == null) {
            tmpSize = [];
        }
        if (typeof size === 'number') {
            tmpSize = [size];
        }
        _this._size = tmpSize;
        // data
        if (data == null) {
            var B = _this.base_type();
            if (B)
                data = B.from(_this.nb_items());
        }
        _this._data = data;
        return _this;
    }
    /**
     * @return {*}  {number}
     * @memberof TypedArray
     */
    TypedArray.prototype.dim = function () {
        return this._size.length;
    };
    /**
     * @param {number} [d]
     * @return {*}  {(number | number[])}
     * @memberof TypedArray
     */
    TypedArray.prototype.size = function (d) {
        if (d != null) {
            return this._size[d];
        }
        else {
            return this._size;
        }
    };
    /**
     * @param {(number[] | number)} index
     * @param {*} value
     * @memberof TypedArray
     */
    TypedArray.prototype.set_val = function (index, value) {
        var idx = this._get_index(index);
        if (this._data[idx] !== value) {
            this._data[idx] = value;
            this._signal_change();
        }
    };
    /**
     * @return {*}  {number}
     * @memberof TypedArray
     */
    TypedArray.prototype.nb_items = function () {
        var total = this._size[0] || 0;
        for (var j = 1; j < this._size.length; j++) {
            total *= this._size[j];
        }
        return total;
    };
    /**
     * @return {*}  {string}
     * @memberof TypedArray
     */
    TypedArray.prototype.toString = function () {
        var m = 1;
        var res = '';
        var l = this._size.map(function (s) {
            var o = m;
            m *= s;
            return o;
        });
        for (var i = 0; i < this._data.length; i++) {
            var data = this._data[i];
            res += data;
            for (var j = l.length - 1; j >= 0; j++) {
                if (i % l[j] == l[j] - 1) {
                    res += [' ', '\n', '\n\n'][j];
                    break;
                }
            }
        }
        return res;
    };
    /**
     * @param {(TypedArray<any> | any)} obj
     * @return {*}  {boolean}
     * @memberof TypedArray
     */
    TypedArray.prototype.equals = function (obj) {
        if (!(obj instanceof TypedArray))
            return this._data === obj;
        if (this._size.length !== obj._size.length) {
            return false;
        }
        var i = 0;
        var k = 0;
        for (; k < this._size.length; i = ++k) {
            if (this._size[i] !== obj._size[i]) {
                return false;
            }
        }
        return this._data === obj._data;
    };
    /**
     * @param {number} [index]
     * @return {*}  {(number | T)}
     * @memberof TypedArray
     */
    TypedArray.prototype.get = function (index) {
        if (typeof index !== 'undefined')
            return this._data[this._get_index(index)];
        return this._data;
    };
    /**
     * @param {number[]} new_size
     * @memberof TypedArray
     */
    TypedArray.prototype.resize = function (new_size) {
        var total = 1;
        for (var i = 0; i < new_size.length; i++) {
            total *= new_size[i];
        }
        var BaseType = this.base_type();
        var instance = BaseType.from(total);
        instance.set(this._data);
        this._data = instance;
        this._size = new_size;
        this._signal_change();
    };
    /**
     * @protected
     * @param {*} str
     * @return {*}  {boolean}
     * @memberof TypedArray
     */
    TypedArray.prototype._set = function (str) {
        if (typeof str === 'string') {
            // TODO optimize
            this._set_state(str);
            return true;
        }
        if (this._data !== str ||
            this._size.length !== 1 ||
            this._size[0] !== str.length) {
            var baseType = this.base_type();
            // @ts-ignore
            this._data = baseType.from(str);
            this._size = [str.length];
            return true;
        }
        return false;
    };
    /**
     * @private
     * @param {(number[] | number)} index
     * @return {*}  {number}
     * @memberof TypedArray
     */
    TypedArray.prototype._get_index = function (index) {
        if (Array.isArray(index)) {
            var o = 0;
            var m = 1;
            for (var i = 0; i < index.length; i++) {
                o += m * index[i];
                m *= this._size[i];
            }
            return o;
        }
        return index;
    };
    /**
     * @param {IFsData} out
     * @memberof TypedArray
     */
    TypedArray.prototype._get_fs_data = function (out) {
        FileSystem_1.FileSystem.set_server_id_if_necessary(out, this);
        out.mod += "C ".concat(this._server_id, " ").concat(this._get_state(), " ");
    };
    /**
     * @protected
     * @return {*}  {string}
     * @memberof TypedArray
     */
    TypedArray.prototype._get_state = function () {
        var res = this._size.length.toString(10);
        for (var i = 0; i < this._size.length; i++) {
            res += ", ".concat(this._size[i]);
        }
        for (var i = 0; i < this._data.length; i++) {
            res += ", ".concat(this._data[i]);
        }
        return res;
    };
    /**
     * @param {string} str
     * @memberof TypedArray
     */
    TypedArray.prototype._set_state = function (str) {
        var l = str.split(',');
        var s = parseInt(l[0]);
        var size = [];
        for (var i = 0; i < s; i++) {
            size.push(parseInt(l[i + 1]));
        }
        this._size = size;
        var baseType = this.base_type();
        var nbItems = this.nb_items();
        // @ts-ignore
        this._data = baseType.from(nbItems);
        for (var i = 0; i < nbItems; i++) {
            this._data[i] = parseFloat(l[s + 1 + i]);
        }
    };
    TypedArray._constructorName = 'TypedArray';
    return TypedArray;
}(Model_1.Model));
exports.TypedArray = TypedArray;
//# sourceMappingURL=TypedArray.js.map