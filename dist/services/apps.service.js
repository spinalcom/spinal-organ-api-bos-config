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
exports.AppService = exports.AppsType = void 0;
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const constant_1 = require("../constant");
const configFile_service_1 = require("./configFile.service");
const spinal_env_viewer_plugin_excel_manager_service_1 = require("spinal-env-viewer-plugin-excel-manager-service");
const adminProfile_service_1 = require("./adminProfile.service");
const utils_1 = require("../utils/utils");
const findNodeBySearchKey_1 = require("../utils/findNodeBySearchKey");
const spinal_core_connectorjs_1 = require("spinal-core-connectorjs");
exports.AppsType = Object.freeze({
    admin: 'admin',
    building: 'building',
});
class AppService {
    constructor() { }
    static getInstance() {
        if (!this.instance) {
            this.instance = new AppService();
        }
        return this.instance;
    }
    async init() {
        this.context = await configFile_service_1.configServiceInstance.getContext(constant_1.AVAILABLE_APPLICATIONS_CONTEXT_NAME);
        if (!this.context)
            this.context = await configFile_service_1.configServiceInstance.addContext(constant_1.AVAILABLE_APPLICATIONS_CONTEXT_NAME, constant_1.AVAILABLE_APPLICATIONS_CONTEXT_TYPE);
        return this.context;
    }
    //////////////////////////////////
    //              CREATE          //
    //////////////////////////////////
    async createAdminApp(appInfo) {
        const groupNode = await this._getApplicationGroupNode(constant_1.ADMIN_APPS_GROUP_NAME, constant_1.ADMIN_APPS_GROUP_TYPE, true);
        if (!groupNode)
            return;
        const children = await groupNode.getChildren([constant_1.APP_RELATION_NAME]);
        const appExist = (0, findNodeBySearchKey_1.findNodeBySearchKey)(children, findNodeBySearchKey_1.searchByName, appInfo.name);
        if (appExist)
            return appExist;
        appInfo.type = constant_1.ADMIN_APP_TYPE;
        const appId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode(appInfo, undefined);
        const node = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(appId);
        const _node = await groupNode.addChildInContext(node, constant_1.APP_RELATION_NAME, constant_1.PTR_LST_TYPE, this.context);
        await adminProfile_service_1.AdminProfileService.getInstance().addAdminAppToProfil(_node);
        return _node;
    }
    async createBuildingApp(appInfo, silenceAlreadyExist = false) {
        const groupNode = await this._getApplicationGroupNode(constant_1.BUILDING_APPS_GROUP_NAME, constant_1.BUILDING_APPS_GROUP_TYPE, true);
        if (!groupNode)
            return;
        const children = await groupNode.getChildren([constant_1.APP_RELATION_NAME]);
        const appExist = (0, findNodeBySearchKey_1.findNodeBySearchKey)(children, findNodeBySearchKey_1.searchByName, appInfo.name);
        if (appExist)
            if (silenceAlreadyExist)
                return appExist;
            else
                throw new Error(`App ${appInfo.name} already exist`);
        appInfo.type = constant_1.BUILDING_APP_TYPE;
        const appId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode(appInfo, undefined);
        const node = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(appId);
        const _node = await groupNode.addChildInContext(node, constant_1.APP_RELATION_NAME, constant_1.PTR_LST_TYPE, this.context);
        await adminProfile_service_1.AdminProfileService.getInstance().addAppToProfil(_node);
        return _node;
    }
    async createBuildingSubApp(appNode, appInfo, silenceAlreadyExist = false) {
        // search subApp from appNode
        const children = await appNode.getChildren([constant_1.SUB_APP_RELATION_NAME]);
        const subApp = (0, findNodeBySearchKey_1.findNodeBySearchKey)(children, findNodeBySearchKey_1.searchByName, appInfo.name);
        if (subApp)
            if (silenceAlreadyExist)
                return subApp;
            else
                return `SubApp ${appInfo.name} already exist, please use the PUT update_building_sub_app API`;
        const appConfig = new spinal_core_connectorjs_1.Model(appInfo.appConfig);
        delete appInfo.appConfig;
        appInfo.type = constant_1.BUILDING_SUB_APP_TYPE;
        const appId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode(appInfo, appConfig);
        const node = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(appId);
        const _node = await appNode.addChildInContext(node, constant_1.SUB_APP_RELATION_NAME, constant_1.PTR_LST_TYPE, this.context);
        await adminProfile_service_1.AdminProfileService.getInstance().addSubAppToProfil(appNode, _node);
        return _node;
    }
    async createOrUpadteAdminApp(appInfo) {
        const groupNode = await this._getApplicationGroupNode(constant_1.ADMIN_APPS_GROUP_NAME, constant_1.ADMIN_APPS_GROUP_TYPE, true);
        if (!groupNode)
            return;
        const children = await groupNode.getChildren([constant_1.APP_RELATION_NAME]);
        const appExist = (0, findNodeBySearchKey_1.findNodeBySearchKey)(children, findNodeBySearchKey_1.searchByName, appInfo.name);
        if (appExist) {
            return this.updateAdminApp(appExist.getId().get(), appInfo);
        }
        return this.createAdminApp(appInfo);
    }
    //////////////////////////////////
    //              GET             //
    //////////////////////////////////
    async getAllAdminApps() {
        const groupNode = await this._getApplicationGroupNode(constant_1.ADMIN_APPS_GROUP_NAME, constant_1.ADMIN_APPS_GROUP_TYPE);
        if (!groupNode)
            return [];
        return groupNode.getChildren([constant_1.APP_RELATION_NAME]);
    }
    async getAllBuildingApps() {
        const groupNode = await this._getApplicationGroupNode(constant_1.BUILDING_APPS_GROUP_NAME, constant_1.BUILDING_APPS_GROUP_TYPE);
        if (!groupNode)
            return [];
        return groupNode.getChildren([constant_1.APP_RELATION_NAME]);
    }
    async getAllBuildingAppsAndSubApp() {
        const groupNode = await this._getApplicationGroupNode(constant_1.BUILDING_APPS_GROUP_NAME, constant_1.BUILDING_APPS_GROUP_TYPE);
        if (!groupNode)
            return [];
        const children = await groupNode.getChildren([constant_1.APP_RELATION_NAME]);
        const res = [...children];
        for (const app of children) {
            const subApps = await app.getChildren([constant_1.SUB_APP_RELATION_NAME]);
            res.push(...subApps);
        }
        return res;
    }
    async getAdminApp(searchKeys, appNameOrId) {
        const nodes = await this.getAllAdminApps();
        return (0, findNodeBySearchKey_1.findNodeBySearchKey)(nodes, searchKeys, appNameOrId);
    }
    async getBuildingApp(searchKeys, appNameOrId) {
        const nodes = await this.getAllBuildingApps();
        return (0, findNodeBySearchKey_1.findNodeBySearchKey)(nodes, searchKeys, appNameOrId);
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
    async getBuildingSubApp(searchKeys, appNameOrId, subAppNameOrId) {
        const buildingApp = await this.getBuildingApp(searchKeys, appNameOrId);
        if (!buildingApp)
            return;
        const nodes = await buildingApp.getChildren([constant_1.SUB_APP_RELATION_NAME]);
        return (0, findNodeBySearchKey_1.findNodeBySearchKey)(nodes, searchKeys, subAppNameOrId);
    }
    async findBuildingSubAppInApps(searchKeys, appsNodes, subAppNameOrId) {
        const promises = appsNodes.map((el) => el.getChildren([constant_1.SUB_APP_RELATION_NAME]));
        const subApps = await Promise.all(promises);
        return subApps
            .flat()
            .find(findNodeBySearchKey_1.isNodeMatchSearchKey.bind(null, searchKeys, subAppNameOrId));
    }
    async formatAppsAndAddSubApps(appsNodes, subAppsNodes) {
        const proms = appsNodes.map((el) => {
            return this.formatAppAndAddSubApps(el, subAppsNodes);
        });
        const items = await Promise.all(proms);
        return items.filter((el) => el !== undefined);
    }
    async formatAppAndAddSubApps(appsNode, subAppsNodes) {
        const res = appsNode.info.get();
        if (res.type === constant_1.BUILDING_APP_TYPE) {
            const subApps = await appsNode.getChildren([constant_1.SUB_APP_RELATION_NAME]);
            if (subApps.length !== 0) {
                res.subApps = subApps.reduce((acc, el) => {
                    if (!subAppsNodes ||
                        subAppsNodes.find((subApp) => subApp.info.id.get() === el.info.id.get()))
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
    async getApps(searchKeys, appNameOrId) {
        const promises = [
            this.getAllBuildingAppsAndSubApp(),
            this.getAllAdminApps(),
        ];
        const apps = await Promise.all(promises);
        return apps
            .flat()
            .find(findNodeBySearchKey_1.isNodeMatchSearchKey.bind(null, searchKeys, appNameOrId));
    }
    //////////////////////////////////
    //              UPDATES         //
    //////////////////////////////////
    async updateAdminApp(appId, newInfo) {
        const appNode = await this.getAdminApp(findNodeBySearchKey_1.searchById, appId);
        return this._updateAppInfo(appNode, newInfo);
    }
    async updateBuildingApp(appId, newInfo) {
        const appNode = await this.getBuildingApp(['id'], appId);
        return this._updateAppInfo(appNode, newInfo);
    }
    _updateAppInfo(appNode, newInfo) {
        if (appNode) {
            for (const key in newInfo) {
                if ((Object.prototype.hasOwnProperty.call(newInfo, key) &&
                    appNode.info[key]) ||
                    key === 'documentationLink') {
                    const element = newInfo[key];
                    if (appNode.info[key])
                        appNode.info[key].set(element);
                    else
                        appNode.info.add_attr(key, element);
                }
            }
            return appNode;
        }
    }
    async updateBuildingSubAppInfo(appId, subAppId, newInfo) {
        const subAppNode = await this.getBuildingSubApp(['id'], appId, subAppId);
        const keysToSkip = ['id', 'appConfig', 'parentApp'];
        if (subAppNode) {
            for (const key in newInfo) {
                if (keysToSkip.includes(key))
                    continue;
                if (Object.prototype.hasOwnProperty.call(newInfo, key)) {
                    const element = newInfo[key];
                    if (subAppNode.info[key])
                        subAppNode.info[key].set(element);
                    else
                        subAppNode.info.add_attr(key, element);
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
    async deleteAdminApp(appId) {
        const appNode = await this.getAdminApp(findNodeBySearchKey_1.searchById, appId);
        if (appNode) {
            await appNode.removeFromGraph();
            await (0, utils_1.removeNodeReferences)(appNode);
            return true;
        }
        return false;
    }
    async deleteBuildingApp(appId) {
        const appNode = await this.getBuildingApp(findNodeBySearchKey_1.searchById, appId);
        if (appNode) {
            // remove subApps
            const subApps = await appNode.getChildren([constant_1.SUB_APP_RELATION_NAME]);
            for (const subApp of subApps) {
                await subApp.removeFromGraph();
            }
            await appNode.removeFromGraph();
            await (0, utils_1.removeNodeReferences)(appNode);
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
    async deleteBuildingSubApp(appId, subAppId) {
        const appNode = await this.getBuildingApp(findNodeBySearchKey_1.searchById, appId);
        if (appNode) {
            const subApps = await appNode.getChildren([constant_1.SUB_APP_RELATION_NAME]);
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
    async uploadApps(appType, fileData, isExcel = false) {
        const data = isExcel
            ? await this._convertExcelToJson(fileData)
            : JSON.parse(JSON.stringify(fileData.toString()));
        const formattedApps = this._formatAppsJson(data);
        const listRes = [];
        for (const item of formattedApps) {
            try {
                let app;
                if (appType === exports.AppsType.admin)
                    app = await this.createAdminApp(item);
                else if (appType === exports.AppsType.building)
                    app = await this.createBuildingApp(item, true);
                else
                    console.error('App type not found, please use AppsType.admin or AppsType.building');
                if (app) {
                    this._updateAppInfo(app, item);
                    listRes.push(app);
                }
            }
            catch (error) {
                console.error(error);
            }
        }
        return listRes;
    }
    async uploadSubApps(fileData, isExcel = false) {
        const data = isExcel
            ? await this._convertExcelToJson(fileData)
            : JSON.parse(JSON.stringify(fileData.toString()));
        const formattedApps = this._formatSubAppsJson(data);
        const subAppsNodes = [];
        const errors = formattedApps.errors;
        for (const item of formattedApps.subApps) {
            try {
                const app = await this.getBuildingApp(findNodeBySearchKey_1.searchByNameOrId, item.parentApp);
                if (app) {
                    errors.push(`App ${item.parentApp} not found`);
                    continue;
                }
                let subApp = await this.createBuildingSubApp(app, item, true);
                if (subApp) {
                    if (typeof subApp === 'string')
                        errors.push(subApp);
                    else {
                        // update subApp with appInfo
                        await this.updateBuildingSubAppInfo(app.info.id.get(), subApp.info.id.get(), item);
                        subAppsNodes.push(subApp);
                    }
                }
            }
            catch (error) {
                console.error(error);
            }
        }
        return { subApps: subAppsNodes, errors };
    }
    //////////////////////////////////
    //              PRIVATES        //
    //////////////////////////////////
    async _getApplicationGroupNode(name, type, createIt = false) {
        const children = await this.context.getChildren([constant_1.CONTEXT_TO_APPS_GROUP]);
        const found = children.find((el) => el.getName().get() === name && el.getType().get() === type);
        if (found || !createIt)
            return found;
        const node = new spinal_env_viewer_graph_service_1.SpinalNode(name, type);
        return await this.context.addChildInContext(node, constant_1.CONTEXT_TO_APPS_GROUP, constant_1.PTR_LST_TYPE, this.context);
    }
    async _convertExcelToJson(excelData) {
        const data = await spinal_env_viewer_plugin_excel_manager_service_1.SpinalExcelManager.convertExcelToJson(excelData);
        return Object.values(data).flat();
    }
    _formatAppsJson(jsonData) {
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
                if (app.isExternalApp)
                    app.link = app.link;
                if (typeof app.tags === 'string')
                    app.tags = app.tags.split(',');
                liste.push(app);
            }
            return liste;
        }, []);
    }
    _formatSubAppsJson(jsonData) {
        const result = [];
        const errors = [];
        for (const app of jsonData) {
            const requiredAttrs = ['name', 'parent', 'appConfig'];
            const notValid = requiredAttrs.find((el) => !app[el]);
            if (!notValid) {
                if (typeof app.tags === 'string')
                    app.tags = app.tags.split(',');
                if (typeof app.appConfig === 'string') {
                    try {
                        app.appConfig = JSON.parse(app.appConfig);
                    }
                    catch (error) {
                        errors.push(`SubApp ${app.name} error parsing appConfig`);
                    }
                }
                result.push(app);
            }
            else {
                errors.push(`SubApp ${app.name} is not valid`);
            }
        }
        return { subApps: result, errors };
    }
}
exports.AppService = AppService;
//# sourceMappingURL=apps.service.js.map