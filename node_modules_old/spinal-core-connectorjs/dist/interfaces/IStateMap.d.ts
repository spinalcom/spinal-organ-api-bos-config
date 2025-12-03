import type { Model } from '../Models/Model';
/**
 * @export
 * @interface IStateMap
 * @template T
 */
export interface IStateMap<T extends Model = Model> {
    [key: string]: {
        type: string;
        data: string;
        buff: T;
    };
}
