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

import { SpinalGraphService, SpinalGraph, SpinalContext, SpinalNode } from 'spinal-env-viewer-graph-service';
import { APP_PROFILE_TYPE, PTR_LST_TYPE, CONTEXT_TO_USER_PROFILE_RELATION_NAME, APP_PROFILE_CONTEXT_NAME, APP_PROFILE_CONTEXT_TYPE } from '../constant';
import { IProfile, IProfileAuthEdit, IProfileAuthRes, IProfileRes } from '../interfaces';
import { authorizationInstance } from './authorization.service';
import { configServiceInstance } from './configFile.service';
import { } from '../utils/profileUtils';
import { AdminProfileService } from './adminProfile.service';

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

  /// CRUD BEGIN

  public async createAppProfile(appProfile: IProfile): Promise<IProfileRes> {
    const profileNode = new SpinalNode(appProfile.name, APP_PROFILE_TYPE);

    const obj: IProfileRes = {
      node: profileNode
    }

    if (appProfile.apisIds) obj.apis = await this.authorizeProfileToAccessApis(profileNode, appProfile.apisIds);
    if (appProfile.appsIds) obj.apps = await this.authorizeProfileToAccessApps(profileNode, appProfile.appsIds);
    if (appProfile.contextIds) obj.contexts = await this.authorizeProfileToAccessContext(profileNode, appProfile.contextIds);

    await this.context.addChildInContext(profileNode, CONTEXT_TO_USER_PROFILE_RELATION_NAME, PTR_LST_TYPE, this.context)

    return obj;
  }

  public async getAppProfile(appProfile: string | SpinalNode): Promise<IProfileRes> {
    const node = appProfile instanceof SpinalNode ? appProfile : await this._getAppProfileNode(appProfile);
    if (!node) return;

    return {
      node,
      ...(await this.getAutorizationStructure(node))
    };
  }

  public async updateAppProfile(appProfileId: string, appProfile: IProfileAuthEdit): Promise<IProfileRes> {
    const profileNode = await this._getAppProfileNode(appProfileId);
    if (!profileNode) return;

    this._renameProfile(profileNode, appProfile.name);

    if (appProfile.unauthorizeApisIds) await this.unauthorizeProfileToAccessApis(profileNode, appProfile.unauthorizeApisIds);
    if (appProfile.unauthorizeAppsIds) await this.unauthorizeProfileToAccessApps(profileNode, appProfile.unauthorizeAppsIds);
    if (appProfile.unauthorizeContextIds) await this.unauthorizeProfileToAccessContext(profileNode, appProfile.unauthorizeContextIds);

    if (appProfile.apisIds) await this.authorizeProfileToAccessApis(profileNode, appProfile.apisIds);
    if (appProfile.appsIds) await this.authorizeProfileToAccessApps(profileNode, appProfile.appsIds);
    if (appProfile.contextIds) await this.authorizeProfileToAccessContext(profileNode, appProfile.contextIds);

    return this.getAppProfile(profileNode);
  }

  public async getAllAppProfile(): Promise<IProfileRes[]> {
    const contexts = await this.getAllAppProfileNodes();
    const promises = contexts.map(node => this.getAppProfile(node));
    return Promise.all(promises);
  }

  public getAllAppProfileNodes() {
    return this.context.getChildrenInContext();
  }

  public async deleteAppProfile(appProfileId: string): Promise<string> {
    const node = await this._getAppProfileNode(appProfileId);
    if (!node) throw new Error(`no profile Found for ${appProfileId}`);
    await node.removeFromGraph();
    return appProfileId;
  }


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
  public async authorizeProfileToAccessContext(appProfile: string | SpinalNode, contextIds: string | string[], digitalTwinId?: string): Promise<SpinalContext[]> {
    const profile = appProfile instanceof SpinalNode ? appProfile : await this._getAppProfileNode(appProfile);
    return authorizationInstance.authorizeProfileToAccessContext(profile, digitalTwinId, contextIds);
  }

  public async authorizeProfileToAccessApps(appProfile: string | SpinalNode, appIds: string | string[]) {
    const profile = appProfile instanceof SpinalNode ? appProfile : await this._getAppProfileNode(appProfile);
    return authorizationInstance.authorizeProfileToAccessApps(profile, appIds);
  }

  public async authorizeProfileToAccessApis(appProfile: string | SpinalNode, apiIds: string | string[]) {
    const profile = appProfile instanceof SpinalNode ? appProfile : await this._getAppProfileNode(appProfile);
    return authorizationInstance.authorizeProfileToAccessApis(profile, apiIds);
  }

  public async getAutorizationStructure(appProfile: string | SpinalNode, digitalTwinId?: string): Promise<IProfileAuthRes> {
    const profile = appProfile instanceof SpinalNode ? appProfile : await this._getAppProfileNode(appProfile);

    return {
      contexts: await this.getAuthorizedContexts(profile, digitalTwinId),
      apis: await this.getAuthorizedApis(profile),
      apps: await this.getAuthorizedApps(profile)
    }
  }

  /////////////////////////////////////////////
  //             UNAUTHORIZE
  /////////////////////////////////////////////

  public async unauthorizeProfileToAccessContext(appProfile: string | SpinalNode, contextIds: string | string[], digitalTwinId?: string): Promise<SpinalContext[]> {
    const profile = appProfile instanceof SpinalNode ? appProfile : await this._getAppProfileNode(appProfile);
    return authorizationInstance.unauthorizeProfileToAccessContext(profile, digitalTwinId, contextIds)
  }

  public async unauthorizeProfileToAccessApps(appProfile: string | SpinalNode, appIds: string | string[]): Promise<SpinalNode[]> {
    const profile = appProfile instanceof SpinalNode ? appProfile : await this._getAppProfileNode(appProfile);
    return authorizationInstance.unauthorizeProfileToAccessApps(profile, appIds)
  }

  public async unauthorizeProfileToAccessApis(appProfile: string | SpinalNode, apiIds: string | string[]): Promise<SpinalNode[]> {
    const profile = appProfile instanceof SpinalNode ? appProfile : await this._getAppProfileNode(appProfile);
    return authorizationInstance.unauthorizeProfileToAccessApis(profile, apiIds)
  }

  ///////////////////////////////////////////////
  //             VERIFICATION
  ///////////////////////////////////////////////

  public async profileHasAccessToContext(appProfile: string | SpinalNode, contextId: string, digitalTwinId?: string): Promise<SpinalNode> {
    const profile = appProfile instanceof SpinalNode ? appProfile : await this._getAppProfileNode(appProfile);
    return authorizationInstance.profileHasAccessToContext(profile, digitalTwinId, contextId);
  }

  public async profileHasAccessToApp(appProfile: string | SpinalNode, appId: string): Promise<SpinalNode> {
    const profile = appProfile instanceof SpinalNode ? appProfile : await this._getAppProfileNode(appProfile);
    return authorizationInstance.profileHasAccessToApp(profile, appId);
  }

  public async profileHasAccessToApi(appProfile: string | SpinalNode, apiId: string): Promise<SpinalNode> {
    const profile = appProfile instanceof SpinalNode ? appProfile : await this._getAppProfileNode(appProfile);
    return authorizationInstance.profileHasAccessToApi(profile, apiId);
  }

  /////////////////////////////////////////////
  //               GET AUTHORIZED
  /////////////////////////////////////////////

  public async getAuthorizedContexts(appProfile: string | SpinalNode, digitalTwinId?: string): Promise<SpinalContext[]> {
    const profile = appProfile instanceof SpinalNode ? appProfile : await this._getAppProfileNode(appProfile);
    return authorizationInstance.getAuthorizedContexts(profile, digitalTwinId);
  }

  public async getAuthorizedApps(appProfile: string | SpinalNode): Promise<SpinalNode[]> {
    const profile = appProfile instanceof SpinalNode ? appProfile : await this._getAppProfileNode(appProfile);
    return authorizationInstance.getAuthorizedApps(profile);
  }

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
    return children.find(el => {
      if (el.getId().get() === nodeIdOrName || el.getName().get() === nodeIdOrName) {
        //@ts-ignore
        SpinalGraphService._addNode(el);
        return true;
      }
      return false;
    })
  }

}
