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
exports.__esModule = true;
exports.getUrlPath = void 0;
var FileSystem_1 = require("../FileSystem/FileSystem");
function getUrlPath(protocol, url, port, searchQuery) {
    if (searchQuery === void 0) { searchQuery = ''; }
    var path = '';
    if (FileSystem_1.FileSystem.CONNECTOR_TYPE === 'Node' || FileSystem_1.FileSystem.is_cordova) {
        path = "".concat(protocol, "//").concat(url);
        if (port)
            path += ":".concat(port);
        path += "".concat(FileSystem_1.FileSystem.url_com).concat(searchQuery);
    }
    else if (FileSystem_1.FileSystem.CONNECTOR_TYPE === 'Browser') {
        path = "".concat(FileSystem_1.FileSystem.url_com).concat(searchQuery);
    }
    return path;
}
exports.getUrlPath = getUrlPath;
//# sourceMappingURL=getUrlPath.js.map