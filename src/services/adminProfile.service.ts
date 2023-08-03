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

import { SpinalContext, SpinalGraph, SpinalGraphService, SpinalNode } from "spinal-env-viewer-graph-service";
import { ADMIN_PROFILE_NAME, ADMIN_PROFILE_TYPE, APP_RELATION_NAME, CONTEXT_TO_USER_PROFILE_RELATION_NAME, PORTOFOLIO_TYPE, PROFILE_TO_AUTHORIZED_DIGITAL_TWIN_RELATION_NAME, PROFILE_TO_AUTHORIZED_PORTOFOLIO_RELATION, PTR_LST_TYPE } from '../constant'
import AuthorizationService from "./authorization.service";
import { UserProfileService } from "./userProfile.service";
import { DigitalTwinService } from "./digitalTwin.service";
import { AppService } from "./apps.service";
import { APIService } from "./apis.service";


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
            await context.addChildInContext(node, CONTEXT_TO_USER_PROFILE_RELATION_NAME, PTR_LST_TYPE, context);
        }

        this._adminNode = node;

        await this.syncAdminProfile();
        return node;
    }

    public async getAdminProfile(argContext?: SpinalContext): Promise<SpinalNode> {
        if (this._adminNode) return this._adminNode;

        const context = argContext || UserProfileService.getInstance().context;
        if (!context) return;

        const children = await context.getChildren();

        return children.find(el => {
            return el.getName().get() === ADMIN_PROFILE_NAME && el.getType().get() === ADMIN_PROFILE_TYPE
        })
    }

    async addAppToProfil(apps: SpinalNode | SpinalNode[]): Promise<SpinalNode[]> {
        if (!Array.isArray(apps)) apps = [apps];

        return UserProfileService.getInstance().authorizeProfileToAccessApps(this._adminNode, apps.map(el => el.getId().get()));
    }

    async addAdminAppToProfil(apps: SpinalNode | SpinalNode[]): Promise<SpinalNode[]> {
        if (!Array.isArray(apps)) apps = [apps];

        return AuthorizationService.getInstance().authorizeProfileToAccessAdminApps(this._adminNode, apps.map(el => el.getId().get()));
    }

    async addApiToProfil(apis: SpinalNode | SpinalNode[]): Promise<SpinalNode[]> {
        if (!Array.isArray(apis)) apis = [apis];

        return UserProfileService.getInstance().authorizeProfileToAccessApis(this._adminNode, apis.map(el => el.getId().get()));
    }

    async addDigitalTwinToAdminProfile(digitalTwins: SpinalNode | SpinalNode[]): Promise<SpinalNode[]> {
        if (!Array.isArray(digitalTwins)) digitalTwins = [digitalTwins];

        return digitalTwins.reduce(async (prom: Promise<SpinalNode[]>, digitalTwin: SpinalNode) => {
            const liste = await prom;

            try {
                const node = await this._adminNode.addChild(digitalTwin, PROFILE_TO_AUTHORIZED_DIGITAL_TWIN_RELATION_NAME, PTR_LST_TYPE);
                liste.push(node)
            } catch (error) { }

            return liste;
        }, Promise.resolve([]))
    }


    public async syncAdminProfile(): Promise<any> {

        return {
            digitaTwins: await this._authorizeAllDigitalTwin(),
            apps: await Promise.all([this._authorizeAllApps(), this._authorizeAllAdminApps()]),
            apis: await this._authorizeAllApis()
        }

    }


    private _createAdminProfile(): SpinalNode {
        const info = {
            name: ADMIN_PROFILE_NAME,
            type: ADMIN_PROFILE_TYPE
        }
        const graph = new SpinalGraph(ADMIN_PROFILE_NAME)
        const profileId = SpinalGraphService.createNode(info, graph);

        const node = SpinalGraphService.getRealNode(profileId);
        return node;
    }


    private async _authorizeAllDigitalTwin(): Promise<SpinalNode[]> {
        const digitalTwins = await DigitalTwinService.getInstance().getAllDigitalTwins();
        return this.addDigitalTwinToAdminProfile(digitalTwins);
    }

    private async _authorizeAllApps(): Promise<SpinalNode[]> {
        const buildingApps = await AppService.getInstance().getAllBuildingApps();
        return this.addAppToProfil(buildingApps);
    }

    private async _authorizeAllAdminApps(): Promise<SpinalNode[]> {
        const adminApps = await AppService.getInstance().getAllAdminApps();
        return this.addAdminAppToProfil(adminApps);
    }

    private async _authorizeAllApis(): Promise<SpinalNode[]> {
        const apis = await APIService.getInstance().getAllApiRoute();
        return this.addApiToProfil(apis);
    }

}