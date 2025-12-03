import type { Lst, Model, Str } from 'spinal-core-connectorjs';
/**
 * @interface SpinalRelationPtrLstNodePointerInfoModel
 * @extends {InfoModel}
 */
export interface SpinalRelationPtrLstNodePointerInfoModel extends Model {
    pointedId?: Str;
    pointedType?: Str;
    ids: Lst<Str>;
}
