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
exports.Directory = void 0;
var Lst_1 = require("../../Models/Lst");
var File_1 = require("./File");
var TiffFile_1 = require("./TiffFile");
/**
 * representation of a virtual Directory
 * @export
 * @class Directory
 * @extends {(Lst<File | TiffFile>)}
 */
var Directory = /** @class */ (function (_super) {
    __extends(Directory, _super);
    function Directory() {
        return _super.call(this) || this;
    }
    /**
     * @return {*}  {*}
     * @memberof Directory
     */
    Directory.prototype.base_type = function () {
        return File_1.File;
    };
    /**
     * @param {string} name
     * @return {*}  {(File | TiffFile)}
     * @memberof Directory
     */
    Directory.prototype.find = function (name) {
        for (var i = 0; i < this.length; i++) {
            var file = this[i];
            if (file.hasOwnProperty('name') && file.name.equals(name))
                return file;
        }
        return undefined;
    };
    /**
     * @param {string} name
     * @param {SpinalLoadCallBack<any>} callback
     * @memberof Directory
     */
    Directory.prototype.load = function (name, callback) {
        var f = this.find(name);
        if (f)
            f.load(callback);
        else
            callback(undefined, 'file does not exist');
    };
    Directory.prototype.has = function (name) {
        if (typeof name === 'string') {
            for (var i = 0; i < this.length; i++) {
                var file = this[i];
                if (file.name.equals(name))
                    return true;
            }
            return false;
        }
        for (var i = 0; i < this.length; i++) {
            if (name(this[i]))
                return true;
        }
        return false;
    };
    /**
     * @param {string} name
     * @param {*} obj
     * @param {IFileInfoOption} [params={}]
     * @return {*}  {File}
     * @memberof Directory
     */
    Directory.prototype.add_file = function (name, obj, params) {
        if (params === void 0) { params = {}; }
        var f = this.find(name);
        if (f)
            return f;
        var res = new File_1.File(name, obj, params);
        this.push(res);
        return res;
    };
    /**
     * @param {string} name
     * @param {*} obj
     * @param {*} tiff_obj
     * @param {IFileInfoOption} [params={}]
     * @return {*}  {TiffFile}
     * @memberof Directory
     */
    Directory.prototype.add_tiff_file = function (name, obj, tiff_obj, params) {
        if (params === void 0) { params = {}; }
        var f = this.find(name);
        if (f)
            return f;
        var res = new TiffFile_1.TiffFile(name, obj, tiff_obj, params);
        this.push(res);
        return res;
    };
    /**
     * @param {string} name
     * @param {*} obj
     * @param {IFileInfoOption} [params={}]
     * @return {*}  {File}
     * @memberof Directory
     */
    Directory.prototype.force_add_file = function (name, obj, params) {
        if (params === void 0) { params = {}; }
        var num = 0;
        var filename = name;
        var f = this.find(filename);
        while (f) {
            filename = name + '_' + num;
            f = this.find(filename);
            if (f)
                num++;
        }
        var res = new File_1.File(filename, obj, params);
        this.push(res);
        return res;
    };
    /**
     * @param {*} info
     * @return {*}  {string}
     * @memberof Directory
     */
    Directory.prototype.get_file_info = function (info) {
        return (info.icon = 'folder');
    };
    /**
     * @static
     * @type {string}
     * @memberof Directory
     */
    Directory._constructorName = 'Directory';
    return Directory;
}(Lst_1.Lst));
exports.Directory = Directory;
//# sourceMappingURL=Directory.js.map