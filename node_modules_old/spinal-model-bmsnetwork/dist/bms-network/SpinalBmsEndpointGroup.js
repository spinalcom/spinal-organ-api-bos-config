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
exports.SpinalBmsEndpointGroup = void 0;
const spinal_core_connectorjs_type_1 = require("spinal-core-connectorjs_type");
const genUID_1 = require("../Utils/genUID");
/**
 * @property {spinal.Str} id;
 * @property {spinal.Str} name;
 * @property {spinal.Str} type;
 * @property {spinal.Str} path;
 * @export
 * @class SpinalBmsEndpointGroup
 * @extends {Model}
 */
class SpinalBmsEndpointGroup extends spinal_core_connectorjs_type_1.Model {
    /**
     *Creates an instance of SpinalBmsEndpointGroup.
     * @param {string} [name='']
     * @param {string} [type='']
     * @param {string} [path='']
     * @param {string} [id=genUID('SpinalBmsNetwork')]
     * @memberof SpinalBmsEndpointGroup
     */
    constructor(name = '', type = '', path = '', id = (0, genUID_1.genUID)('SpinalBmsNetwork')) {
        super();
        this.add_attr({
            id,
            name,
            type,
            path,
        });
    }
}
exports.SpinalBmsEndpointGroup = SpinalBmsEndpointGroup;
/**
 * @static
 * @type {string}
 * @memberof SpinalBmsEndpointGroup
 */
SpinalBmsEndpointGroup.relationName = 'hasBmsEndpointGroup';
/**
 * @static
 * @type {string}
 * @memberof SpinalBmsEndpointGroup
 */
SpinalBmsEndpointGroup.nodeTypeName = 'BmsEndpointGroup';
spinal_core_connectorjs_type_1.spinalCore.register_models(SpinalBmsEndpointGroup);
exports.default = SpinalBmsEndpointGroup;
//# sourceMappingURL=SpinalBmsEndpointGroup.js.map