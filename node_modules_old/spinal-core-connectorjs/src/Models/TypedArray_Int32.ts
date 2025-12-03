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

import { TypedArray } from './TypedArray';

export class TypedArray_Int32 extends TypedArray<Int32Array> {
  public static _constructorName: string = 'TypedArray_Int32';

  /**
   * Creates an instance of TypedArray_Int32.
   * @param {(number | number[])} [size]
   * @param {Int32Array} [data]
   * @memberof TypedArray_Int32
   */
  public constructor(size?: number | number[], data?: Int32Array) {
    super(size, data);
  }

  /**
   * @return {*}  {typeof TypedArray_Int32}
   * @memberof TypedArray_Int32
   */
  public base_type(): typeof TypedArray_Int32 {
    return TypedArray_Int32;
  }

  /**
   * @return {*}  {TypedArray_Int32}
   * @memberof TypedArray_Int32
   */
  public deep_copy(): TypedArray_Int32 {
    return new TypedArray_Int32(this._size, this._data);
  }
}
