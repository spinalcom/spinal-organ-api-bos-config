/*
 * Copyright 2023 SpinalCom - www.spinalcom.com
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
  FileSystem,
  spinalCore,
  Lst,
  Model,
  Ptr,
  Str,
  Val,
} from 'spinal-core-connectorjs';
import generator from 'generate-password';
import getMAC, { isMAC } from 'getmac';
import os from 'os';
var ip = require('ip');



export interface ILog extends Model {
  timeStamp: Val;
  message: Str;
}

export interface IGenericOrganData extends Model {
  id: Str;
  name: Str;
  type: Str,
  bootTimestamp: Val;
  lastHealthTime: Val;
  macAdress: Str;
  ramRssUsed: Str;
  serverName: Str;
  version: Str;
  logList: Lst<ILog>;
}

export interface ISpecificOrganData extends Model {
  port: Val;
  lastAction: {
    message: Str;
    date: Val;
  };
}
export class ConfigFileModel extends Model {
  genericOrganData: IGenericOrganData;
  specificOrganData: ISpecificOrganData;
  specificOrganConfig?: Ptr<any>;
  constructor(
    name?: string,
    type?: string,
    serverName?: string,
    port?: number,
  ) {
    super();
    if (FileSystem._sig_server === false) return;
    this.add_attr({
      genericOrganData: {
        id: generator.generate({ length: 20, numbers: true }),
        name: name,
        type: type,
        bootTimestamp: Date.now(),
        lastHealthTime: Date.now(),
        macAdress: getMAC(),
        ramRssUsed: '',
        serverName: serverName,
        version: '',
        logList: [],
      },
      specificOrganData: {
        port: port,
        lastAction: {
          message: 'connected',
          date: Date.now(),
        },
      },
    });
    this.updateRamUsage();
  }

  public addToConfigFileModel(): Lst {
    var fileLst = new Lst();
    this.data.add_attr(fileLst);
    return fileLst;
  }
  public updateIPandMacAdress() {
    console.log(getMAC())
  }
  public updateRamUsage() {
    const used = process.memoryUsage();
    const value = `${Math.round((used.rss / 1024 / 1024) * 100) / 100} MB`;
    this.genericOrganData?.ramRssUsed?.set(value);
  }
  public loadConfigModel() {
    if (typeof this.specificOrganConfig === 'undefined') {
      return undefined;
    } else {
      return this.specificOrganConfig.load();
    }
  }
  public setConfigModel(model: Model) {
    this.add_attr('specificOrganConfig', new Ptr(model));
  }
}

spinalCore.register_models(ConfigFileModel, 'ConfigFileModel');
