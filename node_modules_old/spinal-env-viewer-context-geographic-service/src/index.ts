/*
 * Copyright 2020 SpinalCom - www.spinalcom.com
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

import type { SpinalNodeRef } from 'spinal-env-viewer-graph-service';
import type { SpinalContext, SpinalNode } from 'spinal-model-graph';
import * as constants from './constants';
import {
  getChildType,
  createContext,
  addAbstractElement as addAbstractElementv2,
  addBuilding as addBuildingv2,
  addFloor as addFloorv2,
  addSite as addSitev2,
  addZone as addZonev2,
  addRoom as addRoomv2,
  addBimElement as addBimElementv2,
  _getReferenceContextName as _getReferenceContextNamev2,
  addToReferenceContext as addToReferenceContextv2,
  addContextToReference as addContextToReferencev2,
  TAddBimElementItem,
} from './geoServiceV2';
import {
  addNodeGraphService,
  getInfoGraphService,
  getRealNode,
} from './graphservice';

export * from './constants';
export * from './geoServiceV2';

/**
 * This method takes as parameters a context (SpinalContext), a parent node (must be a SpinalNode) and a string representing the abstract element type;
 * @param {SpinalNodeRef} contextRef - The Context geographic
 * @param {SpinalNodeRef} parentNodeRef - The parent Node
 * @param {string} elementName - The AbstactElement Name
 * @returns {Promise<SpinalNode>}
 */
async function addAbstractElement(
  contextRef: SpinalNodeRef,
  parentNodeRef: SpinalNodeRef,
  elementName: string
): Promise<SpinalNodeRef> {
  const context: SpinalContext = getRealNode(contextRef.id.get());
  const parent: SpinalNode = getRealNode(parentNodeRef.id.get());
  const node = await addAbstractElementv2(context, parent, elementName);
  addNodeGraphService(node);
  return getInfoGraphService(node.info.id.get());
}

/**
 * @param {string} contextId - The Context geographic Id
 * @param {string} parentId - The parent Node Id
 * @param {string} buildingName - Building Name
 */
async function addBuilding(
  contextId: string,
  parentId: string,
  buildingName: string
): Promise<SpinalNode> {
  const context: SpinalContext = getRealNode(contextId);
  const parent: SpinalNode = getRealNode(parentId);
  const node = await addBuildingv2(context, parent, buildingName);
  addNodeGraphService(node);
  return node;
}

/**
 * @param {string} contextId - The Context geographic Id
 * @param {string} parentId - The parent Node Id
 * @param {string} floorName - the floor Name
 */
async function addFloor(
  contextId: string,
  parentId: string,
  floorName: string
): Promise<SpinalNode> {
  const context: SpinalContext = getRealNode(contextId);
  const parent: SpinalNode = getRealNode(parentId);
  const node = await addFloorv2(context, parent, floorName);
  addNodeGraphService(node);
  return node;
}

/**
 * @param {string} contextId - The Context geographic Id
 * @param {string} parentId - The parent Node Id
 * @param {string} siteName - the site Name
 */
async function addSite(
  contextId: string,
  parentId: string,
  siteName: string
): Promise<SpinalNode> {
  const context: SpinalContext = getRealNode(contextId);
  const parent: SpinalNode = getRealNode(parentId);
  const node = await addSitev2(context, parent, siteName);
  addNodeGraphService(node);
  return node;
}

/**
 * @param {string} contextId - The Context geographic Id
 * @param {string} parentId - The parent Node Id
 * @param {string} zoneName - Zone name
 */
async function addZone(
  contextId: string,
  parentId: string,
  zoneName: string
): Promise<SpinalNode> {
  const context: SpinalContext = getRealNode(contextId);
  const parent: SpinalNode = getRealNode(parentId);
  const node = await addZonev2(context, parent, zoneName);
  addNodeGraphService(node);
  return node;
}

/**
 * @param {string} contextId - The Context geographic
 * @param {string} parentId - The parent Node
 * @param {string} roomName - Room Name
 */
async function addRoom(
  contextId: string,
  parentId: string,
  roomName: string
): Promise<SpinalNode> {
  const context: SpinalContext = getRealNode(contextId);
  const parent: SpinalNode = getRealNode(parentId);
  const node = await addRoomv2(context, parent, roomName);
  addNodeGraphService(node);
  return node;
}

/**
 * it uses bimObject service to add all dbIds passed as parameters.
 * the parameter elements can be a simple or an array of the following element interface.
 * `{ dbId: number, name: string }`
 * @param {SpinalNodeRef} contextRef - The Context geographic
 * @param {SpinalNodeRef} parentRef - The parent Node
 * @param {TAddBimElementItem | TAddBimElementItem[]} elements
 */
function addBimElement(
  contextRef: SpinalNodeRef,
  parentRef: SpinalNodeRef,
  elements: TAddBimElementItem | TAddBimElementItem[],
  model: any
): Promise<unknown[]> {
  let context = getRealNode(contextRef.id.get());
  let parent = getRealNode(parentRef.id.get());
  return addBimElementv2(context, parent, elements, model);
}

function _getReferenceContextName(nodeId: string): {
  name: string;
  relation: string;
} {
  let node = getRealNode(nodeId);
  return _getReferenceContextNamev2(node.info.type.get());
}

/**
 *
 * @param {string} nodeId
 */
async function addToReferenceContext(nodeId: string): Promise<void> {
  let node = getRealNode(nodeId);
  return addToReferenceContextv2(node);
}

/**
 *
 * @param {string} contextId
 */
function addContextToReference(contextId: string): Promise<void> {
  let context = getRealNode(contextId);
  return addContextToReferencev2(context);
}

const GeographicContext = {
  constants,
  getChildType,
  createContext,
  addAbstractElement,
  addBuilding,
  addFloor,
  addSite,
  addZone,
  addRoom,
  addBimElement,
  _getReferenceContextName,
  addToReferenceContext,
  addContextToReference,
};

export default GeographicContext;
