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
exports.sendXhr = void 0;
var FileSystem_1 = require("../FileSystem/FileSystem");
function sendXhr(options, command, httpMethod, header, body) {
    var path = '';
    var parsedOpt = typeof options === 'string' ? new URL(options) : options;
    var url = parsedOpt.hostname;
    var port = parsedOpt.port;
    if (FileSystem_1.FileSystem.CONNECTOR_TYPE === 'Node' || FileSystem_1.FileSystem.is_cordova) {
        path = "".concat(parsedOpt.protocol, "//").concat(url).concat(port) ? ':' + port : '' + command;
    }
    else if (FileSystem_1.FileSystem.CONNECTOR_TYPE === 'Browser') {
        path = command;
    }
    return new Promise(function (resolve, reject) {
        var xhr_object = FileSystem_1.FileSystem._my_xml_http_request();
        xhr_object.open(httpMethod, path, true);
        xhr_object.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                return resolve(this.responseText);
            }
            else if (this.readyState === 4) {
                return reject(this.status);
            }
        };
        if (header) {
            for (var key in header) {
                if (Object.prototype.hasOwnProperty.call(header, key)) {
                    xhr_object.setRequestHeader(key, header[key]);
                }
            }
        }
        xhr_object.send(body);
    });
}
exports.sendXhr = sendXhr;
//# sourceMappingURL=sendXhr.js.map