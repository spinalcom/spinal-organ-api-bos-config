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
exports.DigitalTwinService = void 0;
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const configFile_service_1 = require("./configFile.service");
const spinal_core_connectorjs_type_1 = require("spinal-core-connectorjs_type");
const path = require("path");
const constant_1 = require("../constant");
const adminProfile_service_1 = require("./adminProfile.service");
class DigitalTwinService {
    constructor() {
        this.attrName = "defaultDigitalTwin";
    }
    static getInstance() {
        if (!this.instance)
            this.instance = new DigitalTwinService();
        return this.instance;
    }
    async init() {
        this.context = await configFile_service_1.configServiceInstance.getContext(constant_1.DIGITALTWIN_CONTEXT_NAME);
        if (!this.context)
            this.context = await configFile_service_1.configServiceInstance.addContext(constant_1.DIGITALTWIN_CONTEXT_NAME, constant_1.DIGITALTWIN_CONTEXT_TYPE);
        return this.context;
    }
    async getDigitalTwinGraph(digitalTwin) {
        try {
            return digitalTwin.getElement(true);
        }
        catch (error) { }
    }
    async getDigitalTwinContexts(digitalTwinId) {
        const digitalTwin = await (digitalTwinId ? this.getDigitalTwin(digitalTwinId) : this.getActualDigitalTwin());
        if (!digitalTwin)
            return [];
        const graph = await this.getDigitalTwinGraph(digitalTwin);
        if (!graph)
            return [];
        return graph.getChildren("hasContext");
    }
    async findContextInDigitalTwin(digitalTwinId, contextId) {
        const contexts = await this.getDigitalTwinContexts(digitalTwinId);
        return contexts.find(el => el.getId().get() === contextId);
    }
    createDigitalTwin(name, directoryPath, setAsDefault = false) {
        if (directoryPath[directoryPath.length - 1] != '/')
            directoryPath += "/";
        return this._getOrCreateDigitalTwin(name, directoryPath)
            .then(async (graph) => {
            return this._createDigitalTwinNode(name, `${directoryPath}${name}`, graph, setAsDefault);
        });
    }
    async getAllDigitalTwins() {
        const children = await this.context.getChildren(constant_1.CONTEXT_TO_DIGITALTWIN_RELATION_NAME);
        return children.map(el => el);
    }
    async getDigitalTwin(digitaltwinId) {
        const allDigitalTwins = await this.getAllDigitalTwins();
        return allDigitalTwins.find(el => el.getId().get() === digitaltwinId);
    }
    async editDigitalTwin(digitalTwinId, newData) {
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
    async removeDigitalTwin(digitalTwinId) {
        const node = await this.getDigitalTwin(digitalTwinId);
        if (node) {
            await node.removeFromGraph();
            return true;
        }
        return false;
    }
    async setActualDigitalTwin(digitalTwinId) {
        const digitalTwinNode = await this.getDigitalTwin(digitalTwinId);
        if (digitalTwinNode) {
            if (this.context.info[this.attrName]) {
                await this.removeActualDigitaTwin();
            }
            digitalTwinNode.info.add_attr({ [this.attrName]: true });
            this.context.info.add_attr({ [this.attrName]: new spinal_core_connectorjs_type_1.Ptr(digitalTwinNode) });
            this._actualDigitalTwin = digitalTwinNode;
            return digitalTwinNode;
        }
        return undefined;
    }
    getActualDigitalTwin(createIfNotExist = false) {
        return new Promise(async (resolve, reject) => {
            if (this._actualDigitalTwin instanceof spinal_env_viewer_graph_service_1.SpinalNode)
                return resolve(this._actualDigitalTwin);
            if (!this.context.info[this.attrName]) {
                if (!createIfNotExist)
                    return resolve(undefined);
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
            });
        });
    }
    async removeActualDigitaTwin() {
        if (!this.context.info[this.attrName])
            return false;
        const defaultDigitalTwin = await this.getActualDigitalTwin();
        if (!defaultDigitalTwin)
            return false;
        defaultDigitalTwin.info.rem_attr(this.attrName);
        this.context.info.rem_attr(this.attrName);
        return true;
    }
    /////////////////////////////////////////////////////////
    //                      PRIVATE                        //
    /////////////////////////////////////////////////////////
    _getOrCreateDigitalTwin(name, directoryPath, createIfNotExist = false) {
        if (directoryPath[directoryPath.length - 1] != '/')
            directoryPath += "/";
        const file_path = path.resolve(`${directoryPath}${name}`);
        const connect = configFile_service_1.configServiceInstance.hubConnect;
        return new Promise((resolve, reject) => {
            try {
                spinal_core_connectorjs_type_1.spinalCore.load(connect, file_path, (graph) => {
                    resolve(graph);
                }, () => {
                    if (createIfNotExist) {
                        connect.load_or_make_dir(directoryPath, (directory) => {
                            resolve(this._createFile(directory, name, directoryPath));
                        });
                    }
                    else {
                        reject(`digitaltwin not found`);
                    }
                });
            }
            catch (error) {
                reject(`Something went wrong please check your digitaltwin path`);
            }
        });
    }
    _createFile(directory, fileName, folderPath) {
        const graph = new spinal_env_viewer_graph_service_1.SpinalGraph(fileName);
        directory.force_add_file(fileName, graph, { model_type: constant_1.DIGITALTWIN_TYPE, path: `${folderPath}/${fileName}`, icon: "" });
        return graph;
    }
    async _createDigitalTwinNode(name, directoryPath, graph, setAsDefault = false) {
        const node = new spinal_env_viewer_graph_service_1.SpinalNode(name, constant_1.DIGITALTWIN_TYPE, graph);
        node.info.add_attr({
            url: directoryPath
        });
        await this.context.addChildInContext(node, constant_1.CONTEXT_TO_DIGITALTWIN_RELATION_NAME, constant_1.PTR_LST_TYPE, this.context);
        if (setAsDefault) {
            await this.setActualDigitalTwin(node.getId().get());
        }
        await adminProfile_service_1.AdminProfileService.getInstance().addDigitalTwinToAdminProfile(node);
        return node;
    }
}
exports.DigitalTwinService = DigitalTwinService;
//# sourceMappingURL=digitalTwin.service.js.map