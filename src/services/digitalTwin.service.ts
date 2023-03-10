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

import { SpinalContext, SpinalGraph, SpinalNode } from "spinal-env-viewer-graph-service";
import { configServiceInstance } from './configFile.service';
import { spinalCore, Ptr } from "spinal-core-connectorjs_type";
import * as path from "path";
import { CONTEXT_TO_DIGITALTWIN_RELATION_NAME, DIGITALTWIN_CONTEXT_NAME, DIGITALTWIN_CONTEXT_TYPE, DIGITALTWIN_TYPE, PORTOFOLIO_CONTEXT_NAME, PTR_LST_TYPE } from "../constant";
import { AdminProfileService } from "./adminProfile.service";

export class DigitalTwinService {
    private static instance: DigitalTwinService;

    private _actualDigitalTwin: SpinalNode;
    private attrName: string = "defaultDigitalTwin";
    public context: SpinalContext;

    private constructor() { }

    public static getInstance(): DigitalTwinService {
        if (!this.instance) this.instance = new DigitalTwinService();

        return this.instance;
    }

    async init(): Promise<SpinalContext> {
        this.context = await configServiceInstance.getContext(DIGITALTWIN_CONTEXT_NAME);
        if (!this.context) this.context = await configServiceInstance.addContext(DIGITALTWIN_CONTEXT_NAME, DIGITALTWIN_CONTEXT_TYPE);

        return this.context;
    }


    public async getDigitalTwinContexts(digitalTwinId?: string): Promise<SpinalContext[]> {
        const digitalTwin = await (digitalTwinId ? this.getDigitalTwin(digitalTwinId) : this.getActualDigitalTwin());
        if (!digitalTwin) return [];

        const graph: SpinalContext = await digitalTwin.getElement(true);
        if (!graph) return [];

        return graph.getChildren("hasContext");
    }

    public async findContextInDigitalTwin(digitalTwinId: string, contextId: string): Promise<SpinalContext> {
        const contexts = await this.getDigitalTwinContexts(digitalTwinId);
        return contexts.find(el => el.getId().get() === contextId);
    }

    public createDigitalTwin(name: string, directoryPath: string, setAsDefault: boolean = false): Promise<SpinalNode> {
        if (directoryPath[directoryPath.length - 1] != '/') directoryPath += "/";

        return this._getOrCreateDigitalTwin(name, directoryPath)
            .then(async (graph) => {
                return this._createDigitalTwinNode(name, `${directoryPath}${name}`, graph, setAsDefault);
            })
    }

    public async getAllDigitalTwins(): Promise<SpinalNode[]> {
        const children = await this.context.getChildren(CONTEXT_TO_DIGITALTWIN_RELATION_NAME);
        return children.map(el => el);
    }

    public async getDigitalTwin(digitaltwinId: string): Promise<SpinalNode | void> {
        const allDigitalTwins = await this.getAllDigitalTwins();
        return allDigitalTwins.find(el => el.getId().get() === digitaltwinId);
    }


    public async editDigitalTwin(digitalTwinId: string, newData: { name?: string; url?: string }): Promise<SpinalNode> {
        const node = await this.getDigitalTwin(digitalTwinId);
        if (node) {
            for (const key in newData) {
                if (node.info[key]) {
                    node.info[key].set(newData[key]);
                }
            }

            return node;
        }

    }

    public async removeDigitalTwin(digitalTwinId: string): Promise<boolean> {
        const node = await this.getDigitalTwin(digitalTwinId);
        if (node) {
            await node.removeFromGraph();
            return true;
        }

        return false;
    }

    public async setActualDigitalTwin(digitalTwinId: string): Promise<SpinalNode | void> {
        const digitalTwinNode = await this.getDigitalTwin(digitalTwinId);
        if (digitalTwinNode) {
            if (this.context.info[this.attrName]) {
                await this.removeActualDigitaTwin();
            }
            digitalTwinNode.info.add_attr({ [this.attrName]: true });
            this.context.info.add_attr({ [this.attrName]: new Ptr(digitalTwinNode) });
            this._actualDigitalTwin = digitalTwinNode;
            return digitalTwinNode;
        }

        return undefined;
    }

    public getActualDigitalTwin(createIfNotExist: boolean = false): Promise<SpinalNode> {
        return new Promise(async (resolve, reject) => {

            if (!this.context.info[this.attrName]) {
                if (!createIfNotExist) return resolve(undefined);
                const defaultName = "Digital twin";
                const defaultDirectory = "/__users__/admin/";
                const graph = await this._getOrCreateDigitalTwin(defaultName, defaultDirectory, createIfNotExist);
                const node = await this._createDigitalTwinNode(defaultName, `${defaultDirectory}${defaultName}`, graph, true);
                this._actualDigitalTwin = node;
                return resolve(node);
            }

            this.context.info[this.attrName].load((node) => {
                this._actualDigitalTwin = node;
                resolve(node);
            })
        });
    }

    public async removeActualDigitaTwin(): Promise<boolean> {
        if (!this.context.info[this.attrName]) return false;

        const defaultDigitalTwin = await this.getActualDigitalTwin();
        if (!defaultDigitalTwin) return false;

        defaultDigitalTwin.info.rem_attr(this.attrName);
        this.context.info.rem_attr(this.attrName);
        return true;
    }

    /////////////////////////////////////////////////////////
    //                      PRIVATE                        //
    /////////////////////////////////////////////////////////


    private _getOrCreateDigitalTwin(name: string, directoryPath: string, createIfNotExist: boolean = false): Promise<SpinalGraph> {
        if (directoryPath[directoryPath.length - 1] != '/') directoryPath += "/";
        const file_path = path.resolve(`${directoryPath}${name}`);

        const connect = configServiceInstance.hubConnect;

        return new Promise((resolve, reject) => {
            try {
                spinalCore.load(connect, file_path,
                    (graph: SpinalGraph) => {
                        resolve(graph);
                    },
                    () => {
                        if (createIfNotExist) {
                            connect.load_or_make_dir(directoryPath, (directory) => {
                                resolve(this._createFile(directory, name, directoryPath));
                            })
                        } else {
                            reject(`digitaltwin not found`)
                        }
                    }
                )
            } catch (error) {
                reject(`Something went wrong please check your digitaltwin path`)
            }

        });
    }

    private _createFile(directory: spinal.Directory, fileName: string, folderPath: string): SpinalGraph {
        const graph = new SpinalGraph(fileName);
        directory.force_add_file(fileName, graph, { model_type: DIGITALTWIN_TYPE, path: `${folderPath}/${fileName}`, icon: "" });
        return graph;
    }

    private async _createDigitalTwinNode(name: string, directoryPath: string, graph: SpinalGraph, setAsDefault: boolean = false) {
        const node = new SpinalNode(name, DIGITALTWIN_TYPE, graph);
        node.info.add_attr({
            url: directoryPath
        });
        await this.context.addChildInContext(node, CONTEXT_TO_DIGITALTWIN_RELATION_NAME, PTR_LST_TYPE, this.context);

        if (setAsDefault) {
            await this.setActualDigitalTwin(node.getId().get());
        }

        await AdminProfileService.getInstance().addDigitalTwinToAdminProfile(node);
        return node;
    }

    // private _getAllHubDigitaltwin() {
    //     return new Promise((resolve, reject) => {
    //         try {
    //             const connect = configServiceInstance.hubConnect;
    //             spinalCore.load_type(connect,)
    //         } catch (error) {
    //             reject(error);
    //         }

    //     });

    // }

}