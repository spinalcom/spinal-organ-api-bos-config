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
exports.Path = void 0;
var Model_1 = require("../../Models/Model");
var FileSystem_1 = require("../FileSystem");
/**
 * representation of a file to upload
 * @export
 * @class Path
 * @extends {Model}
 */
var Path = /** @class */ (function (_super) {
    __extends(Path, _super);
    /**
     * Creates an instance of Path.
     * @param {(File | Buffer)} [file]
     * @memberof Path
     */
    function Path(file) {
        var _this = _super.call(this) || this;
        _this.file = file;
        // @ts-ignore
        var size = file === null || file === void 0 ? void 0 : file.fileSize;
        if (file && typeof Buffer !== 'undefined' && file instanceof Buffer) {
            size = file.length;
        }
        size = size || 0;
        _this.add_attr({
            remaining: size,
            to_upload: size
        });
        return _this;
    }
    /**
     * @param {{ remaining: Val; to_upload: Val }} info
     * @memberof Path
     */
    Path.prototype.get_file_info = function (info) {
        info.remaining = this.remaining;
        info.to_upload = this.to_upload;
    };
    /**
     * @param {IFsData} out
     * @memberof Path
     */
    Path.prototype._get_fs_data = function (out) {
        _super.prototype._get_fs_data.call(this, out);
        // permit to send the data after the server's answer
        if (this.file != null && this._server_id & 3) {
            FileSystem_1.FileSystem._files_to_upload[this._server_id] = this;
        }
    };
    /**
     * @static
     * @type {string}
     * @memberof Path
     */
    Path._constructorName = 'Path';
    return Path;
}(Model_1.Model));
exports.Path = Path;
//# sourceMappingURL=Path.js.map