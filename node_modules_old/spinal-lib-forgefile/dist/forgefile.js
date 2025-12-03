"use strict";
/*
 * Copyright 2018 SpinalCom - www.spinalcom.com
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
Object.defineProperty(exports, "__esModule", { value: true });
const spinal_core_connectorjs_type_1 = require("spinal-core-connectorjs_type");
class ForgeFileDerivativesItem extends spinal_core_connectorjs_type_1.Model {
    constructor(params) {
        super();
        let param;
        param = params;
        if (!params) {
            param = {};
        }
        if ((params != null ? param.name : void 0) == null) {
            param.name = 'unnamed';
        }
        if ((param != null ? param.path : void 0) == null) {
            param.path = '.';
        }
        this.add_attr({ name: param.name, path: param.path });
        this._name = this.name;
    }
}
exports.ForgeFileDerivativesItem = ForgeFileDerivativesItem;
class ForgeFileItem extends spinal_core_connectorjs_type_1.Model {
    constructor(name = 'Forge File') {
        super();
        const tmp = {
            name,
            _name: name,
            _viewable: false,
            _children: [],
            filepath: new spinal_core_connectorjs_type_1.Path(),
            state: new spinal_core_connectorjs_type_1.Choice(0, [
                'Initial',
                'Uploading',
                'Uploading completed',
                'Uploading to forge',
                'Upload to forge completed',
                'Translating',
                'Translating completed',
                'Export completed',
                'Failed',
            ]),
            urn: '',
            ask_token: false,
            oauth: '',
            bucket_key: '',
        };
        this.add_attr(tmp);
    }
    add_child(child) {
        this._children.push(child);
    }
    accept_child(ch) {
        return ch instanceof ForgeFileDerivativesItem;
    }
}
exports.ForgeFileItem = ForgeFileItem;
spinal_core_connectorjs_type_1.spinalCore.register_models([ForgeFileItem, ForgeFileDerivativesItem]);
exports.default = ForgeFileItem;
//# sourceMappingURL=forgefile.js.map