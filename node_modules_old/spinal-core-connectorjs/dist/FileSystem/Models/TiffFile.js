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
exports.TiffFile = void 0;
var File_1 = require("./File");
var Ptr_1 = require("./Ptr");
/**
 * @export
 * @class TiffFile
 * @extends {File<T>}
 * @template T
 */
var TiffFile = /** @class */ (function (_super) {
    __extends(TiffFile, _super);
    /**
     * Creates an instance of TiffFile.
     * @param {string} [name='']
     * @param {number} [ptr_or_model=0]
     * @param {number} [ptr_tiff=0]
     * @param {*} [info={}]
     * @memberof TiffFile
     */
    function TiffFile(name, ptr_or_model, ptr_tiff, info) {
        if (name === void 0) { name = ''; }
        if (ptr_or_model === void 0) { ptr_or_model = 0; }
        if (ptr_tiff === void 0) { ptr_tiff = 0; }
        if (info === void 0) { info = {}; }
        var _this = _super.call(this, name, ptr_or_model, info) || this;
        _this.add_attr({
            _ptr_tiff: new Ptr_1.Ptr(ptr_tiff),
            _has_been_converted: 0
        });
        return _this;
    }
    TiffFile.prototype.load_tiff = function (callback) {
        this._ptr_tiff.load(callback);
    };
    /**
     * @static
     * @type {string}
     * @memberof TiffFile
     */
    TiffFile._constructorName = 'TiffFile';
    return TiffFile;
}(File_1.File));
exports.TiffFile = TiffFile;
//# sourceMappingURL=TiffFile.js.map