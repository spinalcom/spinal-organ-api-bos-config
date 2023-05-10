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

import { FileSystem, Model, spinalCore, File as SpinalFile } from 'spinal-core-connectorjs';
import { SpinalContext, SpinalGraph, SpinalGraphService, SpinalNode } from 'spinal-env-viewer-graph-service';
import { IConfig, ISpinalAPIMiddleware } from 'spinal-organ-api-server';
import { EXCLUDES_TYPES, HTTP_CODES } from '../constant';
import { AppProfileService, AppService, DigitalTwinService, UserProfileService } from '../services';



const digitalTwinService = DigitalTwinService.getInstance();

export default class SpinalAPIMiddleware implements ISpinalAPIMiddleware {

    config: IConfig = {
        spinalConnector: {
            protocol: process.env.HUB_PROTOCOL || 'http',
            user: process.env.USER_ID,
            password: process.env.USER_MDP,
            host: process.env.HUB_HOST,
            port: process.env.HUB_PORT
        },
        api: {
            port: process.env.SERVER_PORT
        },
        file: {
            path: process.env.CONFIG_DIRECTORY_PATH
        }
    };
    conn: FileSystem;
    loadedPtr: Map<number, any>;
    iteratorGraph: AsyncGenerator<SpinalGraph<any>, never> = this._geneGraph();
    profilesToGraph: Map<string, SpinalGraph> = new Map();
    private static instance: SpinalAPIMiddleware;

    private constructor(conn: spinal.FileSystem) {
        this.conn = conn;
    }

    static getInstance(conn?: spinal.FileSystem): SpinalAPIMiddleware {
        if (!this.instance) this.instance = new SpinalAPIMiddleware(conn);
        return this.instance;
    }

    async getGraph(): Promise<SpinalGraph<any>> {
        const next = await this.iteratorGraph.next();
        return next.value;
    }

    async getProfileGraph(profileId: string): Promise<SpinalGraph> {
        let graph: any = this.profilesToGraph.get(profileId);
        if (graph) return graph;

        graph = await AppProfileService.getInstance().getAppProfileNodeGraph(profileId);
        if (!graph) graph = await UserProfileService.getInstance().getUserProfileNodeGraph(profileId);

        if (!graph) throw { code: 401, message: `No graph found for ${profileId}` };

        this.profilesToGraph.set(profileId, graph);
        return graph;
    }

    addProfileToMap(profileId: string, graph: SpinalGraph) {
        this.profilesToGraph.set(profileId, graph);
    }

    async load<T extends Model>(server_id: number, profileId: string): Promise<T> {
        if (!server_id) return Promise.reject({ code: 406, message: "Invalid serverId" });

        if (!profileId) return Promise.reject({ code: HTTP_CODES.UNAUTHORIZED, message: "Unauthorized" });


        let node = FileSystem._objects[server_id];
        if (!node) return this._loadwithConnect(server_id, profileId);

        if (node instanceof SpinalFile) return <any>node;
        const found = await this._nodeIsBelongUserContext(<SpinalNode>node, profileId);
        if (!found) return Promise.reject({ code: HTTP_CODES.UNAUTHORIZED, message: "Unauthorized" });

        // @ts-ignore
        SpinalGraphService._addNode(node);
        // @ts-ignore
        return Promise.resolve(node);
    }

    loadPtr<T extends Model>(ptr: spinal.File<T> | spinal.Ptr<T> | spinal.Pbr<T>): Promise<T> {
        if (ptr instanceof spinalCore._def['File']) return this.loadPtr(ptr._ptr);
        const server_id = ptr.data.value;

        if (this.loadedPtr.has(server_id)) {
            return this.loadedPtr.get(server_id);
        }

        const prom: Promise<T> = new Promise((resolve, reject) => {
            try {
                this.conn.load_ptr(
                    server_id,
                    (model: T) => {
                        if (!model) { reject(new Error(`LoadedPtr Error server_id: '${server_id}'`)); }
                        else { resolve(model); }
                    });

            } catch (e) {
                reject(e);
            }
        });
        this.loadedPtr.set(server_id, prom);
        return prom;
    }


    //////////////////////////////////////////////
    //               PRIVATES                   //
    //////////////////////////////////////////////

    private async *_geneGraph(): AsyncGenerator<SpinalGraph<any>, never> {
        let graph;

        while (true) {
            const actualDigitalTwin = await digitalTwinService.getActualDigitalTwin();
            const url = actualDigitalTwin.info.url.get();
            if (!graph || url !== this.config.file.path) {
                graph = await this._loadNewGraph(url);
                await SpinalGraphService.setGraph(graph)
            }

            yield graph;
        }
    }

    private _loadNewGraph(path: string): Promise<SpinalGraph> {
        return new Promise<SpinalGraph<any>>((resolve, reject) => {
            spinalCore.load(this.conn, path, (graph: any) => {
                resolve(graph);
            }, () => {
                console.error(`File does not exist in location ${path}`);
                reject();
            });
        });
    }

    private _loadwithConnect<T extends spinal.Model>(server_id: number, profileId: string): Promise<T> {
        return new Promise((resolve, reject) => {
            this.conn.load_ptr(server_id, async (model: T) => {
                if (!model) return reject({ code: 404, message: "Node is not found" });

                if (model instanceof SpinalFile) return resolve(model);

                const contextFound = await this._nodeIsBelongUserContext(<any>model, profileId);
                if (!contextFound) return reject({ code: 401, message: "Unauthorized" });

                // @ts-ignore
                SpinalGraphService._addNode(model);
                // @ts-ignore
                return resolve(model);
            })
        });
    }

    private async _nodeIsBelongUserContext(node: SpinalNode<any>, profileId: string): Promise<boolean> {
        const type = node.getType().get();
        if (EXCLUDES_TYPES.indexOf(type) !== -1) return true;

        const contexts = await this._getProfileContexts(profileId);

        const found = contexts.find(context => {
            if (node instanceof SpinalContext) return node.getId().get() === context.getId().get();
            return node.belongsToContext(context)
        })
        return found ? true : false;
    }

    private async _getProfileContexts(profileId: string): Promise<SpinalNode<any>[]> {
        const graph = await this.getProfileGraph(profileId);
        if (!graph) throw new Error("no graph found");

        const contexts = await graph.getChildren(["hasContext"]);

        //addContext to SpinalNode map
        return contexts.map(context => {
            //@ts-ignore
            SpinalGraphService._addNode(context);
            return context;
        });
    }

}

export { SpinalAPIMiddleware };