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
import SpinalAPIMiddleware from "../middlewares/SpinalAPIMiddleware";

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

    /**
     * Retrieves the graph element associated with the provided digital twin node.
     *
     * @param digitalTwin - The SpinalNode instance representing the digital twin.
     * @returns A promise that resolves to the corresponding SpinalGraph.
     * @throws Will throw an error if the retrieval fails.
     */
    public async getDigitalTwinGraph(digitalTwin: SpinalNode): Promise<SpinalGraph> {
        try {
            return digitalTwin.getElement(true);
        } catch (error) { }
    }


    /**
     * Retrieves the list of contexts associated with a digital twin.
     *
     * If a `digitalTwinId` is provided, it fetches the contexts for the specified digital twin.
     * Otherwise, it fetches the contexts for the currently active digital twin.
     * Returns an empty array if the digital twin or its graph cannot be found.
     *
     * @param digitalTwinId - (Optional) The ID of the digital twin to retrieve contexts for.
     * @returns A promise that resolves to an array of `SpinalContext` objects associated with the digital twin.
     */
    public async getDigitalTwinContexts(digitalTwinId?: string): Promise<SpinalContext[]> {
        const digitalTwin = await (digitalTwinId ? this.getDigitalTwin(digitalTwinId) : this.getActualDigitalTwin());
        if (!digitalTwin) return [];

        const graph: SpinalGraph = await this.getDigitalTwinGraph(digitalTwin);
        if (!graph) return [];

        return graph.getChildren("hasContext");
    }


    /**
     * Finds and returns a specific context within a digital twin by its context ID.
     *
     * @param digitalTwinId - The unique identifier of the digital twin to search within.
     * @param contextId - The unique identifier of the context to find.
     * @returns A promise that resolves to the found `SpinalContext` if it exists, or `undefined` if not found.
     */
    public async findContextInDigitalTwin(digitalTwinId: string, contextId: string): Promise<SpinalContext> {
        const contexts = await this.getDigitalTwinContexts(digitalTwinId);
        return contexts.find(el => el.getId().get() === contextId);
    }


    /**
     * Creates a new digital twin node and its associated graph file.
     *
     * If the graph file already exists at the specified directory path, it will use the existing graph.
     * Otherwise, it creates a new graph file and node. Optionally sets the created node as the default digital twin.
     *
     * @param name - The name of the digital twin.
     * @param directoryPath - The directory path where the digital twin graph file should be stored.
     * @param setAsDefault - (Optional) Whether to set the created digital twin as the default. Defaults to false.
     * @returns A promise that resolves to the created `SpinalNode` instance.
     */
    public createDigitalTwin(name: string, directoryPath: string, setAsDefault: boolean = false): Promise<SpinalNode> {
        if (directoryPath[directoryPath.length - 1] != '/') directoryPath += "/";

        return this._getOrCreateDigitalTwin(name, directoryPath)
            .then(async (graph) => {
                return this._createDigitalTwinNode(name, `${directoryPath}${name}`, graph, setAsDefault);
            })
    }

    /**
     * Retrieves all digital twin nodes from the current context.
     *
     * @returns {Promise<SpinalNode[]>} A promise that resolves to an array of `SpinalNode` instances representing all digital twins.
     *
     * @throws Will propagate any errors thrown by the underlying context's `getChildren` method.
     */
    public async getAllDigitalTwins(): Promise<SpinalNode[]> {
        const children = await this.context.getChildren(CONTEXT_TO_DIGITALTWIN_RELATION_NAME);
        return children.map(el => el);
    }


    /**
     * Retrieves a specific digital twin node by its unique identifier.
     *
     * @param digitaltwinId - The unique identifier of the digital twin to retrieve.
     * @returns A promise that resolves to the matching `SpinalNode` if found, or `void` if not found.
     */
    public async getDigitalTwin(digitaltwinId: string): Promise<SpinalNode | void> {
        const allDigitalTwins = await this.getAllDigitalTwins();
        return allDigitalTwins.find(el => el.getId().get() === digitaltwinId);
    }


    /**
     * Updates the properties of a digital twin node with new data.
     *
     * @param digitalTwinId - The unique identifier of the digital twin to edit.
     * @param newData - An object containing the properties to update. Supported keys are `name` and `url`.
     * @returns A promise that resolves to the updated `SpinalNode` if found, otherwise `undefined`.
     *
     * @throws Will throw an error if the digital twin cannot be retrieved.
     */
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

    /**
     * Removes a digital twin from the graph by its ID.
     *
     * @param digitalTwinId - The unique identifier of the digital twin to remove.
     * @returns A promise that resolves to `true` if the digital twin was found and removed, or `false` if not found.
     */
    public async removeDigitalTwin(digitalTwinId: string): Promise<boolean> {
        const node = await this.getDigitalTwin(digitalTwinId);
        if (node) {
            await node.removeFromGraph();
            return true;
        }

        return false;
    }


    /**
     * Sets the specified digital twin as the actual (default) digital twin.
     *
     * Updates the context and the digital twin node to reflect the new default.
     * Removes the previous default digital twin if it exists.
     *
     * @param digitalTwinId - The unique identifier of the digital twin to set as actual.
     * @returns A promise that resolves to the set `SpinalNode` if successful, or `undefined` if not found.
     */
    public async setActualDigitalTwin(digitalTwinId: string): Promise<SpinalNode | void> {
        const digitalTwinNode = await this.getDigitalTwin(digitalTwinId);
        if (digitalTwinNode) {
            if (this.context.info[this.attrName]) {
                await this.removeActualDigitaTwin();
            }
            digitalTwinNode.info.add_attr({ [this.attrName]: true });
            this.context.info.add_attr({ [this.attrName]: new Ptr(digitalTwinNode) });
            this._actualDigitalTwin = digitalTwinNode;
            await SpinalAPIMiddleware.getInstance().setGraph(digitalTwinNode);
            return digitalTwinNode;
        }

        return undefined;
    }


    /**
     * Retrieves the current digital twin node associated with the context.
     * 
     * If the digital twin node is already loaded and cached, it resolves immediately with the cached node.
     * If the node does not exist and `createIfNotExist` is `true`, it creates a new digital twin node and resolves with it.
     * If the node does not exist and `createIfNotExist` is `false`, it resolves with `undefined`.
     * Otherwise, it loads the node asynchronously and resolves with the loaded node.
     * 
     * @param createIfNotExist - Whether to create the digital twin node if it does not exist. Defaults to `false`.
     * @returns A promise that resolves with the `SpinalNode` representing the digital twin, or `undefined` if not found and not created.
     */
    public getActualDigitalTwin(createIfNotExist: boolean = false): Promise<SpinalNode> {
        return new Promise(async (resolve, reject) => {
            if (this._actualDigitalTwin instanceof SpinalNode) return resolve(this._actualDigitalTwin)
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

    /**
     * Removes the current actual (default) digital twin association from the context.
     *
     * This method clears the reference to the default digital twin in both the context and the digital twin node itself.
     *
     * @returns A promise that resolves to `true` if the association was removed, or `false` if no default was set.
     */
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


}