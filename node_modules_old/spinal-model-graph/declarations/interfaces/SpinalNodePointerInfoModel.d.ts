import type { Model, Str } from 'spinal-core-connectorjs';
/**
 * @export
 * @interface SpinalNodePointerInfoModel
 * @extends {Model}
 */
export interface SpinalNodePointerInfoModel extends Model {
    pointedId?: Str;
    pointedType?: Str;
}
