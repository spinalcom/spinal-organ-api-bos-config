import type { IFsData } from '../interfaces/IFsData';
import { Obj } from './Obj';
/**
 * Bese representation of a Boolean
 * @export
 * @class Bool
 * @extends {Obj<boolean>}
 */
export declare class Bool extends Obj<boolean> {
    /**
     * @static
     * @type {string}
     * @memberof Bool
     */
    static _constructorName: string;
    /**
     * Creates an instance of Bool.
     * @param {(boolean | Bool)} [data=false]
     * @memberof Bool
     */
    constructor(data?: boolean | Bool);
    /**
     * toggle true / false ( 1 / 0 )
     * @return {*}  {boolean}
     * @memberof Bool
     */
    toggle(): boolean;
    /**
     * @return {*}  {boolean}
     * @memberof Bool
     */
    toBoolean(): boolean;
    /**
     * @return {*}  {Bool}
     * @memberof Bool
     */
    deep_copy(): Bool;
    /**
     * we do not take _set from Obj because we want a conversion if value is not a boolean
     * @protected
     * @param {(string | boolean | Bool)} value
     * @return {*}  {boolean}
     * @memberof Bool
     */
    protected _set(value: string | boolean | Bool): boolean;
    /**
     * @param {IFsData} out
     * @memberof Bool
     */
    _get_fs_data(out: IFsData): void;
}
