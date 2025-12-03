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
import { Model } from './Model';
import { Obj } from './Obj';

/**
 * representation of a string
 * @export
 * @class Str
 * @extends {Obj<string>}
 */
export class Str extends Obj<string> {
  public static _constructorName: string = 'Str';
  public _data: string;
  public length: number = 0;

  // /**
  //  * @readonly
  //  * @type {number}
  //  * @memberof Str
  //  */
  // public get length(): number {
  //   return this._data.length;
  // }

  /**
   * Creates an instance of Str.
   * @param {(string | Str)} [data='']
   * @memberof Str
   */
  public constructor(data: string | Str = '') {
    super();
    this._data = data.toString();
    this.length = this._data.length;
  }

  /**
   * toggle presence of str in this
   * @param {string} str
   * @param {string} [space=' ']
   * @return {*}  {boolean}
   * @memberof Str
   */
  public toggle(str: string, space: string = ' '): boolean {
    var i, l;
    l = this._data.split(space);
    i = l.indexOf(str);
    if (i < 0) {
      l.push(str);
    } else {
      l.splice(i, 1);
    }
    return this.set(l.join(' '));
  }

  /**
   * true if str is contained in this
   * @param {string} str
   * @return {*}  {boolean}
   * @memberof Str
   */
  public contains(str: string): boolean {
    return this._data.indexOf(str) >= 0;
  }

  /**
   * @param {(string | Model)} str
   * @return {*}  {boolean}
   * @memberof Str
   */
  public equals(str: string | Model): boolean {
    return str instanceof Model
      ? this.toString() === str.toString()
      : this._data === str;
  }

  /**
   * @return {*}  {string}
   * @memberof Str
   */
  public toString(): string {
    return this._data;
  }

  /**
   * @param {string} str
   * @return {*}  {boolean}
   * @memberof Str
   */
  public ends_with(str: string): boolean {
    return this._data.endsWith(str);
  }

  /**
   * @return {*}  {Str}
   * @memberof Str
   */
  public deep_copy(): Str {
    return new Str(this._data);
  }

  /**
   * @param {IFsData} out
   * @memberof Str
   */
  public _get_fs_data(out: IFsData): void {
    FileSystem.set_server_id_if_necessary(out, this);
    out.mod += `C ${this._server_id} ${encodeURI(this._data)} `;
  }

  /**
   * @protected
   * @param {(Str | string)} [value='']
   * @return {*}  {boolean}
   * @memberof Str
   */
  protected _set(value: Str | string = ''): boolean {
    const n: string = value.toString();
    if (this._data !== n) {
      this._data = n;
      this.length = this._data.length;
      return true;
    }
    return false;
  }

  /**
   * @protected
   * @return {*}  {string}
   * @memberof Str
   */
  protected _get_state(): string {
    return encodeURI(this._data);
  }

  public _set_state(str: string, _map: unknown): boolean {
    return this.set(decodeURIComponent(str));
  }
}
