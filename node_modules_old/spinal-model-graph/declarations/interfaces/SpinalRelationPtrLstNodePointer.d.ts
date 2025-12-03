import type { Lst } from 'spinal-core-connectorjs';
import type { SpinalNode } from '../Nodes/SpinalNode';
import type { SpinalNodePointer } from '../SpinalNodePointer';
import type { SpinalRelationPtrLstNodePointerInfoModel } from './SpinalRelationPtrLstNodePointerInfoModel';
/**
 * @interface SpinalRelationPtrLstNodePointer
 * @extends {SpinalNodePointer<Lst<SpinalNode<any>>>}
 */
export interface SpinalRelationPtrLstNodePointer extends SpinalNodePointer<Lst<SpinalNode>> {
    info: SpinalRelationPtrLstNodePointerInfoModel;
}
