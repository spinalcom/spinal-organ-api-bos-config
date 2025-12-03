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

import { Obj } from './Obj';

/**
 * representation of a number
 * @export
 * @class Val
 * @extends {Obj<number>}
 */
export class Val extends Obj<number> {
  public static _constructorName: string = 'Val';

  /**
   * Creates an instance of Val.
   * @param {(number | Val)} [data=0]
   * @memberof Val
   */
  public constructor(data: number | Val = 0) {
    super();
    this._set(data);
  }

  /**
   * toggle true / false ( 1 / 0 )
   * @return {*}  {boolean}
   * @memberof Val
   */
  public toggle(): boolean {
    return this.set(!this._data);
  }

  /**
   * @return {*}  {boolean}
   * @memberof Val
   */
  public toBoolean(): boolean {
    return Boolean(this._data);
  }

  /**
   * @return {*}  {Val}
   * @memberof Val
   */
  public deep_copy(): Val {
    return new Val(this._data);
  }

  /**
   * @param {number} v
   * @memberof Val
   */
  public add(v: number): void {
    if (v) {
      this._data += v;
      this._signal_change();
    }
  }

  /**
   * we do not take _set from Obj because we want a conversion if value is not a number
   * @protected
   * @param {(string | boolean | number | Val)} value
   * @return {*}  {boolean}
   * @memberof Val
   */
  protected _set(value: string | boolean | number | Val): boolean {
    let n: number;
    if (typeof value === 'string' || typeof value === 'boolean') {
      n = Number(value);
      if (isNaN(n))
        console.log(`Don't know how to transform ${value} to a Val`);
    } else if (value instanceof Val) n = value._data;
    else n = value;
    if (this._data !== n) {
      this._data = n;
      return true;
    }
    return false;
  }
}
