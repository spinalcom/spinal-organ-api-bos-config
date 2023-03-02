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
    PTR_LST_TYPE, PROFILE_TO_AUTHORIZED_DIGITAL_TWIN_RELATION_NAME, PROFILE_TO_AUTHORIZED_APP, PROFILE_TO_AUTHORIZED_API, REF_TYPE, PROFILE_TO_AUTHORIZED_ADMIN_APP
} from "../constant";
import { SpinalContext, SpinalGraph, SpinalNode } from "spinal-env-viewer-graph-service";
import { Lst, Ptr } from "spinal-core-connectorjs_type";
import { DigitalTwinService } from "./digitalTwin.service";
import { AppService } from "./apps.service";
import apisController from "../controllers/apis.controller";
import { APIService } from "./apis.service";

export default class AuthorizationService {
    private static instance: AuthorizationService;

    private constructor() { }


    public static getInstance(): AuthorizationService {
        if (!this.instance) this.instance = new AuthorizationService();
        return this.instance;
    }

    // public async profileHasAccess(profile: SpinalNode, node: SpinalNode | string): Promise<boolean> {
    //     return
    // }

    /////////////////////////////////////////////
    //               AUTHORIZE
    /////////////////////////////////////////////
    public async authorizeProfileToAccessContext(profile: SpinalNode, digitalTwinId: string, contextIds: string | string[]): Promise<SpinalContext[]> {
        if (!Array.isArray(contextIds)) contextIds = [contextIds];
        if (!digitalTwinId) {
            digitalTwinId = await this._getActualDigitalTwinId();
            if (!digitalTwinId) throw "No digital twin is setup";
        }
        const node = await this.getAuthorizedDigitalTwinNode(profile, digitalTwinId, true);

        if (!node) throw `No digitalTwin found for ${digitalTwinId}`;

        const graph: SpinalGraph = await node.getElement(false);
        return contextIds.reduce(async (prom, contextId) => {
            const liste = await prom;
            const context = await DigitalTwinService.getInstance().findContextInDigitalTwin(digitalTwinId, contextId);

            if (context) {
                try {
                    await graph.addContext(context);
                    liste.push(context);
                } catch (error) { }

                return liste;
            }

        }, Promise.resolve([]))
    }

    public async authorizeProfileToAccessApps(profile: SpinalNode, appIds: string | string[]): Promise<SpinalNode[]> {
        if (!Array.isArray(appIds)) appIds = [appIds];
        return appIds.reduce(async (prom, appId) => {
            const liste = await prom;
            const app = await AppService.getInstance().getBuildingApp(appId);

            if (app) {
                try {
                    await profile.addChild(app, PROFILE_TO_AUTHORIZED_APP, PTR_LST_TYPE);
                    liste.push(app);
                } catch (error) { }

                return liste;
            }

        }, Promise.resolve([]))
    }

    public async authorizeProfileToAccessAdminApps(profile: SpinalNode, appIds: string | string[]): Promise<SpinalNode[]> {
        if (!Array.isArray(appIds)) appIds = [appIds];
        return appIds.reduce(async (prom, appId) => {
            const liste = await prom;
            const app = await AppService.getInstance().getAdminApp(appId);

            if (app) {
                try {
                    await profile.addChild(app, PROFILE_TO_AUTHORIZED_ADMIN_APP, PTR_LST_TYPE);
                    liste.push(app);
                } catch (error) { }

                return liste;
            }

        }, Promise.resolve([]))
    }

    public async authorizeProfileToAccessApis(profile: SpinalNode, apiIds: string | string[]): Promise<SpinalNode[]> {
        if (!Array.isArray(apiIds)) apiIds = [apiIds];
        return apiIds.reduce(async (prom, apiId) => {
            const liste = await prom;
            const api = await APIService.getInstance().getApiRouteById(apiId);

            if (api) {
                try {
                    await profile.addChild(api, PROFILE_TO_AUTHORIZED_API, PTR_LST_TYPE);
                    liste.push(api);
                } catch (error) { }

                return liste;
            }

        }, Promise.resolve([]))
    }

    /////////////////////////////////////////////
    //               GET AUTHORIZED
    /////////////////////////////////////////////

    public async getAuthorizedContexts(profile: SpinalNode, digitalTwinId: string): Promise<SpinalContext[]> {
        if (!digitalTwinId) {
            digitalTwinId = await this._getActualDigitalTwinId();
            if (!digitalTwinId) return [];
        }
        const digitalTwin = await this.getAuthorizedDigitalTwinNode(profile, digitalTwinId);
        if (!digitalTwin) return [];

        const graph: SpinalGraph = await digitalTwin.getElement(true);
        if (!graph) return [];

        return graph.getChildren("hasContext");
    }

    public async getAuthorizedApps(profile: SpinalNode): Promise<SpinalNode[]> {
        return profile.getChildren(PROFILE_TO_AUTHORIZED_APP);
    }

    public async getAuthorizedAdminApps(profile: SpinalNode): Promise<SpinalNode[]> {
        return profile.getChildren(PROFILE_TO_AUTHORIZED_ADMIN_APP);
    }

    public async getAuthorizedApis(profile: SpinalNode): Promise<SpinalNode[]> {
        return profile.getChildren(PROFILE_TO_AUTHORIZED_API);
    }

    public async getAuthorizedDigitalTwinNode(profile: SpinalNode, digitalTwinId: string, createIfNotExist: boolean = false) {
        if (!digitalTwinId) {
            digitalTwinId = await this._getActualDigitalTwinId();
        }

        const digitalTwins = await profile.getChildren(PROFILE_TO_AUTHORIZED_DIGITAL_TWIN_RELATION_NAME);
        const found = digitalTwins.find(el => el.getId().get() === digitalTwinId || el.info.refId?.get() === digitalTwinId);
        if (found) return found;

        if (createIfNotExist) {
            const digitalTwin = await DigitalTwinService.getInstance().getDigitalTwin(digitalTwinId);
            if (!digitalTwin) return;
            const ref = await this._createNodeReference(digitalTwin);
            return profile.addChild(ref, PROFILE_TO_AUTHORIZED_DIGITAL_TWIN_RELATION_NAME, PTR_LST_TYPE);
        }
    }

    /////////////////////////////////////////////
    //               UNAUTHORIZE
    /////////////////////////////////////////////

    public async unauthorizeProfileToAccessContext(profile: SpinalNode, digitalTwinId: string, contextIds: string | string[]): Promise<SpinalContext[]> {
        if (!Array.isArray(contextIds)) contextIds = [contextIds];
        if (!digitalTwinId) {
            digitalTwinId = await this._getActualDigitalTwinId();
            if (!digitalTwinId) throw "No digital twin is setup";
        }
        const node = await this.getAuthorizedDigitalTwinNode(profile, digitalTwinId, true);

        if (!node) throw `No digitalTwin found for ${digitalTwinId}`;

        const graph: SpinalGraph = await node.getElement(false);
        return contextIds.reduce(async (prom, contextId) => {
            const liste = await prom;
            const context = await DigitalTwinService.getInstance().findContextInDigitalTwin(digitalTwinId, contextId);

            if (context) {
                try {
                    await graph.removeChild(context, "hasContext", REF_TYPE);
                    liste.push(context);
                } catch (error) { }

                return liste;
            }

        }, Promise.resolve([]))
    }

    public async unauthorizeProfileToAccessApps(profile: SpinalNode, appIds: string | string[]): Promise<SpinalNode[]> {
        if (!Array.isArray(appIds)) appIds = [appIds];
        return appIds.reduce(async (prom, appId) => {
            const liste = await prom;
            const app = await AppService.getInstance().getBuildingApp(appId);

            if (app) {
                try {
                    await profile.removeChild(app, PROFILE_TO_AUTHORIZED_APP, PTR_LST_TYPE);
                    liste.push(app);
                } catch (error) { }

                return liste;
            }

        }, Promise.resolve([]))
    }

    public async unauthorizeProfileToAccessApis(profile: SpinalNode, apiIds: string | string[]): Promise<SpinalNode[]> {
        if (!Array.isArray(apiIds)) apiIds = [apiIds];
        return apiIds.reduce(async (prom, apiId) => {
            const liste = await prom;
            const api = await APIService.getInstance().getApiRouteById(apiId);

            if (api) {
                try {
                    await profile.removeChild(api, PROFILE_TO_AUTHORIZED_API, PTR_LST_TYPE);
                    liste.push(api);
                } catch (error) { }

                return liste;
            }

        }, Promise.resolve([]))
    }


    ///////////////////////////////////////////////
    //             VERIFICATION
    ///////////////////////////////////////////////

    public async profileHasAccessToContext(profile: SpinalNode, digitalTwinId: string, contextId: string): Promise<boolean> {
        const contexts = await this.getAuthorizedContexts(profile, digitalTwinId);
        return contexts.some(el => el.getId().get() === contextId);
    }

    public async profileHasAccessToApp(profile: SpinalNode, appId: string): Promise<boolean> {
        const contexts = await Promise.all([this.getAuthorizedApps(profile), this.getAuthorizedAdminApps(profile)]);
        return contexts.flat().some(el => el.getId().get() === appId);
    }

    public async profileHasAccessToApi(profile: SpinalNode, apiId: string): Promise<boolean> {
        const contexts = await this.getAuthorizedApis(profile);
        return contexts.some(el => el.getId().get() === apiId);
    }


    ///////////////////////////////////////////////
    //             PRIVATE
    ///////////////////////////////////////////////
    private async _createNodeReference(node: SpinalNode): Promise<SpinalNode> {
        const refNode = new SpinalNode(node.getName().get(), node.getType().get(), new SpinalGraph());

        refNode.info.add_attr({ refId: node.getId().get() });
        refNode.info.name.set(node.info.name);
        await this._addRefToNode(node, refNode);
        return refNode;
    }

    private _addRefToNode(node: SpinalNode, ref: SpinalNode) {

        if (node.info.references) {
            return new Promise((resolve, reject) => {
                node.info.references.load((lst) => {
                    lst.push(ref);
                    resolve(ref);
                })
            })

        } else {
            node.info.add_attr({
                references: new Ptr(new Lst([ref]))
            })
            return Promise.resolve(ref);
        }
    }

    private _getRealNode(refNode: SpinalNode): Promise<SpinalNode> {
        return refNode.getElement(false);
    }

    private async _getActualDigitalTwinId(): Promise<string> {
        const actualDigitalTwin = await DigitalTwinService.getInstance().getActualDigitalTwin();
        if (actualDigitalTwin) return actualDigitalTwin.getId().get();
    }

}


const authorizationInstance = AuthorizationService.getInstance();
export { authorizationInstance, AuthorizationService };