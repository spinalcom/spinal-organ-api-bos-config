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
import type { Model } from 'spinal-core-connectorjs';
import {
  RELATION_TYPE_LIST,
  SPINAL_RELATION_LST_PTR_TYPE,
  SPINAL_RELATION_PTR_LST_TYPE,
  SPINAL_RELATION_TYPE,
} from '../constants';
import type { SpinalNode } from '../Nodes/SpinalNode';
import { SpinalRelationLstPtr } from './SpinalRelationLstPtr';
import { SpinalRelationPtrLst } from './SpinalRelationPtrLst';
import { SpinalRelationRef } from './SpinalRelationRef';
/**
 * Namespace for general relation functions.
 * @abstract
 */
class SpinalRelationFactory {
  /**
   * Create a new relation of relationType with the relationName.
   * @param {SpinalNode} parent Parent of the relation
   * @param {string} relationName Name of the relation
   * @param {string} relationType Type of the relation
   * @returns {SpinalRelationRef | SpinalRelationLstPtr | SpinalRelationPtrLst} A new SpinalRelation
   * @static
   * @memberof SpinalRelationFactory
   */
  static getNewRelation(
    parent: SpinalNode<Model>,
    relationName: string,
    relationType: string
  ): SpinalRelationRef | SpinalRelationLstPtr | SpinalRelationPtrLst {
    switch (relationType) {
      case SPINAL_RELATION_TYPE:
        return new SpinalRelationRef(parent, relationName);
      case SPINAL_RELATION_LST_PTR_TYPE:
        return new SpinalRelationLstPtr(parent, relationName);
      case SPINAL_RELATION_PTR_LST_TYPE:
        return new SpinalRelationPtrLst(parent, relationName);
      default:
        throw new Error('Unknown relationType');
    }
  }
}

export {
  SPINAL_RELATION_TYPE,
  SPINAL_RELATION_LST_PTR_TYPE,
  SPINAL_RELATION_PTR_LST_TYPE,
  RELATION_TYPE_LIST,
  SpinalRelationFactory,
};
