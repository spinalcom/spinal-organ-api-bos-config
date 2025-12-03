import type { IFileInfoOption } from '../../interfaces/IFileInfoOption';
import type { SpinalFilterFunction } from '../../interfaces/SpinalFilterFunction';
import type { SpinalLoadCallBack } from '../../interfaces/SpinalLoadCallBack';
import { Lst } from '../../Models/Lst';
import type { Model } from '../../Models/Model';
import { File } from './File';
import { TiffFile } from './TiffFile';
/**
 * representation of a virtual Directory
 * @export
 * @class Directory
 * @extends {(Lst<File | TiffFile>)}
 */
export declare class Directory<T extends Model = any> extends Lst<File | TiffFile> {
    /**
     * @static
     * @type {string}
     * @memberof Directory
     */
    static _constructorName: string;
    constructor();
    /**
     * @return {*}  {*}
     * @memberof Directory
     */
    base_type(): typeof File;
    /**
     * @param {string} name
     * @return {*}  {(File | TiffFile)}
     * @memberof Directory
     */
    find(name: string): File<T> | TiffFile<T>;
    /**
     * @param {string} name
     * @param {SpinalLoadCallBack<any>} callback
     * @memberof Directory
     */
    load(name: string, callback: SpinalLoadCallBack<any>): void;
    /**
     * @param {SpinalFilterFunction<File>} f
     * @return {*}  {boolean}
     * @memberof Directory
     */
    has(f: SpinalFilterFunction<File>): boolean;
    /**
     * @param {string} name
     * @return {*}  {boolean}
     * @memberof Directory
     */
    has(name: string): boolean;
    /**
     * @param {string} name
     * @param {*} obj
     * @param {IFileInfoOption} [params={}]
     * @return {*}  {File}
     * @memberof Directory
     */
    add_file(name: string, obj: any, params?: IFileInfoOption): File;
    /**
     * @param {string} name
     * @param {*} obj
     * @param {*} tiff_obj
     * @param {IFileInfoOption} [params={}]
     * @return {*}  {TiffFile}
     * @memberof Directory
     */
    add_tiff_file(name: string, obj: any, tiff_obj: any, params?: IFileInfoOption): TiffFile;
    /**
     * @param {string} name
     * @param {*} obj
     * @param {IFileInfoOption} [params={}]
     * @return {*}  {File}
     * @memberof Directory
     */
    force_add_file(name: string, obj: any, params?: IFileInfoOption): File;
    /**
     * @param {*} info
     * @return {*}  {string}
     * @memberof Directory
     */
    get_file_info(info: any): string;
}
declare type _Directory<T extends Model = any> = Directory<T>;
declare global {
    export namespace spinal {
        type Directory<T extends Model = any> = _Directory<T>;
    }
}
export {};
