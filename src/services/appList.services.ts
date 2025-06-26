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

import { SpinalContext } from "spinal-env-viewer-graph-service";
import { APP_LIST_CONTEXT_NAME, APP_LIST_CONTEXT_TYPE, CONTEXT_TO_APP_RELATION_NAME } from "../constant";
import { IAppCredential, IApplicationToken, IOAuth2Credential, IBosCredential } from "../interfaces";
import { configServiceInstance } from "./configFile.service";
import { AuthentificationService } from "./authentification.service";
import { _addUserToContext, authenticateApplication } from "../utils/ApplicationAuthUtils";

export class AppListService {
  private static instance: AppListService;
  public context: SpinalContext;

  private constructor() { }

  public static getInstance(): AppListService {
    if (!this.instance) this.instance = new AppListService();
    return this.instance;
  }

  public async init(): Promise<SpinalContext> {
    this.context = await configServiceInstance.getContext(APP_LIST_CONTEXT_NAME);
    if (!this.context) {
      this.context = await configServiceInstance.addContext(APP_LIST_CONTEXT_NAME, APP_LIST_CONTEXT_TYPE);
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
  public async authenticateApplication(application: IAppCredential | IOAuth2Credential): Promise<{ code: number; data: string | IApplicationToken }> {

    const adminCredential = await this._getAuthPlateformInfo();

    console.warn("this mode is deprecated, please use the new authentication service");
    return authenticateApplication(adminCredential.urlAdmin, adminCredential.idPlateform, application, this.context);
  }

  //////////////////////////////////////////////////
  //                    PRIVATE                   //
  //////////////////////////////////////////////////





  private async _getAuthPlateformInfo() {
    const adminCredential = await AuthentificationService.getInstance().getBosToAdminCredential();
    if (!adminCredential) throw new Error("No authentication platform is registered");
    return adminCredential;
  }
}
