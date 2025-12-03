import { Model, Str, Val } from 'spinal-core-connectorjs';
import { SpinalContext } from '../Nodes/SpinalContext';
import { SpinalNode } from '../Nodes/SpinalNode';
import { SpinalMap } from '../SpinalMap';
import { SpinalNodePointer } from '../SpinalNodePointer';
/**
 * Base for all relation in a SpinalGraph.
 * @abstract
 * @class BaseSpinalRelation
 * @abstract
 * @property {Str} name
 * @property {Str} id
 * @property {SpinalNodePointer<SpinalNode>} parent
 * @property {SpinalMap<Val>} contextIds
 * @extends {Model}
 */
declare abstract class BaseSpinalRelation extends Model {
    name: Str;
    id: Str;
    parent: SpinalNodePointer<SpinalNode<any>>;
    contextIds: SpinalMap<Val>;
    /**
     * Constructor for the BaseSpinalRelation class.
     * @param {SpinalNode<Model>} parent Parent of the relation
     * @param {string} name Name of the relation
     * @throws {TypeError} If the parent is not a node
     * @throws {TypeError} If the name is not a string
     */
    constructor(parent?: SpinalNode<any>, name?: string);
    /**
     * Shortcut to id.
     * @returns {Str} Id of the relation
     * @memberof BaseSpinalRelation
     */
    getId(): Str;
    /**
     * Returns the name of the relation.
     * @returns {Str} Name of the relation
     * @memberof BaseSpinalRelation
     */
    getName(): Str;
    /**
     * Returns the parent of the relation.
     * @template T
     * @return {*}  {Promise<SpinalNode<T>>} Returns a promise where the resolve is the parent
     * @memberof BaseSpinalRelation
     */
    getParent<T extends Model>(): Promise<SpinalNode<T>>;
    /**
     * Adds an id to the context ids of the relation.
     * @param {string} id Id of the context
     * @throws {TypeError} If the id is not a string
     * @memberof BaseSpinalRelation
     */
    addContextId(id: string): void;
    /**
     * Returns a list of the contexts the relation is associated to.
     * @returns {Array<string>} A list of ids of the associated contexts
     * @memberof BaseSpinalRelation
     */
    getContextIds(): string[];
    /**
     * Returns true if the relation belongs to the context.
     * @param {SpinalContext<T>} context The context that might own the node
     * @returns {boolean} A boolean
     * @throws {TypeError} If the context is not a SpinalContext
     * @memberof BaseSpinalRelation
     */
    belongsToContext(context: SpinalContext<any>): boolean;
    /**
     * Remove an id to the context ids of the relation.
     * @param {string} id Id of the context
     * @throws {TypeError} If the id is not a string
     * @memberof BaseSpinalRelation
     */
    removeContextId(id: string): void;
    /**
     * Removes children from the relation.
     * @param {Array<SpinalNode<Model>>} [nodesToDelete=[]] Childs to remove
     * @returns {Promise<void>} An empty promise
     * @throws {TypeError} If nodes is not an array or omitted
     * @throws {Error} If one of the nodes is not a child
     * @memberof BaseSpinalRelation
     */
    removeChildren(nodesToDelete?: SpinalNode<any>[]): Promise<void>;
    /**
     * Removes a child from the relation.
     * @abstract
     * @param {SpinalNode<any>} node Child to remove
     * @return {*}  {Promise<void>} An empty promise
     * @memberof BaseSpinalRelation
     */
    abstract removeChild(node: SpinalNode<any>): Promise<void>;
    /**
     * Return all the children of the relation.
     * @abstract
     * @return {*}  {Promise<SpinalNode<any>[]>} The children of the relation
     * @memberof BaseSpinalRelation
     */
    abstract getChildren(): Promise<SpinalNode<any>[]>;
    /**
     * Return all the children of the relation associated to a certain context.
     * @abstract
     * @param {SpinalContext<any>} context
     * @return {*}  {Promise<SpinalNode<any>[]>} The children of the relation
     * @throws {TypeError} If the context is not a SpinalContext
     * @memberof BaseSpinalRelation
     */
    abstract getChildrenInContext(context: SpinalContext<any>): Promise<SpinalNode<any>[]>;
    /**
     * Returns the type of the relation.
     * @abstract
     * @return {*}  {string} Type of the relation
     * @memberof BaseSpinalRelation
     */
    abstract getType(): string;
    /**
     * returns the number of children of the relation.
     * @abstract
     * @return {*}  {number}
     * @memberof BaseSpinalRelation
     */
    abstract getNbChildren(): number;
    /**
     * Retrieves all the ids of the children of the relation and return them inside an array.
     * @abstract
     * @return {*}  {string[]} Array containing all the children ids of the relation
     * @memberof BaseSpinalRelation
     */
    abstract getChildrenIds(): string[];
    /**
     * Removes the relation from the graph.
     * @returns {Promise<void>} An empty promise
     * @memberof BaseSpinalRelation
     */
    removeFromGraph(): Promise<void>;
    /**
     * Removes the relation from the parent.
     * @returns {Promise<void>} An empty promise
     * @private
     * @memberof BaseSpinalRelation
     */
    _removeFromParent(): Promise<void>;
}
export default BaseSpinalRelation;
export { BaseSpinalRelation };
