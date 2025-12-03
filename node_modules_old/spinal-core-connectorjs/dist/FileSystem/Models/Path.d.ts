/// <reference types="node" />
import type { IFsData } from '../../interfaces/IFsData';
import { Model } from '../../Models/Model';
import type { Val } from '../../Models/Val';
/**
 * representation of a file to upload
 * @export
 * @class Path
 * @extends {Model}
 */
export declare class Path extends Model {
    /**
     * @static
     * @type {string}
     * @memberof Path
     */
    static _constructorName: string;
    /**
     * @type {(File | Buffer)}
     * @memberof Path
     */
    file?: File | Buffer;
    /**
     * @type {Val}
     * @memberof Path
     */
    remaining: Val;
    /**
     * @type {Val}
     * @memberof Path
     */
    to_upload: Val;
    /**
     * Creates an instance of Path.
     * @param {(File | Buffer)} [file]
     * @memberof Path
     */
    constructor(file?: File | Buffer);
    /**
     * @param {{ remaining: Val; to_upload: Val }} info
     * @memberof Path
     */
    get_file_info(info: {
        remaining: Val;
        to_upload: Val;
    }): void;
    /**
     * @param {IFsData} out
     * @memberof Path
     */
    _get_fs_data(out: IFsData): void;
}
