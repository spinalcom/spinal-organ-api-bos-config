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
  SpinalContext,
  SpinalNode,
  SPINAL_RELATION_PTR_LST_TYPE,
} from 'spinal-model-graph';
import {
  GEOGRAPHIC_TYPES_ORDER,
  GEOGRAPHIC_RELATIONS,
  MAP_TYPE_RELATION,
  SITE_RELATION,
  BUILDING_RELATION,
  FLOOR_RELATION,
  ZONE_RELATION,
  ROOM_RELATION,
  CONTEXT_TYPE,
  SITE_TYPE,
  BUILDING_TYPE,
  FLOOR_TYPE,
  ZONE_TYPE,
  ROOM_TYPE,
  SITE_REFERENCE_CONTEXT,
  BUILDING_REFERENCE_CONTEXT,
  FLOOR_REFERENCE_CONTEXT,
  ZONE_REFERENCE_CONTEXT,
  ROOM_REFERENCE_CONTEXT,
} from './constants';
import { addNodeGraphService, getGraph } from './graphservice';

const dicoContextRef = new Map<
  string,
  AsyncGenerator<SpinalNode, never, never>
>();

/**
 * Returns the child type of the type given as parameter.
 * @param {string} parentType
 * @return {string} Child type
 */
export function getChildType(parentType: string): string {
  let parentTypeIndex = GEOGRAPHIC_TYPES_ORDER.indexOf(parentType);
  if (parentTypeIndex === -1) {
    return '';
  }
  return GEOGRAPHIC_TYPES_ORDER[parentTypeIndex + 1];
}
export async function createContext(
  contextName: string
): Promise<SpinalContext> {
  if (typeof contextName !== 'string') {
    throw Error('contextName must be a string');
  }
  const graph = getGraph();
  const context = await graph.getContext(contextName);
  if (typeof context !== 'undefined') return Promise.resolve(context);
  const contextRes = new SpinalContext(contextName, CONTEXT_TYPE);
  await graph.addContext(contextRes);
  addNodeGraphService(contextRes);
  return contextRes;
}
export async function addAbstractElement(
  context: SpinalContext,
  parent: SpinalNode,
  elementName: string,
  id?: string
): Promise<SpinalNode> {
  const parentType = parent.info.type.get();
  const childType = getChildType(parentType);
  if (!childType) {
    throw Error(`${parentType} is not a valid type in geographic context`);
  }
  return getOrCreateElemFromReferenceContext(
    childType,
    context,
    parent,
    elementName,
    id
  );
}
export function addBuilding(
  context: SpinalContext,
  parent: SpinalNode,
  elementName: string,
  id?: string
) {
  return getOrCreateElemFromReferenceContext(
    BUILDING_TYPE,
    context,
    parent,
    elementName,
    id
  );
}
export function addFloor(
  context: SpinalContext,
  parent: SpinalNode,
  elementName: string,
  id?: string
) {
  return getOrCreateElemFromReferenceContext(
    FLOOR_TYPE,
    context,
    parent,
    elementName,
    id
  );
}
export function addSite(
  context: SpinalContext,
  parent: SpinalNode,
  elementName: string,
  id?: string
) {
  return getOrCreateElemFromReferenceContext(
    SITE_TYPE,
    context,
    parent,
    elementName,
    id
  );
}
export function addZone(
  context: SpinalContext,
  parent: SpinalNode,
  elementName: string,
  id?: string
) {
  return getOrCreateElemFromReferenceContext(
    ZONE_TYPE,
    context,
    parent,
    elementName,
    id
  );
}
export function addRoom(
  context: SpinalContext,
  parent: SpinalNode,
  elementName: string,
  id?: string
) {
  return getOrCreateElemFromReferenceContext(
    ROOM_TYPE,
    context,
    parent,
    elementName,
    id
  );
}

export type TAddBimElementItem = {
  dbId: number;
  name: string;
};
export function addBimElement(
  context: SpinalContext,
  parent: SpinalNode,
  elements: TAddBimElementItem | TAddBimElementItem[],
  model: any
): Promise<unknown[]> {
  const elems = Array.isArray(elements) ? elements : [elements];
  let contextId = context.info.id.get();
  let parentId = parent.info.id.get();
  addNodeGraphService(context);
  addNodeGraphService(parent);
  return Promise.all(
    elems.map((element) => {
      return window.spinal.BimObjectService.addBIMObject(
        contextId,
        parentId,
        element.dbId,
        element.name,
        model
      );
    })
  );
}
export function _getReferenceContextName(nodeType: string): {
  name: string;
  relation: string;
} {
  switch (nodeType) {
    case SITE_TYPE:
      return {
        name: SITE_REFERENCE_CONTEXT,
        relation: SITE_RELATION,
      };
    case BUILDING_TYPE:
      return {
        name: BUILDING_REFERENCE_CONTEXT,
        relation: BUILDING_RELATION,
      };

    case FLOOR_TYPE:
      return {
        name: FLOOR_REFERENCE_CONTEXT,
        relation: FLOOR_RELATION,
      };

    case ZONE_TYPE:
      return {
        name: ZONE_REFERENCE_CONTEXT,
        relation: ZONE_RELATION,
      };

    case ROOM_TYPE:
      return {
        name: ROOM_REFERENCE_CONTEXT,
        relation: ROOM_RELATION,
      };

    default:
      return undefined;
  }
}

export async function addToReferenceContext(node: SpinalNode): Promise<void> {
  const obj = _getReferenceContextName(node.info.type.get());

  if (typeof obj !== 'undefined') {
    let context = await getOrCreateRefContext(obj.name);
    await context.addChild(node, obj.relation, SPINAL_RELATION_PTR_LST_TYPE);
  }
}

export async function getOrCreateElemFromReferenceContext(
  nodeType: string,
  context: SpinalContext,
  parent: SpinalNode,
  elementName: string,
  id?: string
): Promise<SpinalNode> {
  const obj = _getReferenceContextName(nodeType);
  if (typeof obj === 'undefined')
    throw new Error(`error unknonw node type : ${nodeType}`);

  const refContext = await getOrCreateRefContext(obj.name);
  let node;
  if (typeof id !== 'undefined') {
    const refNodes = await refContext.getChildren(obj.relation);
    node = refNodes.find((itm) => itm.info.id.get() === id);
  }
  if (!node) {
    node = new SpinalNode(elementName, nodeType);
    if (typeof id !== 'undefined') node.info.id.set(id);
    await refContext.addChild(node, obj.relation, SPINAL_RELATION_PTR_LST_TYPE);
  }
  await parent.addChildInContext(
    node,
    obj.relation,
    SPINAL_RELATION_PTR_LST_TYPE,
    context
  );
  return node;
}

async function* _getOrCreateRefContext(
  contextName: string
): AsyncGenerator<SpinalNode<any>, never, never> {
  const graph = getGraph();
  let context = await graph.getContext(contextName);
  if (!context) {
    context = new SpinalContext(contextName, contextName.replace('.', ''));
    await graph.addContext(context);
  }
  addNodeGraphService(context);
  while (true) yield context;
}

export async function getOrCreateRefContext(
  contextName: string
): Promise<SpinalNode> {
  if (!dicoContextRef.has(contextName)) {
    const gen = _getOrCreateRefContext(contextName);
    dicoContextRef.set(contextName, gen);
  }
  return (await dicoContextRef.get(contextName)!.next()).value;
}

export async function addContextToReference(
  context: SpinalContext
): Promise<void> {
  if (typeof context !== 'undefined') {
    await context.map(GEOGRAPHIC_RELATIONS, (node) => {
      addNodeGraphService(node);
      return addToReferenceContext(node);
    });
  }
}
