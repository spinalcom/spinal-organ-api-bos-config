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

import {
  SpinalContext,
  SpinalGraph,
  SpinalGraphService,
  SpinalNode,
} from 'spinal-env-viewer-graph-service';
import {
  ADMIN_PROFILE_NAME,
  ADMIN_PROFILE_TYPE,
  APP_RELATION_NAME,
  CONTEXT_TO_USER_PROFILE_RELATION_NAME,
  PORTOFOLIO_TYPE,
  PROFILE_TO_AUTHORIZED_DIGITAL_TWIN_RELATION_NAME,
  PROFILE_TO_AUTHORIZED_PORTOFOLIO_RELATION,
  PTR_LST_TYPE,
} from '../constant';
import AuthorizationService from './authorization.service';
import { UserProfileService } from './userProfile.service';
import { DigitalTwinService } from './digitalTwin.service';
import { AppService } from './apps.service';
import { APIService } from './apis.service';


export class AdminProfileService {
  private static instance: AdminProfileService;
  private _adminNode: SpinalNode;

  private constructor() { }


  public static getInstance(): AdminProfileService {
    if (!this.instance) {
      this.instance = new AdminProfileService();
    }

    return this.instance;
  }


  public get adminNode() {
    return this._adminNode;
  }


  public async init(context: SpinalContext): Promise<SpinalNode> {
    let node = await this.getAdminProfile(context);

    if (!node) {
      node = this._createAdminProfile();
      await context.addChildInContext(
        node,
        CONTEXT_TO_USER_PROFILE_RELATION_NAME,
        PTR_LST_TYPE,
        context
      );
    }

    this._adminNode = node;

    await this.syncAdminProfile();
    return node;
  }


  /**
   * Retrieves the admin profile node from the specified context or the default user profile context.
   *
   * If the admin profile node has already been retrieved and cached, it returns the cached node.
   * Otherwise, it fetches the children of the context and searches for a node with the name
   * `ADMIN_PROFILE_NAME` and type `ADMIN_PROFILE_TYPE`.
   *
   * @param argContext - (Optional) The context from which to retrieve the admin profile node.
   *                     If not provided, the default user profile context is used.
   * @returns A promise that resolves to the admin profile `SpinalNode` if found, otherwise `undefined`.
   */
  public async getAdminProfile(argContext?: SpinalContext): Promise<SpinalNode> {
    if (this._adminNode) return this._adminNode;

    const context = argContext || UserProfileService.getInstance().context;
    if (!context) return;

    const children = await context.getChildren();

    return children.find((el) => {
      return (
        el.getName().get() === ADMIN_PROFILE_NAME &&
        el.getType().get() === ADMIN_PROFILE_TYPE
      );
    });
  }


  /**
   * Adds one or more applications to the admin profile, authorizing access for the profile.
   *
   * @param apps - A single `SpinalNode` instance or an array of `SpinalNode` instances representing the applications to be added.
   * @returns A promise that resolves to an array of `SpinalNode` instances that have been authorized for the profile.
   */
  async addAppToProfil(apps: SpinalNode | SpinalNode[]): Promise<SpinalNode[]> {
    if (!Array.isArray(apps)) apps = [apps];

    return UserProfileService.getInstance().authorizeProfileToAccessApps(
      this._adminNode,
      apps.map((el) => el.getId().get())
    );
  }


  /**
   * Authorizes the admin profile to access a sub-app under a specific app.
   * @param app The parent app node.
   * @param subApp The sub-app node to authorize.
   * @returns {Promise<SpinalNode[]>} A promise that resolves to an array of authorized sub-app nodes.
   */
  async addSubAppToProfil(app: SpinalNode, subApp: SpinalNode): Promise<SpinalNode[]> {
    return UserProfileService.getInstance().authorizeProfileToAccessSubApps(
      this._adminNode,
      [app],
      subApp.getId().get()
    );
  }


  /**
   * Authorizes the admin profile to access the given admin apps.
   * @param apps One or more admin app nodes.
   * @returns {Promise<SpinalNode[]>} A promise that resolves to an array of authorized admin app nodes.
   */
  public async addAdminAppToProfil(apps: SpinalNode | SpinalNode[]): Promise<SpinalNode[]> {
    if (!Array.isArray(apps)) apps = [apps];

    return AuthorizationService.getInstance().authorizeProfileToAccessAdminApps(
      this._adminNode,
      apps.map((el) => el.getId().get())
    );
  }


  /**
   * Authorizes the admin profile to access the given APIs.
   * @param apis One or more API nodes.
   * @returns {Promise<SpinalNode[]>} A promise that resolves to an array of authorized API nodes.
   */
  public async addApiToProfil(apis: SpinalNode | SpinalNode[]): Promise<SpinalNode[]> {
    if (!Array.isArray(apis)) apis = [apis];

    return UserProfileService.getInstance().authorizeProfileToAccessApis(
      this._adminNode,
      apis.map((el) => el.getId().get())
    );
  }


  /**
   * Authorizes the admin profile to access the given digital twins.
   * Adds each digital twin as a child of the admin profile node using the appropriate relation.
   * @param digitalTwins One or more digital twin nodes.
   * @returns {Promise<SpinalNode[]>} A promise that resolves to an array of authorized digital twin nodes.
   */
  async addDigitalTwinToAdminProfile(digitalTwins: SpinalNode | SpinalNode[]): Promise<SpinalNode[]> {
    if (!Array.isArray(digitalTwins)) digitalTwins = [digitalTwins];

    const promises = [];

    for (const digitalTwin of digitalTwins) {
      promises.push(
        this._adminNode
          .addChild(
            digitalTwin,
            PROFILE_TO_AUTHORIZED_DIGITAL_TWIN_RELATION_NAME,
            PTR_LST_TYPE
          ).catch((error) => { })
      );
    }

    return Promise.all(promises).then((result) => {
      return result.filter((node) => node instanceof SpinalNode);
    });
  }


  /**
   * Synchronizes the admin profile by authorizing access to all digital twins, apps, admin apps, and APIs.
   *
   * @returns {Promise<any>} A promise that resolves to an object containing:
   *   - `digitaTwins`: The result of authorizing all digital twins.
   *   - `apps`: An array with the results of authorizing all apps and all admin apps.
   *   - `apis`: The result of authorizing all APIs.
   *
   * @remarks
   * This method aggregates the results of multiple asynchronous authorization operations
   * related to digital twins, applications, and APIs for the admin profile.
   */
  public async syncAdminProfile(): Promise<any> {
    return {
      digitaTwins: await this._authorizeAllDigitalTwin(),
      apps: await Promise.all([
        this._authorizeAllApps(),
        this._authorizeAllAdminApps(),
      ]),
      apis: await this._authorizeAllApis(),
    };
  }


  /**
   * Creates a new admin profile node.
   * @returns {SpinalNode} The created admin profile node.
   * @private
   */
  private _createAdminProfile(): SpinalNode {
    const info = {
      name: ADMIN_PROFILE_NAME,
      type: ADMIN_PROFILE_TYPE,
    };
    const graph = new SpinalGraph(ADMIN_PROFILE_NAME);
    const profileId = SpinalGraphService.createNode(info, graph);

    const node = SpinalGraphService.getRealNode(profileId);
    return node;
  }


  /**
   * Authorizes all digital twins by retrieving them and adding them to the admin profile.
   *
   * @returns {Promise<SpinalNode[]>} A promise that resolves to an array of `SpinalNode` instances representing the authorized digital twins.
   * @private
   */
  private async _authorizeAllDigitalTwin(): Promise<SpinalNode[]> {
    const digitalTwins =
      await DigitalTwinService.getInstance().getAllDigitalTwins();
    return this.addDigitalTwinToAdminProfile(digitalTwins);
  }


  /**
   * Authorizes all building applications by retrieving them and adding them to the admin profile.
   *
   * @returns {Promise<SpinalNode[]>} A promise that resolves to an array of `SpinalNode` instances representing the authorized building applications.
   * @private
   */
  private async _authorizeAllApps(): Promise<SpinalNode[]> {
    const buildingApps = await AppService.getInstance().getAllBuildingApps();
    return this.addAppToProfil(buildingApps);
  }


  private async _authorizeAllApis(): Promise<SpinalNode[]> {
    const apis = await APIService.getInstance().getAllApiRoute();
    return this.addApiToProfil(apis);
  }

  private async _authorizeAllAdminApps(): Promise<SpinalNode[]> {
    const adminApps = await AppService.getInstance().getAllAdminApps();
    return this.addAdminAppToProfil(adminApps);
  }

}
