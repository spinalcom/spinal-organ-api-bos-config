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

import type { IFsData } from '../../interfaces/IFsData';
import type { SpinalLoadCallBack } from '../../interfaces/SpinalLoadCallBack';
import { Model } from '../../Models/Model';
import { FileSystem } from '../FileSystem';

/**
 * @export
 * @class Ptr
 * @extends {Model}
 * @template T
 */
export class Ptr<T extends Model = any> extends Model {
  /**
   * @static
   * @type {string}
   * @memberof Ptr
   */
  public static _constructorName: string = 'Ptr';

  /**
   * @type {{ model?: T; value?: any }}
   * @memberof Ptr
   */
  public data: { model?: T; value?: any } = {};

  /**
   * Creates an instance of Ptr.
   * @param {*} [model]
   * @memberof Ptr
   */
  public constructor(model?: any) {
    super();
    this._set(model);
  }

  /**
   * @return {*}  {Promise<T>}
   * @memberof Ptr
   */
  public load(): Promise<T>;
  /**
   * @param {SpinalLoadCallBack<T>} callback
   * @memberof Ptr
   */
  public load(callback: SpinalLoadCallBack<T>): void;
  /**
   * @param {SpinalLoadCallBack<T>} [callback]
   * @return {*}  {Promise<T>}
   * @memberof Ptr
   */
  public load(callback?: SpinalLoadCallBack<T>): Promise<T> {
    if (this.data.model != null) {
      if (typeof callback === 'function') {
        callback(this.data.model, false);
      } else {
        return Promise.resolve(this.data.model);
      }
    } else {
      if (this.data.value === 0)
        console.error(`Ptr ${this._server_id} load with value 0.`);
      if (typeof callback === 'function') {
        FileSystem.get_inst()?.load_ptr(this.data.value, callback);
      } else {
        return FileSystem.get_inst()?.load_ptr(this.data.value);
      }
    }
  }

  /**
   * @param {IFsData} out
   * @memberof Ptr
   */
  public _get_fs_data(out: IFsData): void {
    FileSystem.set_server_id_if_necessary(out, this);
    if (this.data.model != null) {
      FileSystem.set_server_id_if_necessary(out, this.data.model);
      out.mod += `C ${this._server_id} ${this.data.model._server_id} `;

      this.data.value = this.data.model._server_id;
      if (this.data.model._server_id & 3) {
        FileSystem._ptr_to_update[this.data.model._server_id] = this;
      }
    } else {
      out.mod += `C ${this._server_id} ${this.data.value} `;
    }
  }

  /**
   * @protected
   * @param {(number | T)} model
   * @return {*}  {boolean}
   * @memberof Ptr
   */
  protected _set(model: number | T): boolean {
    if (typeof model === 'number') {
      const res = this.data.value !== model;
      this.data = {
        value: model,
      };
      return res;
    }
    if (model instanceof Model) {
      const res = this.data.value !== model._server_id;
      this.data = {
        model: model,
        value: model._server_id,
      };
      return res;
    }
    return false;
  }

  /**
   * @protected
   * @return {*}
   * @memberof Ptr
   */
  protected _get_state() {
    return this.data.toString();
  }

  /**
   * @param {string} str
   * @param {unknown} _map
   * @return {*}  {boolean}
   * @memberof Ptr
   */
  public _set_state(str: string, _map: unknown): boolean {
    return this.set(str);
  }
}

type _Ptr<T extends Model = any> = Ptr<T>;
declare global {
  export namespace spinal {
    export type Ptr<T extends Model = any> = _Ptr<T>;
  }
}
