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
  SpinalGraphService,
  SpinalNode,
} from 'spinal-env-viewer-graph-service';
import {
  AVAILABLE_APPLICATIONS_CONTEXT_NAME,
  AVAILABLE_APPLICATIONS_CONTEXT_TYPE,
  PTR_LST_TYPE,
  CONTEXT_TO_APPS_GROUP,
  ADMIN_APPS_GROUP_NAME,
  ADMIN_APPS_GROUP_TYPE,
  APP_RELATION_NAME,
  ADMIN_APP_TYPE,
  BUILDING_APPS_GROUP_NAME,
  BUILDING_APPS_GROUP_TYPE,
  BUILDING_APP_TYPE,
  SUB_APP_RELATION_NAME,
  BUILDING_SUB_APP_TYPE,
} from '../constant';
import { ISpinalApp } from '../interfaces';
import { configServiceInstance } from './configFile.service';
import { SpinalExcelManager } from 'spinal-env-viewer-plugin-excel-manager-service';
import { AdminProfileService } from './adminProfile.service';
import { removeNodeReferences } from '../utils/utils';
import { ISubApp, ISubAppExel } from '../interfaces/ISubApp';
import {
  TAppSearch,
  findNodeBySearchKey,
  isNodeMatchSearchKey,
  searchById,
  searchByName,
  searchByNameOrId,
} from '../utils/findNodeBySearchKey';
import { Model } from 'spinal-core-connectorjs';

export const AppsType = Object.freeze({
  admin: 'admin',
  building: 'building',
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
    this.context = await configServiceInstance.getContext(
      AVAILABLE_APPLICATIONS_CONTEXT_NAME
    );
    if (!this.context)
      this.context = await configServiceInstance.addContext(
        AVAILABLE_APPLICATIONS_CONTEXT_NAME,
        AVAILABLE_APPLICATIONS_CONTEXT_TYPE
      );
    return this.context;
  }

  //////////////////////////////////
  //              CREATE          //
  //////////////////////////////////

  public async createAdminApp(appInfo: ISpinalApp): Promise<SpinalNode> {
    const groupNode = await this._getApplicationGroupNode(
      ADMIN_APPS_GROUP_NAME,
      ADMIN_APPS_GROUP_TYPE,
      true
    );
    if (!groupNode) return;

    const children = await groupNode.getChildren([APP_RELATION_NAME]);
    const appExist = findNodeBySearchKey(children, searchByName, appInfo.name);

    if (appExist) return appExist;

    appInfo.type = ADMIN_APP_TYPE;
    const appId = SpinalGraphService.createNode(appInfo, undefined);
    const node = SpinalGraphService.getRealNode(appId);
    const _node = await groupNode.addChildInContext(
      node,
      APP_RELATION_NAME,
      PTR_LST_TYPE,
      this.context
    );
    await AdminProfileService.getInstance().addAdminAppToProfil(_node);
    return _node;
  }

  public async createBuildingApp(
    appInfo: ISpinalApp,
    silenceAlreadyExist = false
  ): Promise<SpinalNode> {
    const groupNode = await this._getApplicationGroupNode(
      BUILDING_APPS_GROUP_NAME,
      BUILDING_APPS_GROUP_TYPE,
      true
    );
    if (!groupNode) return;

    const children = await groupNode.getChildren([APP_RELATION_NAME]);
    const appExist = findNodeBySearchKey(children, searchByName, appInfo.name);
    if (appExist)
      if (silenceAlreadyExist) return appExist;
      else throw new Error(`App ${appInfo.name} already exist`);

    appInfo.type = BUILDING_APP_TYPE;
    const appId = SpinalGraphService.createNode(appInfo, undefined);
    const node = SpinalGraphService.getRealNode(appId);
    const _node = await groupNode.addChildInContext(
      node,
      APP_RELATION_NAME,
      PTR_LST_TYPE,
      this.context
    );
    await AdminProfileService.getInstance().addAppToProfil(_node);
    return _node;
  }

  public async createBuildingSubApp(
    appNode: SpinalNode,
    appInfo: ISubApp,
    silenceAlreadyExist = false
  ): Promise<SpinalNode | string> {
    // search subApp from appNode
    const children = await appNode.getChildren([SUB_APP_RELATION_NAME]);
    const subApp = findNodeBySearchKey(children, searchByName, appInfo.name);
    if (subApp)
      if (silenceAlreadyExist) return subApp;
      else
        return `SubApp ${appInfo.name} already exist, please use the PUT update_building_sub_app API`;
    const appConfig = new Model(appInfo.appConfig)!;
    delete appInfo.appConfig;
    appInfo.type = BUILDING_SUB_APP_TYPE;
    const appId = SpinalGraphService.createNode(appInfo, appConfig);
    const node = SpinalGraphService.getRealNode(appId);
    const _node = await appNode.addChildInContext(
      node,
      SUB_APP_RELATION_NAME,
      PTR_LST_TYPE,
      this.context
    );
    await AdminProfileService.getInstance().addSubAppToProfil(appNode, _node);
    return _node;
  }

  public async createOrUpadteAdminApp(
    appInfo: ISpinalApp
  ): Promise<SpinalNode> {
    const groupNode = await this._getApplicationGroupNode(
      ADMIN_APPS_GROUP_NAME,
      ADMIN_APPS_GROUP_TYPE,
      true
    );
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

  public async getAllAdminApps(): Promise<SpinalNode[]> {
    const groupNode = await this._getApplicationGroupNode(
      ADMIN_APPS_GROUP_NAME,
      ADMIN_APPS_GROUP_TYPE
    );
    if (!groupNode) return [];
    return groupNode.getChildren([APP_RELATION_NAME]);
  }

  public async getAllBuildingApps(): Promise<SpinalNode[]> {
    const groupNode = await this._getApplicationGroupNode(
      BUILDING_APPS_GROUP_NAME,
      BUILDING_APPS_GROUP_TYPE
    );
    if (!groupNode) return [];
    return groupNode.getChildren([APP_RELATION_NAME]);
  }

  public async getAllBuildingAppsAndSubApp(): Promise<SpinalNode[]> {
    const groupNode = await this._getApplicationGroupNode(
      BUILDING_APPS_GROUP_NAME,
      BUILDING_APPS_GROUP_TYPE
    );
    if (!groupNode) return [];
    const children = await groupNode.getChildren([APP_RELATION_NAME]);
    const res: SpinalNode[] = [...children];
    for (const app of children) {
      const subApps = await app.getChildren([SUB_APP_RELATION_NAME]);
      res.push(...subApps);
    }
    return res;
  }

  public async getAdminApp(
    searchKeys: TAppSearch,
    appNameOrId: string
  ): Promise<SpinalNode> {
    const nodes = await this.getAllAdminApps();
    return findNodeBySearchKey(nodes, searchKeys, appNameOrId);
  }

  public async getBuildingApp(
    searchKeys: TAppSearch,
    appNameOrId: string
  ): Promise<SpinalNode> {
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
  public async getBuildingSubApp(
    searchKeys: TAppSearch,
    appNameOrId: string,
    subAppNameOrId: string
  ): Promise<SpinalNode> {
    const buildingApp = await this.getBuildingApp(searchKeys, appNameOrId);
    if (!buildingApp) return;
    const nodes = await buildingApp.getChildren([SUB_APP_RELATION_NAME]);
    return findNodeBySearchKey(nodes, searchKeys, subAppNameOrId);
  }

  public async findBuildingSubAppInApps(
    searchKeys: TAppSearch,
    appsNodes: SpinalNode[],
    subAppNameOrId: string
  ): Promise<SpinalNode> {
    const promises = appsNodes.map((el) =>
      el.getChildren([SUB_APP_RELATION_NAME])
    );
    const subApps = await Promise.all(promises);
    return subApps
      .flat()
      .find(isNodeMatchSearchKey.bind(null, searchKeys, subAppNameOrId));
  }

  public async formatAppsAndAddSubApps(
    appsNodes: SpinalNode[],
    subAppsNodes?: SpinalNode[]
  ): Promise<ISpinalApp[]> {
    const proms = appsNodes.map((el) => {
      return this.formatAppAndAddSubApps(el, subAppsNodes);
    });
    const items = await Promise.all(proms);
    return items.filter((el) => el !== undefined) as ISpinalApp[];
  }

  public async formatAppAndAddSubApps(
    appsNode: SpinalNode,
    subAppsNodes?: SpinalNode[]
  ): Promise<ISpinalApp> {
    const res = appsNode.info.get();
    if (res.type === BUILDING_APP_TYPE) {
      const subApps = await appsNode.getChildren([SUB_APP_RELATION_NAME]);
      if (subApps.length !== 0) {
        res.subApps = subApps.reduce((acc, el) => {
          if (
            !subAppsNodes ||
            subAppsNodes.find(
              (subApp) => subApp.info.id.get() === el.info.id.get()
            )
          )
            acc.push(el.info.get());
          return acc;
        }, []);
        // app have sub apps but not in the subAppsNodes
        if (Array.isArray(subAppsNodes) && res.subApps.length === 0)
          return undefined;
      }
    }
    return res;
  }

  public async getApps(
    searchKeys: TAppSearch,
    appNameOrId: string
  ): Promise<SpinalNode> {
    const promises = [
      this.getAllBuildingAppsAndSubApp(),
      this.getAllAdminApps(),
    ];
    const apps = await Promise.all(promises);
    return apps
      .flat()
      .find(isNodeMatchSearchKey.bind(null, searchKeys, appNameOrId));
  }

  //////////////////////////////////
  //              UPDATES         //
  //////////////////////////////////

  public async updateAdminApp(
    appId: string,
    newInfo: ISpinalApp
  ): Promise<SpinalNode> {
    const appNode = await this.getAdminApp(searchById, appId);
    return this._updateAppInfo(appNode, newInfo);
  }

  public async updateBuildingApp(
    appId: string,
    newInfo: ISpinalApp
  ): Promise<SpinalNode> {
    const appNode = await this.getBuildingApp(['id'], appId);
    return this._updateAppInfo(appNode, newInfo);
  }

  private _updateAppInfo(appNode: SpinalNode, newInfo: ISpinalApp) {
    if (appNode) {
      for (const key in newInfo) {
        if (
          (Object.prototype.hasOwnProperty.call(newInfo, key) &&
            appNode.info[key]) ||
          key === 'documentationLink'
        ) {
          const element = newInfo[key];
          if (appNode.info[key]) appNode.info[key].set(element);
          else appNode.info.add_attr(key, element);
        }
      }
      return appNode;
    }
  }

  public async updateBuildingSubAppInfo(
    appId: string,
    subAppId: string,
    newInfo: ISubApp
  ): Promise<SpinalNode> {
    const subAppNode = await this.getBuildingSubApp(['id'], appId, subAppId);
    const keysToSkip = ['id', 'appConfig', 'parentApp'];
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

  public async deleteAdminApp(appId: string): Promise<boolean> {
    const appNode = await this.getAdminApp(searchById, appId);
    if (appNode) {
      await appNode.removeFromGraph();
      await removeNodeReferences(appNode);
      return true;
    }
    return false;
  }

  public async deleteBuildingApp(appId: string): Promise<boolean> {
    const appNode = await this.getBuildingApp(searchById, appId);
    if (appNode) {
      // remove subApps
      const subApps = await appNode.getChildren([SUB_APP_RELATION_NAME]);
      for (const subApp of subApps) {
        await subApp.removeFromGraph();
      }
      await appNode.removeFromGraph();
      await removeNodeReferences(appNode);
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
  public async deleteBuildingSubApp(
    appId: string,
    subAppId: string
  ): Promise<boolean> {
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

  public async uploadApps(
    appType: keyof typeof AppsType,
    fileData: Buffer,
    isExcel: boolean = false
  ): Promise<SpinalNode[]> {
    const data = isExcel
      ? await this._convertExcelToJson(fileData)
      : JSON.parse(JSON.stringify(fileData.toString()));

    const formattedApps = this._formatAppsJson(data);
    const listRes = [];
    for (const item of formattedApps) {
      try {
        let app;
        if (appType === AppsType.admin) app = await this.createAdminApp(item);
        else if (appType === AppsType.building)
          app = await this.createBuildingApp(item, true);
        else
          console.error(
            'App type not found, please use AppsType.admin or AppsType.building'
          );
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

  public async uploadSubApps(
    fileData: Buffer,
    isExcel: boolean = false
  ): Promise<{ subApps: SpinalNode[]; errors: string[] }> {
    const data = isExcel
      ? await this._convertExcelToJson(fileData)
      : JSON.parse(JSON.stringify(fileData.toString()));

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
          if (typeof subApp === 'string') errors.push(subApp);
          else {
            // update subApp with appInfo
            await this.updateBuildingSubAppInfo(
              app.info.id.get(),
              subApp.info.id.get(),
              item
            );
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

  private async _getApplicationGroupNode(
    name: string,
    type: string,
    createIt: boolean = false
  ): Promise<SpinalNode | void> {
    const children = await this.context.getChildren([CONTEXT_TO_APPS_GROUP]);

    const found = children.find(
      (el) => el.getName().get() === name && el.getType().get() === type
    );
    if (found || !createIt) return found;

    const node = new SpinalNode(name, type);
    return await this.context.addChildInContext(
      node,
      CONTEXT_TO_APPS_GROUP,
      PTR_LST_TYPE,
      this.context
    );
  }

  private async _convertExcelToJson(excelData: Buffer) {
    const data = await SpinalExcelManager.convertExcelToJson(excelData);
    return Object.values(data).flat();
  }

  private _formatAppsJson(jsonData: ISpinalApp[]): ISpinalApp[] {
    return jsonData.reduce((liste, app) => {
      const requiredAttrs = [
        'name',
        'icon',
        'tags',
        'categoryName',
        'groupName',
      ];

      const missingAttr = requiredAttrs.find((el) => !app[el]);
      if (!missingAttr) {
        app.hasViewer = app.hasViewer || false;
        app.packageName = app.packageName || app.name;
        app.isExternalApp =
          app.isExternalApp?.toString().toLocaleLowerCase() == 'false'
            ? false
            : Boolean(app.isExternalApp);
        if (app.isExternalApp) app.link = app.link;

        if (typeof app.tags === 'string') app.tags = (<any>app.tags).split(',');

        liste.push(app);
      }

      return liste;
    }, []);
  }

  private _formatSubAppsJson(jsonData: ISubAppExel[]): {
    subApps: ISubAppExel[];
    errors: string[];
  } {
    const result: ISubAppExel[] = [];
    const errors: string[] = [];
    for (const app of jsonData) {
      const requiredAttrs = ['name', 'parent', 'appConfig'];

      const notValid = requiredAttrs.find((el) => !app[el]);
      if (!notValid) {
        if (typeof app.tags === 'string') app.tags = (<any>app.tags).split(',');
        if (typeof app.appConfig === 'string') {
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
