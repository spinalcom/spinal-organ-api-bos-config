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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganListService = void 0;
const constant_1 = require("../constant");
const configFile_service_1 = require("./configFile.service");
class OrganListService {
    static instance;
    context;
    constructor() { }
    static getInstance() {
        if (!this.instance)
            this.instance = new OrganListService();
        return this.instance;
    }
    async init() {
        this.context = await configFile_service_1.configServiceInstance.getContext(constant_1.ORGAN_LIST_CONTEXT_NAME);
        if (!this.context)
            this.context = await configFile_service_1.configServiceInstance.addContext(constant_1.ORGAN_LIST_CONTEXT_NAME, constant_1.ORGAN_LIST_CONTEXT_TYPE);
        return this.context;
    }
}
exports.OrganListService = OrganListService;
//# sourceMappingURL=organList.service.js.map