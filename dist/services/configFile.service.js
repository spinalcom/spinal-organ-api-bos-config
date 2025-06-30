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
exports.configServiceInstance = void 0;
const path = require("path");
const spinal_core_connectorjs_type_1 = require("spinal-core-connectorjs_type");
const spinal_model_graph_1 = require("spinal-model-graph");
const constant_1 = require("../constant");
const _1 = require(".");
const adminApps_1 = require("../defaultApps/adminApps");
// const { config: { directory_path, fileName } } = require("../../config");
const directory_path = process.env.CONFIG_DIRECTORY_PATH || constant_1.CONFIG_DEFAULT_DIRECTORY_PATH;
const fileName = process.env.CONFIG_FILE_NAME || constant_1.CONFIG_DEFAULT_NAME;
class ConfigFileService {
    constructor() { }
    static getInstance() {
        if (!ConfigFileService.instance) {
            ConfigFileService.instance = new ConfigFileService();
        }
        return ConfigFileService.instance;
    }
    init(connect) {
        return this.loadOrMakeConfigFile(connect).then((graph) => {
            this.hubConnect = connect;
            this.graph = graph;
            return this._initServices().then(async (result) => {
                // await DigitalTwinService.getInstance().init(connect);
                await (0, adminApps_1.createDefaultAdminApps)();
                return result;
            });
        });
    }
    getContext(contextName) {
        return this.graph.getContext(contextName);
    }
    addContext(contextName, contextType) {
        const context = new spinal_model_graph_1.SpinalContext(contextName, contextType);
        return this.graph.addContext(context);
    }
    async loadOrMakeConfigFile(connect) {
        try {
            const graph = await spinal_core_connectorjs_type_1.spinalCore.load(connect, path.resolve(`${directory_path}/${fileName}`));
            return graph;
        }
        catch (error) {
            const dir = await connect.load_or_make_dir(directory_path);
            const graph = this._createFile(dir, fileName);
            return graph;
        }
    }
    _createFile(directory, fileName = constant_1.CONFIG_DEFAULT_NAME) {
        const graph = new spinal_model_graph_1.SpinalGraph(constant_1.CONFIG_DEFAULT_NAME);
        directory.force_add_file(fileName, graph, {
            model_type: constant_1.CONFIG_FILE_MODEl_TYPE,
        });
        return graph;
    }
    _initServices() {
        const services = [_1.APIService, _1.AppProfileService, _1.AppService, _1.OrganListService, _1.UserProfileService, _1.UserListService, _1.AppListService, _1.DigitalTwinService, _1.TokenService, _1.LogService, _1.WebsocketLogsService, _1.AuthentificationService, _1.SpinalCodeUniqueService];
        const promises = services.map((service) => {
            try {
                const instance = service.getInstance();
                if (typeof instance.init === "function")
                    return instance.init();
            }
            catch (error) {
                console.error(error);
            }
        });
        return Promise.all(promises);
    }
}
exports.default = ConfigFileService;
exports.configServiceInstance = ConfigFileService.getInstance();
//# sourceMappingURL=configFile.service.js.map