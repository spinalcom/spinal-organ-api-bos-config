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

import * as path from "path";
import { spinalCore } from "spinal-core-connectorjs_type";
import { SpinalGraph, SpinalContext } from "spinal-model-graph";
import { CONFIG_DEFAULT_NAME, CONFIG_FILE_MODEl_TYPE, CONFIG_DEFAULT_DIRECTORY_PATH } from "../constant";

import { APIService, AppProfileService, AppService, OrganListService, UserProfileService, DigitalTwinService, TokenService, UserListService, AppListService, LogService, WebsocketLogsService, AuthentificationService, SpinalCodeUniqueService } from ".";

import { createDefaultAdminApps } from "../defaultApps/adminApps";

// const { config: { directory_path, fileName } } = require("../../config");

const directory_path = process.env.CONFIG_DIRECTORY_PATH || CONFIG_DEFAULT_DIRECTORY_PATH;
const fileName = process.env.CONFIG_FILE_NAME || CONFIG_DEFAULT_NAME;

export default class ConfigFileService {
  private static instance: ConfigFileService;
  public graph: SpinalGraph;
  public hubConnect: spinal.FileSystem;

  private constructor() { }

  public static getInstance(): ConfigFileService {
    if (!ConfigFileService.instance) {
      ConfigFileService.instance = new ConfigFileService();
    }
    return ConfigFileService.instance;
  }

  public init(connect: spinal.FileSystem): Promise<(SpinalContext | void)[]> {
    return this.loadOrMakeConfigFile(connect).then((graph: SpinalGraph) => {
      this.hubConnect = connect;
      this.graph = graph;
      return this._initServices().then(async (result) => {
        // await DigitalTwinService.getInstance().init(connect);
        await createDefaultAdminApps();
        return result;
      });
    });
  }

  public getContext(contextName: string): Promise<SpinalContext> {
    return this.graph.getContext(contextName);
  }

  public addContext(contextName: string, contextType?: string): Promise<SpinalContext> {
    const context = new SpinalContext(contextName, contextType);
    return this.graph.addContext(context);
  }

  private async loadOrMakeConfigFile(connect: spinal.FileSystem): Promise<SpinalGraph> {
    try {
      const graph = await spinalCore.load<SpinalGraph>(connect, path.resolve(`${directory_path}/${fileName}`));
      return graph;
    } catch (error) {
      const dir = await connect.load_or_make_dir(directory_path);
      const graph = this._createFile(dir, fileName);
      return graph;
    }
  }

  private _createFile(directory: spinal.Directory, fileName: string = CONFIG_DEFAULT_NAME): SpinalGraph {
    const graph = new SpinalGraph(CONFIG_DEFAULT_NAME);
    directory.force_add_file(fileName, graph, {
      model_type: CONFIG_FILE_MODEl_TYPE,
    });
    return graph;
  }

  private _initServices() {
    const services = [APIService, AppProfileService, AppService, OrganListService, UserProfileService, UserListService, AppListService, DigitalTwinService, TokenService, LogService, WebsocketLogsService, AuthentificationService, SpinalCodeUniqueService];

    const promises = services.map((service) => {
      try {
        const instance = service.getInstance();
        if (typeof instance.init === "function") return instance.init();
      } catch (error) {
        console.error(error);
      }
    });

    return Promise.all(promises);
  }
}

export const configServiceInstance = ConfigFileService.getInstance();
