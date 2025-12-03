import { Lst, Model } from 'spinal-core-connectorjs';
import { SpinalContext } from '../Nodes/SpinalContext';
import { SpinalNode } from '../Nodes/SpinalNode';
import { SpinalNodePointer } from '../SpinalNodePointer';
import { BaseSpinalRelation } from './BaseSpinalRelation';
/**
 * Relation where the children are in Lst of Ptr.
 * @extends BaseSpinalRelation
 * @property {Str} name
 * @property {Str} id
 * @property {SpinalNodePointer<SpinalNode<any>>} parent
 * @property {SpinalMap<Val>} contextIds
 * @property {Lst<SpinalNodePointer<SpinalNode<any>>>} children
 */
declare class SpinalRelationLstPtr extends BaseSpinalRelation {
    _constructorName: string;
    static _constructorName: string;
    children: Lst<SpinalNodePointer<SpinalNode<any>>>;
    /**
     * Constructor for the SpinalRelationLstPtr class.
     * @param {SpinalNode<any>} parent Parent of the relation
     * @param {string} name Name of the relation
     * @throws {TypeError} If the parent is not a node
     * @throws {TypeError} If the name is not a string
     * @memberof SpinalRelationLstPtr
     */
    constructor(parent?: SpinalNode<any>, name?: string);
    /**
     * Retrieves all the ids of the children of the relation and return them inside an array.
     * @returns {string[]} Array containing all the children ids of the relation
     * @memberof SpinalRelationLstPtr
     */
    getChildrenIds(): string[];
    /**
     * returns the number of children of the relation.
     * @returns {number}
     * @memberof SpinalRelationLstPtr
     */
    getNbChildren(): number;
    /**
     * Return all the children of the relation.
     * @returns {Promise<SpinalNode[]>} The children of the relation
     * @memberof SpinalRelationLstPtr
     */
    getChildren(): Promise<SpinalNode<any>[]>;
    /**
     * Return all the children of the relation associated to a certain context.
     * @returns {Promise<SpinalNode<any>[]>} The children of the relation
     * @throws {TypeError} If the context is not a SpinalContext
     * @memberof SpinalRelationLstPtr
     */
    getChildrenInContext(context: SpinalContext<any>): Promise<SpinalNode<any>[]>;
    /**
     * Returns the type of the relation.
     * @returns {string} Type of the relation
     * @memberof SpinalRelationLstPtr
     */
    getType(): string;
    /**
     * Adds a child to the relation.
     * @template T extends Model = Node Element Type
     * @param {(T|SpinalNode<T>)} node Node or model to add
     * @throws {TypeError} If the node is not a Model
     * @throws {Error} If the node is already a child of the relation
     * @returns {Promise<SpinalNode<T>>} Promise containing the node that was added
     * @memberof SpinalRelationLstPtr
     */
    addChild<T extends Model>(node: T | SpinalNode<T>): Promise<SpinalNode<T>>;
    /**
     * Removes a child from the relation.
     * @param {SpinalNode<any>} node Child to remove
     * @returns {Promise<void>} An empty promise
     * @throws {Error} If the given node is not a child
     * @memberof SpinalRelationLstPtr
     */
    removeChild(node: SpinalNode<any>): Promise<void>;
}
export default SpinalRelationLstPtr;
export { SpinalRelationLstPtr };
