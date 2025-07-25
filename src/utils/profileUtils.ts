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

import { IProfileData, IProfileRes } from '../interfaces';
import { SpinalNode } from 'spinal-env-viewer-graph-service';
import { AppService } from '../services';

export async function _formatProfile(data: IProfileRes): Promise<IProfileData> {
  return {
    ...data.node.info.get(),
    ...(await _formatAuthRes(data)),
  };
}

export async function _formatAuthRes(data: IProfileRes) {
  return {
    apps: await AppService.getInstance().formatAppsAndAddSubApps(data.apps, data.subApps),
    apis: _getNodeListInfo(data.apis),
    contexts: _getNodeListInfo(data.contexts),
    ...(data.adminApps && { adminApps: _getNodeListInfo(data.adminApps) }),
  };
}

export function _getNodeListInfo(nodes: SpinalNode[] = []): any[] {
  return nodes.map((el) => el.info.get());
}
