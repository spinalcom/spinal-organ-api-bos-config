import { FileSystem } from './FileSystem/FileSystem';
import type { Directory } from './FileSystem/Models/Directory';
import type { RightsItem } from './FileSystem/Models/RightsItem';
import type { IAuthResponse } from './interfaces/IAuthResponse';
import type { ICreateSessionResponse } from './interfaces/ICreateSessionResponse';
import type { IFileInfoOption } from './interfaces/IFileInfoOption';
import type { ISpinalModel } from './interfaces/ISpinalModels';
import type { SpinalCallBackError } from './interfaces/SpinalCallBackError';
import type { SpinalLoadCallBack } from './interfaces/SpinalLoadCallBack';
import type { SpinalStoreCallBackSucess } from './interfaces/SpinalStoreCallBackSucess';
import type { Model } from './Models/Model';
export declare class spinalCore {
    static _def: ISpinalModel;
    static version: string;
    /**
     * @static
     * @param {(URL | string)} options
     * @param {string} [accessToken]
     * @return {*}  {FileSystem}
     * @memberof spinalCore
     */
    static connect(options: URL | string, accessToken?: string): FileSystem;
    /**
     * @static
     * @param {(URL | string)} options
     * @param {number} sessionId
     * @param {string} [accessToken]
     * @return {*}  {FileSystem}
     * @memberof spinalCore
     */
    static connectWithSessionId(options: URL | string, sessionId: number, accessToken?: string): FileSystem;
    /**
     * @static
     * @param {(URL | string)} options
     * @param {string} username
     * @param {string} password
     * @return {*}  {Promise<IAuthResponse>}
     * @memberof spinalCore
     */
    static auth(options: URL | string, username: string, password: string): Promise<IAuthResponse>;
    /**
     * @static
     * @param {(URL | string)} options
     * @param {string} bosRegisterKey
     * @param {string} organName
     * @param {string} organType
     * @return {*}  {Promise<IAuthResponse>}
     * @memberof spinalCore
     */
    static authOrgan(options: URL | string, bosRegisterKey: string, organName: string, organType: string): Promise<IAuthResponse>;
    /**
     * @static
     * @param {(URL | string)} options
     * @param {string} token
     * @return {*}  {Promise<ICreateSessionResponse>}
     * @memberof spinalCore
     */
    static createSession(options: URL | string, token: string): Promise<ICreateSessionResponse>;
    /**
     * stores a model in the file system
     * @static
     * @param {FileSystem} fs
     * @param {Model} model
     * @param {string} path
     * @param {IFileInfoOption} [fileOption]
     * @return {*}  {Promise<void>}
     * @memberof spinalCore
     */
    static store(fs: FileSystem, model: Model, path: string, fileOption?: IFileInfoOption): Promise<void>;
    /**
     * stores a model in the file system
     * @static
     * @param {FileSystem} fs
     * @param {Model} model
     * @param {string} path
     * @param {SpinalStoreCallBackSucess} callback_success
     * @param {SpinalCallBackError} [callback_error]
     * @param {IFileInfoOption} [fileOption]
     * @memberof spinalCore
     */
    static store(fs: FileSystem, model: Model, path: string, callback_success: SpinalStoreCallBackSucess, callback_error?: SpinalCallBackError, fileOption?: IFileInfoOption): void;
    /**
     * @static
     * @param {typeof Model} model
     * @param {string} [name]
     * @memberof spinalCore
     */
    static register_models(model: typeof Model, name?: string): void;
    /**
     * @static
     * @param {(typeof Model[]
     *       | {
     *           [key: string]: typeof Model;
     *         })} modelList
     * @memberof spinalCore
     */
    static register_models(modelList: (typeof Model)[] | {
        [key: string]: typeof Model;
    }): void;
    /**
     * @static
     * @template T
     * @param {FileSystem} fs
     * @param {string} path
     * @return {*}  {Promise<T>}
     * @memberof spinalCore
     */
    static loadPromise<T extends Model>(fs: FileSystem, path: string): Promise<T>;
    /**
     * loads a model from the file system
     * @static
     * @template T
     * @param {FileSystem} fs
     * @param {string} path
     * @return {*}  {Promise<T>}
     * @memberof spinalCore
     */
    static load<T extends Model = Model>(fs: FileSystem, path: string): Promise<T>;
    /**
     * loads a model from the file system
     * @static
     * @template T
     * @param {FileSystem} fs
     * @param {string} path
     * @param {SpinalLoadCallBack<T>} callback_success
     * @param {SpinalCallBackError} [callback_error]
     * @memberof spinalCore
     */
    static load<T extends Model = Model>(fs: FileSystem, path: string, callback_success: SpinalLoadCallBack<T>, callback_error?: SpinalCallBackError): void;
    /**
     * loads all the models of a specific type
     * @static
     * @template T
     * @param {FileSystem} fs
     * @param {string} type
     * @param {SpinalLoadCallBack<T>} callback_success
     * @param {SpinalCallBackError} [callback_error]
     * @return {*}  {void}
     * @memberof spinalCore
     */
    static load_type<T extends Model>(fs: FileSystem, type: string, callback_success: SpinalLoadCallBack<T>, callback_error?: SpinalCallBackError): void;
    /**
     * @export
     * @param {FileSystem} fs
     * @param {number} ptr
     * @return {*}  {Promise<RightsItem>}
     */
    static load_right(fs: FileSystem, ptr: number): Promise<RightsItem>;
    /**
     * @static
     * @param {FileSystem} fs
     * @param {number} ptr
     * @param {SpinalLoadCallBack<RightsItem>} callback_success
     * @param {SpinalCallBackError} [callback_error]
     * @memberof spinalCore
     */
    static load_right(fs: FileSystem, ptr: number, callback_success: SpinalLoadCallBack<RightsItem>, callback_error?: SpinalCallBackError): void;
    /**
     * @static
     * @param {FileSystem} fs
     * @param {string} path
     * @return {*}  {Promise<Directory>}
     * @memberof spinalCore
     */
    static load_directory(fs: FileSystem, path: string): Promise<Directory>;
    /**
     * @static
     * @param {FileSystem} fs
     * @param {string} path
     * @param {SpinalLoadCallBack<Directory>} [callback]
     * @memberof spinalCore
     */
    static load_directory(fs: FileSystem, path: string, callback?: SpinalLoadCallBack<Directory>): void;
    /**
     * @static
     * @template T
     * @param {FileSystem} fs
     * @param {number} ptr
     * @return {*}  {Promise<Model>}
     * @memberof spinalCore
     */
    static load_ptr<T extends Model>(fs: FileSystem, ptr: number): Promise<Model>;
    /**
     * @static
     * @template T
     * @param {FileSystem} fs
     * @param {number} ptr
     * @param {SpinalLoadCallBack<T>} [callback]
     * @memberof spinalCore
     */
    static load_ptr<T extends Model>(fs: FileSystem, ptr: number, callback?: SpinalLoadCallBack<T>): void;
    /**
     * @static
     * @param {FileSystem} fs
     * @param {number} ptr
     * @param {string} file_name
     * @param {number} right_flag
     * @param {string} targetName
     * @return {*}  {void}
     * @memberof spinalCore
     */
    static share_model(fs: FileSystem, ptr: number, file_name: string, right_flag: number, targetName: string): void;
    static right_flag: {
        AD: number;
        WR: number;
        RD: number;
    };
    /**
     * "public static" method: extend one object as a class, using the same 'class' concept as coffeescript
     * @deprecated
     * @static
     * @param {*} child
     * @param {*} parent
     * @return {*}  {*}
     * @memberof spinalCore
     */
    static extend(child: any, parent: any): any;
    /**
     * default callback function
     * @static
     * @return {*}  {void}
     * @memberof spinalCore
     */
    static defaultCallbackError(): void;
}
