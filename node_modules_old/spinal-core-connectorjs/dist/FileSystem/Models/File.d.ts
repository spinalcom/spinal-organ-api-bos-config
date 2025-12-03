import type { IFileInfo } from '../../interfaces/IFileInfo';
import type { SpinalLoadCallBack } from '../../interfaces/SpinalLoadCallBack';
import { Model } from '../../Models/Model';
import type { Str } from '../../Models/Str';
import { Ptr } from './Ptr';
/**
 * representation of a virtual File
 * @export
 * @class File
 * @extends {Model}
 * @template T
 */
export declare class File<T extends Model = any> extends Model {
    /**
     * @static
     * @type {string}
     * @memberof File
     */
    static _constructorName: string;
    /**
     * @type {Str}
     * @memberof File
     */
    name: Str;
    /**
     * @type {Str}
     * @memberof File
     */
    _created_at: Str;
    /**
     * @type {Ptr<T>}
     * @memberof File
     */
    _ptr: Ptr<T>;
    /**
     * @type {IFileInfo}
     * @memberof File
     */
    _info: IFileInfo;
    /**
     * Creates an instance of File.
     * @param {string} [name='']
     * @param {(number | T)} [ptr_or_model=0]
     * @param {*} [info={}]
     * @memberof File
     */
    constructor(name?: string, ptr_or_model?: number | T, info?: any);
    /**
     * @return {*}  {Promise<T>}
     * @memberof File
     */
    load(): Promise<T>;
    /**
     * @param {SpinalLoadCallBack<T>} [callback]
     * @memberof File
     */
    load(callback?: SpinalLoadCallBack<T>): void;
}
declare type _File<T extends Model = any> = File<T>;
declare global {
    export namespace spinal {
        type File<T extends Model = any> = _File<T>;
    }
}
export {};
