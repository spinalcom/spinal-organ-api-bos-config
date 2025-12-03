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

import {
  FileSystem,
  Lst,
  Model,
  spinalCore,
  Str,
} from 'spinal-core-connectorjs';
import type { SpinalRelationPtrLstNodePointer } from '../interfaces/SpinalRelationPtrLstNodePointer';
import { SpinalContext } from '../Nodes/SpinalContext';
import { SpinalNode } from '../Nodes/SpinalNode';
import { SpinalNodePointer } from '../SpinalNodePointer';
import { BaseSpinalRelation } from './BaseSpinalRelation';
import { SPINAL_RELATION_PTR_LST_TYPE } from './SpinalRelationFactory';

/**
 * Relation where the children are in Ptr to a Lst.
 * @class SpinalRelationPtrLst
 * @extends {BaseSpinalRelation}
 * @property {Str} name
 * @property {Str} id
 * @property {SpinalNodePointer<SpinalNode<any>>} parent
 * @property {SpinalMap<Val>} contextIds
 * @property {SpinalRelationPtrLstNodePointer} children
 */
class SpinalRelationPtrLst extends BaseSpinalRelation {
  public _constructorName = 'SpinalRelationPtrLst';
  public static _constructorName = 'SpinalRelationPtrLst';
  children: SpinalRelationPtrLstNodePointer;

  /**
   * Constructor for the SpinalRelationPtrLst class.
   * @param {SpinalNode} [parent] Parent of the relation
   * @param {string} [name] Name of the relation
   * @throws {TypeError} If the parent is not a node
   * @throws {TypeError} If the name is not a string
   */
  constructor(parent?: SpinalNode<any>, name?: string) {
    super(parent, name);

    if (FileSystem._sig_server === false) return;

    this.add_attr({
      children: new SpinalNodePointer(new Lst()),
    });

    this.children.info.add_attr('ids', new Lst());
  }

  /**
   * Retrieves all the ids of the children of the relation and return them inside an array.
   * @returns {String[]} Array containing all the children ids of the relation
   * @memberof SpinalRelationPtrLst
   */
  getChildrenIds(): string[] {
    const idLst: Lst<Str> = this.children.info.ids;
    const ids: string[] = [];

    for (let i: number = 0; i < idLst.length; i += 1) {
      ids.push(idLst[i].get());
    }

    return ids;
  }

  /**
   * returns the number of children of the relation.
   * @returns {number}
   * @memberof SpinalRelationPtrLst
   */
  getNbChildren(): number {
    return this.children.info.ids.length;
  }

  /**
   * Return all the children of the relation.
   * @returns {Promise<SpinalNode<any>[]>} The children of the relation
   * @memberof SpinalRelationPtrLst
   */
  async getChildren(): Promise<SpinalNode<any>[]> {
    const childrenLst: Lst<SpinalNode<any>> = await this.children.load();
    const children: SpinalNode<any>[] = [];

    for (let i: number = 0; i < childrenLst.length; i += 1) {
      children.push(childrenLst[i]);
    }

    return children;
  }

  /**
   * Return all the children of the relation associated to a certain context.
   * @param {SpinalContext} context Context to use for the search
   * @returns {Promise<Array<SpinalNode<any>>>} The children associated to the context
   * @throws {TypeError} If the context is not a SpinalContext
   * @memberof SpinalRelationPtrLst
   */
  async getChildrenInContext(
    context: SpinalContext<any>
  ): Promise<SpinalNode<any>[]> {
    const childrenLst: Lst<SpinalNode<any>> = await this.children.load();
    const children: SpinalNode<any>[] = [];

    if (!(context instanceof SpinalContext)) {
      throw TypeError('context must be a SpinalContext');
    }

    for (let i: number = 0; i < childrenLst.length; i += 1) {
      const child = childrenLst[i];

      if (child.belongsToContext(context)) {
        children.push(child);
      }
    }

    return children;
  }

  /**
   * Returns the type of the relation.
   * @returns {string} Type of the relation
   * @memberof SpinalRelationPtrLst
   */
  getType(): string {
    return SPINAL_RELATION_PTR_LST_TYPE;
  }

  /**
   * Adds a child to the relation.
   * @template T extends Model = Node Element Type
   * @param {(T|SpinalNode<T>)} node Node or model to add
   * @throws {TypeError} If the node is not a Model
   * @throws {Error} If the node is already a child of the relation
   * @returns {Promise<SpinalNode<T>>} Promise containing the node that was added
   * @memberof SpinalRelationPtrLst
   */
  async addChild<T extends Model>(
    node: T | SpinalNode<T>
  ): Promise<SpinalNode<T>> {
    let nodeCreate: SpinalNode<T> | Model = node;
    if (!(node instanceof Model)) {
      throw new Error(
        'Cannot add a child witch is not an instance of SpinalNode or Model.'
      );
    } else if (!(node instanceof SpinalNode)) {
      nodeCreate = new SpinalNode(undefined, undefined, node);
    }

    const tmpNodeCreate: SpinalNode<T> = <SpinalNode<T>>nodeCreate;
    if (this.getChildrenIds().indexOf(tmpNodeCreate.getId().get()) !== -1) {
      throw new Error('Cannot add a child twice to the same relation.');
    }

    await this.children.load().then((children) => {
      this.children.info.ids.push(tmpNodeCreate.getId());
      tmpNodeCreate._addParent(this);
      children.push(tmpNodeCreate);
    });

    return tmpNodeCreate;
  }

  /**
   * Removes a child from the relation.
   * @param {SpinalNode<any>} node Child to remove
   * @returns {Promise<void>} An empty promise
   * @throws {Error} If the given node is not a child
   * @memberof SpinalRelationPtrLst
   */
  async removeChild(node: SpinalNode<any>): Promise<void> {
    const childrenLst: Lst<SpinalNode<any>> = await this.children.load();

    if (!childrenLst.contains(node)) {
      throw Error('The node is not a child');
    }

    childrenLst.remove(node);
    this.children.info.ids.remove(node.getId());
    node._removeParent(this);
  }

  /**
   * Removes children from the relation.
   * @override
   * @param {SpinalNode<any>[]} [nodes=[]] Childs to remove
   * @returns {Promise<void>} An empty promise
   * @throws {TypeError} If nodes is not an array or omitted
   * @throws {Error} If one of the nodes is not a child
   * @memberof SpinalRelationPtrLst
   */
  async removeChildren(nodes: SpinalNode<any>[] = []): Promise<void> {
    if (!Array.isArray(nodes)) {
      throw TypeError('node must be an array');
    }

    const childrenLst: Lst<SpinalNode<any>> = await this.children.load();
    let error: boolean = false;

    if (nodes.length === 0) {
      for (let idx = 0; idx < childrenLst.length; idx++) {
        childrenLst[idx]._removeParent(this);
      }
      childrenLst.clear();
      this.children.info.ids.clear();
      return;
    }

    for (const node of nodes) {
      const index: number = childrenLst.indexOf(node);
      childrenLst.remove(node);
      this.children.info.ids.remove(node.getId());
      node._removeParent(this);
    }

    if (error) {
      throw Error('Could not remove all nodes');
    }
  }
}

spinalCore.register_models(SpinalRelationPtrLst, 'SpinalRelationPtrLst');
export default SpinalRelationPtrLst;

export { SpinalRelationPtrLst };
