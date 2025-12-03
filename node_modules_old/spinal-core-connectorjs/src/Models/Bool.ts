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
import { FileSystem } from '../FileSystem/FileSystem';
import type { IFsData } from '../interfaces/IFsData';
import { Obj } from './Obj';

/**
 * Bese representation of a Boolean
 * @export
 * @class Bool
 * @extends {Obj<boolean>}
 */
export class Bool extends Obj<boolean> {
  /**
   * @static
   * @type {string}
   * @memberof Bool
   */
  public static _constructorName: string = 'Bool';

  /**
   * Creates an instance of Bool.
   * @param {(boolean | Bool)} [data=false]
   * @memberof Bool
   */
  public constructor(data: boolean | Bool = false) {
    super();
    this._set(data);
  }

  /**
   * toggle true / false ( 1 / 0 )
   * @return {*}  {boolean}
   * @memberof Bool
   */
  public toggle(): boolean {
    return this.set(!this._data);
  }

  /**
   * @return {*}  {boolean}
   * @memberof Bool
   */
  public toBoolean(): boolean {
    return this._data;
  }

  /**
   * @return {*}  {Bool}
   * @memberof Bool
   */
  public deep_copy(): Bool {
    return new Bool(this._data);
  }

  /**
   * we do not take _set from Obj because we want a conversion if value is not a boolean
   * @protected
   * @param {(string | boolean | Bool)} value
   * @return {*}  {boolean}
   * @memberof Bool
   */
  protected _set(value: string | boolean | Bool): boolean {
    let n: boolean;
    if (value === 'false') n = false;
    else if (value === 'true') n = true;
    else if (value instanceof Bool) n = value._data;
    else n = Boolean(value);
    if (this._data !== n) {
      this._data = n;
      return true;
    }
    return false;
  }

  /**
   * @param {IFsData} out
   * @memberof Bool
   */
  public _get_fs_data(out: IFsData): void {
    FileSystem.set_server_id_if_necessary(out, this);
    out.mod += `C ${this._server_id} ${this._data ? 1 : 0} `;
  }
}
