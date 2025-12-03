import { Model } from 'spinal-core-connectorjs';
import { SpinalNode } from './SpinalNode';
/**
 * A SpinalContext is the statring node of a part of the graph.
 * @class SpinalContext
 * @extends {SpinalNode<T>}
 * @template T
 */
declare class SpinalContext<T extends Model = any> extends SpinalNode<T> {
    /**
     * Constructor for the SpinalContext class.
     * @param {String} [name="undefined"] Name of the context
     * @param {String} [type="SpinalContext"] Type of the context, usually unused
     * @param {SpinalNode | Model} [element] Element of the context
     * @throws {TypeError} If the element is not a Model
     */
    constructor(name?: string, type?: string, element?: T);
    /**
     * Adds a child with a SpinalRelationLstPtrType.
     * @override
     * @param {SpinalNode | Model} child Node to add as child
     * @param {String} relationName Name of the relation
     * @param {String} [_relationType=SPINAL_RELATION_PTR_LST_TYPE]
     * This parameter is here only to properly override the parent method
     * @returns {Promise<SpinalNode>} The child node in a promise
     * @throws {TypeError} If the child is not a model
     * @throws {TypeError} If the relation name is not a string
     */
    addChild<K extends Model>(child: K | SpinalNode<K>, relationName: string, _relationType?: string): Promise<SpinalNode<K>>;
    /**
     * Adds a child with a SpinalRelationLstPtrType and notices
     * the context if a new relation was created.
     * @override
     * @param {SpinalNode | Model} child Node to add as child
     * @param {String} relationName Name of the relation
     * @param {String} [relationType=SPINAL_RELATION_PTR_LST_TYPE]
     * This parameter is here only to properly override the parent method
     * @param {SpinalContext} context Context to update, usually unused
     * @returns {Promise<SpinalNode>} The child node in a promise
     */
    addChildInContext<K extends Model>(child: K | SpinalNode<K>, relationName: string, _relationType?: string, context?: SpinalContext<T>): Promise<SpinalNode<K>>;
    /**
     * Return the children of the node that are registered in the context
     * @override
     * @param {SpinalContext} [context=this] Context to use for the search, this by default
     * @returns {Promise<Array<SpinalNode>>} The children that were found
     */
    getChildrenInContext<K extends Model>(context?: SpinalContext<T>): Promise<SpinalNode<K>[]>;
}
export default SpinalContext;
export { SpinalContext };
