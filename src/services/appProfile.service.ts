/*
 * Copyright 2022 SpinalCom - www.spinalcom.com
 *
 * This file is part of SpinalCore.
 *
 * Please read all of the followi../interfaces/IProfileResitions
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

import { SpinalGraphService, SpinalGraph, SpinalContext, SpinalNode } from "spinal-env-viewer-graph-service";
import { APP_PROFILE_TYPE, PTR_LST_TYPE, CONTEXT_TO_USER_PROFILE_RELATION_NAME, APP_PROFILE_CONTEXT_NAME, APP_PROFILE_CONTEXT_TYPE } from "../constant";
import { IProfile, IProfileAuthEdit, IProfileAuthRes, IProfileRes } from "../interfaces";
import { authorizationInstance } from "./authorization.service";
import { configServiceInstance } from "./configFile.service";
import { TAppSearch } from "../utils/findNodeBySearchKey";

export class AppProfileService {
  private static instance: AppProfileService;
  public context: SpinalContext;

  private constructor() { }

  public static getInstance(): AppProfileService {
    if (!this.instance) {
      this.instance = new AppProfileService();
    }

    return this.instance;
  }

  public async init(): Promise<SpinalContext> {
    this.context = await configServiceInstance.getContext(APP_PROFILE_CONTEXT_NAME);
    if (!this.context) this.context = await configServiceInstance.addContext(APP_PROFILE_CONTEXT_NAME, APP_PROFILE_CONTEXT_TYPE);
    return this.context;
  }


  /**
   * Creates a new application profile node and authorizes access to APIs, apps, and contexts if provided.
   * @param appProfile The profile data to create.
   * @returns The created profile node and its authorized resources.
   */
  public async createAppProfile(appProfile: IProfile): Promise<IProfileRes> {
    const profileNode = new SpinalNode(appProfile.name, APP_PROFILE_TYPE);

    const obj: IProfileRes = { node: profileNode };

    if (appProfile.apisIds) obj.apis = await this.authorizeProfileToAccessApis(profileNode, appProfile.apisIds);
    if (appProfile.appsIds) obj.apps = await this.authorizeProfileToAccessApps(profileNode, appProfile.appsIds);
    if (appProfile.contextIds) obj.contexts = await this.authorizeProfileToAccessContext(profileNode, appProfile.contextIds);

    await this.context.addChildInContext(profileNode, CONTEXT_TO_USER_PROFILE_RELATION_NAME, PTR_LST_TYPE, this.context);

    return obj;
  }


  /**
   * Retrieves the application profile node and its associated authorization structure.
   *
   * @param appProfile - The application profile identifier or a SpinalNode instance.
   * @returns A promise that resolves to an object containing the profile node and its authorization structure,
   *          or `undefined` if the node could not be found.
   */
  public async getAppProfile(appProfile: string | SpinalNode): Promise<IProfileRes> {
    const node = appProfile instanceof SpinalNode ? appProfile : await this._getAppProfileNode(appProfile);
    if (!node) return;

    return { node, ...(await this.getAutorizationStructure(node)) };
  }


  /**
   * Updates an existing application profile node with new data and re-authorizes access to APIs, apps, and contexts.
   *
   * @param {string} appProfileId
   * @param {IProfileAuthEdit} appProfile
   * @return {*}  {Promise<IProfileRes>}
   * @memberof AppProfileService
   */
  public async updateAppProfile(appProfileId: string, appProfile: IProfileAuthEdit): Promise<IProfileRes> {
    const profileNode = await this._getAppProfileNode(appProfileId);
    if (!profileNode) return;

    this._renameProfile(profileNode, appProfile.name);

    await this._unauthorizeAll(profileNode, appProfile);
    await this._authorizeAll(profileNode, appProfile);

    return this.getAppProfile(profileNode);
  }


  /**
   * Retrieves all application profiles with their authorization structures.
   * @returns A promise that resolves to an array of profile nodes and their authorized resources.
   */
  public async getAllAppProfile(): Promise<IProfileRes[]> {
    const contexts = await this.getAllAppProfileNodes();
    const promises = contexts.map((node) => this.getAppProfile(node));
    return Promise.all(promises);
  }

  /**
   * Retrieves all application profile nodes in the context.
   * @returns An array of SpinalNode instances representing all application profiles.
   */
  public getAllAppProfileNodes() {
    return this.context.getChildrenInContext();
  }

  /**
   * Deletes an application profile node from the graph.
   *
   * @param {string} appProfileId
   * @return {*}  {Promise<string>}
   * @memberof AppProfileService
   */
  public async deleteAppProfile(appProfileId: string): Promise<string> {
    const node = await this._getAppProfileNode(appProfileId);
    if (!node) throw new Error(`no profile Found for ${appProfileId}`);
    await node.removeFromGraph();
    return appProfileId;
  }

  /**
   * Retrieves the application profile node graph by its ID.
   * @param {string} profileId - The ID of the application profile.
   * @param {string} [digitalTwinId] - Optional digital twin ID for authorization.
   * @returns {Promise<SpinalGraph | void>} A promise that resolves to the SpinalGraph of the application profile or void if not found.
   */
  public async getAppProfileNodeGraph(profileId: string, digitalTwinId?: string): Promise<SpinalGraph | void> {
    const profile = await this._getAppProfileNode(profileId);
    if (profile) {
      const digitalTwin = await authorizationInstance.getAuthorizedDigitalTwinNode(profile, digitalTwinId);
      if (digitalTwin) return digitalTwin.getElement();
    }
  }

  /// END CRUD

  /// AUTH BEGIN

  /////////////////////////////////////////////
  //               AUTHORIZE
  /////////////////////////////////////////////

  /**
   * Authorizes an application profile to access specified contexts, apps, and APIs.
   * @param appProfile The application profile node or its ID.
   * @param data The authorization data containing context IDs, app IDs, and API IDs.
   * @returns A promise that resolves to the authorized resources.
   */
  public async authorizeProfileToAccessContext(appProfile: string | SpinalNode, contextIds: string | string[], digitalTwinId?: string): Promise<SpinalContext[]> {
    const profile = appProfile instanceof SpinalNode ? appProfile : await this._getAppProfileNode(appProfile);
    return authorizationInstance.authorizeProfileToAccessContext(profile, digitalTwinId, contextIds);
  }

  /**
   * Authorizes an application profile to access specified apps.
   *
   * @param {(string | SpinalNode)} appProfile
   * @param {(string | string[])} appIds
   * @return {*} 
   * @memberof AppProfileService
   */
  public async authorizeProfileToAccessApps(appProfile: string | SpinalNode, appIds: string | string[]) {
    const profile = appProfile instanceof SpinalNode ? appProfile : await this._getAppProfileNode(appProfile);
    return authorizationInstance.authorizeProfileToAccessApps(profile, appIds);
  }

  /**
   * Authorizes an application profile to access specified APIs.
   *
   * @param {(string | SpinalNode)} appProfile
   * @param {(string | string[])} apiIds
   * @return {*} 
   * @memberof AppProfileService
   */
  public async authorizeProfileToAccessApis(appProfile: string | SpinalNode, apiIds: string | string[]) {
    const profile = appProfile instanceof SpinalNode ? appProfile : await this._getAppProfileNode(appProfile);
    return authorizationInstance.authorizeProfileToAccessApis(profile, apiIds);
  }

  /**
   * Retrieves the authorization structure for a given application profile.
   *
   * @param {(string | SpinalNode)} appProfile
   * @param {string} [digitalTwinId]
   * @return {*}  {Promise<IProfileAuthRes>}
   * @memberof AppProfileService
   */
  public async getAutorizationStructure(appProfile: string | SpinalNode, digitalTwinId?: string): Promise<IProfileAuthRes> {
    const profile = appProfile instanceof SpinalNode ? appProfile : await this._getAppProfileNode(appProfile);

    return {
      contexts: await this.getAuthorizedContexts(profile, digitalTwinId),
      apis: await this.getAuthorizedApis(profile),
      apps: await this.getAuthorizedApps(profile),
    };
  }

  /////////////////////////////////////////////
  //             UNAUTHORIZE
  /////////////////////////////////////////////

  /**
   * Unauthorizes an application profile from accessing specified contexts.
   *
   * @param {(string | SpinalNode)} appProfile
   * @param {(string | string[])} contextIds
   * @param {string} [digitalTwinId]
   * @return {*}  {Promise<SpinalContext[]>}
   * @memberof AppProfileService
   */
  public async unauthorizeProfileToAccessContext(appProfile: string | SpinalNode, contextIds: string | string[], digitalTwinId?: string): Promise<SpinalContext[]> {
    const profile = appProfile instanceof SpinalNode ? appProfile : await this._getAppProfileNode(appProfile);
    return authorizationInstance.unauthorizeProfileToAccessContext(profile, digitalTwinId, contextIds);
  }

  /**
   * Unauthorizes an application profile from accessing specified apps.
   *
   * @param {(string | SpinalNode)} appProfile
   * @param {(string | string[])} appIds
   * @return {*}  {Promise<SpinalNode[]>}
   * @memberof AppProfileService
   */
  public async unauthorizeProfileToAccessApps(appProfile: string | SpinalNode, appIds: string | string[]): Promise<SpinalNode[]> {
    const profile = appProfile instanceof SpinalNode ? appProfile : await this._getAppProfileNode(appProfile);
    return authorizationInstance.unauthorizeProfileToAccessApps(profile, appIds);
  }

  /**
   * Unauthorizes an application profile from accessing specified APIs.
   *
   * @param {(string | SpinalNode)} appProfile
   * @param {(string | string[])} apiIds
   * @return {*}  {Promise<SpinalNode[]>}
   * @memberof AppProfileService
   */
  public async unauthorizeProfileToAccessApis(appProfile: string | SpinalNode, apiIds: string | string[]): Promise<SpinalNode[]> {
    const profile = appProfile instanceof SpinalNode ? appProfile : await this._getAppProfileNode(appProfile);
    return authorizationInstance.unauthorizeProfileToAccessApis(profile, apiIds);
  }

  ///////////////////////////////////////////////
  //             VERIFICATION
  ///////////////////////////////////////////////

  /**
   * Checks if an application profile has access to a specific context.
   *
   * @param {(string | SpinalNode)} appProfile
   * @param {string} contextId
   * @param {string} [digitalTwinId]
   * @return {*}  {Promise<SpinalNode>}
   * @memberof AppProfileService
   */
  public async profileHasAccessToContext(appProfile: string | SpinalNode, contextId: string, digitalTwinId?: string): Promise<SpinalNode> {
    const profile = appProfile instanceof SpinalNode ? appProfile : await this._getAppProfileNode(appProfile);
    return authorizationInstance.profileHasAccessToContext(profile, digitalTwinId, contextId);
  }

  /**
   * Checks if an application profile has access to a specific app.
   *
   * @param {TAppSearch} searchKeys
   * @param {(string | SpinalNode)} appProfile
   * @param {string} appId
   * @return {*}  {Promise<SpinalNode>}
   * @memberof AppProfileService
   */
  public async profileHasAccessToApp(searchKeys: TAppSearch, appProfile: string | SpinalNode, appId: string): Promise<SpinalNode> {
    const profile = appProfile instanceof SpinalNode ? appProfile : await this._getAppProfileNode(appProfile);
    return authorizationInstance.profileHasAccessToApp(searchKeys, profile, appId);
  }

  /**
   * Checks if an application profile has access to a specific API.
   *
   * @param {(string | SpinalNode)} appProfile
   * @param {string} apiId
   * @return {*}  {Promise<SpinalNode>}
   * @memberof AppProfileService
   */
  public async profileHasAccessToApi(appProfile: string | SpinalNode, apiId: string): Promise<SpinalNode> {
    const profile = appProfile instanceof SpinalNode ? appProfile : await this._getAppProfileNode(appProfile);
    return authorizationInstance.profileHasAccessToApi(profile, apiId);
  }

  /////////////////////////////////////////////
  //               GET AUTHORIZED
  /////////////////////////////////////////////

  /**
   * Retrieves the contexts that an application profile is authorized to access.
   *
   * @param {(string | SpinalNode)} appProfile
   * @param {string} [digitalTwinId]
   * @return {*}  {Promise<SpinalContext[]>}
   * @memberof AppProfileService
   */
  public async getAuthorizedContexts(appProfile: string | SpinalNode, digitalTwinId?: string): Promise<SpinalContext[]> {
    const profile = appProfile instanceof SpinalNode ? appProfile : await this._getAppProfileNode(appProfile);
    return authorizationInstance.getAuthorizedContexts(profile, digitalTwinId);
  }

  /**
   * Retrieves the applications that an application profile is authorized to access.
   *
   * @param {(string | SpinalNode)} appProfile
   * @return {*}  {Promise<SpinalNode[]>}
   * @memberof AppProfileService
   */
  public async getAuthorizedApps(appProfile: string | SpinalNode): Promise<SpinalNode[]> {
    const profile = appProfile instanceof SpinalNode ? appProfile : await this._getAppProfileNode(appProfile);
    return authorizationInstance.getAuthorizedApps(profile);
  }

  /**
   * Retrieves the APIs that an application profile is authorized to access.
   *
   * @param {(string | SpinalNode)} appProfile
   * @return {*}  {Promise<SpinalNode[]>}
   * @memberof AppProfileService
   */
  public async getAuthorizedApis(appProfile: string | SpinalNode): Promise<SpinalNode[]> {
    const profile = appProfile instanceof SpinalNode ? appProfile : await this._getAppProfileNode(appProfile);
    return authorizationInstance.getAuthorizedApis(profile);
  }

  ///////////////////////////////////////////////////////////
  ///                       PRIVATES                      //
  //////////////////////////////////////////////////////////

  public async _getAppProfileNodeGraph(profileId: string): Promise<SpinalGraph | void> {
    const profile = await this._getAppProfileNode(profileId);
    if (profile) return profile.getElement();
  }

  public async _getAppProfileNode(appProfileId: string): Promise<SpinalNode> {
    const node = SpinalGraphService.getRealNode(appProfileId);
    if (node) return node;

    return this._findChildInContext(this.context, appProfileId);
  }

  private _renameProfile(node: SpinalNode, newName: string) {
    if (newName && newName.trim()) node.info.name.set(newName);
  }

  private async _findChildInContext(startNode: SpinalNode, nodeIdOrName: string): Promise<SpinalNode> {
    const children = await startNode.getChildrenInContext(this.context);
    return children.find((el) => {
      if (el.getId().get() === nodeIdOrName || el.getName().get() === nodeIdOrName) {
        //@ts-ignore
        SpinalGraphService._addNode(el);
        return true;
      }
      return false;
    });
  }

  private _unauthorizeAll(profile: SpinalNode, data: { unauthorizeApisIds?: string[], unauthorizeAppsIds?: string[], unauthorizeContextIds?: string[] }) {
    const unauthorizePromises = [];

    if (data.unauthorizeApisIds) unauthorizePromises.push(this.unauthorizeProfileToAccessApis(profile, data.unauthorizeApisIds));
    if (data.unauthorizeAppsIds) unauthorizePromises.push(this.unauthorizeProfileToAccessApps(profile, data.unauthorizeAppsIds));
    if (data.unauthorizeContextIds) unauthorizePromises.push(this.unauthorizeProfileToAccessContext(profile, data.unauthorizeContextIds));

    return Promise.all(unauthorizePromises);
  }

  private async _authorizeAll(profile: SpinalNode, data: { apiIds?: string[], appsIds?: string[], contextIds?: string[] }): Promise<IProfileAuthRes> {
    const authorizePromises = [];

    authorizePromises.push(this.authorizeProfileToAccessApis(profile, data.apiIds || []));
    authorizePromises.push(this.authorizeProfileToAccessApps(profile, data.appsIds || []));
    authorizePromises.push(this.authorizeProfileToAccessContext(profile, data.contextIds || []));

    const [apis, apps, contexts] = await Promise.all(authorizePromises);
    return {
      apis,
      apps,
      contexts
    };

  }

}
