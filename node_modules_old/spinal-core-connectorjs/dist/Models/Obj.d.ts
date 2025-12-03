import type { IFsData } from '../interfaces/IFsData';
import { Model } from './Model';
/**
 * @export
 * @class Obj
 * @extends {Model}
 * @template T
 */
export declare class Obj<T extends string | number | boolean> extends Model {
    static _constructorName: string;
    _data: T;
    /**
     * Creates an instance of Obj.
     * @param {*} [data]
     * @memberof Obj
     */
    constructor(data?: any);
    /**
     * @return {*}  {string}
     * @memberof Obj
     */
    toString(): string;
    /**
     * @param {*} obj
     * @return {*}  {boolean}
     * @memberof Obj
     */
    equals(obj: any): boolean;
    /**
     * @return {*}  {*}
     * @memberof Obj
     */
    get(): T;
    /**
     * @param {IFsData} out
     * @memberof Obj
     */
    _get_fs_data(out: IFsData): void;
    /**
     * @protected
     * @param {T} value
     * @return {*}  {boolean}
     * @memberof Obj
     */
    protected _set(value: T): boolean;
    /**
     * @@protected
     * @return {*}  {string}
     * @memberof Obj
     */
    protected _get_state(): string;
    /**
     * @param {string} str
     * @param {unknown} _map
     * @return {*}  {boolean}
     * @memberof Obj
     */
    _set_state(str: string, _map: unknown): boolean;
}
