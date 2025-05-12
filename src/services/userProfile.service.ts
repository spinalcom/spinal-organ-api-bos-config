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

import {
  SpinalGraphService,
  SpinalGraph,
  SpinalContext,
  SpinalNode,
} from 'spinal-env-viewer-graph-service';
import {
  USER_PROFILE_TYPE,
  PTR_LST_TYPE,
  CONTEXT_TO_USER_PROFILE_RELATION_NAME,
  USER_PROFILE_CONTEXT_NAME,
  USER_PROFILE_CONTEXT_TYPE,
  ADMIN_PROFILE_TYPE,
} from '../constant';
import {
  IProfile,
  IProfileAuthEdit,
  IProfileAuthRes,
  IProfileRes,
} from '../interfaces';
import { authorizationInstance } from './authorization.service';
import { configServiceInstance } from './configFile.service';
import {} from '../utils/profileUtils';
import { AdminProfileService } from './adminProfile.service';
import { TAppSearch } from '../utils/findNodeBySearchKey';

export class UserProfileService {
  private static instance: UserProfileService;
  public context: SpinalContext;
  private adminProfile: SpinalNode;

  private constructor() {}

  public static getInstance(): UserProfileService {
    if (!this.instance) {
      this.instance = new UserProfileService();
    }

    return this.instance;
  }

  public async init(): Promise<SpinalContext> {
    this.context = await configServiceInstance.getContext(
      USER_PROFILE_CONTEXT_NAME
    );
    if (!this.context)
      this.context = await configServiceInstance.addContext(
        USER_PROFILE_CONTEXT_NAME,
        USER_PROFILE_CONTEXT_TYPE
      );

    await AdminProfileService.getInstance().init(this.context);
    return this.context;
  }

  /// CRUD BEGIN

  public async createUserProfile(userProfile: IProfile): Promise<IProfileRes> {
    const profileNode = new SpinalNode(userProfile.name, USER_PROFILE_TYPE);

    const obj: IProfileRes = {
      node: profileNode,
    };

    if (userProfile.apisIds)
      obj.apis = await this.authorizeProfileToAccessApis(
        profileNode,
        userProfile.apisIds
      );
    if (userProfile.appsIds) {
      obj.apps = await this.authorizeProfileToAccessApps(
        profileNode,
        userProfile.appsIds
      );
      if (userProfile.subAppsIds)
        obj.subApps = await this.authorizeProfileToAccessSubApps(
          profileNode,
          obj.apps,
          userProfile.subAppsIds
        );
    }
    if (userProfile.contextIds)
      obj.contexts = await this.authorizeProfileToAccessContext(
        profileNode,
        userProfile.contextIds
      );

    await this.context.addChildInContext(
      profileNode,
      CONTEXT_TO_USER_PROFILE_RELATION_NAME,
      PTR_LST_TYPE,
      this.context
    );

    return obj;
  }

  public async getUserProfile(
    userProfile: string | SpinalNode
  ): Promise<IProfileRes> {
    const node =
      userProfile instanceof SpinalNode
        ? userProfile
        : await this._getUserProfileNode(userProfile);
    if (!node) return;

    return {
      node,
      ...(await this.getAutorizationStructure(node)),
    };
  }

  public async updateUserProfile(
    userProfileId: string,
    userProfile: IProfileAuthEdit
  ): Promise<IProfileRes> {
    const profileNode = await this._getUserProfileNode(userProfileId);
    if (!profileNode) return;

    this._renameProfile(profileNode, userProfile.name);

    if (userProfile.unauthorizeApisIds)
      await this.unauthorizeProfileToAccessApis(
        profileNode,
        userProfile.unauthorizeApisIds
      );
    if (userProfile.unauthorizeAppsIds)
      await this.unauthorizeProfileToAccessApps(
        profileNode,
        userProfile.unauthorizeAppsIds
      );
    if (userProfile.unauthorizeSubAppsIds)
      await this.unauthorizeProfileToAccessSubApps(
        profileNode,
        userProfile.unauthorizeSubAppsIds
      );
    if (userProfile.unauthorizeContextIds)
      await this.unauthorizeProfileToAccessContext(
        profileNode,
        userProfile.unauthorizeContextIds
      );

    if (userProfile.apisIds)
      await this.authorizeProfileToAccessApis(profileNode, userProfile.apisIds);
    if (userProfile.appsIds) {
      const nodeApps = await this.authorizeProfileToAccessApps(
        profileNode,
        userProfile.appsIds
      );
      if (userProfile.subAppsIds)
        await this.authorizeProfileToAccessSubApps(
          profileNode,
          nodeApps,
          userProfile.subAppsIds
        );
    }
    if (userProfile.contextIds)
      await this.authorizeProfileToAccessContext(
        profileNode,
        userProfile.contextIds
      );

    return this.getUserProfile(profileNode);
  }

  public async getAllUserProfile(): Promise<IProfileRes[]> {
    const contexts = await this.getAllUserProfileNodes();
    const promises = contexts.map((node) => this.getUserProfile(node));
    return Promise.all(promises);
  }

  public getAllUserProfileNodes() {
    return this.context.getChildrenInContext();
  }

  public async deleteUserProfile(userProfileId: string): Promise<string> {
    const node = await this._getUserProfileNode(userProfileId);
    if (!node) throw new Error(`no profile Found for ${userProfileId}`);
    await node.removeFromGraph();
    return userProfileId;
  }

  public async getUserProfileNodeGraph(
    profileId: string,
    digitalTwinId?: string
  ): Promise<SpinalGraph | void> {
    const profile = await this._getUserProfileNode(profileId);
    if (profile) {
      const digitalTwin =
        await authorizationInstance.getAuthorizedDigitalTwinNode(
          profile,
          digitalTwinId
        );
      if (digitalTwin) return digitalTwin.getElement();
    }
  }

  /// END CRUD

  /// AUTH BEGIN

  /////////////////////////////////////////////
  //               AUTHORIZE
  /////////////////////////////////////////////
  public async authorizeProfileToAccessContext(
    userProfile: string | SpinalNode,
    contextIds: string | string[],
    digitalTwinId?: string
  ): Promise<SpinalContext[]> {
    const profile =
      userProfile instanceof SpinalNode
        ? userProfile
        : await this._getUserProfileNode(userProfile);
    return authorizationInstance.authorizeProfileToAccessContext(
      profile,
      digitalTwinId,
      contextIds
    );
  }

  public async authorizeProfileToAccessApps(
    userProfile: string | SpinalNode,
    appIds: string | string[]
  ) {
    const profile =
      userProfile instanceof SpinalNode
        ? userProfile
        : await this._getUserProfileNode(userProfile);
    return authorizationInstance.authorizeProfileToAccessApps(profile, appIds);
  }

  public async authorizeProfileToAccessSubApps(
    userProfile: string | SpinalNode,
    apps: SpinalNode[],
    subAppIds: string | string[]
  ) {
    const profile =
      userProfile instanceof SpinalNode
        ? userProfile
        : await this._getUserProfileNode(userProfile);
    return authorizationInstance.authorizeProfileToAccessSubApps(
      profile,
      apps,
      subAppIds
    );
  }

  public async authorizeProfileToAccessApis(
    userProfile: string | SpinalNode,
    apiIds: string | string[]
  ) {
    const profile =
      userProfile instanceof SpinalNode
        ? userProfile
        : await this._getUserProfileNode(userProfile);
    return authorizationInstance.authorizeProfileToAccessApis(profile, apiIds);
  }

  public async getAutorizationStructure(
    userProfile: string | SpinalNode,
    digitalTwinId?: string
  ): Promise<IProfileAuthRes> {
    const profile =
      userProfile instanceof SpinalNode
        ? userProfile
        : await this._getUserProfileNode(userProfile);
    const res: IProfileAuthRes = {
      contexts: await this.getAuthorizedContexts(profile, digitalTwinId),
      apis: await this.getAuthorizedApis(profile),
      apps: await this.getAuthorizedApps(profile),
      subApps: await this.getAuthorizedSubApps(profile),
    };

    if (profile.getType().get() === ADMIN_PROFILE_TYPE) {
      res.adminApps = await this.getAuthorizedAdminApps(profile);
    }
    return res;
    // return {
    //   contexts: await this.getAuthorizedContexts(profile, digitalTwinId),
    //   apis: await this.getAuthorizedApis(profile),
    //   subApps: await this.getAuthorizedSubApps(profile),
    //   apps: await this.getAuthorizedApps(profile),
    //   ...(profile.getType().get() === ADMIN_PROFILE_TYPE && {
    //     adminApps: await this.getAuthorizedAdminApps(profile),
    //   }),
    // };
  }

  /////////////////////////////////////////////
  //             UNAUTHORIZE
  /////////////////////////////////////////////

  public async unauthorizeProfileToAccessContext(
    userProfile: string | SpinalNode,
    contextIds: string | string[],
    digitalTwinId?: string
  ): Promise<SpinalContext[]> {
    const profile =
      userProfile instanceof SpinalNode
        ? userProfile
        : await this._getUserProfileNode(userProfile);
    return authorizationInstance.unauthorizeProfileToAccessContext(
      profile,
      digitalTwinId,
      contextIds
    );
  }

  public async unauthorizeProfileToAccessApps(
    userProfile: string | SpinalNode,
    appIds: string | string[]
  ): Promise<SpinalNode[]> {
    const profile =
      userProfile instanceof SpinalNode
        ? userProfile
        : await this._getUserProfileNode(userProfile);
    return authorizationInstance.unauthorizeProfileToAccessApps(
      profile,
      appIds
    );
  }

  public async unauthorizeProfileToAccessSubApps(
    userProfile: string | SpinalNode,
    subAppIds: string | string[]
  ): Promise<SpinalNode[]> {
    const profile =
      userProfile instanceof SpinalNode
        ? userProfile
        : await this._getUserProfileNode(userProfile);
    return authorizationInstance.unauthorizeProfileToAccessSubApps(
      profile,
      subAppIds
    );
  }

  public async unauthorizeProfileToAccessApis(
    userProfile: string | SpinalNode,
    apiIds: string | string[]
  ): Promise<SpinalNode[]> {
    const profile =
      userProfile instanceof SpinalNode
        ? userProfile
        : await this._getUserProfileNode(userProfile);
    return authorizationInstance.unauthorizeProfileToAccessApis(
      profile,
      apiIds
    );
  }

  ///////////////////////////////////////////////
  //             VERIFICATION
  ///////////////////////////////////////////////

  public async profileHasAccessToContext(
    userProfile: string | SpinalNode,
    contextId: string,
    digitalTwinId?: string
  ): Promise<SpinalNode> {
    const profile =
      userProfile instanceof SpinalNode
        ? userProfile
        : await this._getUserProfileNode(userProfile);
    return authorizationInstance.profileHasAccessToContext(
      profile,
      digitalTwinId,
      contextId
    );
  }

  public async profileHasAccessToApp(
    searchKeys: TAppSearch,
    userProfile: string | SpinalNode,
    appId: string
  ): Promise<SpinalNode> {
    const profile =
      userProfile instanceof SpinalNode
        ? userProfile
        : await this._getUserProfileNode(userProfile);
    return authorizationInstance.profileHasAccessToApp(
      searchKeys,
      profile,
      appId
    );
  }
  public async profileHasAccessToSubApp(
    searchKeys: TAppSearch,
    userProfile: string | SpinalNode,
    appNameOrId: string,
    subAppNameOrId: string
  ): Promise<SpinalNode> {
    const profile =
      userProfile instanceof SpinalNode
        ? userProfile
        : await this._getUserProfileNode(userProfile);
    return authorizationInstance.profileHasAccessToSubApp(
      searchKeys,
      profile,
      appNameOrId,
      subAppNameOrId
    );
  }

  public async profileHasAccessToApi(
    userProfile: string | SpinalNode,
    apiId: string
  ): Promise<SpinalNode> {
    const profile =
      userProfile instanceof SpinalNode
        ? userProfile
        : await this._getUserProfileNode(userProfile);
    return authorizationInstance.profileHasAccessToApi(profile, apiId);
  }

  /////////////////////////////////////////////
  //               GET AUTHORIZED
  /////////////////////////////////////////////

  public async getAuthorizedContexts(
    userProfile: string | SpinalNode,
    digitalTwinId?: string
  ): Promise<SpinalContext[]> {
    const profile =
      userProfile instanceof SpinalNode
        ? userProfile
        : await this._getUserProfileNode(userProfile);
    return authorizationInstance.getAuthorizedContexts(profile, digitalTwinId);
  }

  public async getAuthorizedApps(
    userProfile: string | SpinalNode
  ): Promise<SpinalNode[]> {
    const profile =
      userProfile instanceof SpinalNode
        ? userProfile
        : await this._getUserProfileNode(userProfile);
    return authorizationInstance.getAuthorizedApps(profile);
  }

  public async getAuthorizedSubApps(
    userProfile: string | SpinalNode
  ): Promise<SpinalNode[]> {
    const profile =
      userProfile instanceof SpinalNode
        ? userProfile
        : await this._getUserProfileNode(userProfile);
    return authorizationInstance.getAuthorizedSubApps(profile);
  }

  public async getAuthorizedAdminApps(
    userProfile: string | SpinalNode
  ): Promise<SpinalNode[]> {
    const profile =
      userProfile instanceof SpinalNode
        ? userProfile
        : await this._getUserProfileNode(userProfile);
    return authorizationInstance.getAuthorizedAdminApps(profile);
  }

  public async getAuthorizedApis(
    userProfile: string | SpinalNode
  ): Promise<SpinalNode[]> {
    const profile =
      userProfile instanceof SpinalNode
        ? userProfile
        : await this._getUserProfileNode(userProfile);
    return authorizationInstance.getAuthorizedApis(profile);
  }

  ///////////////////////////////////////////////////////////
  ///                       PRIVATES                      //
  //////////////////////////////////////////////////////////

  public async _getUserProfileNode(userProfileId: string): Promise<SpinalNode> {
    const node = SpinalGraphService.getRealNode(userProfileId);
    if (node) return node;

    return this._findChildInContext(this.context, userProfileId);
  }

  private _renameProfile(node: SpinalNode, newName: string) {
    if (newName && newName.trim()) node.info.name.set(newName);
  }

  private async _findChildInContext(
    startNode: SpinalNode,
    nodeIdOrName: string
  ): Promise<SpinalNode> {
    const children = await startNode.getChildrenInContext(this.context);
    return children.find((el) => {
      if (
        el.getId().get() === nodeIdOrName ||
        el.getName().get() === nodeIdOrName
      ) {
        //@ts-ignore
        SpinalGraphService._addNode(el);
        return true;
      }
      return false;
    });
  }
}
