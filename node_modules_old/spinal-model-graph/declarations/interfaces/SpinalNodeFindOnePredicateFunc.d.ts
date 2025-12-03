import type { SpinalNode } from '../Nodes/SpinalNode';
/**
 * A function that takes a node and returns a boolean.
 * @callback SpinalNodeFindOnePredicateFunc
 * @param {SpinalNode<any>} node
 * @returns {boolean}
 */
export declare type SpinalNodeFindOnePredicateFunc = (node: SpinalNode<any>) => boolean;
