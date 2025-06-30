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
exports.AppListService = void 0;
const constant_1 = require("../constant");
const configFile_service_1 = require("./configFile.service");
const authentification_service_1 = require("./authentification.service");
const ApplicationAuthUtils_1 = require("../utils/ApplicationAuthUtils");
class AppListService {
    static instance;
    context;
    constructor() { }
    static getInstance() {
        if (!this.instance)
            this.instance = new AppListService();
        return this.instance;
    }
    async init() {
        this.context = await configFile_service_1.configServiceInstance.getContext(constant_1.APP_LIST_CONTEXT_NAME);
        if (!this.context) {
            this.context = await configFile_service_1.configServiceInstance.addContext(constant_1.APP_LIST_CONTEXT_NAME, constant_1.APP_LIST_CONTEXT_TYPE);
        }
        return this.context;
    }
    /**
     * Authenticate an application using the admin platform.
     *
     * @param {(IAppCredential | IOAuth2Credential)} application
     * @return {*}  {(Promise<{ code: number; data: string | IApplicationToken }>)}
     * @memberof AppListService
     */
    async authenticateApplication(application) {
        const adminCredential = await this._getAuthPlateformInfo();
        console.warn("this mode is deprecated, please use the new authentication service");
        return (0, ApplicationAuthUtils_1.authenticateApplication)(adminCredential.urlAdmin, adminCredential.idPlateform, application, this.context);
    }
    //////////////////////////////////////////////////
    //                    PRIVATE                   //
    //////////////////////////////////////////////////
    async _getAuthPlateformInfo() {
        const adminCredential = await authentification_service_1.AuthentificationService.getInstance().getBosToAdminCredential();
        if (!adminCredential)
            throw new Error("No authentication platform is registered");
        return adminCredential;
    }
}
exports.AppListService = AppListService;
//# sourceMappingURL=appList.services.js.map