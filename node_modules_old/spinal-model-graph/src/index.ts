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
export {
  ADD_CHILD_EVENT,
  ADD_CHILD_IN_CONTEXT_EVENT,
  REMOVE_CHILDREN_EVENT,
  REMOVE_CHILD_EVENT,
} from './constants';
export type { AnySpinalRelation } from './interfaces/AnySpinalRelation';
export type { ArrayPairStringAny } from './interfaces/ArrayPairStringAny';
export type { EventData } from './interfaces/EventData';
export type { RelationSearch } from './interfaces/RelationSearch';
export type { SpinalMapForEachFunc } from './interfaces/SpinalMapForEachFunc';
export type { SpinalMapItem } from './interfaces/SpinalMapItem';
export type { SpinalNodeFindOnePredicateFunc } from './interfaces/SpinalNodeFindOnePredicateFunc';
export type { SpinalNodeFindPredicateFunc } from './interfaces/SpinalNodeFindPredicateFunc';
export type { SpinalNodeForEachFunc } from './interfaces/SpinalNodeForEachFunc';
export type { SpinalNodeInfoModel } from './interfaces/SpinalNodeInfoModel';
export type { SpinalNodeMapFunc } from './interfaces/SpinalNodeMapFunc';
export type { SpinalNodePointerInfoModel } from './interfaces/SpinalNodePointerInfoModel';
export type { SpinalRelationPtrLstNodePointer } from './interfaces/SpinalRelationPtrLstNodePointer';
export type { SpinalRelationPtrLstNodePointerInfoModel } from './interfaces/SpinalRelationPtrLstNodePointerInfoModel';
export type { SpinalSetForEachFunc } from './interfaces/SpinalSetForEachFunc';
export { SpinalContext } from './Nodes/SpinalContext';
export { SpinalGraph } from './Nodes/SpinalGraph';
export { DEFAULT_FIND_PREDICATE, SpinalNode } from './Nodes/SpinalNode';
export {
  SpinalRelationFactory,
  SPINAL_RELATION_LST_PTR_TYPE,
  SPINAL_RELATION_PTR_LST_TYPE,
  SPINAL_RELATION_TYPE,
} from './Relations/SpinalRelationFactory';
export { SpinalRelationLstPtr } from './Relations/SpinalRelationLstPtr';
export { SpinalRelationPtrLst } from './Relations/SpinalRelationPtrLst';
export { SpinalRelationRef } from './Relations/SpinalRelationRef';
export { SpinalMap } from './SpinalMap';
export { SpinalNodePointer } from './SpinalNodePointer';
export { SpinalSet } from './SpinalSet';
