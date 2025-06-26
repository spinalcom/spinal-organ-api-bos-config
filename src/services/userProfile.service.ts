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
import { USER_PROFILE_TYPE, PTR_LST_TYPE, CONTEXT_TO_USER_PROFILE_RELATION_NAME, USER_PROFILE_CONTEXT_NAME, USER_PROFILE_CONTEXT_TYPE, ADMIN_PROFILE_TYPE } from "../constant";
import { IProfile, IProfileAuthEdit, IProfileAuthRes, IProfileRes } from "../interfaces";
import { authorizationInstance } from "./authorization.service";
import { configServiceInstance } from "./configFile.service";
import { } from "../utils/profileUtils";
import { AdminProfileService } from "./adminProfile.service";
import { TAppSearch } from "../utils/findNodeBySearchKey";

export class UserProfileService {
  private static instance: UserProfileService;
  public context: SpinalContext;

  private constructor() { }

  public static getInstance(): UserProfileService {
    if (!this.instance) {
      this.instance = new UserProfileService();
    }

    return this.instance;
  }

  public async init(): Promise<SpinalContext> {
    this.context = await configServiceInstance.getContext(USER_PROFILE_CONTEXT_NAME);
    if (!this.context) this.context = await configServiceInstance.addContext(USER_PROFILE_CONTEXT_NAME, USER_PROFILE_CONTEXT_TYPE);

    await AdminProfileService.getInstance().init(this.context);
    return this.context;
  }

  /// CRUD BEGIN

  /**
   * Creates a new user profile node and authorizes it to access specified APIs, apps, sub-apps, and contexts.
   *
   * @param userProfile - The user profile data containing the profile name and optional lists of API, app, sub-app, and context IDs to authorize.
   * @returns A promise that resolves to an object containing the created profile node and the results of the authorization operations.
   *
   * @remarks
   * - The method creates a new `SpinalNode` for the user profile.
   * - It conditionally authorizes the profile to access APIs, apps, sub-apps, and contexts based on the provided IDs.
   * - The new profile node is added as a child in the context with a specific relation.
   */
  public async createUserProfile(userProfile: IProfile): Promise<IProfileRes> {
    const profileNode = new SpinalNode(userProfile.name, USER_PROFILE_TYPE);

    const obj: IProfileRes = { node: profileNode };

    if (userProfile.apisIds) obj.apis = await this.authorizeProfileToAccessApis(profileNode, userProfile.apisIds);
    if (userProfile.appsIds) {
      obj.apps = await this.authorizeProfileToAccessApps(profileNode, userProfile.appsIds);
      if (userProfile.subAppsIds) obj.subApps = await this.authorizeProfileToAccessSubApps(profileNode, obj.apps, userProfile.subAppsIds);
    }

    if (userProfile.contextIds) obj.contexts = await this.authorizeProfileToAccessContext(profileNode, userProfile.contextIds);

    await this.context.addChildInContext(profileNode, CONTEXT_TO_USER_PROFILE_RELATION_NAME, PTR_LST_TYPE, this.context);

    return obj;
  }


  /**
   * Retrieves the user profile node and its associated authorization structure.
   *
   * @param userProfile - The user profile identifier as a string or a SpinalNode instance.
   * @returns A promise that resolves to an object containing the user profile node and its authorization structure,
   *          or `undefined` if the node could not be found.
   */
  public async getUserProfile(userProfile: string | SpinalNode): Promise<IProfileRes> {
    const node = userProfile instanceof SpinalNode ? userProfile : await this._getUserProfileNode(userProfile);
    if (!node) return;

    return {
      node,
      ...(await this.getAutorizationStructure(node)),
    };
  }

  /**
   * Updates a user profile with the provided information.
   *
   * This method performs the following actions:
   * - Retrieves the user profile node by its ID.
   * - Renames the profile if a new name is provided.
   * - Revokes access to APIs, Apps, SubApps, and Contexts as specified.
   * - Grants access to APIs, Apps, SubApps, and Contexts as specified.
   * - Returns the updated user profile.
   *
   * @param userProfileId - The unique identifier of the user profile to update.
   * @param userProfile - An object containing the updated profile information and access rights.
   * @returns A promise that resolves to the updated user profile response, or `undefined` if the profile node is not found.
   */
  public async updateUserProfile(userProfileId: string, userProfile: IProfileAuthEdit): Promise<IProfileRes> {
    const profileNode = await this._getUserProfileNode(userProfileId);
    if (!profileNode) return;

    this._renameProfile(profileNode, userProfile.name);

    if (userProfile.unauthorizeApisIds) await this.unauthorizeProfileToAccessApis(profileNode, userProfile.unauthorizeApisIds);
    if (userProfile.unauthorizeAppsIds) await this.unauthorizeProfileToAccessApps(profileNode, userProfile.unauthorizeAppsIds);
    if (userProfile.unauthorizeSubAppsIds) await this.unauthorizeProfileToAccessSubApps(profileNode, userProfile.unauthorizeSubAppsIds);
    if (userProfile.unauthorizeContextIds) await this.unauthorizeProfileToAccessContext(profileNode, userProfile.unauthorizeContextIds);

    if (userProfile.apisIds) await this.authorizeProfileToAccessApis(profileNode, userProfile.apisIds);

    if (userProfile.appsIds) {
      const nodeApps = await this.authorizeProfileToAccessApps(profileNode, userProfile.appsIds);
      if (userProfile.subAppsIds) await this.authorizeProfileToAccessSubApps(profileNode, nodeApps, userProfile.subAppsIds);
    }

    if (userProfile.contextIds) await this.authorizeProfileToAccessContext(profileNode, userProfile.contextIds);

    return this.getUserProfile(profileNode);
  }

  /**
   * Retrieves all user profiles.
   *
   * This method fetches all user profile nodes and then retrieves the corresponding user profile
   * information for each node. The results are returned as an array of `IProfileRes` objects.
   *
   * @returns {Promise<IProfileRes[]>} A promise that resolves to an array of user profile responses.
   */
  public async getAllUserProfile(): Promise<IProfileRes[]> {
    const contexts = await this.getAllUserProfileNodes();
    const promises = contexts.map((node) => this.getUserProfile(node));
    return Promise.all(promises);
  }

  /**
   * Retrieves all user profile nodes within the current context.
   *
   * @returns {Promise<any[]>} A promise that resolves to an array of user profile nodes found in the context.
   */
  public getAllUserProfileNodes() {
    return this.context.getChildrenInContext();
  }

  /**
   * Deletes a user profile by its unique identifier.
   *
   * This method retrieves the user profile node associated with the given `userProfileId`.
   * If the node exists, it removes the node from the graph. If the node does not exist,
   * an error is thrown indicating that no profile was found for the provided ID.
   *
   * @param userProfileId - The unique identifier of the user profile to delete.
   * @returns A promise that resolves to the `userProfileId` of the deleted profile.
   * @throws {Error} If no user profile is found for the given `userProfileId`.
   */
  public async deleteUserProfile(userProfileId: string): Promise<string> {
    const node = await this._getUserProfileNode(userProfileId);
    if (!node) throw new Error(`no profile Found for ${userProfileId}`);
    await node.removeFromGraph();
    return userProfileId;
  }

  /**
   * Retrieves the SpinalGraph associated with a user profile and a specific digital twin.
   *
   * @param profileId - The unique identifier of the user profile.
   * @param digitalTwinId - (Optional) The unique identifier of the digital twin.
   * @returns A promise that resolves to the SpinalGraph instance if found, or void otherwise.
   */
  public async getUserProfileNodeGraph(profileId: string, digitalTwinId?: string): Promise<SpinalGraph | void> {
    const profile = await this._getUserProfileNode(profileId);
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
   * Authorizes a user profile to access one or more specified contexts within a digital twin.
   *
   * @param userProfile - The user profile to authorize, provided as either a string (profile ID) or a `SpinalNode` instance.
   * @param contextIds - The ID or array of IDs of the contexts to which access is being authorized.
   * @param digitalTwinId - (Optional) The ID of the digital twin in which the contexts reside.
   * @returns A promise that resolves to an array of `SpinalContext` objects representing the contexts the profile is authorized to access.
   */
  public async authorizeProfileToAccessContext(userProfile: string | SpinalNode, contextIds: string | string[], digitalTwinId?: string): Promise<SpinalContext[]> {
    const profile = userProfile instanceof SpinalNode ? userProfile : await this._getUserProfileNode(userProfile);
    return authorizationInstance.authorizeProfileToAccessContext(profile, digitalTwinId, contextIds);
  }

  /**
   * Authorizes a user profile to access one or more applications.
   *
   * @param userProfile - The user profile to authorize, either as a string identifier or a SpinalNode instance.
   * @param appIds - The application ID or an array of application IDs to which access should be granted.
   * @returns A promise that resolves with the result of the authorization operation.
   */
  public async authorizeProfileToAccessApps(userProfile: string | SpinalNode, appIds: string | string[]) {
    const profile = userProfile instanceof SpinalNode ? userProfile : await this._getUserProfileNode(userProfile);
    return authorizationInstance.authorizeProfileToAccessApps(profile, appIds);
  }

  /**
   * Authorizes a user profile to access specific sub-applications within the provided applications.
   *
   * @param userProfile - The user profile to authorize, either as a string identifier or a SpinalNode instance.
   * @param apps - An array of SpinalNode instances representing the applications containing the sub-apps.
   * @param subAppIds - A single sub-app ID or an array of sub-app IDs to which access should be granted.
   * @returns A promise that resolves with the result of the authorization operation.
   */
  public async authorizeProfileToAccessSubApps(userProfile: string | SpinalNode, apps: SpinalNode[], subAppIds: string | string[]) {
    const profile = userProfile instanceof SpinalNode ? userProfile : await this._getUserProfileNode(userProfile);
    return authorizationInstance.authorizeProfileToAccessSubApps(profile, apps, subAppIds);
  }

  /**
   * Authorizes a user profile to access one or more APIs.
   *
   * @param userProfile - The user profile to authorize, either as a string identifier or a SpinalNode instance.
   * @param apiIds - The API ID or an array of API IDs to which access should be granted.
   * @returns A promise that resolves with the result of the authorization operation.
   */
  public async authorizeProfileToAccessApis(userProfile: string | SpinalNode, apiIds: string | string[]) {
    const profile = userProfile instanceof SpinalNode ? userProfile : await this._getUserProfileNode(userProfile);
    return authorizationInstance.authorizeProfileToAccessApis(profile, apiIds);
  }

  /**
   * Retrieves the authorization structure for a given user profile.
   *
   * This method gathers all authorized contexts, APIs, apps, and sub-apps for the specified user profile.
   * If the profile is of type ADMIN_PROFILE_TYPE, it also includes authorized admin apps.
   *
   * @param userProfile - The user profile identifier as a string or a SpinalNode instance.
   * @param digitalTwinId - (Optional) The unique identifier of the digital twin.
   * @returns A promise that resolves to an object containing the authorization structure.
   */
  public async getAutorizationStructure(userProfile: string | SpinalNode, digitalTwinId?: string): Promise<IProfileAuthRes> {
    const profile = userProfile instanceof SpinalNode ? userProfile : await this._getUserProfileNode(userProfile);
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
  }

  /////////////////////////////////////////////
  //             UNAUTHORIZE
  /////////////////////////////////////////////

  /**
   * Revokes a user profile's authorization to access one or more contexts within a digital twin.
   *
   * @param userProfile - The user profile identifier or SpinalNode instance representing the profile.
   * @param contextIds - The ID or array of IDs of the contexts to unauthorize.
   * @param digitalTwinId - (Optional) The ID of the digital twin in which the contexts reside.
   * @returns A promise that resolves to an array of SpinalContext objects representing the affected contexts.
   */
  public async unauthorizeProfileToAccessContext(userProfile: string | SpinalNode, contextIds: string | string[], digitalTwinId?: string): Promise<SpinalContext[]> {
    const profile = userProfile instanceof SpinalNode ? userProfile : await this._getUserProfileNode(userProfile);
    return authorizationInstance.unauthorizeProfileToAccessContext(profile, digitalTwinId, contextIds);
  }

  /**
   * Revokes a user profile's authorization to access one or more applications.
   *
   * @param userProfile - The user profile identifier or SpinalNode instance representing the profile.
   * @param appIds - A single application ID or an array of application IDs to unauthorize.
   * @returns A promise that resolves to an array of SpinalNode instances representing the affected applications.
   */
  public async unauthorizeProfileToAccessApps(userProfile: string | SpinalNode, appIds: string | string[]): Promise<SpinalNode[]> {
    const profile = userProfile instanceof SpinalNode ? userProfile : await this._getUserProfileNode(userProfile);
    return authorizationInstance.unauthorizeProfileToAccessApps(profile, appIds);
  }

  /**
   * Revokes a user profile's authorization to access one or more sub-applications.
   *
   * @param userProfile - The user profile identifier or SpinalNode instance representing the profile.
   * @param subAppIds - A single sub-application ID or an array of sub-application IDs to unauthorize.
   * @returns A promise that resolves to an array of SpinalNode instances representing the affected sub-applications.
   */
  public async unauthorizeProfileToAccessSubApps(userProfile: string | SpinalNode, subAppIds: string | string[]): Promise<SpinalNode[]> {
    const profile = userProfile instanceof SpinalNode ? userProfile : await this._getUserProfileNode(userProfile);
    return authorizationInstance.unauthorizeProfileToAccessSubApps(profile, subAppIds);
  }

  /**
   * Revokes a user profile's access to one or more APIs.
   *
   * @param userProfile - The user profile to unauthorize, either as a string identifier or a SpinalNode instance.
   * @param apiIds - The API ID or an array of API IDs to revoke access from.
   * @returns A promise that resolves with the result of the unauthorization operation.
   */
  public async unauthorizeProfileToAccessApis(userProfile: string | SpinalNode, apiIds: string | string[]): Promise<SpinalNode[]> {
    const profile = userProfile instanceof SpinalNode ? userProfile : await this._getUserProfileNode(userProfile);
    return authorizationInstance.unauthorizeProfileToAccessApis(profile, apiIds);
  }

  ///////////////////////////////////////////////
  //             VERIFICATION
  ///////////////////////////////////////////////

  /**
   * Checks whether a given user profile has access to a specific context within a digital twin.
   *
   * @param userProfile - The user profile identifier (string) or a SpinalNode representing the profile.
   * @param contextId - The identifier of the context to check access for.
   * @param digitalTwinId - (Optional) The identifier of the digital twin instance.
   * @returns A promise that resolves to the SpinalNode if the profile has access to the context.
   */
  public async profileHasAccessToContext(userProfile: string | SpinalNode, contextId: string, digitalTwinId?: string): Promise<SpinalNode> {
    const profile = userProfile instanceof SpinalNode ? userProfile : await this._getUserProfileNode(userProfile);
    return authorizationInstance.profileHasAccessToContext(profile, digitalTwinId, contextId);
  }

  /**
   * Checks if a user profile has access to a specific application.
   *
   * @param searchKeys - The search criteria used to locate the application.
   * @param userProfile - The user profile identifier or a SpinalNode representing the profile.
   * @param appId - The unique identifier of the application to check access for.
   * @returns A promise that resolves to the SpinalNode representing the application if access is granted.
   */
  public async profileHasAccessToApp(searchKeys: TAppSearch, userProfile: string | SpinalNode, appId: string): Promise<SpinalNode> {
    const profile = userProfile instanceof SpinalNode ? userProfile : await this._getUserProfileNode(userProfile);
    return authorizationInstance.profileHasAccessToApp(searchKeys, profile, appId);
  }


  /**
   * Checks if a user profile has access to a specific sub-application within an application.
   *
   * @param searchKeys - The search criteria used to locate the application.
   * @param userProfile - The user profile identifier or a SpinalNode representing the profile.
   * @param appNameOrId - The name or ID of the application containing the sub-app.
   * @param subAppNameOrId - The name or ID of the sub-application to check access for.
   * @returns A promise that resolves to the SpinalNode representing the sub-application if access is granted.
   */
  public async profileHasAccessToSubApp(
    searchKeys: TAppSearch,
    userProfile: string | SpinalNode,
    appNameOrId: string,
    subAppNameOrId: string
  ): Promise<SpinalNode> {
    const profile = userProfile instanceof SpinalNode ? userProfile : await this._getUserProfileNode(userProfile);
    return authorizationInstance.profileHasAccessToSubApp(searchKeys, profile, appNameOrId, subAppNameOrId);
  }

  /**
   * Checks if a user profile has access to a specific API.
   *
   * @param userProfile - The user profile identifier (string) or a SpinalNode representing the profile.
   * @param apiId - The unique identifier of the API to check access for.
   * @returns A promise that resolves to the SpinalNode representing the API if access is granted.
   */
  public async profileHasAccessToApi(userProfile: string | SpinalNode, apiId: string): Promise<SpinalNode> {
    const profile = userProfile instanceof SpinalNode ? userProfile : await this._getUserProfileNode(userProfile);
    return authorizationInstance.profileHasAccessToApi(profile, apiId);
  }

  /////////////////////////////////////////////
  //               GET AUTHORIZED
  /////////////////////////////////////////////

  /**
   * Retrieves all contexts that a user profile is authorized to access.
   *
   * @param userProfile - The user profile identifier (string) or a SpinalNode representing the profile.
   * @param digitalTwinId - (Optional) The unique identifier of the digital twin.
   * @returns A promise that resolves to an array of SpinalContext objects the profile is authorized to access.
   */
  public async getAuthorizedContexts(userProfile: string | SpinalNode, digitalTwinId?: string): Promise<SpinalContext[]> {
    const profile = userProfile instanceof SpinalNode ? userProfile : await this._getUserProfileNode(userProfile);
    return authorizationInstance.getAuthorizedContexts(profile, digitalTwinId);
  }

  /**
   * Retrieves all applications that a user profile is authorized to access.
   *
   * @param userProfile - The user profile identifier (string) or a SpinalNode representing the profile.
   * @returns A promise that resolves to an array of SpinalNode objects representing the authorized applications.
   */
  public async getAuthorizedApps(userProfile: string | SpinalNode): Promise<SpinalNode[]> {
    const profile = userProfile instanceof SpinalNode ? userProfile : await this._getUserProfileNode(userProfile);
    return authorizationInstance.getAuthorizedApps(profile);
  }

  /**
   * Retrieves the list of authorized sub-applications for a given user profile.
   *
   * @param userProfile - The user profile identifier or a SpinalNode instance representing the user profile.
   * @returns A promise that resolves to an array of SpinalNode objects representing the authorized sub-applications.
   */
  public async getAuthorizedSubApps(userProfile: string | SpinalNode): Promise<SpinalNode[]> {
    const profile = userProfile instanceof SpinalNode ? userProfile : await this._getUserProfileNode(userProfile);
    return authorizationInstance.getAuthorizedSubApps(profile);
  }

  /**
   * Retrieves the list of admin applications that the specified user profile is authorized to access.
   *
   * @param userProfile - The user profile identifier or a SpinalNode instance representing the user profile.
   * @returns A promise that resolves to an array of SpinalNode objects representing the authorized admin applications.
   */
  public async getAuthorizedAdminApps(userProfile: string | SpinalNode): Promise<SpinalNode[]> {
    const profile = userProfile instanceof SpinalNode ? userProfile : await this._getUserProfileNode(userProfile);
    return authorizationInstance.getAuthorizedAdminApps(profile);
  }

  /**
   * Retrieves all APIs that a user profile is authorized to access.
   *
   * @param userProfile - The user profile identifier (string) or a SpinalNode representing the profile.
   * @returns A promise that resolves to an array of SpinalNode objects representing the authorized APIs.
   */
  public async getAuthorizedApis(userProfile: string | SpinalNode): Promise<SpinalNode[]> {
    const profile = userProfile instanceof SpinalNode ? userProfile : await this._getUserProfileNode(userProfile);
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

  private async _findChildInContext(startNode: SpinalNode, nodeIdOrName: string): Promise<SpinalNode> {
    const children = await startNode.getChildrenInContext(this.context);
    return children.find((el) => {
      if (el.getId().get() === nodeIdOrName || el.getName().get() === nodeIdOrName) {
        SpinalGraphService._addNode(el);
        return true;
      }
      return false;
    });
  }
}
