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

import { SpinalContext, SpinalGraphService, SpinalNode } from "spinal-env-viewer-graph-service";
import { AVAILABLE_APPLICATIONS_CONTEXT_NAME, AVAILABLE_APPLICATIONS_CONTEXT_TYPE, PTR_LST_TYPE, CONTEXT_TO_APPS_GROUP, ADMIN_APPS_GROUP_NAME, ADMIN_APPS_GROUP_TYPE, APP_RELATION_NAME, ADMIN_APP_TYPE, BUILDING_APPS_GROUP_NAME, BUILDING_APPS_GROUP_TYPE, BUILDING_APP_TYPE, SUB_APP_RELATION_NAME, BUILDING_SUB_APP_TYPE } from "../constant";
import { ISpinalApp } from "../interfaces";
import { configServiceInstance } from "./configFile.service";
import { SpinalExcelManager } from "spinal-env-viewer-plugin-excel-manager-service";
import { AdminProfileService } from "./adminProfile.service";
import { ISubApp, ISubAppExel } from "../interfaces/ISubApp";
import { TAppSearch, findNodeBySearchKey, isNodeMatchSearchKey, searchById, searchByName, searchByNameOrId } from "../utils/findNodeBySearchKey";
import { Model } from "spinal-core-connectorjs";

export const AppsType = Object.freeze({
  admin: "admin",
  building: "building",
});

export class AppService {
  private static instance: AppService;
  public context: SpinalContext;

  private constructor() { }

  public static getInstance(): AppService {
    if (!this.instance) {
      this.instance = new AppService();
    }

    return this.instance;
  }

  public async init(): Promise<SpinalContext> {
    this.context = await configServiceInstance.getContext(AVAILABLE_APPLICATIONS_CONTEXT_NAME);
    if (!this.context) this.context = await configServiceInstance.addContext(AVAILABLE_APPLICATIONS_CONTEXT_NAME, AVAILABLE_APPLICATIONS_CONTEXT_TYPE);
    return this.context;
  }

  //////////////////////////////////
  //              CREATE          //
  //////////////////////////////////

  /**
   * Create an admin app in the admin apps group.
   *
   * @param {ISpinalApp} appInfo
   * @return {*}  {Promise<SpinalNode>}
   * @memberof AppService
   */
  public async createAdminApp(appInfo: ISpinalApp): Promise<SpinalNode> {
    const groupNode = await this._getApplicationGroupNode(ADMIN_APPS_GROUP_NAME, ADMIN_APPS_GROUP_TYPE, true);
    if (!groupNode) return;

    const appsCreated = await groupNode.getChildren([APP_RELATION_NAME]);
    const appExist = findNodeBySearchKey(appsCreated, searchByName, appInfo.name);

    if (appExist) return appExist;

    appInfo.type = ADMIN_APP_TYPE;
    const appId = SpinalGraphService.createNode(appInfo, undefined);
    const node = SpinalGraphService.getRealNode(appId);
    const _node = await groupNode.addChildInContext(node, APP_RELATION_NAME, PTR_LST_TYPE, this.context);
    await AdminProfileService.getInstance().addAdminAppToProfil(_node);
    return _node;
  }

  /**
   * Create a building app in the building apps group.
   *
   * @param {ISpinalApp} appInfo
   * @param {boolean} [silenceAlreadyExist=false]
   * @return {*}  {Promise<SpinalNode>}
   * @memberof AppService
   */
  public async createBuildingApp(appInfo: ISpinalApp, silenceAlreadyExist = false): Promise<SpinalNode> {
    const groupNode = await this._getApplicationGroupNode(BUILDING_APPS_GROUP_NAME, BUILDING_APPS_GROUP_TYPE, true);
    if (!groupNode) return;

    const children = await groupNode.getChildren([APP_RELATION_NAME]);
    const appExist = findNodeBySearchKey(children, searchByName, appInfo.name);
    if (appExist)
      if (silenceAlreadyExist) return appExist;
      else throw new Error(`App ${appInfo.name} already exist`);

    appInfo.type = BUILDING_APP_TYPE;
    const appId = SpinalGraphService.createNode(appInfo, undefined);
    const node = SpinalGraphService.getRealNode(appId);
    const _node = await groupNode.addChildInContext(node, APP_RELATION_NAME, PTR_LST_TYPE, this.context);
    await AdminProfileService.getInstance().addAppToProfil(_node);
    return _node;
  }

  /**
   * Create a subApp under a building app.
   *
   * @param {SpinalNode} appNode
   * @param {ISubApp} appInfo
   * @param {boolean} [silenceAlreadyExist=false]
   * @return {*}  {(Promise<SpinalNode | string>)}
   * @memberof AppService
   */
  public async createBuildingSubApp(appNode: SpinalNode, appInfo: ISubApp, silenceAlreadyExist = false): Promise<SpinalNode | string> {
    // search subApp from appNode
    const children = await appNode.getChildren([SUB_APP_RELATION_NAME]);
    const subApp = findNodeBySearchKey(children, searchByName, appInfo.name);
    if (subApp)
      if (silenceAlreadyExist) return subApp;
      else return `SubApp ${appInfo.name} already exist, please use the PUT update_building_sub_app API`;

    const appConfig = new Model(appInfo.appConfig)!;
    delete appInfo.appConfig;

    appInfo.type = BUILDING_SUB_APP_TYPE;
    const appId = SpinalGraphService.createNode(appInfo, appConfig);
    const node = SpinalGraphService.getRealNode(appId);
    const _node = await appNode.addChildInContext(node, SUB_APP_RELATION_NAME, PTR_LST_TYPE, this.context);
    await AdminProfileService.getInstance().addSubAppToProfil(appNode, _node);
    return _node;
  }

  /**
   * Creates a new admin application node or updates an existing one based on the provided app information.
   *
   * This method first retrieves (or creates) the admin applications group node. It then checks if an application
   * with the same name already exists as a child of this group. If it exists, the method updates the existing
   * application node; otherwise, it creates a new admin application node.
   *
   * @param appInfo - The information of the admin application to create or update.
   * @returns A promise that resolves to the created or updated SpinalNode, or `undefined` if the group node could not be retrieved.
   */
  public async createOrUpadteAdminApp(appInfo: ISpinalApp): Promise<SpinalNode> {
    const groupNode = await this._getApplicationGroupNode(ADMIN_APPS_GROUP_NAME, ADMIN_APPS_GROUP_TYPE, true);
    if (!groupNode) return;

    const children = await groupNode.getChildren([APP_RELATION_NAME]);
    const appExist = findNodeBySearchKey(children, searchByName, appInfo.name);
    if (appExist) {
      return this.updateAdminApp(appExist.getId().get(), appInfo);
    }
    return this.createAdminApp(appInfo);
  }

  //////////////////////////////////
  //              GET             //
  //////////////////////////////////

  /**
   * Retrieves all admin application nodes.
   *
   * @returns {Promise<SpinalNode[]>} A promise that resolves to an array of SpinalNode representing admin apps.
   */
  public async getAllAdminApps(): Promise<SpinalNode[]> {
    const groupNode = await this._getApplicationGroupNode(ADMIN_APPS_GROUP_NAME, ADMIN_APPS_GROUP_TYPE);
    if (!groupNode) return [];
    return groupNode.getChildren([APP_RELATION_NAME]);
  }

  /**
   * Retrieves all building application nodes.
   *
   * This method fetches the group node associated with building applications
   * using the specified group name and type. If the group node exists, it returns
   * all its child nodes that are related via the application relation name.
   * If the group node does not exist, it returns an empty array.
   *
   * @returns {Promise<SpinalNode[]>} A promise that resolves to an array of building application nodes.
   */
  public async getAllBuildingApps(): Promise<SpinalNode[]> {
    const groupNode = await this._getApplicationGroupNode(BUILDING_APPS_GROUP_NAME, BUILDING_APPS_GROUP_TYPE);
    if (!groupNode) return [];
    return groupNode.getChildren([APP_RELATION_NAME]);
  }

  /**
   * Retrieves all building applications and their sub-applications.
   *
   * This method fetches the group node associated with building applications
   * and retrieves all its child nodes that are related via the application relation name.
   * It then iterates through each building application to fetch its sub-applications,
   * collecting them into a single array of SpinalNode objects.
   *
   * @returns {Promise<SpinalNode[]>} A promise that resolves to an array of SpinalNode representing all building apps and their sub-apps.
   */
  public async getAllBuildingAppsAndSubApp(): Promise<SpinalNode[]> {
    const groupNode = await this._getApplicationGroupNode(BUILDING_APPS_GROUP_NAME, BUILDING_APPS_GROUP_TYPE);
    if (!groupNode) return [];
    const children = await groupNode.getChildren([APP_RELATION_NAME]);
    const res: SpinalNode[] = [...children];
    for (const app of children) {
      const subApps = await app.getChildren([SUB_APP_RELATION_NAME]);
      res.push(...subApps);
    }
    return res;
  }

  /**
   * Retrieves an admin application node by search key (name or id).
   *
   * @param {TAppSearch} searchKeys - The search method(s) to use (e.g., by name or id).
   * @param {string} appNameOrId - The name or id of the admin app to find.
   * @returns {Promise<SpinalNode>} A promise that resolves to the found SpinalNode or undefined.
   */
  public async getAdminApp(searchKeys: TAppSearch, appNameOrId: string): Promise<SpinalNode> {
    const nodes = await this.getAllAdminApps();
    return findNodeBySearchKey(nodes, searchKeys, appNameOrId);
  }


  /**
   * Retrieves a building application node based on the provided search keys and application name or ID.
   *
   * @param searchKeys - The search criteria used to filter building applications.
   * @param appNameOrId - The name or ID of the application to find.
   * @returns A promise that resolves to the matching `SpinalNode` if found.
   */
  public async getBuildingApp(searchKeys: TAppSearch, appNameOrId: string): Promise<SpinalNode> {
    const nodes = await this.getAllBuildingApps();
    return findNodeBySearchKey(nodes, searchKeys, appNameOrId);
  }

  /**
   * Get a building subApp from a building app
   * if subAppNameOrId is not provided, return the first subApp found
   * if subAppNameOrId is provided, return the subApp with the id or name or undefined
   * @param {TAppSearch} searchKeys
   * @param {string} appNameOrId
   * @param {string} [subAppNameOrId]
   * @return {*}  {Promise<SpinalNode>}
   * @memberof AppService
   */
  public async getBuildingSubApp(searchKeys: TAppSearch, appNameOrId: string, subAppNameOrId: string): Promise<SpinalNode> {
    const buildingApp = await this.getBuildingApp(searchKeys, appNameOrId);
    if (!buildingApp) return;
    const nodes = await buildingApp.getChildren([SUB_APP_RELATION_NAME]);
    return findNodeBySearchKey(nodes, searchKeys, subAppNameOrId);
  }

  /**
   * Searches for a building sub-application node within a list of application nodes.
   *
   * This method retrieves all sub-applications from the provided application nodes,
   * then searches for a sub-app that matches the given search key (by name or id).
   *
   * @param {TAppSearch} searchKeys - The search method(s) to use (e.g., by name or id).
   * @param {SpinalNode[]} appsNodes - The list of application nodes to search within.
   * @param {string} subAppNameOrId - The name or id of the sub-app to find.
   * @returns {Promise<SpinalNode>} A promise that resolves to the found sub-app node or undefined.
   */
  public async findBuildingSubAppInApps(searchKeys: TAppSearch, appsNodes: SpinalNode[], subAppNameOrId: string): Promise<SpinalNode> {
    const promises = appsNodes.map((el) => el.getChildren([SUB_APP_RELATION_NAME]));
    const subApps = await Promise.all(promises);
    return subApps.flat().find(isNodeMatchSearchKey.bind(null, searchKeys, subAppNameOrId));
  }



  /**
   * Formats an array of application nodes and adds their corresponding sub-applications.
   *
   * For each application node in the provided array, this method calls `formatAppAndAddSubApps`
   * to format the node and include its sub-apps (if any). If `subAppsNodes` is provided,
   * only sub-apps present in that list will be included. The method filters out any undefined
   * results (e.g., if a node does not match the filter criteria) and returns an array of
   * formatted application objects.
   *
   * @param {SpinalNode[]} appsNodes - The application nodes to format.
   * @param {SpinalNode[]} [subAppsNodes] - Optional list of sub-app nodes to include.
   * @returns {Promise<ISpinalApp[]>} A promise that resolves to an array of formatted applications.
   */
  public async formatAppsAndAddSubApps(appsNodes: SpinalNode[], subAppsNodes?: SpinalNode[]): Promise<ISpinalApp[]> {
    const proms = (appsNodes || []).map((el) => {
      return this.formatAppAndAddSubApps(el, subAppsNodes);
    });

    const items = await Promise.all(proms);
    return items.filter((el) => el !== undefined) as ISpinalApp[];
  }


  /**
   * Formats a single application node and adds its sub-applications if present.
   *
   * If the node is a building app, retrieves its sub-apps and includes them in the result.
   * If `subAppsNodes` is provided, only includes sub-apps present in that list.
   * Returns `undefined` if the app has sub-apps but none match the filter.
   *
   * @param appsNode - The application node to format.
   * @param subAppsNodes - Optional list of sub-app nodes to include.
   * @returns The formatted application object or undefined.
   */
  public async formatAppAndAddSubApps(appsNode: SpinalNode, subAppsNodes?: SpinalNode[]): Promise<ISpinalApp> {
    const res = appsNode.info.get();
    if (res.type === BUILDING_APP_TYPE) {
      const subApps = await appsNode.getChildren([SUB_APP_RELATION_NAME]);
      if (subApps.length !== 0) {
        res.subApps = subApps.reduce((acc, el) => {
          if (!subAppsNodes || subAppsNodes.find((subApp) => subApp.info.id.get() === el.info.id.get())) acc.push(el.info.get());
          return acc;
        }, []);
        // app has sub-apps but none match the filter
        if (Array.isArray(subAppsNodes) && res.subApps.length === 0) return undefined;
      }
    }
    return res;
  }


  /**
   * Retrieves an application node (admin, building app, or sub-app) by search key (name or id).
   *
   * This method searches across all building apps, their sub-apps, and admin apps,
   * returning the first node that matches the provided search key.
   *
   * @param {TAppSearch} searchKeys - The search method(s) to use (e.g., by name or id).
   * @param {string} appNameOrId - The name or id of the app to find.
   * @returns {Promise<SpinalNode>} A promise that resolves to the found SpinalNode or undefined.
   */
  public async getApps(searchKeys: TAppSearch, appNameOrId: string): Promise<SpinalNode> {
    const promises = [this.getAllBuildingAppsAndSubApp(), this.getAllAdminApps()];
    const apps = await Promise.all(promises);
    return apps.flat().find(isNodeMatchSearchKey.bind(null, searchKeys, appNameOrId));
  }

  //////////////////////////////////
  //              UPDATES         //
  //////////////////////////////////

  /**
   * Updates the information of an admin application node with the provided new information.
   *
   * @param appId - The unique identifier of the admin application to update.
   * @param newInfo - An object containing the new information to update the application with.
   * @returns A promise that resolves to the updated SpinalNode instance.
   * @throws Will throw an error if the application node cannot be found or the update fails.
   */
  public async updateAdminApp(appId: string, newInfo: ISpinalApp): Promise<SpinalNode> {
    const appNode = await this.getAdminApp(searchById, appId);
    return this._updateAppInfo(appNode, newInfo);
  }

  /**
   * Updates the information of a building application node with the provided new information.
   *
   * @param appId - The unique identifier of the building application to update.
   * @param newInfo - An object containing the new information to update the application with.
   * @returns A promise that resolves to the updated SpinalNode instance.
   * @throws Will throw an error if the application node cannot be found or the update fails.
   */
  public async updateBuildingApp(appId: string, newInfo: ISpinalApp): Promise<SpinalNode> {
    const appNode = await this.getBuildingApp(["id"], appId);
    return this._updateAppInfo(appNode, newInfo);
  }

  /**
   * Updates the information of a given application node with new values provided in `newInfo`.
   * 
   * Iterates over the keys in `newInfo` and updates the corresponding properties in `appNode.info`.
   * If the property exists, it is updated using the `set` method. If it does not exist, it is added using `add_attr`.
   * The property "documentationLink" is always updated or added, regardless of its existence in `appNode.info`.
   * 
   * @param appNode - The application node whose information is to be updated.
   * @param newInfo - An object containing the new information to update in the application node.
   * @returns The updated application node, or `undefined` if `appNode` is not provided.
   */
  private _updateAppInfo(appNode: SpinalNode, newInfo: ISpinalApp) {
    if (appNode) {
      for (const key in newInfo) {
        if ((Object.prototype.hasOwnProperty.call(newInfo, key) && appNode.info[key]) || key === "documentationLink") {
          const element = newInfo[key];
          if (appNode.info[key]) appNode.info[key].set(element);
          else appNode.info.add_attr(key, element);
        }
      }
      return appNode;
    }
  }

  /**
   * Updates the information of a sub-application node within a building application.
   *
   * This method retrieves the sub-application node using the provided `appId` and `subAppId`,
   * then updates its attributes based on the `newInfo` object. Certain keys (`id`, `appConfig`, `parentApp`)
   * are skipped during the update. If an attribute exists, it is updated; otherwise, it is added.
   * The method also updates the sub-application's element with the new `appConfig` if provided.
   *
   * @param appId - The ID of the parent application.
   * @param subAppId - The ID of the sub-application to update.
   * @param newInfo - An object containing the new information for the sub-application.
   * @returns A promise that resolves to the updated `SpinalNode` representing the sub-application.
   */
  public async updateBuildingSubAppInfo(appId: string, subAppId: string, newInfo: ISubApp): Promise<SpinalNode> {
    const subAppNode = await this.getBuildingSubApp(["id"], appId, subAppId);
    const keysToSkip = ["id", "appConfig", "parentApp"];
    if (subAppNode) {
      for (const key in newInfo) {
        if (keysToSkip.includes(key)) continue;
        if (Object.prototype.hasOwnProperty.call(newInfo, key)) {
          const element = newInfo[key];
          if (subAppNode.info[key]) subAppNode.info[key].set(element);
          else subAppNode.info.add_attr(key, element);
        }
      }
      const element = await subAppNode.getElement();
      element.set(newInfo.appConfig);
      return subAppNode;
    }
  }

  //////////////////////////////////
  //              DELETE          //
  //////////////////////////////////

  /**
   * Deletes an admin application node by its ID.
   *
   * This method retrieves the admin application node using the provided appId.
   * If the node exists, it removes it from the graph and returns true.
   * If the node does not exist, it returns false.
   *
   * @param {string} appId - The ID of the admin application to delete.
   * @returns {Promise<boolean>} True if the admin app was deleted, false otherwise.
   */
  public async deleteAdminApp(appId: string): Promise<boolean> {
    const appNode = await this.getAdminApp(searchById, appId);
    if (appNode) {
      await appNode.removeFromGraph();
      return true;
    }
    return false;
  }


  /**
   * Deletes a building application node and all its sub-applications by the application's ID.
   *
   * This method retrieves the building application node using the provided appId.
   * If the node exists, it first removes all its sub-applications from the graph,
   * then removes the building application node itself.
   * Returns true if the building app was deleted, false otherwise.
   *
   * @param {string} appId - The ID of the building application to delete.
   * @returns {Promise<boolean>} True if the building app was deleted, false otherwise.
   */
  public async deleteBuildingApp(appId: string): Promise<boolean> {
    const appNode = await this.getBuildingApp(searchById, appId);
    if (appNode) {
      // remove subApps
      const subApps = await appNode.getChildren([SUB_APP_RELATION_NAME]);
      for (const subApp of subApps) {
        await subApp.removeFromGraph();
      }
      await appNode.removeFromGraph();
      return true;
    }
    return false;
  }


  /**
   * Delete a subApp from a building app
   * @param {string} appId
   * @param {string} subAppId
   * @return {*} {Promise<boolean>} true if the subApp is deleted, false if not found
   * @memberof AppService
   */
  public async deleteBuildingSubApp(appId: string, subAppId: string): Promise<boolean> {
    const appNode = await this.getBuildingApp(searchById, appId);
    if (appNode) {
      const subApps = await appNode.getChildren([SUB_APP_RELATION_NAME]);
      for (const subApp of subApps) {
        if (subApp.getId().get() === subAppId) {
          await subApp.removeFromGraph();
          return true;
        }
      }
      return false;
    }
    return false;
  }

  //////////////////////////////////
  //         EXCEl / JSON         //
  //////////////////////////////////

  /**
   * Uploads applications from a file (Excel or JSON) and creates or updates them in the graph.
   *
   * @param appType - The type of application to upload ('admin' or 'building').
   * @param fileData - The file data containing the applications (Excel or JSON format).
   * @param isExcel - Whether the file is in Excel format (default: false).
   * @returns A promise that resolves to an array of created or updated SpinalNode instances.
   */
  public async uploadApps(appType: keyof typeof AppsType, fileData: Buffer, isExcel: boolean = false): Promise<SpinalNode[]> {
    const data = isExcel ? await this._convertExcelToJson(fileData) : JSON.parse(JSON.stringify(fileData.toString()));

    const formattedApps = this._formatAppsJson(data);
    const listRes = [];
    for (const item of formattedApps) {
      try {
        let app;
        if (appType === AppsType.admin) app = await this.createAdminApp(item);
        else if (appType === AppsType.building) app = await this.createBuildingApp(item, true);
        else console.error("App type not found, please use AppsType.admin or AppsType.building");
        if (app) {
          this._updateAppInfo(app, item);
          listRes.push(app);
        }
      } catch (error) {
        console.error(error);
      }
    }
    return listRes;
  }


  /**
   * Uploads sub-applications from a file (Excel or JSON) and creates or updates them in the graph.
   *
   * @param fileData - The file data containing the sub-applications (Excel or JSON format).
   * @param isExcel - Whether the file is in Excel format (default: false).
   * @returns A promise that resolves to an object containing created/updated sub-app nodes and any errors.
   */
  public async uploadSubApps(fileData: Buffer, isExcel: boolean = false): Promise<{ subApps: SpinalNode[]; errors: string[] }> {
    const data = isExcel ? await this._convertExcelToJson(fileData) : JSON.parse(JSON.stringify(fileData.toString()));

    const formattedApps = this._formatSubAppsJson(data);
    const subAppsNodes: SpinalNode[] = [];
    const errors = formattedApps.errors;
    for (const item of formattedApps.subApps) {
      try {
        const app = await this.getBuildingApp(searchByNameOrId, item.parentApp);
        if (app) {
          errors.push(`App ${item.parentApp} not found`);
          continue;
        }
        let subApp = await this.createBuildingSubApp(app, item, true);
        if (subApp) {
          if (typeof subApp === "string") errors.push(subApp);
          else {
            // update subApp with appInfo
            await this.updateBuildingSubAppInfo(app.info.id.get(), subApp.info.id.get(), item);
            subAppsNodes.push(subApp);
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
    return { subApps: subAppsNodes, errors };
  }

  //////////////////////////////////
  //              PRIVATES        //
  //////////////////////////////////

  private async _getApplicationGroupNode(name: string, type: string, createIt: boolean = false): Promise<SpinalNode | void> {
    const children = await this.context.getChildren([CONTEXT_TO_APPS_GROUP]);

    const found = children.find((el) => el.getName().get() === name && el.getType().get() === type);
    if (found || !createIt) return found;

    const node = new SpinalNode(name, type);
    return await this.context.addChildInContext(node, CONTEXT_TO_APPS_GROUP, PTR_LST_TYPE, this.context);
  }

  private async _convertExcelToJson(excelData: Buffer) {
    const data = await SpinalExcelManager.convertExcelToJson(excelData);
    return Object.values(data).flat();
  }

  private _formatAppsJson(jsonData: ISpinalApp[]): ISpinalApp[] {
    return jsonData.reduce((liste, app) => {
      const requiredAttrs = ["name", "icon", "tags", "categoryName", "groupName"];

      const missingAttr = requiredAttrs.find((el) => !app[el]);
      if (!missingAttr) {
        app.hasViewer = app.hasViewer || false;
        app.packageName = app.packageName || app.name;
        app.isExternalApp = app.isExternalApp?.toString().toLocaleLowerCase() == "false" ? false : Boolean(app.isExternalApp);
        if (app.isExternalApp) app.link = app.link;

        if (typeof app.tags === "string") app.tags = (<any>app.tags).split(",");

        liste.push(app);
      }

      return liste;
    }, []);
  }

  private _formatSubAppsJson(jsonData: ISubAppExel[]): { subApps: ISubAppExel[]; errors: string[]; } {
    const result: ISubAppExel[] = [];
    const errors: string[] = [];
    for (const app of jsonData) {
      const requiredAttrs = ["name", "parent", "appConfig"];

      const notValid = requiredAttrs.find((el) => !app[el]);
      if (!notValid) {
        if (typeof app.tags === "string") app.tags = (<any>app.tags).split(",");
        if (typeof app.appConfig === "string") {
          try {
            app.appConfig = JSON.parse(app.appConfig);
          } catch (error) {
            errors.push(`SubApp ${app.name} error parsing appConfig`);
          }
        }
        result.push(app);
      } else {
        errors.push(`SubApp ${app.name} is not valid`);
      }
    }
    return { subApps: result, errors };
  }

}
