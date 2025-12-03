import type { Model, Str, Val } from 'spinal-core-connectorjs';
/**
 * @export
 * @interface SpinalNodeInfoModel
 * @extends {Model}
 */
export interface SpinalNodeInfoModel extends Model {
    id: Str;
    name: Str;
    type: Str;
    directModificationDate: Val;
    indirectModificationDate: Val;
}
