import type { Model } from '../Models/Model';
import type { Str } from '../Models/Str';
/**
 * @export
 * @interface IFileInfo
 * @extends {Model}
 */
export interface IFileInfo extends Model {
    model_type?: Str;
    [key: string]: any;
}
