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
exports.TypedArray_Int32 = void 0;
var TypedArray_1 = require("./TypedArray");
var TypedArray_Int32 = /** @class */ (function (_super) {
    __extends(TypedArray_Int32, _super);
    /**
     * Creates an instance of TypedArray_Int32.
     * @param {(number | number[])} [size]
     * @param {Int32Array} [data]
     * @memberof TypedArray_Int32
     */
    function TypedArray_Int32(size, data) {
        return _super.call(this, size, data) || this;
    }
    /**
     * @return {*}  {typeof TypedArray_Int32}
     * @memberof TypedArray_Int32
     */
    TypedArray_Int32.prototype.base_type = function () {
        return TypedArray_Int32;
    };
    /**
     * @return {*}  {TypedArray_Int32}
     * @memberof TypedArray_Int32
     */
    TypedArray_Int32.prototype.deep_copy = function () {
        return new TypedArray_Int32(this._size, this._data);
    };
    TypedArray_Int32._constructorName = 'TypedArray_Int32';
    return TypedArray_Int32;
}(TypedArray_1.TypedArray));
exports.TypedArray_Int32 = TypedArray_Int32;
//# sourceMappingURL=TypedArray_Int32.js.map