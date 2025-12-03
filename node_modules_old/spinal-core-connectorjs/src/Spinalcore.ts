/*
 * Copyright 2022 SpinalCom - www.spinalcom.com
 *
 * This file is part of SpinalCore.
 *
 * Please read all of the following terms and conditions
 * of the Free Software license Agreement ("Agreement")
 * carefully.
 *
 * This Agreement is a legally binding contract between
 * the Licensee (as defined below) and SpinalCom that
 * sets forth the terms and conditions that govern your
 * use of the Program. By installing and/or using the
 * Program, you agree to abide by all the terms and
 * conditions stated or referenced herein.
 *
 * If you do not agree to abide by these terms and
 * conditions, do not demonstrate your acceptance and do
 * not install or use the Program.
 * You should have received a copy of the license along
 * with this file. If not, see
 * <http://resources.spinalcom.com/licenses.pdf>.
 */

import { FileSystem } from './FileSystem/FileSystem';
import type { Directory } from './FileSystem/Models/Directory';
import type { File } from './FileSystem/Models/File';
import type { RightsItem } from './FileSystem/Models/RightsItem';
import type { TiffFile } from './FileSystem/Models/TiffFile';
import type { IAuthResponse } from './interfaces/IAuthResponse';
import type { ICreateSessionResponse } from './interfaces/ICreateSessionResponse';
import type { IFileInfoOption } from './interfaces/IFileInfoOption';
import type {
  IOptionFileSystemWithSessionId,
  IOptionFileSystemWithUser,
} from './interfaces/IOptionFilesystem';
import type { ISpinalModel } from './interfaces/ISpinalModels';
import type { SpinalCallBackError } from './interfaces/SpinalCallBackError';
import type { SpinalLoadCallBack } from './interfaces/SpinalLoadCallBack';
import type { SpinalStoreCallBackSucess } from './interfaces/SpinalStoreCallBackSucess';
import { ModelProcessManager } from './ModelProcessManager';
import type { Model } from './Models/Model';
import { sendXhr } from './Utils/sendXhr';

export class spinalCore {
  public static _def: ISpinalModel = ModelProcessManager._def;
  public static version: string = ModelProcessManager.spinal.version;

  /**
   * @static
   * @param {(URL | string)} options
   * @param {string} [accessToken]
   * @return {*}  {FileSystem}
   * @memberof spinalCore
   */
  public static connect(
    options: URL | string,
    accessToken?: string
  ): FileSystem {
    const parsedOpt = typeof options === 'string' ? new URL(options) : options;
    if (parsedOpt.pathname.slice(-1)[0] !== '/') {
      parsedOpt.pathname += '/';
    }
    const opt: IOptionFileSystemWithUser = {
      protocol: parsedOpt.protocol,
      home_dir: parsedOpt.pathname,
      url: parsedOpt.hostname,
      port: parsedOpt.port,
      userid: parsedOpt.username,
      password: parsedOpt.password,
      accessToken,
    };
    return new FileSystem(opt);
  }

  /**
   * @static
   * @param {(URL | string)} options
   * @param {number} sessionId
   * @param {string} [accessToken]
   * @return {*}  {FileSystem}
   * @memberof spinalCore
   */
  public static connectWithSessionId(
    options: URL | string,
    sessionId: number,
    accessToken?: string
  ): FileSystem {
    const parsedOpt = typeof options === 'string' ? new URL(options) : options;
    if (parsedOpt.pathname.slice(-1)[0] !== '/') {
      parsedOpt.pathname += '/';
    }
    const opt: IOptionFileSystemWithSessionId = {
      protocol: parsedOpt.protocol,
      home_dir: parsedOpt.pathname,
      url: parsedOpt.hostname,
      port: parsedOpt.port,
      sessionId,
      accessToken,
    };
    return new FileSystem(opt);
  }

  /**
   * @static
   * @param {(URL | string)} options
   * @param {string} username
   * @param {string} password
   * @return {*}  {Promise<IAuthResponse>}
   * @memberof spinalCore
   */
  public static async auth(
    options: URL | string,
    username: string,
    password: string
  ): Promise<IAuthResponse> {
    const res = await sendXhr(
      options,
      '/api/v1/auth',
      'POST',
      { 'Content-Type': 'application/json' },
      JSON.stringify({ userName: username, password: password })
    );
    return JSON.parse(res);
  }

  /**
   * @static
   * @param {(URL | string)} options
   * @param {string} bosRegisterKey
   * @param {string} organName
   * @param {string} organType
   * @return {*}  {Promise<IAuthResponse>}
   * @memberof spinalCore
   */
  public static async authOrgan(
    options: URL | string,
    bosRegisterKey: string,
    organName: string,
    organType: string
  ): Promise<IAuthResponse> {
    const res = await sendXhr(
      options,
      '/api/v1/authOrgan',
      'POST',
      { 'Content-Type': 'application/json' },
      JSON.stringify({ bosRegisterKey, organName, organType })
    );
    return JSON.parse(res);
  }

  /**
   * @static
   * @param {(URL | string)} options
   * @param {string} token
   * @return {*}  {Promise<ICreateSessionResponse>}
   * @memberof spinalCore
   */
  public static async createSession(
    options: URL | string,
    token: string
  ): Promise<ICreateSessionResponse> {
    let accessToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    const res = await sendXhr(options, '/api/v1/createSession', 'GET', {
      authorization: accessToken,
    });
    return JSON.parse(res);
  }

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
  public static async store(
    fs: FileSystem,
    model: Model,
    path: string,
    fileOption?: IFileInfoOption
  ): Promise<void>;
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
  public static store(
    fs: FileSystem,
    model: Model,
    path: string,
    callback_success: SpinalStoreCallBackSucess,
    callback_error?: SpinalCallBackError,
    fileOption?: IFileInfoOption
  ): void;
  public static async store(
    fs: FileSystem,
    model: Model,
    path: string,
    optionOrCb?: SpinalStoreCallBackSucess | IFileInfoOption,
    callback_error?: SpinalCallBackError,
    fileOption: IFileInfoOption = {
      model_type: 'Model',
    }
  ): Promise<void> {
    // Parse path
    const lst = path.split('/');
    const file_name = lst.pop();
    if (lst[0] === '') lst.splice(0, 1);
    path = lst.join('/'); // Absolute paths are not allowed
    const home_dir = FileSystem.get_inst()._home_dir;
    try {
      const dir = await fs.load_or_make_dir(home_dir + path);
      const file = dir.detect((x: File): boolean => x.name.get() === file_name);
      if (file != null) dir.remove(file);
      if (typeof optionOrCb === 'function') {
        dir.add_file(file_name, model, fileOption);
        optionOrCb();
      } else {
        dir.add_file(file_name, model, optionOrCb ? optionOrCb : fileOption);
      }
      return;
    } catch (error) {
      if (typeof optionOrCb === 'undefined') throw error;
      if (typeof callback_error === 'undefined') {
        spinalCore.defaultCallbackError();
      } else callback_error();
    }
  }

  /**
   * @static
   * @param {typeof Model} model
   * @param {string} [name]
   * @memberof spinalCore
   */
  public static register_models(model: typeof Model, name?: string): void;
  /**
   * @static
   * @param {(typeof Model[]
   *       | {
   *           [key: string]: typeof Model;
   *         })} modelList
   * @memberof spinalCore
   */
  public static register_models(
    modelList:
      | (typeof Model)[]
      | {
          [key: string]: typeof Model;
        }
  ): void;
  public static register_models(
    modelList:
      | typeof Model
      | (typeof Model)[]
      | { [key: string]: typeof Model },
    name?: string
  ): void {
    if (name)
      return ModelProcessManager.register_models(<typeof Model>modelList, name);
    return ModelProcessManager.register_models(
      <(typeof Model)[] | { [key: string]: typeof Model }>modelList
    );
  }

  /**
   * @static
   * @template T
   * @param {FileSystem} fs
   * @param {string} path
   * @return {*}  {Promise<T>}
   * @memberof spinalCore
   */
  public static async loadPromise<T extends Model>(
    fs: FileSystem,
    path: string
  ): Promise<T> {
    // Parse path
    const lst = path.split('/');
    const file_name = lst.pop();
    if (lst[0] === '') lst.splice(0, 1);
    path = lst.join('/'); // Absolute paths are not allowed
    const home_dir = FileSystem.get_inst()._home_dir;
    const current_dir = await fs.load_or_make_dir(`${home_dir}${path}`);
    const file: File<T> | TiffFile<T> = current_dir.detect(
      (x: File): boolean => x.name.get() === file_name
    );
    if (file) return file.load();
    throw new Error('File not Found');
  }

  /**
   * loads a model from the file system
   * @static
   * @template T
   * @param {FileSystem} fs
   * @param {string} path
   * @return {*}  {Promise<T>}
   * @memberof spinalCore
   */
  public static load<T extends Model = Model>(
    fs: FileSystem,
    path: string
  ): Promise<T>;
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
  public static load<T extends Model = Model>(
    fs: FileSystem,
    path: string,
    callback_success: SpinalLoadCallBack<T>,
    callback_error?: SpinalCallBackError
  ): void;
  public static load<T extends Model>(
    fs: FileSystem,
    path: string,
    callback_success?: SpinalLoadCallBack<T>,
    callback_error?: SpinalCallBackError
  ): Promise<T> {
    if (typeof callback_success === 'undefined')
      return spinalCore.loadPromise(fs, path);
    if (typeof callback_error === 'undefined')
      callback_error = spinalCore.defaultCallbackError;
    // Parse path
    const lst = path.split('/');
    const file_name = lst.pop();
    if (lst[0] === '') lst.splice(0, 1);
    path = lst.join('/'); // Absolute paths are not allowed
    const home_dir = FileSystem.get_inst()._home_dir;
    fs.load_or_make_dir(
      `${home_dir}${path}`,
      (current_dir: Directory, err: boolean): void => {
        if (err) {
          return callback_error();
        } else {
          const file = current_dir.detect(
            (x: File): boolean => x.name.get() === file_name
          );
          if (file != null) {
            return file.load((data: T, err: boolean): void => {
              if (err) {
                return callback_error();
              } else {
                return callback_success(data);
              }
            });
          } else {
            return callback_error();
          }
        }
      }
    );
  }

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
  public static load_type<T extends Model>(
    fs: FileSystem,
    type: string,
    callback_success: SpinalLoadCallBack<T>,
    callback_error?: SpinalCallBackError
  ): void {
    if (typeof callback_error === 'undefined') {
      callback_error = spinalCore.defaultCallbackError;
    }
    return fs.load_type(type, (data: T, error: boolean): void => {
      if (!data || error) callback_error();
      else callback_success(data, error);
    });
  }

  /**
   * @export
   * @param {FileSystem} fs
   * @param {number} ptr
   * @return {*}  {Promise<RightsItem>}
   */
  public static load_right(fs: FileSystem, ptr: number): Promise<RightsItem>;
  /**
   * @static
   * @param {FileSystem} fs
   * @param {number} ptr
   * @param {SpinalLoadCallBack<RightsItem>} callback_success
   * @param {SpinalCallBackError} [callback_error]
   * @memberof spinalCore
   */
  public static load_right(
    fs: FileSystem,
    ptr: number,
    callback_success: SpinalLoadCallBack<RightsItem>,
    callback_error?: SpinalCallBackError
  ): void;
  public static load_right(
    fs: FileSystem,
    ptr: number,
    callback_success?: SpinalLoadCallBack<RightsItem>,
    callback_error?: SpinalCallBackError
  ): Promise<RightsItem> {
    if (typeof callback_success === 'function') {
      if (typeof callback_error === 'undefined') {
        callback_error = spinalCore.defaultCallbackError;
      }
      fs.load_right(ptr, (data: RightsItem, err: boolean): void => {
        if (err) return callback_error();
        else return callback_success(data, err);
      });
    } else {
      return fs.load_right(ptr);
    }
  }
  /**
   * @static
   * @param {FileSystem} fs
   * @param {string} path
   * @return {*}  {Promise<Directory>}
   * @memberof spinalCore
   */
  public static load_directory(
    fs: FileSystem,
    path: string
  ): Promise<Directory>;
  /**
   * @static
   * @param {FileSystem} fs
   * @param {string} path
   * @param {SpinalLoadCallBack<Directory>} [callback]
   * @memberof spinalCore
   */
  public static load_directory(
    fs: FileSystem,
    path: string,
    callback?: SpinalLoadCallBack<Directory>
  ): void;
  public static load_directory(
    fs: FileSystem,
    path: string,
    callback?: SpinalLoadCallBack<Directory>
  ): void | Promise<Directory> {
    if (typeof callback === 'function') return fs.load(path, callback);
    return fs.load(path);
  }

  /**
   * @static
   * @template T
   * @param {FileSystem} fs
   * @param {number} ptr
   * @return {*}  {Promise<Model>}
   * @memberof spinalCore
   */
  public static load_ptr<T extends Model>(
    fs: FileSystem,
    ptr: number
  ): Promise<Model>;
  /**
   * @static
   * @template T
   * @param {FileSystem} fs
   * @param {number} ptr
   * @param {SpinalLoadCallBack<T>} [callback]
   * @memberof spinalCore
   */
  public static load_ptr<T extends Model>(
    fs: FileSystem,
    ptr: number,
    callback?: SpinalLoadCallBack<T>
  ): void;
  public static load_ptr<T extends Model>(
    fs: FileSystem,
    ptr: number,
    callback?: SpinalLoadCallBack<T>
  ): void | Promise<Model> {
    if (typeof callback === 'function') return fs.load_ptr(ptr, callback);
    return fs.load_ptr(ptr);
  }

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
  public static share_model(
    fs: FileSystem,
    ptr: number,
    file_name: string,
    right_flag: number,
    targetName: string
  ): void {
    return fs.share_model(ptr, file_name, right_flag, targetName);
  }

  public static right_flag = { AD: 1, WR: 2, RD: 4 };

  /**
   * "public static" method: extend one object as a class, using the same 'class' concept as coffeescript
   * @deprecated
   * @static
   * @param {*} child
   * @param {*} parent
   * @return {*}  {*}
   * @memberof spinalCore
   */
  public static extend(child: any, parent: any): any {
    return FileSystem.extend(child, parent);
  }

  /**
   * default callback function
   * @static
   * @return {*}  {void}
   * @memberof spinalCore
   */
  public static defaultCallbackError(): void {
    return console.log(
      'Model could not be loaded. You can pass a callback to handle this error.'
    );
  }
}
