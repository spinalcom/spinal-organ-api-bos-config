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

import type { IFileInfo } from '../../interfaces/IFileInfo';
import type { SpinalLoadCallBack } from '../../interfaces/SpinalLoadCallBack';
import { ModelProcessManager } from '../../ModelProcessManager';
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
export class File<T extends Model = any> extends Model {
  /**
   * @static
   * @type {string}
   * @memberof File
   */
  public static _constructorName: string = 'File';

  /**
   * @type {Str}
   * @memberof File
   */
  public name: Str;
  /**
   * @type {Str}
   * @memberof File
   */
  public _created_at: Str;
  /**
   * @type {Ptr<T>}
   * @memberof File
   */
  public _ptr: Ptr<T>;
  /**
   * @type {IFileInfo}
   * @memberof File
   */
  public _info: IFileInfo;

  /**
   * Creates an instance of File.
   * @param {string} [name='']
   * @param {(number | T)} [ptr_or_model=0]
   * @param {*} [info={}]
   * @memberof File
   */
  public constructor(
    name: string = '',
    ptr_or_model: number | T = 0,
    info?: any
  ) {
    super();
    const cp_info: any = {};
    if (!info) info = {};
    for (const key in info) {
      cp_info[key] = info[key];
    }
    if (ptr_or_model instanceof Model) {
      if (!('model_type' in cp_info)) {
        cp_info.model_type = ModelProcessManager.get_object_class(ptr_or_model);
      }
      ptr_or_model.get_file_info?.(cp_info);
    }
    this.add_attr({
      name: name,
      _created_at: Date.now(),
      _ptr: new Ptr(ptr_or_model),
      _info: cp_info,
    });
  }

  /**
   * @return {*}  {Promise<T>}
   * @memberof File
   */
  public load(): Promise<T>;
  /**
   * @param {SpinalLoadCallBack<T>} [callback]
   * @memberof File
   */
  public load(callback?: SpinalLoadCallBack<T>): void;
  public load(callback?: SpinalLoadCallBack<T>): Promise<T> {
    if (typeof callback === 'function') this._ptr.load(callback);
    else return this._ptr.load();
  }
}

type _File<T extends Model = any> = File<T>;
declare global {
  export namespace spinal {
    export type File<T extends Model = any> = _File<T>;
  }
}
