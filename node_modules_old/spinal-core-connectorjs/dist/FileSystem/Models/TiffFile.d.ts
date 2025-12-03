import type { SpinalLoadCallBack } from '../../interfaces/SpinalLoadCallBack';
import type { Model } from '../../Models/Model';
import { File } from './File';
import { Ptr } from './Ptr';
/**
 * @export
 * @class TiffFile
 * @extends {File<T>}
 * @template T
 */
export declare class TiffFile<T extends Model = any> extends File<T> {
    /**
     * @static
     * @type {string}
     * @memberof TiffFile
     */
    static _constructorName: string;
    /**
     * @type {Ptr}
     * @memberof TiffFile
     */
    _ptr_tiff: Ptr;
    /**
     * @type {number}
     * @memberof TiffFile
     */
    _has_been_converted: number;
    /**
     * Creates an instance of TiffFile.
     * @param {string} [name='']
     * @param {number} [ptr_or_model=0]
     * @param {number} [ptr_tiff=0]
     * @param {*} [info={}]
     * @memberof TiffFile
     */
    constructor(name?: string, ptr_or_model?: number, ptr_tiff?: number, info?: any);
    load_tiff(callback: SpinalLoadCallBack<T>): void;
}
declare type _TiffFile<T extends Model = any> = TiffFile<T>;
declare global {
    export namespace spinal {
        type TiffFile<T extends Model = any> = _TiffFile<T>;
    }
}
export {};
