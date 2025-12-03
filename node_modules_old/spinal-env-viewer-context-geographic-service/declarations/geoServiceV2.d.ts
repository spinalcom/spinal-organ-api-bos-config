import { SpinalContext, SpinalNode } from 'spinal-model-graph';
/**
 * Returns the child type of the type given as parameter.
 * @param {string} parentType
 * @return {string} Child type
 */
export declare function getChildType(parentType: string): string;
export declare function createContext(contextName: string): Promise<SpinalContext>;
export declare function addAbstractElement(context: SpinalContext, parent: SpinalNode, elementName: string, id?: string): Promise<SpinalNode>;
export declare function addBuilding(context: SpinalContext, parent: SpinalNode, elementName: string, id?: string): Promise<SpinalNode<any>>;
export declare function addFloor(context: SpinalContext, parent: SpinalNode, elementName: string, id?: string): Promise<SpinalNode<any>>;
export declare function addSite(context: SpinalContext, parent: SpinalNode, elementName: string, id?: string): Promise<SpinalNode<any>>;
export declare function addZone(context: SpinalContext, parent: SpinalNode, elementName: string, id?: string): Promise<SpinalNode<any>>;
export declare function addRoom(context: SpinalContext, parent: SpinalNode, elementName: string, id?: string): Promise<SpinalNode<any>>;
export type TAddBimElementItem = {
    dbId: number;
    name: string;
};
export declare function addBimElement(context: SpinalContext, parent: SpinalNode, elements: TAddBimElementItem | TAddBimElementItem[], model: any): Promise<unknown[]>;
export declare function _getReferenceContextName(nodeType: string): {
    name: string;
    relation: string;
};
export declare function addToReferenceContext(node: SpinalNode): Promise<void>;
export declare function getOrCreateElemFromReferenceContext(nodeType: string, context: SpinalContext, parent: SpinalNode, elementName: string, id?: string): Promise<SpinalNode>;
export declare function getOrCreateRefContext(contextName: string): Promise<SpinalNode>;
export declare function addContextToReference(context: SpinalContext): Promise<void>;
