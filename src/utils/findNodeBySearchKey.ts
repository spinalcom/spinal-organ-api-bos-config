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

import type { SpinalNode } from 'spinal-model-graph';

const idKey = 'id' as const;
const nameKey = 'name' as const;

export const searchByName = [nameKey] as const;
export const searchById = [idKey] as const;
export const searchByNameOrId = [idKey, nameKey] as const;
export type TAppSearch =
  | typeof searchByName
  | typeof searchById
  | typeof searchByNameOrId;

export function isNodeMatchSearchKey(
  searchKeys: TAppSearch,
  searchValue: string,
  node: SpinalNode
): boolean {
  for (const key of searchKeys) {
    if (node.info[key]?.get().toLowerCase() === searchValue.toLowerCase()) {
      return true;
    }
  }
  return false;
}

export function findNodeBySearchKey(
  nodes: SpinalNode[],
  searchKeys: TAppSearch,
  searchValue: string
): SpinalNode {
  for (const node of nodes) {
    if (isNodeMatchSearchKey(searchKeys, searchValue, node)) {
      return node;
    }
  }
}
