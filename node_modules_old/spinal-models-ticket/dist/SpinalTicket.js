"use strict";
/*
 * Copyright 2019 SpinalCom - www.spinalcom.com
 *
 *  This file is part of SpinalCore.
 *
 *  Please read all of the following terms and conditions
 *  of the Free Software license Agreement ("Agreement")
 *  carefully.
 *
 *  This Agreement is a legally binding contract between
 *  the Licensee (as defined below) and SpinalCom that
 *  sets forth the terms and conditions that govern your
 *  use of the Program. By installing and/or using the
 *  Program, you agree to abide by all the terms and
 *  conditions stated or referenced herein.
 *
 *  If you do not agree to abide by these terms and
 *  conditions, do not demonstrate your acceptance and do
 *  not install or use the Program.
 *  You should have received a copy of the license along
 *  with this file. If not, see
 *  <http://resources.spinalcom.com/licenses.pdf>.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const spinal_core_connectorjs_type_1 = require("spinal-core-connectorjs_type");
const spinalCore = require("spinal-core-connectorjs");
class SpinalTicket extends spinal_core_connectorjs_type_1.Model {
    constructor(ticket) {
        super();
        if (!!ticket) {
            ticket['creationDate'] = Date.now();
            this.add_attr(ticket);
        }
    }
}
exports.SpinalTicket = SpinalTicket;
spinalCore.register_models(SpinalTicket);
//# sourceMappingURL=SpinalTicket.js.map