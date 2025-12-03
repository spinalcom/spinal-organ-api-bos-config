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

import type { Lst } from './Lst';
import { Model } from './Model';
import type { Str } from './Str';
import type { Val } from './Val';

/**
 * @export
 * @class Choice
 * @extends {Model}
 */
export class Choice extends Model {
  /**
   * @static
   * @type {string}
   * @memberof Choice
   */
  public static _constructorName: string = 'Choice';

  /**
   * @type {Val}
   * @memberof Choice
   */
  public num: Val;
  /**
   *
   * @type {Lst<Str>}
   * @memberof Choice
   */
  public lst: Lst<Str>;

  /**
   * Creates an instance of Choice.
   * @param {(Val | number)} [InitIdx]
   * @param {((string | Str)[])} [stringChoises]
   * @memberof Choice
   */
  public constructor(InitIdx?: Val | number, stringChoises?: (string | Str)[]) {
    super();
    // default
    this.add_attr({
      num: 0,
      lst: stringChoises,
    });
    // init
    if (InitIdx != null) {
      this.num.set(InitIdx);
    }
  }

  /**
   * @return {*}  {boolean}
   * @memberof Choice
   */
  public filter(): boolean {
    return true;
  }

  /**
   * @return {*}  {Str} the seleected value
   * @memberof Choice
   */
  public item(): Str {
    return this.lst[this.num.get()];
  }

  /**
   * @return {*}  {string} the seleected value
   * @memberof Choice
   */
  public get(): string {
    return this.item()?.get();
  }

  /**
   * @return {*}  {string}
   * @memberof Choice
   */
  public toString(): string {
    return this.item()?.toString();
  }

  /**
   * @param {(Choice | Str)} a
   * @return {*}  {boolean}
   * @memberof Choice
   */
  public equals(a: Choice | Str): boolean {
    if (a instanceof Choice) {
      return super.equals(a);
    } else {
      return this.item().equals(a);
    }
  }

  /**
   * @protected
   * @param {(string | number)} value
   * @return {*}  {boolean}
   * @memberof Choice
   */
  protected _set(value: string | number): boolean {
    for (let idx = 0; idx < this.lst.length; idx++) {
      const itm = this.lst[idx];
      if (itm.equals(value)) {
        return this.num.set(idx);
      }
    }
    return this.num.set(value);
  }
}
