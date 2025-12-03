import type { SpinalNodeRef } from 'spinal-env-viewer-graph-service';
import type { SpinalNode } from 'spinal-model-graph';
import * as constants from './constants';
import { getChildType, createContext, TAddBimElementItem } from './geoServiceV2';
export * from './constants';
export * from './geoServiceV2';
/**
 * This method takes as parameters a context (SpinalContext), a parent node (must be a SpinalNode) and a string representing the abstract element type;
 * @param {SpinalNodeRef} contextRef - The Context geographic
 * @param {SpinalNodeRef} parentNodeRef - The parent Node
 * @param {string} elementName - The AbstactElement Name
 * @returns {Promise<SpinalNode>}
 */
declare function addAbstractElement(contextRef: SpinalNodeRef, parentNodeRef: SpinalNodeRef, elementName: string): Promise<SpinalNodeRef>;
/**
 * @param {string} contextId - The Context geographic Id
 * @param {string} parentId - The parent Node Id
 * @param {string} buildingName - Building Name
 */
declare function addBuilding(contextId: string, parentId: string, buildingName: string): Promise<SpinalNode>;
/**
 * @param {string} contextId - The Context geographic Id
 * @param {string} parentId - The parent Node Id
 * @param {string} floorName - the floor Name
 */
declare function addFloor(contextId: string, parentId: string, floorName: string): Promise<SpinalNode>;
/**
 * @param {string} contextId - The Context geographic Id
 * @param {string} parentId - The parent Node Id
 * @param {string} siteName - the site Name
 */
declare function addSite(contextId: string, parentId: string, siteName: string): Promise<SpinalNode>;
/**
 * @param {string} contextId - The Context geographic Id
 * @param {string} parentId - The parent Node Id
 * @param {string} zoneName - Zone name
 */
declare function addZone(contextId: string, parentId: string, zoneName: string): Promise<SpinalNode>;
/**
 * @param {string} contextId - The Context geographic
 * @param {string} parentId - The parent Node
 * @param {string} roomName - Room Name
 */
declare function addRoom(contextId: string, parentId: string, roomName: string): Promise<SpinalNode>;
/**
 * it uses bimObject service to add all dbIds passed as parameters.
 * the parameter elements can be a simple or an array of the following element interface.
 * `{ dbId: number, name: string }`
 * @param {SpinalNodeRef} contextRef - The Context geographic
 * @param {SpinalNodeRef} parentRef - The parent Node
 * @param {TAddBimElementItem | TAddBimElementItem[]} elements
 */
declare function addBimElement(contextRef: SpinalNodeRef, parentRef: SpinalNodeRef, elements: TAddBimElementItem | TAddBimElementItem[], model: any): Promise<unknown[]>;
declare function _getReferenceContextName(nodeId: string): {
    name: string;
    relation: string;
};
/**
 *
 * @param {string} nodeId
 */
declare function addToReferenceContext(nodeId: string): Promise<void>;
/**
 *
 * @param {string} contextId
 */
declare function addContextToReference(contextId: string): Promise<void>;
declare const GeographicContext: {
    constants: typeof constants;
    getChildType: typeof getChildType;
    createContext: typeof createContext;
    addAbstractElement: typeof addAbstractElement;
    addBuilding: typeof addBuilding;
    addFloor: typeof addFloor;
    addSite: typeof addSite;
    addZone: typeof addZone;
    addRoom: typeof addRoom;
    addBimElement: typeof addBimElement;
    _getReferenceContextName: typeof _getReferenceContextName;
    addToReferenceContext: typeof addToReferenceContext;
    addContextToReference: typeof addContextToReference;
};
export default GeographicContext;
