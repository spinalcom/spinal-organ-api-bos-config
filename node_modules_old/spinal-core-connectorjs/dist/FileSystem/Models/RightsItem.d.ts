import { Lst } from '../../Models/Lst';
import type { Model } from '../../Models/Model';
/**
 * @export
 * @class RightsItem
 * @extends {Lst<T>}
 * @template T
 */
export declare class RightsItem<T extends Model = any> extends Lst<T> {
    /**
     * @static
     * @type {string}
     * @memberof RightsItem
     */
    static _constructorName: string;
    /**
     * Creates an instance of RightsItem.
     * @memberof RightsItem
     */
    constructor();
}
