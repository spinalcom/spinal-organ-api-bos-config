/*
 * Copyright 2025 SpinalCom - www.spinalcom.com
 *
 * This file is part of SpinalCore.
 *
 * Please read all of the following terms and conditions
 * of the Software license Agreement ("Agreement")
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

import { SpinalNode } from 'spinal-env-viewer-graph-service';

export interface IAppProfile {
  name: string;
  authorizeApps?: string[];
  unauthorizeApps: string[];
  authorizeApis?: string[];
  unauthorizeApis?: string[];
  authorizeBos?: string[];
  unauthorizeBos?: string[];
  [key: string]: any;
}

export interface IAppProfileRes {
  node: SpinalNode;
  authorizedApps?: SpinalNode[];
  authorizedRoutes?: SpinalNode[];
  authorizedBos?: SpinalNode[];
}
