import type { SpinalNode } from '../Nodes/SpinalNode';
/**
 * A function that takes a node and returns a boolean.
 * @callback SpinalNodeFindPredicateFunc
 * @param {SpinalNode<any>} node
 * @param {() => void} [stopCallback] callback to stop the find
 * @returns {boolean}
 */
export declare type SpinalNodeFindPredicateFunc = (node: SpinalNode<any>, stopCallback?: () => void) => boolean;
