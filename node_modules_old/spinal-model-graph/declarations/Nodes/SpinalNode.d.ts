import { Lst, Model, Str, Val } from 'spinal-core-connectorjs';
import type { AnySpinalRelation } from '../interfaces/AnySpinalRelation';
import { RelationSearch } from '../interfaces/RelationSearch';
import type { SpinalNodeFindOnePredicateFunc } from '../interfaces/SpinalNodeFindOnePredicateFunc';
import type { SpinalNodeFindPredicateFunc } from '../interfaces/SpinalNodeFindPredicateFunc';
import type { SpinalNodeForEachFunc } from '../interfaces/SpinalNodeForEachFunc';
import type { SpinalNodeInfoModel } from '../interfaces/SpinalNodeInfoModel';
import type { SpinalNodeMapFunc } from '../interfaces/SpinalNodeMapFunc';
import { SpinalMap } from '../SpinalMap';
import { SpinalNodePointer } from '../SpinalNodePointer';
import { SpinalSet } from '../SpinalSet';
import { SpinalContext } from './SpinalContext';
export declare const DEFAULT_FIND_PREDICATE: SpinalNodeFindPredicateFunc;
/**
 * Node of a graph.
 * @extends Model
 * @template T extends Model = ElementType
 */
declare class SpinalNode<T extends Model = any> extends Model {
    info: SpinalNodeInfoModel;
    parents: SpinalMap<Lst<SpinalNodePointer<AnySpinalRelation>>>;
    children: SpinalMap<SpinalMap<AnySpinalRelation>>;
    element?: SpinalNodePointer<T>;
    contextIds: SpinalSet;
    /**
     * Constructor for the SpinalNode class.
     * @param {string} [name="undefined"] Name of the node
     * @param {string} [type="undefined"] Type of the node
     * @param {date} [directModificationDate="undefined"] Type of the node
     * @param {date} [indirectModificationDate="undefined"] Type of the node
     * @param {Model} [element] Element of the node
     * @throws {TypeError} If the element is not a Model
     */
    constructor(name?: string, type?: string, element?: T);
    /**
     * Returns the id.
     * @returns {Str} Id of the node
     */
    getId(): Str;
    /**
     * Returns the name.
     * @returns {Str} Name of the node
     */
    getName(): Str;
    /**
     * Returns the type.
     * @returns {Str} Type of the node
     */
    getType(): Str;
    /**
     * Returns the DirectModificationDate.
     * @returns {Date} Direct Modification Date of the node
     */
    getDirectModificationDate(): Val;
    /**
     * Returns the IndirectModificationDate.
     * @returns {Date} Indirect Modification Date of the node
     */
    getIndirectModificationDate(): Val;
    /**
     * Sets the value corresponding to the key.
     * @param {Date} date Key to the value
     * @throws {TypeError} If the date is not of type Date
     * @memberof SpinalNode
     */
    setIndirectModificationDate(date?: number): void;
    /**
     * Sets the value corresponding to the key.
     * @param {Date} date Key to the value
     * @throws {TypeError} If the date is not of type Date
     * @memberof SpinalNode
     */
    setDirectModificationDate(date?: number): void;
    /**
     * Returns the element. if not present will create one
     * @param {boolean} [noCreate=false] if true will not create a element and if element doesn't exist will return undefined
     * @returns {Promise<T>} A promise where the parameter of the resolve method is the element
     * @memberof SpinalNode
     */
    getElement(noCreate?: boolean): Promise<T>;
    /**
     * Returns all the children ids in an array.
     * @returns {string[]} Ids of the children
     */
    getChildrenIds(): string[];
    /**
     * Computes and returns the number of children of the node.
     * @returns {number} The number of children
     */
    getNbChildren(): number;
    /**
     * Adds an id to the context ids of the node.
     * @param {string} id Id of the context
     * @throws {TypeError} If the id is not a string
     */
    addContextId(id: string): void;
    /**
     * Remove an id to the context ids of the node.
     * @param {string} id
     * @memberof SpinalNode
     */
    removeContextId(id: string): void;
    /**
     * Returns a list of the contexts the node is associated to.
     * @returns {string[]} An array of ids of the associated contexts
     */
    getContextIds(): string[];
    /**
     * Returns true if the node belongs to the context.
     * @param {SpinalContext} context The context that might own the node
     * @returns {boolean} A boolean
     * @throws {TypeError} If context is not a SpinalContext
     */
    belongsToContext(context: SpinalContext<any>): boolean;
    /**
     * Verify if the node contains the relation name.
     * @param {string} relationName Name of the relation
     * @param {string} [relationType] Type of the relation
     * @returns {boolean} Return true is the relation is contained in the node and false otherwise.
     * @throws {TypeError} If the relation name is not a string
     * @throws {Error} If the relation type doesn't exist
     */
    hasRelation(relationName: string, relationType?: string): boolean;
    /**
     * Verify if the node contains all the relation names.
     * @param {string[]} relationNames Array containing all the relation name
     * @param {string} relationType Type of the relations
     * @returns {boolean} Return true if the node contains
     * all the relations in relationNames,false otherwise.
     * @throws {TypeError} If the relation names are not in an array
     * @throws {TypeError} If one of the relation names is not a string
     * @throws {Error} If the relation type doesn't exist
     */
    hasRelations(relationNames: string[], relationType?: string): boolean;
    /**
     * Returns all the relation names of the node.
     * @returns {string[]} The names of the relations of the node
     */
    getRelationNames(): string[];
    /**
     * Add the node as child of the relation.
     * @param {T|SpinalNode<T>} child Element to add as child
     * @param {string} relationName Name of the relation
     * @param {string} relationType Type of the relation
     * @returns {Promise<SpinalNode>} The child node in a promise
     * @throws {TypeError} If the child is not a model
     * @throws {TypeError} If the relation name is not a string
     * @throws {Error} If the relation type is invalid
     */
    addChild<K extends Model>(child: K | SpinalNode<K>, relationName: string, relationType: string): Promise<SpinalNode<K>>;
    /**
     * Adds a child and notices the context if a new relation was created.
     * @param {SpinalNode | Model} child Node to add as child
     * @param {string} relationName Name of the relation
     * @param {string} relationType Type of the relation
     * @param {SpinalContext} context Context to update
     * @returns {Promise<SpinalNode>} The child node in a promise
     * @throws {TypeError} If the child is not a model
     * @throws {TypeError} If the relation name is not a string
     * @throws {TypeError} If the context is not a SpinalContext
     * @throws {Error} If the relation type is invalid
     */
    addChildInContext<K extends Model>(child: K | SpinalNode<K>, relationName: string, relationType: string, context: SpinalContext<any>): Promise<SpinalNode<K>>;
    /**
     * Removes the node from the relation children.
     * @param {SpinalNode} node Node to remove
     * @param {string} relationName Name of the relation to wich the node belongs
     * @param {string} relationType Type of the relation to wich the node belongs
     * @returns {Promise<void>} An empty promise
     * @throws {TypeError} If relation name is not a string
     * @throws {Error} If relation type is invalid
     * @throws {Error} If relation doesn't exist
     * @throws {Error} If the child doesn't exist
     */
    removeChild(node: SpinalNode<any>, relationName: string, relationType: string): Promise<void>;
    /**
     * Removes children in the given relation.
     * @param {SpinalNode[]} nodes Nodes to delete
     * @param {string} relationName Name of the relation
     * @param {string} relationType Type of the relation
     * @returns {Promise<void>} An empty promise
     * @throws {TypeError} If nodes is not an array
     * @throws {TypeError} If an element of nodes is not a SpinalNode
     * @throws {TypeError} If relation name is not a string
     * @throws {Error} If relation type is invalid
     * @throws {Error} If the relation doesn't exist
     * @throws {Error} If one of the nodes is not a child
     */
    removeChildren(nodes: SpinalNode<any>[], relationName: string, relationType: string): Promise<void>;
    /**
     * Removes a child relation of the node.
     * @param {string} relationName Name of the relation to remove
     * @param {string} relationType Type of the relation to remove
     * @returns {Promise<void>} An empty promise
     * @throws {TypeError} If the relationName is not a string
     * @throws {Error} If the relationType is invalid
     * @throws {Error} If the relation doesn't exist
     */
    removeRelation(relationName: string, relationType: string): Promise<void>;
    /**
     * Remove the node from the graph
     * i.e remove the node from all the parent relations and remove all the children relations.
     * This operation might delete all the sub-graph under this node.
     * After this operation the node can be deleted without fear.
     * @returns {Promise<void>} An empty promise
     */
    removeFromGraph(): Promise<void>;
    /**
     * Returns the first child in the given relation for which the predicate is true.
     * @param {SpinalNodeFindPredicateFunc} predicate
     * Functions that takes a node and returns a boolean
     * @param {string} relationName Name of the relation
     * @param {string} relationType Type of the relation
     * @returns {Promise<SpinalNode<any>>}
     * The first child for which the predicate is true or undefined
     * @throws {TypeError} If predicate is not a function
     * @throws {TypeError} If relation name is not a string
     * @throws {Error} If relation type is invalid
     * @throws {Error} If relation doesn't exist
     */
    getChild(predicate: SpinalNodeFindPredicateFunc, relationName: string, relationType: string): Promise<SpinalNode<any>>;
    /**
     * Returns the children of the node for the relation names.
     * @param {string[]} [relationNames=[]]
     * Array containing the relation names of the desired children
     * @returns {Promise<SpinalNode[]>} The children that were found
     * @throws {TypeError} If relationNames is neither an array, a string or omitted
     * @throws {TypeError} If an element of relationNames is not a string
     */
    getChildren(relationNames?: string | RegExp | (string | RegExp)[]): Promise<SpinalNode<any>[]>;
    /**
     * Return the children of the node that are registered in the context
     * @param {SpinalContext} context Context to use for the search
     * @returns {Promise<SpinalNode[]>} The children that were found
     * @throws {TypeError} If the context is not a SpinalContext
     */
    getChildrenInContext(context: SpinalContext<any>): Promise<SpinalNode<any>[]>;
    /**
     * Return all parents for the relation names no matter the type of relation
     * @param {(string | RegExp | (string | RegExp)[])} [relationNames=[]] Array containing the relation names of the desired parents
     * @returns {Promise<Array<SpinalNode<any>>>} Promise containing the parents that were found
     * @throws {TypeError} If the relationNames are neither an array, a string or omitted
     * @throws {TypeError} If an element of relationNames is not a string
     * @memberof SpinalNode
     */
    getParents(relationNames?: string | RegExp | (string | RegExp)[]): Promise<SpinalNode<any>[]>;
    getParentsInContext(context: SpinalContext<any>): Promise<SpinalNode<any>[]>;
    /**
     * Recursively finds and return the FIRST FOUND parent nodes for which the predicate is true
     * @param {string[]} relationNames Arry of relation
     * @param {(node)=> boolean} predicate function stop search if return true
     */
    findOneParent(relationNames?: string | RegExp | (string | RegExp)[], predicate?: SpinalNodeFindOnePredicateFunc): Promise<SpinalNode<any>>;
    /**
     * Recursively finds all the parent nodes for which the predicate is true
     * @param {(string | RegExp | (string | RegExp)[])} [relationNames=[]] Arry of relation
     * @param {SpinalNodeFindPredicateFunc} [predicate=DEFAULT_FIND_PREDICATE]
     * @return {*}  {Promise<SpinalNode<any>[]>}
     * @memberof SpinalNode
     */
    findParents(relationNames?: string | RegExp | (string | RegExp)[], predicate?: SpinalNodeFindPredicateFunc): Promise<SpinalNode<any>[]>;
    findParentsInContext(context: SpinalContext<any>, predicate?: SpinalNodeFindPredicateFunc): Promise<SpinalNode<any>[]>;
    /**
     * Recursively finds all the children nodes for which the predicate is true.
     * @param {string|string[]} relationNames Array containing the relation names to follow
     * @param {SpinalNodeFindPredicateFunc} predicate
     * Function returning true if the node needs to be returned
     * @returns {Promise<Array<SpinalNode<any>>>} The nodes that were found
     * @throws {TypeError} If the relationNames are neither an array, a string or omitted
     * @throws {TypeError} If an element of relationNames is not a string
     * @throws {TypeError} If the predicate is not a function
     */
    find(relationNames: RelationSearch, predicate?: SpinalNodeFindPredicateFunc): Promise<SpinalNode<any>[]>;
    /**
     * @param {RelationSearch} relations
     * @param {(node: SpinalNode<any>, stopFct?: () => void) => Promise<boolean>} predicate
     * @return {*}  {Promise<SpinalNode<any>[]>}
     * @memberof SpinalNode
     */
    findAsyncPredicate(relations: RelationSearch, predicate: (node: SpinalNode<any>, stopFct?: () => void) => Promise<boolean>): Promise<SpinalNode<any>[]>;
    /**
     * @param {SpinalContext<any>} context
     * @param {(node: SpinalNode<any>, stopFct?: () => void) => Promise<boolean>} predicate
     * @return {*}  {Promise<SpinalNode<any>[]>}
     * @memberof SpinalNode
     */
    findInContextAsyncPredicate(context: SpinalContext<any>, predicate: (node: SpinalNode<any>, stopFct?: () => void) => Promise<boolean>): Promise<SpinalNode<any>[]>;
    /**
     * Recursively finds all the children nodes with type "nodeType".
     * @param {string|string[]} relationNames Array containing the relation names to follow
     * @param {string} nodeType Type of node to find in children
     * @returns {Promise<Array<SpinalNode<any>>>} The nodes that were found
     * @throws {TypeError} If the relationNames are neither an array, a string or omitted
     * @throws {TypeError} If an element of relationNames is not a string
     * @throws {TypeError} If the predicate is not a function
     */
    findByType(relationNames: string | string[], nodeType: string): Promise<SpinalNode<any>[]>;
    /**
     * Recursively finds all the children nodes and classify them by type.
     * @param {string|string[]} relationNames Array containing the relation names to follow
     * @return {*}  {Promise<{ types: string[]; data: { [type: string]: SpinalNode<any>[] } }>}
     * @throws {TypeError} If the relationNames are neither an array, a string or omitted
     * @throws {TypeError} If an element of relationNames is not a string
     * @throws {TypeError} If the predicate is not a function
     * @memberof SpinalNode
     */
    browseAnClassifyByType(relationNames: string | string[]): Promise<{
        types: string[];
        data: {
            [type: string]: SpinalNode<any>[];
        };
    }>;
    /**
     * Recursively finds all the children nodes in the context for which the predicate is true..
     * @param {SpinalContext} context Context to use for the search
     * @param {findPredicate} predicate Function returning true if the node needs to be returned
     * @returns {Promise<Array<SpinalNode>>} The nodes that were found
     * @throws {TypeError} If context is not a SpinalContext
     * @throws {TypeError} If the predicate is not a function
     */
    findInContext(context: SpinalContext<any>, predicate?: SpinalNodeFindPredicateFunc): Promise<SpinalNode<any>[]>;
    /**
     * Recursively finds all the children nodes in the context for which the predicate is true..
     * @param {SpinalContext} context Context to use for the search
     * @param {string} nodeType Type of node to find in children
     * @returns {Promise<Array<SpinalNode>>} The nodes that were found
     * @throws {TypeError} If context is not a SpinalContext
     * @throws {TypeError} If the predicate is not a function
     */
    findInContextByType(context: SpinalContext<any>, nodeType: string): Promise<SpinalNode<any>[]>;
    /**
     * Recursively finds all the children nodes in the context and classify them by type.
     * @param {SpinalContext} context Context to use for the search
     * @returns {Object<{types : string[], data : Object<string : SpinalNode[]>}>}
     * @throws {TypeError} If the relationNames are neither an array, a string or omitted
     * @throws {TypeError} If an element of relationNames is not a string
     * @throws {TypeError} If the predicate is not a function
     */
    browseAndClassifyByTypeInContext(context: SpinalContext<any>): Promise<{
        types: string[];
        data: {
            [type: string]: SpinalNode<any>[];
        };
    }>;
    /**
     * Recursively applies a function to all the children nodes.
     * @param {string|string[]} relationNames Array containing the relation names to follow
     * @param {SpinalNodeForEachFunc<SpinalNode<any>>} callback Function to apply to the nodes
     * @throws {TypeError} If the relationNames are neither an array, a string or omitted
     * @throws {TypeError} If an element of relationNames is not a string
     * @throws {TypeError} If the callback is not a function
     */
    forEach(relationNames: string | string[], callback: SpinalNodeForEachFunc): Promise<void>;
    /**
     * Recursively applies a function to all the children nodes in the context.
     * @param {SpinalContext} context Context to use for the search
     * @param {forEachCallback} callback Function to apply to the nodes
     * @throws {TypeError} If context is not a SpinalContext
     * @throws {TypeError} If the callback is not a function
     */
    forEachInContext(context: SpinalContext<any>, callback: SpinalNodeForEachFunc): Promise<void>;
    /**
     * Recursively applies a function to all the children nodes and returns the results in an array.
     * @template T
     * @param {string|string[]} relationNames Array containing the relation names to follow
     * @param {SpinalNodeMapFunc} callback Function to apply to the nodes
     * @returns {Promise<T[]>} The results of the callback for each node
     * @throws {TypeError} If the relationNames are neither an array, a string or omitted
     * @throws {TypeError} If an element of relationNames is not a string
     * @throws {TypeError} If the callback is not a function
     * @memberof SpinalNode
     */
    map<T>(relationNames: string | string[], callback: SpinalNodeMapFunc<T>): Promise<T[]>;
    /**
     * Recursively applies a function to all the children nodes in the context
     * and returns the results in an array.
     * @template T
     * @param {SpinalContext} context Context to use for the search
     * @param {function} callback Function to apply to the nodes
     * @returns {Promise<Array<*>>} The results of the callback for each node
     * @throws {TypeError} If context is not a SpinalContext
     * @throws {TypeError} If the callback is not a function
     * @memberof SpinalNode
     */
    mapInContext<T>(context: SpinalContext<any>, callback: SpinalNodeMapFunc<T>): Promise<T[]>;
    /**
     * @param {RelationSearch} relationNames
     * @return {*}  {AsyncGenerator<SpinalNode<any>, void, void>}
     * @memberof SpinalNode
     */
    visitParents(relationNames: RelationSearch): AsyncGenerator<SpinalNode<any>, void, void>;
    /**
     * @param {SpinalContext<any>} context
     * @return {*}  {AsyncGenerator<SpinalNode<any>, void, void>}
     * @memberof SpinalNode
     */
    visitParentsInContext(context: SpinalContext<any>): AsyncGenerator<SpinalNode<any>, void, void>;
    /**
     * @param {RelationSearch} relationNames
     * @return {*}  {AsyncGenerator<SpinalNode<any>, void, void>}
     * @memberof SpinalNode
     */
    visitChildren(relationNames: RelationSearch): AsyncGenerator<SpinalNode<any>, void, void>;
    /**
     * @param {SpinalContext<any>} context
     * @return {*}  {AsyncGenerator<SpinalNode<any>, void, void>}
     * @memberof SpinalNode
     */
    visitChildrenInContext(context: SpinalContext<any>): AsyncGenerator<SpinalNode<any>, void, void>;
    /**
     * Return the relation list corresponding to the relation type.
     * @param {string} relationType Type of the relation
     * @returns {SpinalMap} Return the relation list corresponding to the relation type
     * @private
     */
    _getChildrenType(relationType: string): SpinalMap<AnySpinalRelation>;
    /**
     * Return the relation corresponding.
     * @param {string} relationName Name of the relation
     * @param {string} relationType Type of the relation
     * @returns {SpinalRelation} The relation corresponding
     * @protected
     */
    _getRelation(relationName: string, relationType: string): AnySpinalRelation;
    /**
     * Removes a parent relation of the node.
     * @param {AnySpinalRelation} relation Relation to remove
     * @protected
     */
    _removeParent(relation: AnySpinalRelation): void;
    /**
     * Removes the node from all parent relation the property parents.
     * @protected
     */
    _removeFromParents(): Promise<void>;
    /**
     * Adds the relation as parent of the node.
     * @param {AnySpinalRelation} relation Parent relation
     * @protected
     */
    _addParent(relation: AnySpinalRelation): void;
    /**
     * Create a new relation for this node.
     * @param {string} relationName Name of the relation
     * @param {string} relationType Type of the relation
     * @protected
     */
    _createRelation(relationName: string, relationType: string): AnySpinalRelation;
    /**
     * Remove all children relation from the graph.
     * @returns {Promise<void>} An empty promise
     * @protected
     */
    _removeFromChildren(): Promise<void>;
    /**
     * @private
     * @param {(string | RegExp | (string | RegExp)[])} [relationNames=[]]
     * @param {boolean} [getParent=false]
     * @return {*}  {string[]}
     * @memberof SpinalNode
     */
    private _getValidRelations;
    private sendEventFunc;
}
export default SpinalNode;
export { SpinalNode };
