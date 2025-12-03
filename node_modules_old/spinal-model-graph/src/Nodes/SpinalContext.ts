/*
 * Copyright 2018 SpinalCom - www.spinalcom.com
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
import { FileSystem, Model, spinalCore } from 'spinal-core-connectorjs';
import { SPINAL_RELATION_PTR_LST_TYPE } from '../Relations/SpinalRelationFactory';
import { guid } from '../Utilities';
import { SpinalNode } from './SpinalNode';

/**
 * A SpinalContext is the statring node of a part of the graph.
 * @class SpinalContext
 * @extends {SpinalNode<T>}
 * @template T
 */
class SpinalContext<T extends Model = any> extends SpinalNode<T> {
  /**
   * Constructor for the SpinalContext class.
   * @param {String} [name="undefined"] Name of the context
   * @param {String} [type="SpinalContext"] Type of the context, usually unused
   * @param {SpinalNode | Model} [element] Element of the context
   * @throws {TypeError} If the element is not a Model
   */
  constructor(
    name: string = 'undefined',
    type: string = 'SpinalContext',
    element?: T
  ) {
    super(name, type, element);
    if (FileSystem._sig_server === false) return;

    this.info.id.set(guid());
  }

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
  addChild<K extends Model>(
    child: K | SpinalNode<K>,
    relationName: string,
    _relationType: string = SPINAL_RELATION_PTR_LST_TYPE
  ): Promise<SpinalNode<K>> {
    return super.addChild(child, relationName, SPINAL_RELATION_PTR_LST_TYPE);
  }

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
  addChildInContext<K extends Model>(
    child: K | SpinalNode<K>,
    relationName: string,
    _relationType: string = SPINAL_RELATION_PTR_LST_TYPE,
    context: SpinalContext<T> = this
  ): Promise<SpinalNode<K>> {
    return super.addChildInContext(
      child,
      relationName,
      SPINAL_RELATION_PTR_LST_TYPE,
      context
    );
  }

  /**
   * Return the children of the node that are registered in the context
   * @override
   * @param {SpinalContext} [context=this] Context to use for the search, this by default
   * @returns {Promise<Array<SpinalNode>>} The children that were found
   */
  getChildrenInContext<K extends Model>(
    context: SpinalContext<T> = this
  ): Promise<SpinalNode<K>[]> {
    return super.getChildrenInContext(context);
  }
}

spinalCore.register_models([SpinalContext]);
export default SpinalContext;
export { SpinalContext };
