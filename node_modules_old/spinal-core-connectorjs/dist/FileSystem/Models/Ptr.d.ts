import type { IFsData } from '../../interfaces/IFsData';
import type { SpinalLoadCallBack } from '../../interfaces/SpinalLoadCallBack';
import { Model } from '../../Models/Model';
/**
 * @export
 * @class Ptr
 * @extends {Model}
 * @template T
 */
export declare class Ptr<T extends Model = any> extends Model {
    /**
     * @static
     * @type {string}
     * @memberof Ptr
     */
    static _constructorName: string;
    /**
     * @type {{ model?: T; value?: any }}
     * @memberof Ptr
     */
    data: {
        model?: T;
        value?: any;
    };
    /**
     * Creates an instance of Ptr.
     * @param {*} [model]
     * @memberof Ptr
     */
    constructor(model?: any);
    /**
     * @return {*}  {Promise<T>}
     * @memberof Ptr
     */
    load(): Promise<T>;
    /**
     * @param {SpinalLoadCallBack<T>} callback
     * @memberof Ptr
     */
    load(callback: SpinalLoadCallBack<T>): void;
    /**
     * @param {IFsData} out
     * @memberof Ptr
     */
    _get_fs_data(out: IFsData): void;
    /**
     * @protected
     * @param {(number | T)} model
     * @return {*}  {boolean}
     * @memberof Ptr
     */
    protected _set(model: number | T): boolean;
    /**
     * @protected
     * @return {*}
     * @memberof Ptr
     */
    protected _get_state(): string;
    /**
     * @param {string} str
     * @param {unknown} _map
     * @return {*}  {boolean}
     * @memberof Ptr
     */
    _set_state(str: string, _map: unknown): boolean;
}
declare type _Ptr<T extends Model = any> = Ptr<T>;
declare global {
    export namespace spinal {
        type Ptr<T extends Model = any> = _Ptr<T>;
    }
}
export {};
